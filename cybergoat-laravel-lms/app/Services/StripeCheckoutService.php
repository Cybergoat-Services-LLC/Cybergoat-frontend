<?php

namespace App\Services;

use App\Models\Invoice;
use Stripe\Checkout\Session;
use Stripe\StripeClient;
use Stripe\Webhook;

class StripeCheckoutService
{
    protected function client(): StripeClient
    {
        return new StripeClient(config('services.stripe.secret'));
    }

    /**
     * Create a Stripe-hosted Checkout Session for a single-course invoice.
     * Hosted Checkout (not custom Elements) is deliberate - it keeps card
     * data off our servers entirely and removes PCI scope from the app.
     */
    public function createSessionForInvoice(Invoice $invoice, string $successUrl, string $cancelUrl): Session
    {
        return $this->client()->checkout->sessions->create([
            'mode' => 'payment',
            'customer_email' => $invoice->user->email,
            'line_items' => [[
                'price_data' => [
                    'currency' => strtolower($invoice->currency),
                    'product_data' => [
                        'name' => $invoice->course->title,
                    ],
                    'unit_amount' => (int) round($invoice->total * 100),
                ],
                'quantity' => 1,
            ]],
            'metadata' => [
                'invoice_id' => (string) $invoice->id,
                'invoice_number' => $invoice->invoice_number,
            ],
            'success_url' => $successUrl,
            'cancel_url' => $cancelUrl,
        ]);
    }

    /**
     * Verify a webhook payload's signature and decode it into a Stripe Event.
     * Throws \UnexpectedValueException / \Stripe\Exception\SignatureVerificationException
     * on a bad payload or signature - callers must treat that as a rejected request.
     */
    public function constructWebhookEvent(string $payload, string $signatureHeader): \Stripe\Event
    {
        return Webhook::constructEvent(
            $payload,
            $signatureHeader,
            config('services.stripe.webhook_secret')
        );
    }
}
