<?php

namespace Tests\Feature;

use App\Filament\Resources\QuizResource\RelationManagers\QuestionsRelationManager;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\User;
use App\Services\QuizGeneratorService;
use Database\Seeders\CybergoatSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class QuizEngineTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CybergoatSeeder::class);
    }

    protected function enroll(User $user, Course $course): Enrollment
    {
        return Enrollment::create([
            'user_id' => $user->id, 'course_id' => $course->id, 'status' => 'active',
            'enrolled_at' => now(), 'expires_at' => now()->addYear(),
        ]);
    }

    protected function makeQuiz(Course $course, bool $published = true): Quiz
    {
        $quiz = Quiz::create(['course_id' => $course->id, 'title' => 'Module 1 Quiz', 'is_published' => $published]);

        Question::create([
            'quiz_id' => $quiz->id, 'question_text' => 'What does CIA stand for in security?',
            'options' => ['Confidentiality, Integrity, Availability', 'Central Intelligence Agency', 'Computer Incident Analysis', 'None of the above'],
            'correct_index' => 0, 'explanation' => 'The CIA triad is the core model.', 'sort' => 1,
        ]);

        return $quiz;
    }

    public function test_quiz_list_requires_authentication(): void
    {
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $this->makeQuiz($course);

        $this->getJson('/api/v1/courses/ceh-v12/quizzes')->assertStatus(401);
    }

    public function test_quiz_list_requires_enrollment(): void
    {
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $this->makeQuiz($course);
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/courses/ceh-v12/quizzes')
            ->assertStatus(403);
    }

    public function test_quiz_list_only_returns_published_quizzes(): void
    {
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $this->makeQuiz($course, published: true);
        $this->makeQuiz($course, published: false);

        $user = User::factory()->create();
        $this->enroll($user, $course);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/courses/ceh-v12/quizzes');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_taking_a_quiz_does_not_leak_correct_answers(): void
    {
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $quiz = $this->makeQuiz($course);
        $user = User::factory()->create();
        $this->enroll($user, $course);

        $response = $this->actingAs($user, 'sanctum')->getJson("/api/v1/quizzes/{$quiz->id}/take");

        $response->assertStatus(200);
        $response->assertJsonMissing(['correct_index']);
        $response->assertJsonMissing(['explanation']);
    }

    public function test_taking_an_unpublished_quiz_is_not_found(): void
    {
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $quiz = $this->makeQuiz($course, published: false);
        $user = User::factory()->create();
        $this->enroll($user, $course);

        $this->actingAs($user, 'sanctum')
            ->getJson("/api/v1/quizzes/{$quiz->id}/take")
            ->assertStatus(404);
    }

    public function test_submitting_correct_answers_scores_full_marks(): void
    {
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $quiz = $this->makeQuiz($course);
        $question = $quiz->questions->first();
        $user = User::factory()->create();
        $this->enroll($user, $course);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/quizzes/{$quiz->id}/submit", [
                'answers' => [(string) $question->id => 0],
            ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true, 'score' => 1, 'total_questions' => 1]);

        $this->assertDatabaseHas('quiz_attempts', [
            'quiz_id' => $quiz->id, 'user_id' => $user->id, 'score' => 1,
        ]);
    }

    public function test_submitting_wrong_answers_scores_zero_and_reveals_explanation(): void
    {
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $quiz = $this->makeQuiz($course);
        $question = $quiz->questions->first();
        $user = User::factory()->create();
        $this->enroll($user, $course);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/quizzes/{$quiz->id}/submit", [
                'answers' => [(string) $question->id => 2],
            ]);

        $response->assertStatus(200)->assertJson(['score' => 0]);
        $this->assertEquals('The CIA triad is the core model.', $response->json('review.0.explanation'));
        $this->assertFalse($response->json('review.0.is_correct'));
    }

    public function test_submit_requires_enrollment(): void
    {
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $quiz = $this->makeQuiz($course);
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/quizzes/{$quiz->id}/submit", ['answers' => []])
            ->assertStatus(403);
    }

    public function test_admin_can_create_a_question_via_the_relation_manager(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $quiz = Quiz::create(['course_id' => $course->id, 'title' => 'New Quiz']);

        Livewire::actingAs($admin)
            ->test(QuestionsRelationManager::class, [
                'ownerRecord' => $quiz,
                'pageClass' => \App\Filament\Resources\QuizResource\Pages\EditQuiz::class,
            ])
            ->callTableAction('create', data: [
                'question_text' => 'What port does HTTPS use?',
                'option_a' => '443',
                'option_b' => '80',
                'option_c' => '21',
                'option_d' => '25',
                'correct_option' => 'A',
                'explanation' => 'HTTPS defaults to TCP port 443.',
            ]);

        $question = Question::where('quiz_id', $quiz->id)->firstOrFail();
        $this->assertEquals(['443', '80', '21', '25'], $question->options);
        $this->assertEquals(0, $question->correct_index);
    }

    public function test_admin_can_generate_questions_with_ai_and_quiz_stays_unpublished(): void
    {
        $this->app->instance(QuizGeneratorService::class, new class extends QuizGeneratorService {
            public function generateDraftQuestions(string $topic, int $count = 5): array
            {
                return [
                    ['question' => 'What is phishing?', 'options' => ['A', 'B', 'C', 'D'], 'correct_index' => 1, 'explanation' => 'Because B.'],
                    ['question' => 'What is malware?', 'options' => ['W', 'X', 'Y', 'Z'], 'correct_index' => 2, 'explanation' => 'Because Y.'],
                ];
            }
        });

        $admin = User::factory()->create(['role' => 'admin']);
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $quiz = Quiz::create(['course_id' => $course->id, 'title' => 'AI Quiz', 'is_published' => false]);

        Livewire::actingAs($admin)
            ->test(QuestionsRelationManager::class, [
                'ownerRecord' => $quiz,
                'pageClass' => \App\Filament\Resources\QuizResource\Pages\EditQuiz::class,
            ])
            ->callTableAction('generateWithAi', data: ['topic' => 'Phishing basics', 'count' => 2]);

        $this->assertEquals(2, $quiz->questions()->count());
        $this->assertFalse($quiz->fresh()->is_published);
    }
}
