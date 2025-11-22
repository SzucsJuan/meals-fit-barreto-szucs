<?php

namespace App\Services;

use App\Models\User;
use App\Models\Achievement;
use App\Models\MealLog;
use Carbon\Carbon;

class AchievementService
{
    public function unlock(User $user, string $code)
    {
        $achievement = Achievement::where('code', $code)->first();

        if (!$achievement) {
            return;
        }

        if (!$user->achievements()->where('achievement_id', $achievement->id)->exists()) {
            $user->achievements()->attach($achievement->id);
        }
    }

    public function checkStreak(User $user)
    {
        // Get all distinct dates where the user has logged a meal, ordered descending
        $dates = MealLog::where('user_id', $user->id)
            ->selectRaw('DATE(log_date) as date')
            ->distinct()
            ->orderBy('date', 'desc')
            ->pluck('date')
            ->toArray();

        if (empty($dates)) {
            return;
        }

        // Check if the most recent log is today or yesterday (to keep streak alive)
        $today = Carbon::today()->toDateString();
        $yesterday = Carbon::yesterday()->toDateString();

        if ($dates[0] !== $today && $dates[0] !== $yesterday) {
            // Streak broken or not started recently
            return;
        }

        $streak = 1;
        $currentDate = Carbon::parse($dates[0]);

        for ($i = 1; $i < count($dates); $i++) {
            $prevDate = Carbon::parse($dates[$i]);

            if ($currentDate->diffInDays($prevDate) === 1) {
                $streak++;
                $currentDate = $prevDate;
            } else {
                break;
            }
        }

        if ($streak >= 7) {
            $this->unlock($user, '7_day_streak');
        }
    }
}
