<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use Database\Seeders\CybergoatSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExternalResourceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CybergoatSeeder::class);
    }

    public function test_admin_can_attach_an_external_resource_to_a_course(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/admin/courses/ceh-v12/external-resources', [
                'provider' => 'Microsoft',
                'title' => 'AI Fundamentals',
                'url' => 'https://learn.microsoft.com/en-us/training/paths/ai-fundamentals/',
                'description' => 'Free intro to AI concepts, included alongside this track.',
            ]);

        $response->assertStatus(201)->assertJson(['success' => true]);

        $this->assertDatabaseHas('course_external_resources', [
            'provider' => 'Microsoft',
            'title' => 'AI Fundamentals',
        ]);
    }

    public function test_non_admin_cannot_attach_an_external_resource(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/admin/courses/ceh-v12/external-resources', [
                'provider' => 'Microsoft',
                'title' => 'AI Fundamentals',
                'url' => 'https://learn.microsoft.com/training/',
            ]);

        $response->assertStatus(403);
    }

    public function test_invalid_url_is_rejected(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/admin/courses/ceh-v12/external-resources', [
                'provider' => 'Microsoft',
                'title' => 'AI Fundamentals',
                'url' => 'not-a-url',
            ]);

        $response->assertStatus(422);
    }

    public function test_course_details_include_attached_external_resources(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin, 'sanctum')->postJson('/api/v1/admin/courses/ceh-v12/external-resources', [
            'provider' => 'Anthropic',
            'title' => 'Prompt Engineering Basics',
            'url' => 'https://www.anthropic.com/learn',
        ]);

        $response = $this->getJson('/api/v1/courses/ceh-v12');

        $response->assertStatus(200)
            ->assertJsonFragment(['provider' => 'Anthropic', 'title' => 'Prompt Engineering Basics']);
    }

    public function test_course_without_resources_returns_empty_list_not_error(): void
    {
        $response = $this->getJson('/api/v1/courses/cciso');

        $response->assertStatus(200);
        $this->assertEquals([], $response->json('data.external_resources'));
    }

    public function test_admin_can_delete_an_external_resource(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $course = Course::where('slug', 'ceh-v12')->firstOrFail();
        $resource = $course->externalResources()->create([
            'provider' => 'Microsoft', 'title' => 'AI Fundamentals', 'url' => 'https://learn.microsoft.com/training/',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/v1/admin/external-resources/{$resource->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('course_external_resources', ['id' => $resource->id]);
    }

    public function test_catalog_listing_includes_price(): void
    {
        Course::where('slug', 'ceh-v12')->update(['price' => 4500]);

        $response = $this->getJson('/api/v1/courses');

        $response->assertStatus(200)->assertJsonFragment(['slug' => 'ceh-v12', 'price' => '4500.00']);
    }
}
