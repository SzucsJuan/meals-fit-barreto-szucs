<?php

namespace App\Observers;

use App\Models\Ingredient;
use App\Jobs\RecomputeRecipeMacrosJob;

class IngredientObserver
{
    public function saved(Ingredient $ingredient): void
    {
        if ($ingredient->wasChanged(['serving_size','serving_unit','calories','protein','carbs','fat'])) {
            $ingredient->recipes()
                ->pluck('recipes.id')
                ->unique()
                ->each(fn ($id) => RecomputeRecipeMacrosJob::dispatch($id));
        }
    }
}
