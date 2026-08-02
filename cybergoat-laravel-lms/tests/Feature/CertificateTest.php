<?php

namespace Tests\Feature;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use App\Services\CertificateService;
use App\Services\GcsKitSigner;
use Database\Seeders\CybergoatSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CertificateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CybergoatSeeder::class);

        // Never render a real PDF or hit live GCS from the test suite.
        $this->app->instance(CertificateService::class, new class extends CertificateService {
            public function generatePdf(Certificate $certificate): string
            {
                return '%PDF-FAKE-CONTENT%';
            }

            public function uploadAndSign(string $objectPath, string $pdfBytes): string
            {
                return "https://storage.googleapis.com/cybergoat-course-kits-prod/{$objectPath}?fake-signature";
            }
        });

        $this->app->instance(GcsKitSigner::class, new class extends GcsKitSigner {
            public function sign(string $objectPath, \DateTimeInterface $expiresAt): string
            {
                return "https://storage.googleapis.com/cybergoat-course-kits-prod/{$objectPath}?fake-signature";
            }
        });
    }

    protected function makeEnrollment(User $user, string $slug): Enrollment
    {
        $course = Course::where('slug', $slug)->firstOrFail();

        return Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'status' => 'active',
            'enrolled_at' => now(),
            'expires_at' => now()->addYear(),
        ]);
    }

    public function test_issue_certificate_requires_authentication(): void
    {
        $user = User::factory()->create();
        $enrollment = $this->makeEnrollment($user, 'ceh-v12');

        $response = $this->postJson("/api/v1/admin/enrollments/{$enrollment->id}/issue-certificate");

        $response->assertStatus(401);
    }

    public function test_issue_certificate_requires_admin(): void
    {
        $user = User::factory()->create();
        $enrollment = $this->makeEnrollment($user, 'ceh-v12');

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/admin/enrollments/{$enrollment->id}/issue-certificate");

        $response->assertStatus(403);
    }

    public function test_admin_can_issue_certificate_and_enrollment_becomes_completed(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $student = User::factory()->create();
        $enrollment = $this->makeEnrollment($student, 'ceh-v12');

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/enrollments/{$enrollment->id}/issue-certificate");

        $response->assertStatus(201)
            ->assertJson(['success' => true, 'type' => 'ec_council_aligned', 'already_issued' => false])
            ->assertJsonStructure(['certificate_number', 'download_url']);

        $this->assertDatabaseHas('enrollments', ['id' => $enrollment->id, 'status' => 'completed']);
        $this->assertDatabaseHas('certificates', [
            'enrollment_id' => $enrollment->id,
            'user_id' => $student->id,
            'type' => 'ec_council_aligned',
        ]);
    }

    public function test_certificate_type_derived_from_course_vendor(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $student = User::factory()->create();
        $enrollment = $this->makeEnrollment($student, 'cisa'); // ISACA

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/enrollments/{$enrollment->id}/issue-certificate");

        $response->assertStatus(201)->assertJson(['type' => 'vendor_aligned']);
    }

    public function test_issuing_certificate_twice_is_idempotent(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $student = User::factory()->create();
        $enrollment = $this->makeEnrollment($student, 'ceh-v12');

        $first = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/enrollments/{$enrollment->id}/issue-certificate");
        $second = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/enrollments/{$enrollment->id}/issue-certificate");

        $first->assertStatus(201);
        $second->assertStatus(200)->assertJson(['already_issued' => true]);
        $this->assertEquals(
            $first->json('certificate_number'),
            $second->json('certificate_number')
        );
        $this->assertDatabaseCount('certificates', 1);
    }

    public function test_public_verify_endpoint_returns_certificate_info(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $student = User::factory()->create(['name' => 'Jane Student']);
        $enrollment = $this->makeEnrollment($student, 'ceh-v12');

        $issue = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/enrollments/{$enrollment->id}/issue-certificate");
        $certNumber = $issue->json('certificate_number');

        $response = $this->getJson("/api/v1/certificates/verify/{$certNumber}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'valid' => true,
                'recipient_name' => 'Jane Student',
                'certificate_number' => $certNumber,
            ]);

        // Verification is public and deliberately doesn't leak a download link.
        $response->assertJsonMissing(['download_url']);
    }

    public function test_public_verify_endpoint_404_for_unknown_certificate(): void
    {
        $response = $this->getJson('/api/v1/certificates/verify/CG-CERT-999999');

        $response->assertStatus(404)->assertJson(['valid' => false]);
    }

    public function test_user_can_list_own_certificates(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $student = User::factory()->create();
        $enrollment = $this->makeEnrollment($student, 'ceh-v12');

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/enrollments/{$enrollment->id}/issue-certificate");

        $response = $this->actingAs($student, 'sanctum')->getJson('/api/v1/certificates');

        $response->assertStatus(200)->assertJson(['success' => true]);
        $this->assertCount(1, $response->json('data'));
        $this->assertNotEmpty($response->json('data.0.download_url'));
    }
}
