<?php

namespace Database\Factories;

use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class MealDetailFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Recipe::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'instructions' => $this->faker->paragraph(2),
            'prep_time' => $this->faker->numberBetween(5, 30),
            'cook_time' => $this->faker->numberBetween(10, 60),
            'servings' => $this->faker->numberBetween(1, 4),
            'calories' => $this->faker->numberBetween(200, 800),
            'protein' => $this->faker->numberBetween(10, 50),
            'carbohydrates' => $this->faker->numberBetween(20, 100),
            'fats' => $this->faker->numberBetween(5, 30)
        ];
    }
} 