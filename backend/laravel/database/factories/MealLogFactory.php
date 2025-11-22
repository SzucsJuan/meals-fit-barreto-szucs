<?php

namespace Database\Factories;

use App\Models\MealLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class MealLogFactory extends Factory
{
    protected $model = MealLog::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'log_date' => now(),
            'total_calories' => 500,
            'total_protein' => 30,
            'total_carbs' => 50,
            'total_fat' => 20,
        ];
    }
}
