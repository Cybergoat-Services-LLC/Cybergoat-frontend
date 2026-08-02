<?php

namespace App\Filament\Resources\CourseResource\RelationManagers;

use App\Services\ContentGeneratorService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class ExternalResourcesRelationManager extends RelationManager
{
    protected static string $relationship = 'externalResources';

    protected static ?string $title = 'Free Bonus Resources (Microsoft, Anthropic, etc.)';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('provider')
                    ->required()
                    ->maxLength(100)
                    ->placeholder('Microsoft, Anthropic, ...'),
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('url')
                    ->required()
                    ->url()
                    ->maxLength(2048),
                Forms\Components\Textarea::make('description')
                    ->maxLength(1000)
                    ->columnSpanFull()
                    ->hintAction(
                        Forms\Components\Actions\Action::make('generateDescription')
                            ->label('Generate with AI')
                            ->icon('heroicon-o-sparkles')
                            ->action(function (Forms\Get $get, Forms\Set $set) {
                                if (blank($get('provider')) || blank($get('title'))) {
                                    Notification::make()->title('Fill in provider and title first')->warning()->send();

                                    return;
                                }

                                try {
                                    $draft = app(ContentGeneratorService::class)
                                        ->generateExternalResourceDescription($get('provider'), $get('title'));
                                } catch (\Throwable $e) {
                                    Notification::make()->title('Could not generate a description')->body($e->getMessage())->danger()->send();

                                    return;
                                }

                                $set('description', $draft);
                            })
                    ),
                Forms\Components\TextInput::make('sort')
                    ->numeric()
                    ->default(0),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->defaultSort('sort')
            ->columns([
                Tables\Columns\TextColumn::make('provider'),
                Tables\Columns\TextColumn::make('title'),
                Tables\Columns\TextColumn::make('url')->limit(40),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
