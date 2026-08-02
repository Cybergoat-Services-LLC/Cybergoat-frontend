<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Invoice;
use App\Models\Setting;
use App\Models\User;
use App\Services\StripeCheckoutService;
use Database\Seeders\CybergoatSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Stripe\Checkout\Session;
use Stripe\Event;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CybergoatSeeder::class);

        Setting::set('vat_enabled', 'false');
        Setting::set('vat_rate', '5');
        Setting::set('company_trn', '');

        Course::where('slug', 'ceh-v12')->update(['price' => 4500, 'currency' => 'AED']);
    }

    protected function fakeStripe(?Session $session = null): void
    {
        $session ??= Session::constructFrom([
            'id' => 'cs_test_fake_123',
            'url' => 'https://checkout.stripe.com/c/pay/cs_test_fake_123',
        ]);

        $this->app->instance(StripeCheckoutService::class, new class($session) extends StripeCheckoutService {
            public function __construct(private Session $fakeSession)
            {
            }

            public function createSessionForInvoice(\App\Models\Invoice $invoice, string $successUrl, string $cancelUrl): Session
            {
                return $this->fakeSession;
            }

            public function constructWebhookEvent(string $payload, string $signatureHeader): Event
            {
                if ($signatureHeader !== 'valid-test-signature') {
                    throw new \UnexpectedValueException('Invalid signature');
                }

                return Event::constructFrom(json_decode($payload, true));
            }
        });
    }

    public function test_checkout_rejects_unauthenticated_requests(): void
    {
        $this->fakeStripe();

        $response = $this->postJson('/api/v1/courses/ceh-v12/checkout');

        $response->assertStatus(401);
    }

    public function test_checkout_rejects_courses_with_no_price_set(): void
    {
        $this->fakeStripe();
        $user = User::factory()->create();
        Course::where('slug', 'chfi-v11')->update(['price' => 0]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/courses/chfi-v11/checkout');

        $response->assertStatus(422)->assertJson(['success' => false]);
    }

    public function test_checkout_creates_pending_invoice_with_no_vat_when_disabled(): void
    {
        $this->fakeStripe();
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/courses/ceh-v12/checkout');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'checkout_url' => 'https://checkout.stripe.com/c/pay/cs_test_fake_123',
            ]);

        $this->assertDatabaseHas('invoices', [
            'user_id' => $user->id,
            'subtotal' => '4500.00',
            'vat_rate_applied' => '0.00',
            'vat_amount' => '0.00',
            'total' => '4500.00',
            'payment_status' => 'pending',
            'stripe_checkout_session_id' => 'cs_test_fake_123',
        ]);
    }

    public function test_invoice_applies_vat_when_enabled(): void
    {
        Setting::set('vat_enabled', 'true');
        Setting::set('vat_rate', '5');
        Setting::set('company_trn', '100123456700003');

        $user = User::factory()->create();
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();

        $invoice = Invoice::draftForCourse($user, $course, 'stripe');

        $this->assertEquals('4500.00', (string) $invoice->subtotal);
        $this->assertEquals('5.00', (string) $invoice->vat_rate_applied);
        $this->assertEquals('225.00', (string) $invoice->vat_amount);
        $this->assertEquals('4725.00', (string) $invoice->total);
        $this->assertEquals('100123456700003', $invoice->company_trn_snapshot);
        $this->assertMatchesRegularExpression('/^CG-INV-\d{6}$/', $invoice->invoice_number);
    }

    public function test_webhook_rejects_invalid_signature(): void
    {
        $this->fakeStripe();

        $response = $this->postJson('/api/v1/webhooks/stripe', [], [
            'Stripe-Signature' => 'not-the-right-signature',
        ]);

        $response->assertStatus(400);
    }

    public function test_webhook_marks_invoice_paid_and_creates_enrollment(): void
    {
        $this->fakeStripe();
        $user = User::factory()->create();
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();

        $invoice = Invoice::draftForCourse($user, $course, 'stripe');
        $invoice->update(['stripe_checkout_session_id' => 'cs_test_fake_123']);

        $payload = json_encode([
            'id' => 'evt_test_1',
            'type' => 'checkout.session.completed',
            'data' => [
                'object' => [
                    'id' => 'cs_test_fake_123',
                    'payment_intent' => 'pi_test_fake_123',
                ],
            ],
        ]);

        $response = $this->call('POST', '/api/v1/webhooks/stripe', [], [], [], [
            'HTTP_Stripe-Signature' => 'valid-test-signature',
            'CONTENT_TYPE' => 'application/json',
        ], $payload);

        $response->assertStatus(200);

        $this->assertDatabaseHas('invoices', [
            'id' => $invoice->id,
            'payment_status' => 'paid',
            'stripe_payment_intent_id' => 'pi_test_fake_123',
        ]);

        $this->assertDatabaseHas('enrollments', [
            'user_id' => $user->id,
            'course_id' => $course->id,
            'status' => 'active',
        ]);
    }

    public function test_webhook_does_not_double_enroll_on_replayed_event(): void
    {
        $this->fakeStripe();
        $user = User::factory()->create();
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();

        $invoice = Invoice::draftForCourse($user, $course, 'stripe');
        $invoice->update(['stripe_checkout_session_id' => 'cs_test_fake_123']);

        $payload = json_encode([
            'id' => 'evt_test_1',
            'type' => 'checkout.session.completed',
            'data' => ['object' => ['id' => 'cs_test_fake_123', 'payment_intent' => 'pi_test_fake_123']],
        ]);

        $headers = ['HTTP_Stripe-Signature' => 'valid-test-signature', 'CONTENT_TYPE' => 'application/json'];

        $this->call('POST', '/api/v1/webhooks/stripe', [], [], [], $headers, $payload);
        $this->call('POST', '/api/v1/webhooks/stripe', [], [], [], $headers, $payload);

        $this->assertDatabaseCount('enrollments', 1);
    }
}
