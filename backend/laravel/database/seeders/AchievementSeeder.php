<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Achievement;

class AchievementSeeder extends Seeder
{
    public function run()
    {
        $achievements = [
            [
                'code' => 'first_recipe',
                'name' => 'First Recipe',
                'description' => 'Create your first recipe.',
                'icon_url' => 'achievements/first_recipe.png',
            ],
            [
                'code' => 'first_meal_log',
                'name' => 'First Meal Log',
                'description' => 'Log your first meal.',
                'icon_url' => 'achievements/first_meal_log.png',
            ],
            [
                'code' => '7_day_streak',
                'name' => '7 Day Streak',
                'description' => 'Log meals for 7 consecutive days.',
                'icon_url' => 'achievements/7_day_streak.png',
            ],
        ];

        foreach ($achievements as $achievement) {
            Achievement::firstOrCreate(
                ['code' => $achievement['code']],
                $achievement
            );
        }
    }
}
