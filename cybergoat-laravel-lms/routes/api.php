<?php

use App\Http\Controllers\Api\CertificateController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\CourseExternalResourceController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\KitController;
use App\Http\Controllers\Api\OfflinePaymentController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\WishlistController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| CyberGOAT LMS REST API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Public Course Catalog Routes
    Route::get('/courses', [CourseController::class, 'index']);
    Route::get('/courses/{slug}', [CourseController::class, 'show']);
    Route::get('/courses/{slug}/live-classes', [CourseController::class, 'liveClasses']);
    Route::post('/courses/{slug}/validate-coupon', [CouponController::class, 'validateCode']);
    Route::get('/certificates/verify/{certificateNumber}', [CertificateController::class, 'verify']);

    // Authenticated Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/enrollments', [EnrollmentController::class, 'index']);
        Route::post('/courses/{slug}/enroll', [EnrollmentController::class, 'store']);

        // Courseware Kit Signed Download Route — requires an active enrollment
        Route::post('/courses/{slug}/download-kit', [KitController::class, 'generateSignedUrl']);

        Route::post('/courses/{slug}/checkout', [CheckoutController::class, 'createSession']);
        Route::post('/courses/{slug}/checkout/offline', [OfflinePaymentController::class, 'store']);

        Route::get('/certificates', [CertificateController::class, 'index']);

        Route::get('/wishlist', [WishlistController::class, 'index']);
        Route::post('/courses/{slug}/wishlist', [WishlistController::class, 'store']);
        Route::delete('/courses/{slug}/wishlist', [WishlistController::class, 'destroy']);

        Route::get('/courses/{slug}/quizzes', [QuizController::class, 'index']);
        Route::get('/quizzes/{quiz}/take', [QuizController::class, 'take']);
        Route::post('/quizzes/{quiz}/submit', [QuizController::class, 'submit']);
    });

    // Admin-only — confirms a bank transfer / Aani QR payment was actually received.
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::post('/admin/invoices/{invoiceNumber}/confirm-payment', [OfflinePaymentController::class, 'confirm']);
        Route::post('/admin/enrollments/{enrollment}/issue-certificate', [CertificateController::class, 'issue']);
        Route::post('/admin/courses/{slug}/external-resources', [CourseExternalResourceController::class, 'store']);
        Route::delete('/admin/external-resources/{resource}', [CourseExternalResourceController::class, 'destroy']);
    });

    // Called by Stripe, not a logged-in user — auth is the webhook signature, not Sanctum.
    Route::post('/webhooks/stripe', [CheckoutController::class, 'handleWebhook']);
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'service' => 'CyberGOAT Laravel LMS Backend',
        'timestamp' => now()->toIso8601String(),
    ]);
});
