<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        //Si queremos ejecutar un seeder puntual corremos en consola: php artisan db:seed --class="nombre del seeder"
        $this->call([
            UserSeeder::class,
            MealsAndFitSeeder::class,
            RecipeSeeder::class,
        ]);
    }
}
