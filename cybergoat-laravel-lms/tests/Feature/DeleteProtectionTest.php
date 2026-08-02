<?php

namespace Tests\Feature;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Invoice;
use App\Models\User;
use Database\Seeders\CybergoatSeeder;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Regression coverage for the 2026-08-02 audit finding: Filament's bulk
 * delete on Courses/Enrollments cascaded and silently destroyed invoices
 * and issued certificates. Fixed by switching those foreign keys from
 * cascade to restrict, and removing the bulk-delete buttons entirely.
 */
class DeleteProtectionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CybergoatSeeder::class);
    }

    public function test_a_course_with_an_invoice_cannot_be_deleted(): void
    {
        $user = User::factory()->create();
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $course->update(['price' => 4500]);
        Invoice::draftForCourse($user, $course, 'bank_transfer');

        $this->expectException(QueryException::class);
        $course->delete();
    }

    public function test_a_course_with_an_enrollment_cannot_be_deleted(): void
    {
        $user = User::factory()->create();
        $course = Course::where('slug', 'chfi-v11')->firstOrFail();

        Enrollment::create([
            'user_id' => $user->id, 'course_id' => $course->id, 'status' => 'active',
            'enrolled_at' => now(), 'expires_at' => now()->addYear(),
        ]);

        $this->expectException(QueryException::class);
        $course->delete();
    }

    public function test_a_course_with_no_history_can_still_be_deleted(): void
    {
        $course = Course::where('slug', 'cissp')->firstOrFail();

        $course->delete();

        $this->assertDatabaseMissing('courses', ['id' => $course->id]);
    }

    public function test_an_enrollment_with_a_certificate_cannot_be_deleted(): void
    {
        $user = User::factory()->create();
        $course = Course::where('slug', 'cciso')->firstOrFail();

        $enrollment = Enrollment::create([
            'user_id' => $user->id, 'course_id' => $course->id, 'status' => 'completed',
            'enrolled_at' => now(), 'expires_at' => now()->addYear(),
        ]);

        Certificate::create([
            'user_id' => $user->id, 'course_id' => $course->id, 'enrollment_id' => $enrollment->id,
            'certificate_number' => 'CG-CERT-000001', 'type' => 'ec_council_aligned',
            'title' => 'Certificate of Completion', 'issued_at' => now(),
        ]);

        $this->expectException(QueryException::class);
        $enrollment->delete();
    }

    public function test_an_enrollment_with_no_certificate_can_still_be_deleted(): void
    {
        $user = User::factory()->create();
        $course = Course::where('slug', 'cisa')->firstOrFail();

        $enrollment = Enrollment::create([
            'user_id' => $user->id, 'course_id' => $course->id, 'status' => 'active',
            'enrolled_at' => now(), 'expires_at' => now()->addYear(),
        ]);

        $enrollment->delete();

        $this->assertDatabaseMissing('enrollments', ['id' => $enrollment->id]);
    }
}
