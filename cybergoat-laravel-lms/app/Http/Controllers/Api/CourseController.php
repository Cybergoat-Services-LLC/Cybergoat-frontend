<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\JsonResponse;

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
     */
    public function liveClasses(string $slug): JsonResponse
    {
        $course = Course::where('slug', $slug)->first();

        if (!$course) {
            return response()->json(['success' => false, 'message' => 'Course not found'], 404);
        }

        $classes = $course->liveClasses ?? [];

        return response()->json([
            'success' => true,
            'course' => $course->title,
            'data' => $classes
        ]);
    }
}
