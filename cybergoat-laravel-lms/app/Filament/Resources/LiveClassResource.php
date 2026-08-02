<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LiveClassResource\Pages;
use App\Models\LiveClass;
use App\Services\GoogleCalendarService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class LiveClassResource extends Resource
{
    protected static ?string $model = LiveClass::class;

    protected static ?string $navigationIcon = 'heroicon-o-video-camera';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('course_id')
                    ->relationship('course', 'title')
                    ->searchable()
                    ->required(),
                Forms\Components\TextInput::make('topic')
                    ->required(),
                Forms\Components\Select::make('type')
                    ->options([
                        'live_virtual' => 'Live Virtual (Google Meet)',
                        'dubai_campus' => 'Dubai Silicon Oasis Campus',
                    ])
                    ->default('live_virtual')
                    ->live()
                    ->required(),
                Forms\Components\TextInput::make('location_or_link')
                    ->label(fn (Forms\Get $get) => $get('type') === 'live_virtual' ? 'Google Meet link' : 'Campus location')
                    ->helperText(fn (Forms\Get $get) => $get('type') === 'live_virtual'
                        ? 'Leave blank to auto-generate a Meet link once this class is saved.'
                        : null)
                    ->required(fn (Forms\Get $get) => $get('type') === 'dubai_campus')
                    // An empty submit would send null and violate the NOT NULL
                    // column, bypassing its DB default - fill a real placeholder
                    // instead, which createMeetEvent() overwrites right after.
                    ->dehydrateStateUsing(fn (?string $state, Forms\Get $get) => filled($state)
                        ? $state
                        : ($get('type') === 'live_virtual' ? 'Pending Meet link generation…' : $state)),
                Forms\Components\DateTimePicker::make('scheduled_at')
                    ->required(),
                Forms\Components\TextInput::make('duration_minutes')
                    ->required()
                    ->numeric()
                    ->default(120),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('scheduled_at')
            ->columns([
                Tables\Columns\TextColumn::make('course.title')->label('Course')->searchable(),
                Tables\Columns\TextColumn::make('topic')->searchable(),
                Tables\Columns\BadgeColumn::make('type')
                    ->colors(['info' => 'live_virtual', 'success' => 'dubai_campus']),
                Tables\Columns\TextColumn::make('location_or_link')->label('Location / Link')->limit(40),
                Tables\Columns\TextColumn::make('scheduled_at')->dateTime()->sortable(),
                Tables\Columns\TextColumn::make('duration_minutes')->suffix(' min'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')->options([
                    'live_virtual' => 'Live Virtual',
                    'dubai_campus' => 'Dubai Campus',
                ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('generateMeetLink')
                    ->label(fn (LiveClass $record) => $record->google_calendar_event_id ? 'Regenerate Meet Link' : 'Generate Meet Link')
                    ->icon('heroicon-o-video-camera')
                    ->color('success')
                    ->visible(fn (LiveClass $record) => $record->type === 'live_virtual')
                    ->requiresConfirmation()
                    ->action(function (LiveClass $record) {
                        try {
                            app(GoogleCalendarService::class)->createMeetEvent($record);

                            Notification::make()->title('Meet link generated')->success()->send();
                        } catch (\Throwable $e) {
                            Notification::make()
                                ->title('Could not generate Meet link')
                                ->body('Check that domain-wide delegation is configured in the Workspace Admin Console. ' . $e->getMessage())
                                ->danger()
                                ->send();
                        }
                    }),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLiveClasses::route('/'),
            'create' => Pages\CreateLiveClass::route('/create'),
            'edit' => Pages\EditLiveClass::route('/{record}/edit'),
        ];
    }
}
