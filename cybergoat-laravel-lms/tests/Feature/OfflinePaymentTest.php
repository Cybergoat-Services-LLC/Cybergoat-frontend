<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Invoice;
use App\Models\Setting;
use App\Models\User;
use Database\Seeders\CybergoatSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OfflinePaymentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CybergoatSeeder::class);

        Setting::set('vat_enabled', 'false');
        Setting::set('bank_iban', 'AE000000000000000000000');
        Setting::set('aani_proxy_id', '+971501234567');

        Course::where('slug', 'ceh-v12')->update(['price' => 4500, 'currency' => 'AED']);
    }

    public function test_offline_checkout_requires_authentication(): void
    {
        $response = $this->postJson('/api/v1/courses/ceh-v12/checkout/offline', ['payment_method' => 'bank_transfer']);

        $response->assertStatus(401);
    }

    public function test_offline_checkout_rejects_invalid_payment_method(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/courses/ceh-v12/checkout/offline', ['payment_method' => 'crypto']);

        $response->assertStatus(422);
    }

    public function test_bank_transfer_checkout_returns_bank_instructions(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/courses/ceh-v12/checkout/offline', ['payment_method' => 'bank_transfer']);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'amount_due' => '4500.00',
                'currency' => 'AED',
                'payment_instructions' => ['bank_iban' => 'AE000000000000000000000'],
            ]);

        $this->assertDatabaseHas('invoices', [
            'user_id' => $user->id,
            'payment_method' => 'bank_transfer',
            'payment_status' => 'pending',
        ]);
    }

    public function test_aani_qr_checkout_returns_aani_instructions(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/courses/ceh-v12/checkout/offline', ['payment_method' => 'aani_qr']);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'payment_instructions' => ['aani_proxy_id' => '+971501234567'],
            ]);

        $this->assertDatabaseHas('invoices', [
            'user_id' => $user->id,
            'payment_method' => 'aani_qr',
        ]);
    }

    public function test_confirm_payment_rejects_unauthenticated_requests(): void
    {
        $user = User::factory()->create();
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $invoice = Invoice::draftForCourse($user, $course, 'bank_transfer');

        $response = $this->postJson("/api/v1/admin/invoices/{$invoice->invoice_number}/confirm-payment");

        $response->assertStatus(401);
    }

    public function test_confirm_payment_rejects_non_admin_users(): void
    {
        $user = User::factory()->create();
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $invoice = Invoice::draftForCourse($user, $course, 'bank_transfer');

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/admin/invoices/{$invoice->invoice_number}/confirm-payment");

        $response->assertStatus(403);
    }

    public function test_admin_can_confirm_payment_and_enrollment_is_created(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $student = User::factory()->create();
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $invoice = Invoice::draftForCourse($student, $course, 'bank_transfer');

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/invoices/{$invoice->invoice_number}/confirm-payment", [
                'payment_reference' => 'WIO-TXN-998877',
            ]);

        $response->assertStatus(200)->assertJson(['success' => true, 'payment_status' => 'paid']);

        $this->assertDatabaseHas('invoices', [
            'id' => $invoice->id,
            'payment_status' => 'paid',
            'confirmed_by' => $admin->id,
            'payment_reference' => 'WIO-TXN-998877',
        ]);

        $this->assertDatabaseHas('enrollments', [
            'user_id' => $student->id,
            'course_id' => $course->id,
            'status' => 'active',
        ]);
    }

    public function test_confirming_an_already_paid_invoice_is_rejected(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $student = User::factory()->create();
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $invoice = Invoice::draftForCourse($student, $course, 'bank_transfer');
        $invoice->markPaidAndEnroll($admin);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/v1/admin/invoices/{$invoice->invoice_number}/confirm-payment");

        $response->assertStatus(409);
    }

    public function test_confirm_payment_returns_404_for_unknown_invoice(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/admin/invoices/CG-INV-999999/confirm-payment');

        $response->assertStatus(404);
    }
}
