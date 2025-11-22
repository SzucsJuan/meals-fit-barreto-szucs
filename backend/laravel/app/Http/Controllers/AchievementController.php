<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    /**
     * Lógica para los achievements
     */
    public function me(Request $request)
    {
        $user = $request->user();

        $achievements = Achievement::query()
            ->leftJoin('user_achievements as ua', function ($join) use ($user) {
                $join->on('ua.achievement_id', '=', 'achievements.id')
                    ->where('ua.user_id', '=', $user->id);
            })
            ->select(
                'achievements.id',
                'achievements.code',
                'achievements.name',
                'achievements.description',
                'achievements.icon_url',
                'achievements.created_at',
                'achievements.updated_at',
                'ua.awarded_at'
            )
            ->orderBy('achievements.id')
            ->get();


        return response()->json($achievements);
    }
}
