<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseExternalResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseExternalResourceController extends Controller
{
    /**
     * Admin-only: attach a free third-party resource (Microsoft, Anthropic,
     * etc.) to a course. CyberGOAT doesn't host or track completion for
     * these - just a curated link shown to prospective/enrolled students.
     */
    public function store(Request $request, string $slug): JsonResponse
    {
        $course = Course::where('slug', $slug)->first();

        if (!$course) {
            return response()->json(['success' => false, 'message' => 'Course not found'], 404);
        }

        $validated = $request->validate([
            'provider' => 'required|string|max:100',
            'title' => 'required|string|max:255',
            'url' => 'required|url|max:2048',
            'description' => 'nullable|string|max:1000',
            'sort' => 'nullable|integer',
        ]);

        $resource = $course->externalResources()->create($validated);

        return response()->json(['success' => true, 'data' => $resource], 201);
    }

    public function destroy(CourseExternalResource $resource): JsonResponse
    {
        $resource->delete();

        return response()->json(['success' => true]);
    }
}
