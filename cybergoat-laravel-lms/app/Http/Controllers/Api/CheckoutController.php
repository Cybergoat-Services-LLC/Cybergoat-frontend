<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Invoice;
use App\Services\StripeCheckoutService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    public function __construct(private StripeCheckoutService $stripe)
    {
    }

    /**
     * Start a Stripe-hosted checkout for a course. Creates a pending invoice
     * up front so we have a durable record even if the customer abandons
     * checkout - the webhook is the only thing that ever marks it paid.
     */
    public function createSession(Request $request, string $slug): JsonResponse
    {
        $course = Course::where('slug', $slug)->first();

        if (!$course) {
            return response()->json(['success' => false, 'message' => 'Course not found'], 404);
        }

        if ((float) $course->price <= 0) {
            return response()->json(['success' => false, 'message' => 'This course does not have a price set yet.'], 422);
        }

        try {
            $invoice = Invoice::draftForCourse($request->user(), $course, 'stripe', $request->input('coupon_code'));
        } catch (\InvalidArgumentException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }

        $frontendUrl = rtrim(env('FRONTEND_URL', config('app.url')), '/');

        $session = $this->stripe->createSessionForInvoice(
            $invoice,
            successUrl: "{$frontendUrl}/checkout/success?invoice={$invoice->invoice_number}",
            cancelUrl: "{$frontendUrl}/checkout/cancelled?invoice={$invoice->invoice_number}",
        );

        $invoice->update(['stripe_checkout_session_id' => $session->id]);

        return response()->json([
            'success' => true,
            'invoice_number' => $invoice->invoice_number,
            'checkout_url' => $session->url,
        ]);
    }

    /**
     * Stripe webhook receiver. Signature verification is the only thing that
     * authorizes this endpoint - it deliberately has no auth:sanctum middleware
     * since Stripe, not a logged-in user, calls it.
     */
    public function handleWebhook(Request $request): JsonResponse
    {
        try {
            $event = $this->stripe->constructWebhookEvent(
                $request->getContent(),
                $request->header('Stripe-Signature', '')
            );
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Invalid webhook signature'], 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $invoice = Invoice::where('stripe_checkout_session_id', $session->id)->first();

            if ($invoice) {
                $invoice->update(['stripe_payment_intent_id' => $session->payment_intent]);
                $invoice->markPaidAndEnroll();
            }
        }

        return response()->json(['received' => true]);
    }
}
