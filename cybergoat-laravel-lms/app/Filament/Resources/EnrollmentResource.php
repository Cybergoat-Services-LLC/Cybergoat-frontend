<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EnrollmentResource\Pages;
use App\Models\Certificate;
use App\Models\Enrollment;
use App\Services\CertificateService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class EnrollmentResource extends Resource
{
    protected static ?string $model = Enrollment::class;

    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->required(),
                Forms\Components\Select::make('course_id')
                    ->relationship('course', 'title')
                    ->searchable()
                    ->required(),
                Forms\Components\Select::make('status')
                    ->options(['active' => 'Active', 'completed' => 'Completed', 'expired' => 'Expired'])
                    ->default('active')
                    ->required(),
                Forms\Components\DateTimePicker::make('enrolled_at')
                    ->default(now())
                    ->required(),
                Forms\Components\DateTimePicker::make('expires_at')
                    ->helperText('Leave blank for an enrollment that never expires.'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('user.name')->label('Student')->searchable(),
                Tables\Columns\TextColumn::make('course.title')->label('Course')->searchable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors(['success' => 'active', 'primary' => 'completed', 'danger' => 'expired']),
                Tables\Columns\TextColumn::make('enrolled_at')->dateTime()->sortable(),
                Tables\Columns\TextColumn::make('expires_at')->dateTime()->sortable()->placeholder('Never'),
                Tables\Columns\IconColumn::make('has_certificate')
                    ->label('Certificate')
                    ->boolean()
                    ->getStateUsing(fn (Enrollment $record) => Certificate::where('enrollment_id', $record->id)->exists()),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options(['active' => 'Active', 'completed' => 'Completed', 'expired' => 'Expired']),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('issueCertificate')
                    ->label('Issue Certificate')
                    ->icon('heroicon-o-document-check')
                    ->color('success')
                    ->visible(fn (Enrollment $record) => !Certificate::where('enrollment_id', $record->id)->exists())
                    ->requiresConfirmation()
                    ->modalDescription('Marks this enrollment completed and generates a real PDF certificate.')
                    ->action(function (Enrollment $record) {
                        $certificate = app(CertificateService::class)->issueForEnrollment($record, auth()->user());

                        Notification::make()
                            ->title("Certificate {$certificate->certificate_number} issued")
                            ->success()
                            ->send();
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
            'index' => Pages\ListEnrollments::route('/'),
            'create' => Pages\CreateEnrollment::route('/create'),
            'edit' => Pages\EditEnrollment::route('/{record}/edit'),
        ];
    }
}
