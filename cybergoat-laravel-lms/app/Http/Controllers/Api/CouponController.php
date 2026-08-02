<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * Preview a coupon's discount before checkout. Does not redeem it -
     * redemption only happens when an invoice is actually created.
     */
    public function validateCode(Request $request, string $slug): JsonResponse
    {
        $validated = $request->validate(['code' => 'required|string']);

        $course = Course::where('slug', $slug)->first();

        if (!$course) {
            return response()->json(['success' => false, 'message' => 'Course not found'], 404);
        }

        $coupon = Coupon::where('code', $validated['code'])->first();

        if (!$coupon || !$coupon->isValid()) {
            return response()->json(['success' => false, 'message' => 'This coupon code is invalid, expired, or fully redeemed.'], 422);
        }

        $subtotal = (float) $course->price;
        $discount = $coupon->discountFor($subtotal);

        return response()->json([
            'success' => true,
            'code' => $coupon->code,
            'discount_amount' => $discount,
            'new_total_before_vat' => round($subtotal - $discount, 2),
        ]);
    }
}
