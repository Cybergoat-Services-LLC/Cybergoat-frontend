<?php

namespace Tests\Feature;

use App\Filament\Resources\LiveClassResource\Pages\ListLiveClasses;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\LiveClass;
use App\Models\User;
use App\Services\GoogleCalendarService;
use Database\Seeders\CybergoatSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class LiveClassMeetTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CybergoatSeeder::class);

        $this->app->instance(GoogleCalendarService::class, new class extends GoogleCalendarService {
            public function createMeetEvent(LiveClass $liveClass): string
            {
                $liveClass->update([
                    'google_calendar_event_id' => 'evt_fake_123',
                    'location_or_link' => 'https://meet.google.com/fake-xyz-123',
                ]);

                return 'https://meet.google.com/fake-xyz-123';
            }
        });
    }

    protected function makeLiveClass(Course $course, string $type = 'live_virtual'): LiveClass
    {
        return LiveClass::create([
            'course_id' => $course->id,
            'topic' => 'CEH v12 - Module 3 Live Q&A',
            'type' => $type,
            'location_or_link' => $type === 'dubai_campus' ? 'Dubai Silicon Oasis Campus, Building A' : 'pending',
            'scheduled_at' => now()->addDays(3),
            'duration_minutes' => 90,
        ]);
    }

    public function test_unauthenticated_users_do_not_see_the_meet_link(): void
    {
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $this->makeLiveClass($course);

        $response = $this->getJson('/api/v1/courses/ceh-v12/live-classes');

        $response->assertStatus(200);
        $this->assertStringNotContainsString('meet.google.com', $response->json('data.0.location_or_link'));
    }

    public function test_non_enrolled_authenticated_users_do_not_see_the_meet_link(): void
    {
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $liveClass = $this->makeLiveClass($course);
        $liveClass->update(['location_or_link' => 'https://meet.google.com/fake-xyz-123']);
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/courses/ceh-v12/live-classes');

        $this->assertStringNotContainsString('meet.google.com', $response->json('data.0.location_or_link'));
    }

    public function test_enrolled_users_see_the_real_meet_link(): void
    {
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $liveClass = $this->makeLiveClass($course);
        $liveClass->update(['location_or_link' => 'https://meet.google.com/fake-xyz-123']);

        $user = User::factory()->create();
        Enrollment::create([
            'user_id' => $user->id, 'course_id' => $course->id, 'status' => 'active',
            'enrolled_at' => now(), 'expires_at' => now()->addYear(),
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/courses/ceh-v12/live-classes');

        $this->assertEquals('https://meet.google.com/fake-xyz-123', $response->json('data.0.location_or_link'));
    }

    public function test_dubai_campus_location_is_always_visible(): void
    {
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $this->makeLiveClass($course, 'dubai_campus');

        $response = $this->getJson('/api/v1/courses/ceh-v12/live-classes');

        $this->assertEquals('Dubai Silicon Oasis Campus, Building A', $response->json('data.0.location_or_link'));
    }

    public function test_creating_a_virtual_class_in_filament_auto_generates_a_meet_link(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();

        Livewire::actingAs($admin)
            ->test(\App\Filament\Resources\LiveClassResource\Pages\CreateLiveClass::class)
            ->fillForm([
                'course_id' => $course->id,
                'topic' => 'CISSP Bootcamp Kickoff',
                'type' => 'live_virtual',
                'scheduled_at' => now()->addDays(5),
                'duration_minutes' => 120,
            ])
            ->call('create')
            ->assertHasNoFormErrors();

        $liveClass = LiveClass::where('topic', 'CISSP Bootcamp Kickoff')->firstOrFail();
        $this->assertEquals('evt_fake_123', $liveClass->google_calendar_event_id);
        $this->assertEquals('https://meet.google.com/fake-xyz-123', $liveClass->location_or_link);
    }

    public function test_admin_can_manually_regenerate_a_meet_link(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $liveClass = $this->makeLiveClass($course);

        Livewire::actingAs($admin)
            ->test(ListLiveClasses::class)
            ->callTableAction('generateMeetLink', $liveClass);

        $this->assertEquals('evt_fake_123', $liveClass->fresh()->google_calendar_event_id);
    }
}
