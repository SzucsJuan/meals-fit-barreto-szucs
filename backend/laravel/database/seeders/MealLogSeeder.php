<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MealLog;
use App\Models\User;
use App\Models\MealDetail;

class MealLogSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $meals = MealDetail::all();

        MealLog::factory()->count(40)->make()->each(function ($log) use ($users, $meals) {
            $log->user_id = $users->random()->id;
            $log->save();

            // VER ESTO, es para relaciona comidas (mealdetails) con este log puntual
            $log->mealDetails()->attach(
                $meals->random(rand(1, 3))->pluck('id')->toArray()
            );
        });
    }
}
