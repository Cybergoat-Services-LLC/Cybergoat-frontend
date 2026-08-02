<?php

namespace Tests\Feature;

use App\Filament\Resources\CourseResource\Pages\EditCourse;
use App\Filament\Resources\CourseResource\RelationManagers\BundledCoursesRelationManager;
use App\Filament\Resources\EnrollmentResource;
use App\Filament\Resources\InvoiceResource;
use App\Filament\Pages\BusinessSettings;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Invoice;
use App\Models\Setting;
use App\Models\User;
use App\Services\CertificateService;
use App\Services\GcsKitSigner;
use Database\Seeders\CybergoatSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class FilamentAdminPanelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CybergoatSeeder::class);

        $this->app->instance(CertificateService::class, new class extends CertificateService {
            public function generatePdf(Certificate $certificate): string
            {
                return '%PDF-FAKE%';
            }

            public function uploadAndSign(string $objectPath, string $pdfBytes): string
            {
                return "https://storage.googleapis.com/cybergoat-course-kits-prod/{$objectPath}?fake";
            }
        });

        $this->app->instance(GcsKitSigner::class, new class extends GcsKitSigner {
            public function sign(string $objectPath, \DateTimeInterface $expiresAt): string
            {
                return "https://storage.googleapis.com/cybergoat-course-kits-prod/{$objectPath}?fake";
            }
        });
    }

    protected function admin(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    public function test_guest_is_redirected_away_from_the_admin_panel(): void
    {
        $response = $this->get('/admin');

        $response->assertRedirect('/admin/login');
    }

    public function test_non_admin_user_cannot_access_the_admin_panel(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        $response = $this->actingAs($student)->get('/admin');

        $response->assertStatus(403);
    }

    public function test_admin_can_access_the_dashboard(): void
    {
        $response = $this->actingAs($this->admin())->get('/admin');

        $response->assertStatus(200);
    }

    public function test_admin_can_edit_a_course_price_through_the_form(): void
    {
        $admin = $this->admin();
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();

        Livewire::actingAs($admin)
            ->test(EditCourse::class, ['record' => $course->getKey()])
            ->fillForm(['price' => 4500, 'currency' => 'AED'])
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertEquals('4500.00', (string) $course->fresh()->price);
    }

    public function test_bundled_courses_relation_manager_can_attach_a_course(): void
    {
        $admin = $this->admin();
        $paid = Course::where('slug', 'ceh-v12')->firstOrFail();
        $free = Course::where('slug', 'chfi-v11')->firstOrFail();

        Livewire::actingAs($admin)
            ->test(BundledCoursesRelationManager::class, [
                'ownerRecord' => $paid,
                'pageClass' => EditCourse::class,
            ])
            ->callTableAction('attach', data: ['recordId' => $free->id]);

        $this->assertTrue($paid->bundledCourses()->where('courses.id', $free->id)->exists());
    }

    public function test_business_settings_page_persists_vat_toggle(): void
    {
        $admin = $this->admin();
        Setting::set('vat_enabled', 'false');

        Livewire::actingAs($admin)
            ->test(BusinessSettings::class)
            ->fillForm([
                'vat_enabled' => true,
                'vat_rate' => 5,
                'company_trn' => '100123456700003',
                'bank_account_name' => 'CYBERGOAT SERVICES - FZCO',
                'bank_name' => 'Wio Bank PJSC',
                'bank_iban' => 'AE220860000009100624064',
                'bank_swift' => 'WIOBAEADXXX',
                'bank_account_number' => '9100624064',
                'aani_proxy_id' => '',
                'aani_qr_image_url' => '',
            ])
            ->call('save');

        $this->assertTrue(Setting::vatEnabled());
        $this->assertEquals('100123456700003', Setting::companyTrn());
        $this->assertEquals('AE220860000009100624064', Setting::get('bank_iban'));
    }

    public function test_invoice_resource_confirm_payment_action_marks_paid_and_enrolls(): void
    {
        $admin = $this->admin();
        $student = User::factory()->create();
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $course->update(['price' => 4500]);
        $invoice = Invoice::draftForCourse($student, $course, 'bank_transfer');

        Livewire::actingAs($admin)
            ->test(InvoiceResource\Pages\ListInvoices::class)
            ->callTableAction('confirmPayment', $invoice, data: ['payment_reference' => 'WIO-TEST-1']);

        $this->assertEquals('paid', $invoice->fresh()->payment_status);
        $this->assertDatabaseHas('enrollments', ['user_id' => $student->id, 'course_id' => $course->id]);
    }

    public function test_enrollment_resource_issue_certificate_action_creates_certificate(): void
    {
        $admin = $this->admin();
        $student = User::factory()->create();
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();

        $enrollment = Enrollment::create([
            'user_id' => $student->id,
            'course_id' => $course->id,
            'status' => 'active',
            'enrolled_at' => now(),
            'expires_at' => now()->addYear(),
        ]);

        Livewire::actingAs($admin)
            ->test(EnrollmentResource\Pages\ListEnrollments::class)
            ->callTableAction('issueCertificate', $enrollment);

        $this->assertDatabaseHas('certificates', [
            'enrollment_id' => $enrollment->id,
            'user_id' => $student->id,
        ]);
        $this->assertEquals('completed', $enrollment->fresh()->status);
    }
}
