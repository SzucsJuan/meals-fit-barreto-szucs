<?php

namespace Database\Factories;

use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class RecipeFactory extends Factory
{
    protected $model = Recipe::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'steps' => $this->faker->paragraph,
            'visibility' => 'public',
            'servings' => 4,
            'prep_time_minutes' => 30,
            'cook_time_minutes' => 45,
        ];
    }
}
