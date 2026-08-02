<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use App\Services\GcsKitSigner;
use Database\Seeders\CybergoatSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CybergoatLmsApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CybergoatSeeder::class);

        // Never hit live Google Cloud Storage from the test suite.
        $this->app->instance(GcsKitSigner::class, new class extends GcsKitSigner {
            public function sign(string $objectPath, \DateTimeInterface $expiresAt): string
            {
                return "https://storage.googleapis.com/cybergoat-course-kits-prod/{$objectPath}"
                    . '?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Signature=fake-test-signature';
            }
        });
    }

    public function test_can_fetch_cybergoat_course_catalog(): void
    {
        $response = $this->getJson('/api/v1/courses');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'count' => 6,
            ])
            ->assertJsonFragment(['slug' => 'ceh-v12'])
            ->assertJsonFragment(['slug' => 'chfi-v11'])
            ->assertJsonFragment(['slug' => 'cciso']);
    }

    public function test_can_fetch_single_course_details(): void
    {
        $response = $this->getJson('/api/v1/courses/chfi-v11');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'slug' => 'chfi-v11',
                    'title' => 'Computer Hacking Forensic Investigator v11',
                    'vendor' => 'EC-Council',
                    'level' => 'Advanced',
                ]
            ]);
    }

    public function test_download_kit_rejects_unauthenticated_requests(): void
    {
        $response = $this->postJson('/api/v1/courses/chfi-v11/download-kit');

        $response->assertStatus(401);
    }

    public function test_download_kit_rejects_users_without_an_active_enrollment(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/courses/chfi-v11/download-kit');

        $response->assertStatus(403)
            ->assertJson(['success' => false]);
    }

    public function test_can_generate_signed_download_url_for_enrolled_user(): void
    {
        $user = User::factory()->create();
        $course = Course::where('slug', 'chfi-v11')->firstOrFail();

        Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'status' => 'active',
            'enrolled_at' => now(),
            'expires_at' => now()->addYear(),
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/courses/chfi-v11/download-kit');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'certification_code' => 'CHFI v11',
                'expires_in_minutes' => 60,
            ])
            ->assertJsonStructure(['download_url', 'expires_at']);

        $downloadUrl = $response->json('download_url');
        $this->assertStringStartsWith('https://storage.googleapis.com/cybergoat-course-kits-prod/course-kits/chfi-v11-student-kit.pdf', $downloadUrl);
        $this->assertStringContainsString('X-Goog-Signature=', $downloadUrl);

        $this->assertDatabaseHas('kit_downloads', [
            'user_id' => $user->id,
            'course_id' => $course->id,
            'gcs_object_path' => 'course-kits/chfi-v11-student-kit.pdf',
        ]);
    }

    public function test_can_enroll_and_fetch_own_enrollments(): void
    {
        $user = User::factory()->create();

        $enrollResponse = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/courses/ceh-v12/enroll');

        $enrollResponse->assertStatus(201)->assertJson(['success' => true]);

        $listResponse = $this->actingAs($user, 'sanctum')->getJson('/api/v1/enrollments');

        $listResponse->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonFragment(['status' => 'active']);
    }

    public function test_can_fetch_live_scheduled_classes(): void
    {
        $response = $this->getJson('/api/v1/courses/ceh-v12/live-classes');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'course' => 'Certified Ethical Hacker v12',
                'data' => [],
            ]);
    }
}
