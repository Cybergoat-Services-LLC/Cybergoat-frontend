<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use App\Services\GoogleSheetsSyncService;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class ReportsSync extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-table-cells';

    protected static ?string $navigationLabel = 'Reports (Google Sheets)';

    protected static string $view = 'filament.pages.reports-sync';

    public function getLastSyncedAt(): ?string
    {
        return Setting::get('sheets_last_synced_at');
    }

    public function sync(): void
    {
        if (blank(config('services.google_sheets.spreadsheet_id'))) {
            Notification::make()
                ->title('No spreadsheet configured')
                ->body('Set GOOGLE_SHEETS_SPREADSHEET_ID before syncing.')
                ->danger()
                ->send();

            return;
        }

        $counts = app(GoogleSheetsSyncService::class)->syncAll();

        Setting::set('sheets_last_synced_at', now()->toIso8601String());

        Notification::make()
            ->title('Synced to Google Sheets')
            ->body("{$counts['enrollments']} enrollments, {$counts['invoices']} invoices, {$counts['certificates']} certificates.")
            ->success()
            ->send();
    }
}
