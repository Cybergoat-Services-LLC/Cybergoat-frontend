<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    /**
     * List the authenticated user's enrollments.
     */
    public function index(Request $request): JsonResponse
    {
        $enrollments = $request->user()
            ->enrollments()
            ->with('course:id,slug,title,certification_code')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $enrollments,
        ]);
    }

    /**
     * Self-enroll the authenticated user in a genuinely free course. Paid
     * courses must go through Stripe/bank-transfer/Aani checkout - this
     * endpoint deliberately cannot be used to skip payment.
     */
    public function store(Request $request, string $slug): JsonResponse
    {
        $course = Course::where('slug', $slug)->first();

        if (!$course) {
            return response()->json(['success' => false, 'message' => 'Course not found'], 404);
        }

        if ((float) $course->price > 0) {
            return response()->json([
                'success' => false,
                'message' => 'This course requires payment. Use /checkout or /checkout/offline instead.',
            ], 422);
        }

        $enrollment = Enrollment::firstOrCreate(
            [
                'user_id' => $request->user()->id,
                'course_id' => $course->id,
                'status' => 'active',
            ],
            [
                'enrolled_at' => now(),
                'expires_at' => now()->addYear(),
            ]
        );

        return response()->json([
            'success' => true,
            'data' => $enrollment,
        ], 201);
    }
}
