<?php

namespace App\Services;

use App\Models\Achievement;
use App\Models\User;
use Carbon\Carbon;

class AchievementService
{
    public function unlockByCode(User $user, string $code, ?array $meta = null): void
    {
        $achievement = Achievement::where('code', $code)->first();

        if (!$achievement) {
            logger()->warning("Achievement with code {$code} not found.");
            return; 
        }

        if ($user->achievements()->where('achievement_id', $achievement->id)->exists()) {
            logger()->info("User {$user->id} already has achievement {$achievement->id}.");
            return;
        }

        $user->achievements()->attach($achievement->id, [
            'awarded_at' => Carbon::now(),
            'meta' => $meta,
        ]);
    }

    public function checkAfterMealLogged(User $user): void
    {
        $this->unlockFirstLogIfNeeded($user);

        if ($this->has7DayStreak($user)) {
            $this->unlockByCode($user, '7_days_streak');
        }
    }

    public function checkAfterRecipeCreated(User $user): void
    {
        if ($user->recipes()->count() === 1) {
            $this->unlockByCode($user, 'first_recipe');
        }
    }

    public function checkAfterFavoriteAdded(User $user): void
    {

        $count = $user->favoriteRecipes()
            ->where('recipes.user_id', '!=', $user->id)
            ->count();

        if ($count >= 5) {
            $this->unlockByCode($user, 'community_helper');
        }
    }


    protected function unlockFirstLogIfNeeded(User $user): void
    {
        if ($user->mealLogs()->count() === 1) {
            $this->unlockByCode($user, 'first_log');
        }
    }

    protected function has7DayStreak(User $user): bool
    {
        $today = Carbon::today();
        $from = $today->copy()->subDays(6);

        return $user->mealLogs()
            ->whereBetween('log_date', [
                $from->startOfDay(),
                $today->endOfDay(),
            ])
            ->selectRaw('DATE(log_date) as d')
            ->distinct()
            ->count() >= 7;
    }
}


