<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\CybergoatSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WishlistTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CybergoatSeeder::class);
    }

    public function test_wishlist_endpoints_require_authentication(): void
    {
        $this->postJson('/api/v1/courses/ceh-v12/wishlist')->assertStatus(401);
        $this->getJson('/api/v1/wishlist')->assertStatus(401);
        $this->deleteJson('/api/v1/courses/ceh-v12/wishlist')->assertStatus(401);
    }

    public function test_user_can_add_and_list_a_wishlisted_course(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/courses/ceh-v12/wishlist')
            ->assertStatus(201);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/wishlist');

        $response->assertStatus(200)->assertJsonFragment(['slug' => 'ceh-v12']);
    }

    public function test_adding_the_same_course_twice_does_not_duplicate(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/courses/ceh-v12/wishlist');
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/courses/ceh-v12/wishlist');

        $this->assertDatabaseCount('wishlists', 1);
    }

    public function test_user_can_remove_a_wishlisted_course(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/courses/ceh-v12/wishlist');

        $this->actingAs($user, 'sanctum')
            ->deleteJson('/api/v1/courses/ceh-v12/wishlist')
            ->assertStatus(200);

        $this->assertDatabaseCount('wishlists', 0);
    }

    public function test_wishlist_does_not_leak_across_users(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $this->actingAs($userA, 'sanctum')->postJson('/api/v1/courses/ceh-v12/wishlist');

        $response = $this->actingAs($userB, 'sanctum')->getJson('/api/v1/wishlist');

        $this->assertCount(0, $response->json('data'));
    }
}
