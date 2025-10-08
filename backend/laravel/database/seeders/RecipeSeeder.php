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
        // IMPORTANTE: asegurate de correr primero el seeder de ingredientes.
        // php artisan db:seed --class=IngredientSeeder

        // 1) Traer ingredientes requeridos
        $pollo  = Ingredient::where('name', 'Pechuga de pollo')->first();
        $arroz  = Ingredient::where('name', 'Arroz blanco cocido')->first();
        $aceite = Ingredient::where('name', 'Aceite de oliva')->first();

        if (!$pollo || !$arroz || !$aceite) {
            throw new InvalidArgumentException('Faltan ingredientes base para seedear la receta (pollo/arroz/aceite).');
        }

        // 2) Asegurar un usuario para la receta (id=2) o crear uno dummy si no existe
        $user = User::find(2);
        if (!$user) {
            $user = User::first() ?? User::factory()->create(); // fallback simple
        }

        DB::transaction(function () use ($pollo, $arroz, $aceite, $user) {
            // 3) Crear/actualizar receta base
            $title = 'Bowl de pollo y arroz';

            $recipe = Recipe::updateOrCreate(
                ['slug' => Str::slug($title)],
                [
                    'user_id'            => $user->id,
                    'title'              => $title,
                    'description'        => 'Clásico bowl alto en proteína con pechuga, arroz blanco y un toque de aceite de oliva.',
                    'steps'              => "1) Cocinar el arroz.\n2) Cocinar la pechuga.\n3) Mezclar todo y agregar aceite.",
                    'visibility'         => 'public',   // 'public' | 'unlisted' | 'private'
                    'servings'           => 1,
                    'prep_time_minutes'  => 10,
                    'cook_time_minutes'  => 20,

                    // 🔽 Nada de image_url: usamos storage + metadatos (se sube por API)
                    'image_disk'         => $recipe->image_disk ?? null,
                    'image_path'         => $recipe->image_path ?? null,
                    'image_thumb_path'   => $recipe->image_thumb_path ?? null,
                    'image_webp_path'    => $recipe->image_webp_path ?? null,
                    'image_width'        => $recipe->image_width ?? null,
                    'image_height'       => $recipe->image_height ?? null,
                ]
            );

            // 4) Items (cantidad y unidad deben coincidir con serving_unit del ingrediente)
            $items = [
                [$pollo, 150, 'g',  null],
                [$arroz, 150, 'g',  null],
                [$aceite, 10,  'ml', null],
            ];

            // Validación rápida de unidades
            foreach ($items as [$ing, $qty, $unit, $_]) {
                if ($ing->serving_unit !== $unit) {
                    throw new InvalidArgumentException("Unidad incompatible para {$ing->name}: {$unit} vs {$ing->serving_unit}");
                }
            }

            // 5) Armar datos para sync (upsert de pivot + actualiza si cambia)
            $attachData = [];
            foreach ($items as [$ing, $qty, $unit, $notes]) {
                $attachData[$ing->id] = [
                    'quantity' => $qty,
                    'unit'     => $unit,
                    'notes'    => $notes,
                ];
            }

            // sync() actualiza atributos de pivot y deja solo los listados (determinístico)
            $recipe->ingredients()->sync($attachData);

            // 6) Recalcular macros (usa tu lógica del modelo)
            $recipe->recomputeMacrosAndSave();
        });
    }
}
