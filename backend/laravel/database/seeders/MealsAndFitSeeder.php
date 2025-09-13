<?php


namespace Database\Seeders;


use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;


class MealsAndFitSeeder extends Seeder
{
    public function run(): void
    {

        DB::table('achievements')->insertOrIgnore([
            ['code' => 'first_log', 'name' => 'Primer registro', 'description' => 'Registraste tu primera comida'],
            ['code' => '7_days_streak', 'name' => 'Racha de 7 días', 'description' => '7 días seguidos registrando'],
            ['code' => 'first_recipe', 'name' => 'Primera receta', 'description' => 'Publicaste tu primera receta'],
            ['code' => 'community_helper', 'name' => 'Ayudante de la comunidad', 'description' => 'Compartiste 5 recetas públicas'],
        ]);

        DB::table('ingredients')->insertOrIgnore([
            [
                'name' => 'Pechuga de pollo',
                'serving_size' => 100,
                'serving_unit' => 'g',
                'calories' => 165,
                'protein' => 31,
                'carbs' => 0,
                'fat' => 3.6,
                'is_verified' => true,
                'created_by' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Arroz blanco cocido',
                'brand' => null,
                'serving_size' => 100,
                'serving_unit' => 'g',
                'calories' => 130,
                'protein' => 2.4,
                'carbs' => 28,
                'fat' => 0.3,
                'is_verified' => true,
                'created_by' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Aceite de oliva',
                'brand' => null,
                'serving_size' => 10,
                'serving_unit' => 'ml',
                'calories' => 88,
                'protein' => 0,
                'carbs' => 0,
                'fat' => 10,
                'is_verified' => true,
                'created_by' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
