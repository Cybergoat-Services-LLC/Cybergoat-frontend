<?php

namespace App\Filament\Resources\QuizResource\RelationManagers;

use App\Models\Question;
use App\Services\QuizGeneratorService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class QuestionsRelationManager extends RelationManager
{
    protected static string $relationship = 'questions';

    protected static ?string $title = 'Questions';

    protected const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Textarea::make('question_text')
                    ->required()
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('option_a')->label('Option A')->required(),
                Forms\Components\TextInput::make('option_b')->label('Option B')->required(),
                Forms\Components\TextInput::make('option_c')->label('Option C')->required(),
                Forms\Components\TextInput::make('option_d')->label('Option D')->required(),
                Forms\Components\Select::make('correct_option')
                    ->label('Correct answer')
                    ->options(['A' => 'A', 'B' => 'B', 'C' => 'C', 'D' => 'D'])
                    ->required(),
                Forms\Components\Textarea::make('explanation')
                    ->columnSpanFull(),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('question_text')
            ->defaultSort('sort')
            ->columns([
                Tables\Columns\TextColumn::make('question_text')->limit(60)->wrap(),
                Tables\Columns\TextColumn::make('options')
                    ->label('Correct answer')
                    ->formatStateUsing(fn (Question $record) => $record->options[$record->correct_index] ?? '—'),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->mutateFormDataUsing(fn (array $data) => $this->optionFieldsToRecord($data)),
                Tables\Actions\Action::make('generateWithAi')
                    ->label('Generate with AI')
                    ->icon('heroicon-o-sparkles')
                    ->color('warning')
                    ->form([
                        Forms\Components\TextInput::make('topic')
                            ->label('Topic')
                            ->required()
                            ->placeholder('e.g. "OWASP Top 10 web application vulnerabilities"'),
                        Forms\Components\TextInput::make('count')
                            ->label('Number of questions')
                            ->numeric()
                            ->default(5)
                            ->minValue(1)
                            ->maxValue(20)
                            ->required(),
                    ])
                    ->modalDescription('Drafts questions with Vertex AI and adds them unpublished - review and edit them here before you publish this quiz.')
                    ->action(function (array $data) {
                        try {
                            $drafts = app(QuizGeneratorService::class)->generateDraftQuestions($data['topic'], (int) $data['count']);
                        } catch (\Throwable $e) {
                            Notification::make()->title('Could not generate questions')->body($e->getMessage())->danger()->send();

                            return;
                        }

                        $nextSort = $this->getOwnerRecord()->questions()->max('sort') + 1;

                        foreach ($drafts as $i => $draft) {
                            $this->getOwnerRecord()->questions()->create([
                                'question_text' => $draft['question'] ?? '',
                                'options' => array_values($draft['options'] ?? []),
                                'correct_index' => (int) ($draft['correct_index'] ?? 0),
                                'explanation' => $draft['explanation'] ?? null,
                                'sort' => $nextSort + $i,
                            ]);
                        }

                        Notification::make()
                            ->title(count($drafts) . ' questions drafted')
                            ->body('Review them below - the quiz stays unpublished until you flip it on.')
                            ->success()
                            ->send();
                    }),
            ])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->mutateRecordDataUsing(fn (array $data, Question $record) => $this->recordToOptionFields($data, $record))
                    ->mutateFormDataUsing(fn (array $data) => $this->optionFieldsToRecord($data)),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    /**
     * The form works with 4 separate option_a..d fields (a hard business
     * rule - exactly 4 options) but the DB stores a single `options` JSON
     * array plus a correct_index. These two methods translate between them.
     */
    protected function optionFieldsToRecord(array $data): array
    {
        $letterIndex = array_flip(self::OPTION_LETTERS);

        $data['options'] = [
            $data['option_a'] ?? '',
            $data['option_b'] ?? '',
            $data['option_c'] ?? '',
            $data['option_d'] ?? '',
        ];
        $data['correct_index'] = $letterIndex[$data['correct_option']] ?? 0;

        unset($data['option_a'], $data['option_b'], $data['option_c'], $data['option_d'], $data['correct_option']);

        return $data;
    }

    protected function recordToOptionFields(array $data, Question $record): array
    {
        $options = $record->options ?? [];

        $data['option_a'] = $options[0] ?? '';
        $data['option_b'] = $options[1] ?? '';
        $data['option_c'] = $options[2] ?? '';
        $data['option_d'] = $options[3] ?? '';
        $data['correct_option'] = self::OPTION_LETTERS[$record->correct_index] ?? 'A';

        return $data;
    }
}
