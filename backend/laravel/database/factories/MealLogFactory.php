<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

class MealLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'total_calories' => $this->faker->numberBetween(1200, 3000),
            'total_protein' => $this->faker->numberBetween(50, 200),
            'total_carbohydrates' => $this->faker->numberBetween(100, 400),
            'total_fats' => $this->faker->numberBetween(30, 120)
        ];
    }
}