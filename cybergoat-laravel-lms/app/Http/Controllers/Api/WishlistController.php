<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * The authenticated user's saved-for-later courses. Purely informational -
     * no purchase logic attached, matching the "wishlist, not a cart" decision.
     */
    public function index(Request $request): JsonResponse
    {
        $courses = $request->user()
            ->wishlists()
            ->with('course:id,slug,title,price,currency')
            ->get()
            ->pluck('course');

        return response()->json(['success' => true, 'data' => $courses]);
    }

    public function store(Request $request, string $slug): JsonResponse
    {
        $course = Course::where('slug', $slug)->first();

        if (!$course) {
            return response()->json(['success' => false, 'message' => 'Course not found'], 404);
        }

        Wishlist::firstOrCreate([
            'user_id' => $request->user()->id,
            'course_id' => $course->id,
        ]);

        return response()->json(['success' => true], 201);
    }

    public function destroy(Request $request, string $slug): JsonResponse
    {
        $course = Course::where('slug', $slug)->first();

        if (!$course) {
            return response()->json(['success' => false, 'message' => 'Course not found'], 404);
        }

        Wishlist::where('user_id', $request->user()->id)
            ->where('course_id', $course->id)
            ->delete();

        return response()->json(['success' => true]);
    }
}
