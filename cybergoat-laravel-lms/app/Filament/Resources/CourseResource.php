<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CourseResource\Pages;
use App\Filament\Resources\CourseResource\RelationManagers;
use App\Models\Course;
use App\Services\ContentGeneratorService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class CourseResource extends Resource
{
    protected static ?string $model = Course::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('slug')
                    ->required(),
                Forms\Components\TextInput::make('title')
                    ->required(),
                Forms\Components\TextInput::make('certification_code'),
                Forms\Components\TextInput::make('vendor')
                    ->required(),
                Forms\Components\TextInput::make('hours')
                    ->required()
                    ->numeric()
                    ->default(40),
                Forms\Components\Select::make('level')
                    ->options([
                        'Fundamentals' => 'Fundamentals',
                        'Intermediate' => 'Intermediate',
                        'Advanced' => 'Advanced',
                        'Executive' => 'Executive',
                    ])
                    ->required(),
                Forms\Components\Textarea::make('description')
                    ->required()
                    ->columnSpanFull()
                    ->rows(6)
                    ->hintAction(
                        Forms\Components\Actions\Action::make('generateDescription')
                            ->label('Generate with AI')
                            ->icon('heroicon-o-sparkles')
                            ->form([
                                Forms\Components\TextInput::make('key_points')
                                    ->label('Key points to include')
                                    ->required()
                                    ->placeholder('e.g. hands-on iLabs, official exam voucher, 40 hours, beginner-friendly'),
                            ])
                            ->modalDescription('Drafts a description into the field below - review and edit it, then Save as normal. Nothing is saved automatically.')
                            ->action(function (array $data, Forms\Get $get, Forms\Set $set) {
                                try {
                                    $draft = app(ContentGeneratorService::class)->generateCourseDescription(
                                        courseTitle: $get('title') ?: 'this course',
                                        keyPoints: $data['key_points'],
                                        vendor: $get('vendor'),
                                        level: $get('level'),
                                    );
                                } catch (\Throwable $e) {
                                    Notification::make()->title('Could not generate a description')->body($e->getMessage())->danger()->send();

                                    return;
                                }

                                $set('description', $draft);
                            })
                    ),
                Forms\Components\Toggle::make('is_official_voucher_included')
                    ->label('Includes official exam voucher')
                    ->required(),
                Forms\Components\TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->helperText('Set to 0 to keep this a free course.'),
                Forms\Components\Select::make('currency')
                    ->options(['AED' => 'AED', 'USD' => 'USD'])
                    ->default('AED')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('slug')
                    ->searchable(),
                Tables\Columns\TextColumn::make('title')
                    ->searchable(),
                Tables\Columns\TextColumn::make('certification_code')
                    ->searchable(),
                Tables\Columns\TextColumn::make('vendor')
                    ->searchable(),
                Tables\Columns\TextColumn::make('hours')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('level')
                    ->searchable(),
                Tables\Columns\IconColumn::make('is_official_voucher_included')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('price')
                    ->money(fn ($record) => $record->currency)
                    ->sortable(),
                Tables\Columns\TextColumn::make('currency')
                    ->searchable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            // No delete here, bulk or otherwise - a course with real enrollment/
            // invoice history is DB-protected from deletion anyway (restrict, not
            // cascade), but a clean refusal to offer the button beats a raw SQL
            // error if someone tries. Delete a genuinely-unused test course via
            // tinker instead, as a deliberate action.
            ->bulkActions([]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\BundledCoursesRelationManager::class,
            RelationManagers\ExternalResourcesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCourses::route('/'),
            'create' => Pages\CreateCourse::route('/create'),
            'edit' => Pages\EditCourse::route('/{record}/edit'),
        ];
    }
}
