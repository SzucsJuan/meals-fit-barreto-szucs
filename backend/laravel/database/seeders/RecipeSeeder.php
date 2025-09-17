<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\Recipe;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use InvalidArgumentException;

class RecipeSeeder extends Seeder
{
    public function run(): void
    {
        // 1) Buscamos los ingredientes por nombre (ajusta si cambian)
        $pollo = Ingredient::where('name', 'Pechuga de pollo')->first();
        $arroz = Ingredient::where('name', 'Arroz blanco cocido')->first();
        $aceite = Ingredient::where('name', 'Aceite de oliva')->first();

        if (!$pollo || !$arroz || !$aceite) {
            throw new InvalidArgumentException('Faltan ingredientes base para seedear la receta.');
        }

        // 2) Creamos la receta base
        $title = 'Bowl de pollo y arroz';
        $recipe = Recipe::updateOrCreate(
            ['slug' => Str::slug($title)],
            [
                'user_id'            => 2,
                'title'              => $title,
                'description'        => 'Clásico bowl alto en proteína con pechuga, arroz blanco y un toque de aceite de oliva.',
                'steps'              => "1) Cocinar el arroz.\n2) Cocinar la pechuga.\n3) Mezclar todo y agregar aceite.",
                'visibility'         => 'public',          // 'public' | 'unlisted' | 'private'
                'servings'           => 1,          
                'prep_time_minutes'  => 10,
                'cook_time_minutes'  => 20,
                'image_url'          => null,
                'calories'           => 0,
                'protein'            => 0,
                'carbs'              => 0,
                'fat'                => 0,
            ]
        );

        // 3) Definimos las cantidades de cada ingrediente para la pivot
        $items = [
            // quantity y unit deben coincidir con tu enum ['g','ml','unit']
            [$pollo, 150, 'g',  null],
            [$arroz, 150, 'g',  null],
            [$aceite, 10, 'ml', null],
        ];

        // 4) Adjuntamos a la pivot (evitamos duplicar con syncWithoutDetaching)
        $attachData = [];
        foreach ($items as [$ing, $qty, $unit, $notes]) {
            $attachData[$ing->id] = [
                'quantity' => $qty,
                'unit'     => $unit,
                'notes'    => $notes,
            ];
        }
        $recipe->ingredients()->syncWithoutDetaching($attachData);

        // 5) Calculamos macros totales según serving_size y serving_unit de cada ingrediente
        $totals = ['calories' => 0.0, 'protein' => 0.0, 'carbs' => 0.0, 'fat' => 0.0];

        foreach ($items as [$ing, $qty, $unit, $_]) {
            // Validación simple de unidad compatible
            if ($ing->serving_unit !== $unit) {
                // Si quisieras, podrías mapear conversiones acá
                throw new InvalidArgumentException("Unidad incompatible para {$ing->name}: {$unit} vs {$ing->serving_unit}");
            }

            // Factor = cantidad usada / tamaño de porción base del ingrediente
            $factor = $ing->serving_size > 0 ? ($qty / $ing->serving_size) : 1;

            $totals['calories'] += $ing->calories * $factor;
            $totals['protein']  += $ing->protein  * $factor;
            $totals['carbs']    += $ing->carbs    * $factor;
            $totals['fat']      += $ing->fat      * $factor;
        }

        $recipe->update([
            'calories' => round($totals['calories'], 2),
            'protein'  => round($totals['protein'], 2),
            'carbs'    => round($totals['carbs'], 2),
            'fat'      => round($totals['fat'], 2), 
        ]);
    }
}
