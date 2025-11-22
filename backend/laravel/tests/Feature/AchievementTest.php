<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Recipe;
use App\Models\MealLog;
use App\Models\Achievement;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class AchievementTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\AchievementSeeder::class);
    }

    public function test_first_recipe_achievement_is_unlocked()
    {
        $user = User::factory()->create();

        $this->assertFalse($user->achievements()->where('code', 'first_recipe')->exists());

        Recipe::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($user->achievements()->where('code', 'first_recipe')->exists());
    }

    public function test_first_meal_log_achievement_is_unlocked()
    {
        $user = User::factory()->create();

        $this->assertFalse($user->achievements()->where('code', 'first_meal_log')->exists());

        MealLog::factory()->create(['user_id' => $user->id]);

        $this->assertTrue($user->achievements()->where('code', 'first_meal_log')->exists());
    }

    public function test_7_day_streak_achievement_is_unlocked()
    {
        $user = User::factory()->create();

        // Create logs for 6 days
        for ($i = 6; $i >= 1; $i--) {
            MealLog::factory()->create([
                'user_id' => $user->id,
                'log_date' => Carbon::today()->subDays($i)->toDateString()
            ]);
        }

        $this->assertFalse($user->achievements()->where('code', '7_day_streak')->exists());

        // Create log for today (7th day)
        MealLog::factory()->create([
            'user_id' => $user->id,
            'log_date' => Carbon::today()->toDateString()
        ]);

        $this->assertTrue($user->achievements()->where('code', '7_day_streak')->exists());
    }
}
