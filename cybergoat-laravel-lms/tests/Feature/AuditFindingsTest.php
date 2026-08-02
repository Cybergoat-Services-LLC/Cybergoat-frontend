<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use App\Services\GcsKitSigner;
use Database\Seeders\CybergoatSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Regression coverage for issues found during the 2026-08-02 self-audit:
 * a free-enroll payment bypass, and enrollment expiry never being enforced.
 */
class AuditFindingsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CybergoatSeeder::class);

        $this->app->instance(GcsKitSigner::class, new class extends GcsKitSigner {
            public function sign(string $objectPath, \DateTimeInterface $expiresAt): string
            {
                return "https://storage.googleapis.com/cybergoat-course-kits-prod/{$objectPath}?fake-signature";
            }
        });
    }

    public function test_self_enroll_rejects_paid_courses(): void
    {
        Course::where('slug', 'ceh-v12')->update(['price' => 4500]);
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/courses/ceh-v12/enroll');

        $response->assertStatus(422)->assertJson(['success' => false]);
        $this->assertDatabaseMissing('enrollments', ['user_id' => $user->id]);
    }

    public function test_self_enroll_still_works_for_genuinely_free_courses(): void
    {
        Course::where('slug', 'ceh-v12')->update(['price' => 0]);
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/courses/ceh-v12/enroll');

        $response->assertStatus(201)->assertJson(['success' => true]);
        $this->assertDatabaseHas('enrollments', ['user_id' => $user->id]);
    }

    public function test_free_enroll_can_no_longer_be_used_to_unlock_a_paid_kit_download(): void
    {
        Course::where('slug', 'ceh-v12')->update(['price' => 4500]);
        $user = User::factory()->create();

        // The old bypass: try to self-enroll, then immediately download the kit.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/courses/ceh-v12/enroll');
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/courses/ceh-v12/download-kit');

        $response->assertStatus(403);
    }

    public function test_download_kit_rejects_an_expired_enrollment(): void
    {
        $user = User::factory()->create();
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();

        Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'status' => 'active',
            'enrolled_at' => now()->subYears(2),
            'expires_at' => now()->subDay(),
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/courses/ceh-v12/download-kit');

        $response->assertStatus(403);
    }

    public function test_download_kit_allows_an_enrollment_with_no_expiry_set(): void
    {
        $user = User::factory()->create();
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();

        Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'status' => 'active',
            'enrolled_at' => now(),
            'expires_at' => null,
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/courses/ceh-v12/download-kit');

        $response->assertStatus(200);
    }
}
