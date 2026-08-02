<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\KitDownload;
use App\Services\GcsKitSigner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class KitController extends Controller
{
    public function __construct(private GcsKitSigner $signer)
    {
    }

    /**
     * Generate a 60-minute V4 signed download URL for a courseware kit.
     * Requires the authenticated user to hold an active enrollment for the course.
     */
    public function generateSignedUrl(Request $request, string $slug): JsonResponse
    {
        $course = Course::where('slug', $slug)->first();

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found'
            ], 404);
        }

        $isEnrolled = Enrollment::where('user_id', $request->user()->id)
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->where(function ($query) {
                $query->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->exists();

        if (!$isEnrolled) {
            return response()->json([
                'success' => false,
                'message' => 'You must have an active, unexpired enrollment in this course to download the courseware kit.',
            ], 403);
        }

        $objectPath = "course-kits/{$slug}-student-kit.pdf";
        $expiresAt = now()->addMinutes(60);

        $signedUrl = $this->signer->sign($objectPath, $expiresAt);

        KitDownload::create([
            'user_id' => $request->user()->id,
            'course_id' => $course->id,
            'kit_name' => "{$course->certification_code} Official Student Kit",
            'gcs_object_path' => $objectPath,
            'download_token' => Str::random(40),
            'expires_at' => $expiresAt,
        ]);

        return response()->json([
            'success' => true,
            'course' => $course->title,
            'certification_code' => $course->certification_code,
            'download_url' => $signedUrl,
            'expires_at' => $expiresAt->toIso8601String(),
            'expires_in_minutes' => 60,
        ]);
    }
}
