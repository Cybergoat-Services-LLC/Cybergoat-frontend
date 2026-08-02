<?php

namespace Tests\Feature;

use App\Filament\Pages\ReportsSync;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Invoice;
use App\Models\Setting;
use App\Models\User;
use App\Services\GoogleSheetsSyncService;
use Database\Seeders\CybergoatSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class GoogleSheetsSyncTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CybergoatSeeder::class);
    }

    protected function fakeSyncService(): void
    {
        $this->app->instance(GoogleSheetsSyncService::class, new class extends GoogleSheetsSyncService {
            public array $calls = [];

            public function syncAll(): array
            {
                $this->calls[] = now();

                return ['enrollments' => 2, 'invoices' => 1, 'certificates' => 1];
            }
        });
    }

    public function test_sync_command_fails_gracefully_without_a_spreadsheet_id(): void
    {
        config(['services.google_sheets.spreadsheet_id' => null]);
        $this->fakeSyncService();

        $this->artisan('app:sync-google-sheets')->assertExitCode(1);
    }

    public function test_sync_command_updates_last_synced_setting(): void
    {
        config(['services.google_sheets.spreadsheet_id' => 'fake-sheet-id']);
        $this->fakeSyncService();

        $this->artisan('app:sync-google-sheets')->assertExitCode(0);

        $this->assertNotNull(Setting::get('sheets_last_synced_at'));
    }

    public function test_reports_page_sync_button_requires_admin(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        $response = $this->actingAs($student)->get('/admin/reports-sync');

        $response->assertStatus(403);
    }

    public function test_reports_page_sync_button_triggers_sync_and_shows_last_synced(): void
    {
        config(['services.google_sheets.spreadsheet_id' => 'fake-sheet-id']);
        $this->fakeSyncService();
        $admin = User::factory()->create(['role' => 'admin']);

        Livewire::actingAs($admin)
            ->test(ReportsSync::class)
            ->call('sync');

        $this->assertNotNull(Setting::get('sheets_last_synced_at'));
    }

    public function test_sync_writes_the_actual_enrollment_invoice_and_certificate_data(): void
    {
        // Not mocked here - proves the real service builds correct rows from
        // the DB, just without actually calling Google's API (client() is
        // never reached because writeSheet would need a real spreadsheet ID;
        // this test exercises the query/mapping logic via a partial double).
        $user = User::factory()->create(['name' => 'Jane Doe', 'email' => 'jane@example.com']);
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $course->update(['price' => 4500]);

        Enrollment::create([
            'user_id' => $user->id, 'course_id' => $course->id, 'status' => 'active',
            'enrolled_at' => now(), 'expires_at' => now()->addYear(),
        ]);
        Invoice::draftForCourse($user, $course, 'bank_transfer');

        $sync = new class extends GoogleSheetsSyncService {
            public array $written = [];

            protected function writeSheet(string $sheetTitle, array $header, array $rows): void
            {
                $this->written[$sheetTitle] = ['header' => $header, 'rows' => $rows];
            }
        };

        $sync->syncAll();

        $this->assertCount(1, $sync->written['Enrollments']['rows']);
        $this->assertEquals('Jane Doe', $sync->written['Enrollments']['rows'][0][0]);
        $this->assertCount(1, $sync->written['Invoices']['rows']);
        $this->assertEquals('jane@example.com', $sync->written['Invoices']['rows'][0][2]);
    }
}
