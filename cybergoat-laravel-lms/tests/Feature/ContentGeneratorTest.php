<?php

namespace Tests\Feature;

use App\Filament\Resources\CourseResource\Pages\EditCourse;
use App\Filament\Resources\CourseResource\RelationManagers\ExternalResourcesRelationManager;
use App\Models\Course;
use App\Models\User;
use App\Services\ContentGeneratorService;
use Database\Seeders\CybergoatSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class ContentGeneratorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CybergoatSeeder::class);

        $this->app->instance(ContentGeneratorService::class, new class extends ContentGeneratorService {
            public function generateCourseDescription(string $courseTitle, string $keyPoints, ?string $vendor = null, ?string $level = null): string
            {
                return "Fake AI description for {$courseTitle} covering {$keyPoints}.";
            }

            public function generateExternalResourceDescription(string $provider, string $resourceTitle): string
            {
                return "Fake blurb for {$provider}'s {$resourceTitle}.";
            }
        });
    }

    public function test_generate_description_action_fills_the_course_description_field(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();

        Livewire::actingAs($admin)
            ->test(EditCourse::class, ['record' => $course->getKey()])
            ->mountFormComponentAction('description', 'generateDescription', arguments: [])
            ->setFormComponentActionData(['key_points' => 'hands-on labs, official voucher'])
            ->callMountedFormComponentAction();

        // The field is filled in the live form state, not yet saved to the DB -
        // confirm it didn't silently persist without the admin clicking Save.
        $this->assertDatabaseMissing('courses', [
            'id' => $course->id,
            'description' => 'Fake AI description for Certified Ethical Hacker v12 covering hands-on labs, official voucher.',
        ]);
    }

    public function test_generate_description_and_save_persists_the_ai_draft(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();

        Livewire::actingAs($admin)
            ->test(EditCourse::class, ['record' => $course->getKey()])
            ->mountFormComponentAction('description', 'generateDescription', arguments: [])
            ->setFormComponentActionData(['key_points' => 'hands-on labs, official voucher'])
            ->callMountedFormComponentAction()
            ->call('save')
            ->assertHasNoFormErrors();

        $this->assertEquals(
            'Fake AI description for Certified Ethical Hacker v12 covering hands-on labs, official voucher.',
            $course->fresh()->description
        );
    }

    public function test_external_resource_generate_description_requires_provider_and_title_first(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();

        Livewire::actingAs($admin)
            ->test(ExternalResourcesRelationManager::class, [
                'ownerRecord' => $course,
                'pageClass' => EditCourse::class,
            ])
            ->mountTableAction('generateDescription')
            ->assertNotified();
    }
}
