<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\Enrollment;
use App\Models\Invoice;
use Google\Client;
use Google\Service\Sheets;
use Google\Service\Sheets\ClearValuesRequest;
use Google\Service\Sheets\ValueRange;

class GoogleSheetsSyncService
{
    /**
     * One-way push of read-only reporting data into a Google Sheet you own.
     * Nothing ever reads back from the Sheet - it's a mirror for you and
     * Gemini-in-Sheets to analyze, not a source of truth for the app.
     */
    public function syncAll(): array
    {
        return [
            'enrollments' => $this->syncEnrollments(),
            'invoices' => $this->syncInvoices(),
            'certificates' => $this->syncCertificates(),
        ];
    }

    protected function syncEnrollments(): int
    {
        $enrollments = Enrollment::with(['user:id,name,email', 'course:id,title'])->get();

        $rows = $enrollments->map(fn (Enrollment $e) => [
            $e->user->name,
            $e->user->email,
            $e->course->title,
            $e->status,
            optional($e->enrolled_at)->toDateTimeString(),
            optional($e->expires_at)->toDateTimeString(),
        ])->all();

        $this->writeSheet('Enrollments', ['Student', 'Email', 'Course', 'Status', 'Enrolled At', 'Expires At'], $rows);

        return count($rows);
    }

    protected function syncInvoices(): int
    {
        $invoices = Invoice::with(['user:id,name,email', 'course:id,title'])->get();

        $rows = $invoices->map(fn (Invoice $i) => [
            $i->invoice_number,
            $i->user->name,
            $i->user->email,
            $i->course->title,
            (string) $i->total,
            $i->currency,
            $i->payment_method,
            $i->payment_status,
            $i->coupon_code ?? '',
            optional($i->paid_at)->toDateTimeString(),
        ])->all();

        $this->writeSheet(
            'Invoices',
            ['Invoice #', 'Customer', 'Email', 'Course', 'Total', 'Currency', 'Method', 'Status', 'Coupon', 'Paid At'],
            $rows
        );

        return count($rows);
    }

    protected function syncCertificates(): int
    {
        $certificates = Certificate::with(['user:id,name', 'course:id,title'])->get();

        $rows = $certificates->map(fn (Certificate $c) => [
            $c->certificate_number,
            $c->user->name,
            $c->course->title,
            $c->type,
            optional($c->issued_at)->toDateTimeString(),
        ])->all();

        $this->writeSheet('Certificates', ['Certificate #', 'Recipient', 'Course', 'Type', 'Issued At'], $rows);

        return count($rows);
    }

    /**
     * Full overwrite of a tab's data range on every sync. Simpler and more
     * reliable than incremental diffing for a dataset this small - no risk
     * of sync drift between what's in Laravel and what's in the Sheet.
     */
    protected function writeSheet(string $sheetTitle, array $header, array $rows): void
    {
        $service = $this->client();
        $spreadsheetId = config('services.google_sheets.spreadsheet_id');

        $service->spreadsheets_values->clear(
            $spreadsheetId,
            "{$sheetTitle}!A:Z",
            new ClearValuesRequest()
        );

        $service->spreadsheets_values->update(
            $spreadsheetId,
            "{$sheetTitle}!A1",
            new ValueRange(['values' => array_merge([$header], $rows)]),
            ['valueInputOption' => 'RAW']
        );
    }

    protected function client(): Sheets
    {
        $googleClient = new Client();
        $googleClient->setAuthConfig(config('services.google_sheets.key_file'));
        $googleClient->addScope(Sheets::SPREADSHEETS);

        return new Sheets($googleClient);
    }
}
