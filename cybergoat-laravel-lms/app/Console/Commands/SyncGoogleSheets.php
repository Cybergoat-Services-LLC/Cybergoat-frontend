<?php

namespace App\Console\Commands;

use App\Models\Setting;
use App\Services\GoogleSheetsSyncService;
use Illuminate\Console\Command;

class SyncGoogleSheets extends Command
{
    protected $signature = 'app:sync-google-sheets';

    protected $description = 'Push enrollments/invoices/certificates into the reporting Google Sheet';

    public function handle(GoogleSheetsSyncService $sync): int
    {
        if (blank(config('services.google_sheets.spreadsheet_id'))) {
            $this->error('GOOGLE_SHEETS_SPREADSHEET_ID is not set - nothing to sync to.');

            return self::FAILURE;
        }

        $counts = $sync->syncAll();

        Setting::set('sheets_last_synced_at', now()->toIso8601String());

        $this->info("Synced: {$counts['enrollments']} enrollments, {$counts['invoices']} invoices, {$counts['certificates']} certificates.");

        return self::SUCCESS;
    }
}
