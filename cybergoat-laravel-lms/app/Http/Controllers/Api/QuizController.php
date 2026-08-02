<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    /**
     * Published quizzes for a course. Requires an active enrollment - a
     * quiz is course material, not something a browsing visitor should see.
     */
    public function index(Request $request, string $slug): JsonResponse
    {
        $course = Course::where('slug', $slug)->first();

        if (!$course) {
            return response()->json(['success' => false, 'message' => 'Course not found'], 404);
        }

        if (!$this->hasActiveEnrollment($request, $course)) {
            return response()->json(['success' => false, 'message' => 'An active enrollment is required to view quizzes for this course.'], 403);
        }

        $quizzes = Quiz::where('course_id', $course->id)
            ->where('is_published', true)
            ->withCount('questions')
            ->get(['id', 'title', 'description']);

        return response()->json(['success' => true, 'data' => $quizzes]);
    }

    /**
     * Fetch a quiz's questions to take it. Correct answers/explanations are
     * deliberately stripped out here - they're only revealed after submit.
     */
    public function take(Request $request, Quiz $quiz): JsonResponse
    {
        if (!$quiz->is_published) {
            return response()->json(['success' => false, 'message' => 'This quiz is not yet published.'], 404);
        }

        if (!$this->hasActiveEnrollment($request, $quiz->course)) {
            return response()->json(['success' => false, 'message' => 'An active enrollment is required to take this quiz.'], 403);
        }

        $questions = $quiz->questions->map(fn ($q) => [
            'id' => $q->id,
            'question_text' => $q->question_text,
            'options' => $q->options,
        ]);

        return response()->json([
            'success' => true,
            'quiz' => ['id' => $quiz->id, 'title' => $quiz->title, 'description' => $quiz->description],
            'questions' => $questions,
        ]);
    }

    /**
     * Score a submitted attempt. Body: {"answers": {"<question_id>": <selected_index>, ...}}
     */
    public function submit(Request $request, Quiz $quiz): JsonResponse
    {
        if (!$quiz->is_published) {
            return response()->json(['success' => false, 'message' => 'This quiz is not yet published.'], 404);
        }

        if (!$this->hasActiveEnrollment($request, $quiz->course)) {
            return response()->json(['success' => false, 'message' => 'An active enrollment is required to take this quiz.'], 403);
        }

        $validated = $request->validate(['answers' => 'required|array']);
        $submitted = $validated['answers'];

        $questions = $quiz->questions;
        $score = 0;
        $review = [];

        foreach ($questions as $question) {
            $selected = $submitted[(string) $question->id] ?? $submitted[$question->id] ?? null;
            $isCorrect = $selected !== null && (int) $selected === $question->correct_index;

            if ($isCorrect) {
                $score++;
            }

            $review[] = [
                'question_id' => $question->id,
                'selected_index' => $selected,
                'correct_index' => $question->correct_index,
                'is_correct' => $isCorrect,
                'explanation' => $question->explanation,
            ];
        }

        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'user_id' => $request->user()->id,
            'score' => $score,
            'total_questions' => $questions->count(),
            'answers' => $submitted,
            'completed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'score' => $score,
            'total_questions' => $attempt->total_questions,
            'review' => $review,
        ]);
    }

    protected function hasActiveEnrollment(Request $request, Course $course): bool
    {
        return Enrollment::where('user_id', $request->user()->id)
            ->where('course_id', $course->id)
            ->where('status', 'active')
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->exists();
    }
}
