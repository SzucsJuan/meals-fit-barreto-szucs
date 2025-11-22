<?php

namespace App\Observers;

use App\Models\Recipe;
use App\Services\AchievementService;

class RecipeObserver
{
    protected $achievementService;

    public function __construct(AchievementService $achievementService)
    {
        $this->achievementService = $achievementService;
    }

    /**
     * Handle the Recipe "created" event.
     *
     * @param  \App\Models\Recipe  $recipe
     * @return void
     */
    public function created(Recipe $recipe)
    {
        if ($recipe->user) {
            $this->achievementService->unlock($recipe->user, 'first_recipe');
        }
    }
}
