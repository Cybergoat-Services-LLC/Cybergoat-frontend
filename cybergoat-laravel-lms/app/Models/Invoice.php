<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'user_id',
        'course_id',
        'subtotal',
        'coupon_code',
        'discount_amount',
        'vat_rate_applied',
        'vat_amount',
        'total',
        'currency',
        'company_trn_snapshot',
        'payment_method',
        'payment_status',
        'stripe_checkout_session_id',
        'stripe_payment_intent_id',
        'payment_reference',
        'confirmed_by',
        'paid_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'vat_rate_applied' => 'decimal:2',
        'vat_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function confirmedBy()
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }

    /**
     * Mark this invoice paid and grant the enrollment it's for. Shared by the
     * Stripe webhook and the admin manual-confirm endpoint so both payment
     * paths enroll through the exact same, idempotent logic.
     */
    public function markPaidAndEnroll(?User $confirmedBy = null, ?string $paymentReference = null): void
    {
        if ($this->payment_status === 'paid') {
            return;
        }

        $this->update([
            'payment_status' => 'paid',
            'confirmed_by' => $confirmedBy?->id,
            'payment_reference' => $paymentReference ?? $this->payment_reference,
            'paid_at' => now(),
        ]);

        $enrollableIds = [$this->course_id, ...$this->course->bundledCourses()->pluck('courses.id')];

        foreach ($enrollableIds as $courseId) {
            Enrollment::firstOrCreate(
                [
                    'user_id' => $this->user_id,
                    'course_id' => $courseId,
                    'status' => 'active',
                ],
                [
                    'enrolled_at' => now(),
                    'expires_at' => now()->addYear(),
                ]
            );
        }
    }

    /**
     * Build a pending invoice for a course purchase, applying the current
     * VAT setting (off/0% pre-registration, no code change needed once flipped on)
     * and an optional coupon. Throws InvalidArgumentException for a bad/expired/
     * exhausted code so callers can turn that into a clean 422 response.
     */
    public static function draftForCourse(User $user, Course $course, string $paymentMethod, ?string $couponCode = null): self
    {
        $subtotal = (float) $course->price;
        $discountAmount = 0.0;
        $coupon = null;

        if ($couponCode) {
            $coupon = Coupon::where('code', $couponCode)->first();

            if (!$coupon || !$coupon->isValid()) {
                throw new \InvalidArgumentException('This coupon code is invalid, expired, or fully redeemed.');
            }

            $discountAmount = $coupon->discountFor($subtotal);
        }

        $discountedSubtotal = round($subtotal - $discountAmount, 2);
        $vatRate = Setting::vatEnabled() ? Setting::vatRate() : 0;
        $vatAmount = round($discountedSubtotal * ($vatRate / 100), 2);

        // invoice_number is derived from the row's own auto-increment id, so it's
        // assigned after insert - avoids a race on a hand-rolled sequence number.
        $invoice = static::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'subtotal' => $subtotal,
            'coupon_code' => $coupon?->code,
            'discount_amount' => $discountAmount,
            'vat_rate_applied' => $vatRate,
            'vat_amount' => $vatAmount,
            'total' => round($discountedSubtotal + $vatAmount, 2),
            'currency' => $course->currency,
            'company_trn_snapshot' => Setting::vatEnabled() ? Setting::companyTrn() : null,
            'payment_method' => $paymentMethod,
            'payment_status' => 'pending',
        ]);

        $invoice->update([
            'invoice_number' => 'CG-INV-' . str_pad((string) $invoice->id, 6, '0', STR_PAD_LEFT),
        ]);

        if ($coupon) {
            $coupon->redeem();
        }

        return $invoice;
    }
}
