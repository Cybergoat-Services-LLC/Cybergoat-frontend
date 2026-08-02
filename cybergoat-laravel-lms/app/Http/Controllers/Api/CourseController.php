<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Display a listing of CyberGOAT courses.
     */
    public function index(): JsonResponse
    {
        $courses = Course::select([
            'id', 'slug', 'title', 'certification_code', 'vendor',
            'hours', 'level', 'description', 'is_official_voucher_included',
            'price', 'currency',
        ])->get();

        return response()->json([
            'success' => true,
            'count' => $courses->count(),
            'data' => $courses
        ]);
    }

    /**
     * Display the specified course by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $course = Course::with('externalResources')->where('slug', $slug)->first();

        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $course
        ]);
    }

    /**
     * Display live scheduled classes for a course (Dubai DSO & Virtual).
     * Public so prospective students can see the schedule - but the actual
     * Google Meet join link is only revealed to authenticated, actively
     * enrolled students, so a class can't be gate-crashed by anyone browsing
     * the catalog.
     */
    public function liveClasses(Request $request, string $slug): JsonResponse
    {
        $course = Course::where('slug', $slug)->first();

        if (!$course) {
            return response()->json(['success' => false, 'message' => 'Course not found'], 404);
        }

        $user = $request->user('sanctum');
        $isEnrolled = $user && Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->exists();

        $classes = $course->liveClasses->map(function ($class) use ($isEnrolled) {
            return [
                'id' => $class->id,
                'topic' => $class->topic,
                'type' => $class->type,
                'scheduled_at' => $class->scheduled_at->toIso8601String(),
                'duration_minutes' => $class->duration_minutes,
                'location_or_link' => ($class->type === 'live_virtual' && !$isEnrolled)
                    ? 'Join link visible to enrolled students only.'
                    : $class->location_or_link,
            ];
        });

        return response()->json([
            'success' => true,
            'course' => $course->title,
            'data' => $classes,
        ]);
    }
}
