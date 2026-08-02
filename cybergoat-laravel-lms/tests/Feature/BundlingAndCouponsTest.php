<?php

namespace Tests\Feature;

use App\Models\Coupon;
use App\Models\Course;
use App\Models\Invoice;
use App\Models\Setting;
use App\Models\User;
use Database\Seeders\CybergoatSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BundlingAndCouponsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CybergoatSeeder::class);

        Setting::set('vat_enabled', 'false');

        Course::where('slug', 'ceh-v12')->update(['price' => 4500, 'currency' => 'AED']);
        Course::where('slug', 'chfi-v11')->update(['price' => 0, 'currency' => 'AED']); // stand-in "free bonus" course
    }

    public function test_purchasing_a_bundled_course_auto_enrolls_the_bundled_free_course(): void
    {
        $paid = Course::where('slug', 'ceh-v12')->firstOrFail();
        $free = Course::where('slug', 'chfi-v11')->firstOrFail();
        $paid->bundledCourses()->attach($free->id);

        $user = User::factory()->create();
        $invoice = Invoice::draftForCourse($user, $paid, 'bank_transfer');
        $invoice->markPaidAndEnroll();

        $this->assertDatabaseHas('enrollments', ['user_id' => $user->id, 'course_id' => $paid->id]);
        $this->assertDatabaseHas('enrollments', ['user_id' => $user->id, 'course_id' => $free->id]);
    }

    public function test_purchasing_a_non_bundled_course_does_not_enroll_unrelated_courses(): void
    {
        $paid = Course::where('slug', 'ceh-v12')->firstOrFail();
        $unrelated = Course::where('slug', 'cciso')->firstOrFail();

        $user = User::factory()->create();
        $invoice = Invoice::draftForCourse($user, $paid, 'bank_transfer');
        $invoice->markPaidAndEnroll();

        $this->assertDatabaseMissing('enrollments', ['user_id' => $user->id, 'course_id' => $unrelated->id]);
    }

    public function test_percentage_coupon_discounts_invoice_correctly(): void
    {
        Coupon::create(['code' => 'GOAT20', 'type' => 'percentage', 'discount_value' => 20, 'max_uses' => 10]);

        $user = User::factory()->create();
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();

        $invoice = Invoice::draftForCourse($user, $course, 'stripe', 'GOAT20');

        $this->assertEquals('4500.00', (string) $invoice->subtotal);
        $this->assertEquals('900.00', (string) $invoice->discount_amount);
        $this->assertEquals('3600.00', (string) $invoice->total);
        $this->assertEquals('GOAT20', $invoice->coupon_code);
    }

    public function test_fixed_coupon_never_discounts_below_zero(): void
    {
        Coupon::create(['code' => 'HUGE', 'type' => 'fixed', 'discount_value' => 999999, 'max_uses' => 10]);

        $user = User::factory()->create();
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();

        $invoice = Invoice::draftForCourse($user, $course, 'stripe', 'HUGE');

        $this->assertEquals('4500.00', (string) $invoice->discount_amount);
        $this->assertEquals('0.00', (string) $invoice->total);
    }

    public function test_expired_coupon_is_rejected(): void
    {
        Coupon::create([
            'code' => 'OLD2025', 'type' => 'percentage', 'discount_value' => 50,
            'max_uses' => 10, 'expires_at' => now()->subDay(),
        ]);

        $user = User::factory()->create();
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();

        $this->expectException(\InvalidArgumentException::class);
        Invoice::draftForCourse($user, $course, 'stripe', 'OLD2025');
    }

    public function test_fully_redeemed_coupon_is_rejected(): void
    {
        Coupon::create(['code' => 'ONEUSE', 'type' => 'percentage', 'discount_value' => 10, 'max_uses' => 1, 'uses_count' => 1]);

        $user = User::factory()->create();
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();

        $this->expectException(\InvalidArgumentException::class);
        Invoice::draftForCourse($user, $course, 'stripe', 'ONEUSE');
    }

    public function test_checkout_endpoint_rejects_invalid_coupon_with_422(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/courses/ceh-v12/checkout/offline', [
                'payment_method' => 'bank_transfer',
                'coupon_code' => 'DOES-NOT-EXIST',
            ]);

        $response->assertStatus(422)->assertJson(['success' => false]);
        $this->assertDatabaseMissing('invoices', ['coupon_code' => 'DOES-NOT-EXIST']);
    }

    public function test_coupon_validate_endpoint_previews_discount_without_redeeming(): void
    {
        Coupon::create(['code' => 'PREVIEW10', 'type' => 'percentage', 'discount_value' => 10, 'max_uses' => 5]);

        $response = $this->postJson('/api/v1/courses/ceh-v12/validate-coupon', ['code' => 'PREVIEW10']);

        $response->assertStatus(200)
            ->assertJson(['success' => true, 'discount_amount' => 450, 'new_total_before_vat' => 4050]);

        $this->assertDatabaseHas('coupons', ['code' => 'PREVIEW10', 'uses_count' => 0]);
    }

    public function test_coupon_usage_increments_on_actual_checkout(): void
    {
        $coupon = Coupon::create(['code' => 'INCR5', 'type' => 'fixed', 'discount_value' => 100, 'max_uses' => 5]);
        $user = User::factory()->create();
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();

        Invoice::draftForCourse($user, $course, 'stripe', 'INCR5');

        $this->assertEquals(1, $coupon->fresh()->uses_count);
    }
}
