<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CertificateResource\Pages;
use App\Models\Certificate;
use App\Services\GcsKitSigner;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class CertificateResource extends Resource
{
    protected static ?string $model = Certificate::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-check';

    // Certificates are only ever created via the "Issue Certificate" enrollment
    // action - no manual create/edit form to avoid orphaned or malformed records.
    public static function canCreate(): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('issued_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('certificate_number')->searchable(),
                Tables\Columns\TextColumn::make('user.name')->label('Recipient')->searchable(),
                Tables\Columns\TextColumn::make('course.title')->label('Course')->searchable(),
                Tables\Columns\BadgeColumn::make('type')
                    ->colors([
                        'warning' => 'ec_council_aligned',
                        'info' => 'vendor_aligned',
                        'success' => 'cybergoat_original',
                    ]),
                Tables\Columns\TextColumn::make('issuedBy.name')->label('Issued by')->toggleable(),
                Tables\Columns\TextColumn::make('issued_at')->dateTime()->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')->options([
                    'ec_council_aligned' => 'EC-Council Aligned',
                    'vendor_aligned' => 'Other Vendor Aligned',
                    'cybergoat_original' => 'CyberGOAT Original',
                ]),
            ])
            ->actions([
                Tables\Actions\Action::make('download')
                    ->label('Download PDF')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->url(fn (Certificate $record) => app(GcsKitSigner::class)->sign($record->gcs_object_path, now()->addMinutes(60)))
                    ->openUrlInNewTab(),
            ])
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCertificates::route('/'),
        ];
    }
}
