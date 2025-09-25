<?php

namespace App\Services;

use App\Models\Recipe;
use App\Models\Ingredient;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class RecipeService
{
    /**
     * Sincroniza ingredientes de una receta y recalcula macros.
     *
     * @param  Recipe $recipe
     * @param  array<int, array{
     *   ingredient_id:int,
     *   quantity:float|int,
     *   unit:string,           // 'g'|'ml'|'unit'
     *   notes?:string|null
     * }> $items
     * @param  bool $ignoreUnitMismatch  Si true, ignora items con unidad distinta al ingrediente
     * @return Recipe
     */
    public function syncIngredientsAndRecompute(Recipe $recipe, array $items, bool $ignoreUnitMismatch = false): Recipe
    {
        // Normalizamos -> array para sync: [ingredient_id => ['quantity'=>..,'unit'=>..,'notes'=>..], ...]
        $payload = [];

        foreach ($items as $i => $row) {
            $ingredientId = (int)($row['ingredient_id'] ?? 0);
            $quantity     = (float)($row['quantity']     ?? 0);
            $unit         = (string)($row['unit']        ?? '');
            $notes        = $row['notes'] ?? null;

            if ($ingredientId <= 0 || $quantity <= 0 || $unit === '') {
                throw new InvalidArgumentException("Fila #$i inválida: ingredient_id, quantity y unit son requeridos");
            }

            /** @var Ingredient $ing */
            $ing = Ingredient::select('id','name','serving_unit')->findOrFail($ingredientId);

            if ($unit !== $ing->serving_unit) {
                if ($ignoreUnitMismatch) {
                    // salteamos este ingrediente
                    continue;
                }
                throw new InvalidArgumentException(
                    "Unidad incompatible para {$ing->name}: receta='{$unit}' vs ingrediente='{$ing->serving_unit}'"
                );
            }

            $payload[$ingredientId] = [
                'quantity' => $quantity,
                'unit'     => $unit,
                'notes'    => $notes,
            ];
        }

        return DB::transaction(function () use ($recipe, $payload, $ignoreUnitMismatch) {
            // sincroniza pivot (agrega/actualiza/elimina los que ya no están)
            $recipe->ingredients()->sync($payload);

            // recalcula y guarda macros totales de la receta
            $recipe->recomputeMacrosAndSave(true);

            // devolvemos receta con ingredientes para uso inmediato
            return $recipe->load('ingredients:id,name');
        });
    }
}
