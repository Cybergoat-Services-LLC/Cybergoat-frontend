<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Invoice;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OfflinePaymentController extends Controller
{
    /**
     * Create a pending invoice for a manually-confirmed payment method
     * (bank transfer or Aani QR). No money moves through this app - the
     * customer pays outside the system and an admin confirms receipt.
     */
    public function store(Request $request, string $slug): JsonResponse
    {
        $validated = $request->validate([
            'payment_method' => 'required|in:bank_transfer,aani_qr',
            'coupon_code' => 'nullable|string',
        ]);

        $course = Course::where('slug', $slug)->first();

        if (!$course) {
            return response()->json(['success' => false, 'message' => 'Course not found'], 404);
        }

        if ((float) $course->price <= 0) {
            return response()->json(['success' => false, 'message' => 'This course does not have a price set yet.'], 422);
        }

        try {
            $invoice = Invoice::draftForCourse($request->user(), $course, $validated['payment_method'], $validated['coupon_code'] ?? null);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }

        return response()->json([
            'success' => true,
            'invoice_number' => $invoice->invoice_number,
            'amount_due' => $invoice->total,
            'currency' => $invoice->currency,
            'payment_instructions' => Setting::offlinePaymentInstructions($validated['payment_method']),
        ]);
    }

    /**
     * Admin-only: confirm a pending offline invoice was actually paid.
     * This is the single place that turns a bank transfer / Aani payment
     * into an active enrollment.
     */
    public function confirm(Request $request, string $invoiceNumber): JsonResponse
    {
        $validated = $request->validate([
            'payment_reference' => 'nullable|string|max:255',
        ]);

        $invoice = Invoice::where('invoice_number', $invoiceNumber)->first();

        if (!$invoice) {
            return response()->json(['success' => false, 'message' => 'Invoice not found'], 404);
        }

        if ($invoice->payment_status === 'paid') {
            return response()->json(['success' => false, 'message' => 'Invoice is already marked paid.'], 409);
        }

        $invoice->markPaidAndEnroll($request->user(), $validated['payment_reference'] ?? null);

        return response()->json([
            'success' => true,
            'invoice_number' => $invoice->invoice_number,
            'payment_status' => $invoice->fresh()->payment_status,
        ]);
    }
}
