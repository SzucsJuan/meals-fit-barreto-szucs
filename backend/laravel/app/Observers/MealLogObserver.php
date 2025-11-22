<?php

namespace App\Observers;

use App\Models\MealLog;
use App\Services\AchievementService;

class MealLogObserver
{
    protected $achievementService;

    public function __construct(AchievementService $achievementService)
    {
        $this->achievementService = $achievementService;
    }

    /**
     * Handle the MealLog "created" event.
     *
     * @param  \App\Models\MealLog  $mealLog
     * @return void
     */
    public function created(MealLog $mealLog)
    {
        if ($mealLog->user) {
            $this->achievementService->unlock($mealLog->user, 'first_meal_log');
            $this->achievementService->checkStreak($mealLog->user);
        }
    }
}
