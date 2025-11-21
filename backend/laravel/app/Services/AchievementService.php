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
        // 1) Primer registro de comida
        $this->unlockFirstLogIfNeeded($user);

        // 2) Racha de 7 días
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
        // Asumiendo relación $user->favoriteRecipes()
        // y que la tabla recipes tiene user_id (dueño de la receta)
        $count = $user->favoriteRecipes()
            ->where('recipes.user_id', '!=', $user->id)
            ->count();

        if ($count >= 5) {
            $this->unlockByCode($user, 'community_helper');
        }
    }

    /* ================== Helpers privados ================== */

    protected function unlockFirstLogIfNeeded(User $user): void
    {
        // Asumiendo relación $user->mealLogs()
        if ($user->mealLogs()->count() === 1) {
            $this->unlockByCode($user, 'first_log');
        }
    }

    protected function has7DayStreak(User $user): bool
    {
        $today = Carbon::today();
        $from = $today->copy()->subDays(6); // hoy + 6 días hacia atrás = 7 días

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


