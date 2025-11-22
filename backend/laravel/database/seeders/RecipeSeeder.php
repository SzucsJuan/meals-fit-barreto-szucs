<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class RecipeSeeder extends Seeder
{
    public function run(): void
    {
        // IMPORTANTE: asegurarse de correr primero el seeder de ingredientes.
        // php artisan db:seed --class=IngredientSeeder

        // Se traen los ingredientes para llenar la tabla de la base
        $pollo  = Ingredient::where('name', 'Pechuga de pollo')->first();
        $arroz  = Ingredient::where('name', 'Arroz blanco cocido')->first();
        $aceite = Ingredient::where('name', 'Aceite de oliva')->first();

        if (!$pollo || !$arroz || !$aceite) {
            throw new InvalidArgumentException('Faltan ingredientes base para seedear la receta (pollo/arroz/aceite).');
        }

        $user = User::find(2);
        if (!$user) {
            $user = User::first() ?? User::factory()->create();
        }

        DB::transaction(function () use ($pollo, $arroz, $aceite, $user) {
            $title = 'Bowl de pollo y arroz';

            $recipe = Recipe::updateOrCreate(
                ['slug' => Str::slug($title)],
                [
                    'user_id'            => $user->id,
                    'title'              => $title,
                    'description'        => 'Clásico bowl alto en proteína con pechuga, arroz blanco y un toque de aceite de oliva.',
                    'steps'              => "1) Cocinar el arroz.\n2) Cocinar la pechuga.\n3) Mezclar todo y agregar aceite.",
                    'visibility'         => 'public', 
                    'servings'           => 1,
                    'prep_time_minutes'  => 10,
                    'cook_time_minutes'  => 20,

                    'image_disk'         => $recipe->image_disk ?? null,
                    'image_path'         => $recipe->image_path ?? null,
                    'image_thumb_path'   => $recipe->image_thumb_path ?? null,
                    'image_webp_path'    => $recipe->image_webp_path ?? null,
                    'image_width'        => $recipe->image_width ?? null,
                    'image_height'       => $recipe->image_height ?? null,
                ]
            );

            $items = [
                [$pollo, 150, 'g',  null],
                [$arroz, 150, 'g',  null],
                [$aceite, 10,  'ml', null],
            ];

            // Validación de unidades
            foreach ($items as [$ing, $qty, $unit, $_]) {
                if ($ing->serving_unit !== $unit) {
                    throw new InvalidArgumentException("Unidad incompatible para {$ing->name}: {$unit} vs {$ing->serving_unit}");
                }
            }

            $attachData = [];
            foreach ($items as [$ing, $qty, $unit, $notes]) {
                $attachData[$ing->id] = [
                    'quantity' => $qty,
                    'unit'     => $unit,
                    'notes'    => $notes,
                ];
            }

            $recipe->ingredients()->sync($attachData);

            $recipe->recomputeMacrosAndSave();
        });
    }
}
