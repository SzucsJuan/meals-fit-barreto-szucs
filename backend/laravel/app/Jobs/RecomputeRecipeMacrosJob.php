<?php

namespace App\Jobs;

use App\Models\Recipe;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class RecomputeRecipeMacrosJob implements ShouldQueue
{
    use Dispatchable, Queueable;

    public function __construct(public int $recipeId) {}

    public function handle(): void
    {
        $recipe = Recipe::find($this->recipeId);
        if (!$recipe) return;

        $recipe->recomputeMacrosAndSave(true);
    }
}
