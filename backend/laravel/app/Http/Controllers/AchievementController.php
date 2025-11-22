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

        $data = $achievements->map(function ($a) {
            return [
                'id' => $a->id,
                'code' => $a->code,
                'name' => $a->name,
                'description' => $a->description,
                'icon_url' => $a->icon_url,
                'awarded_at' => $a->awarded_at
                    ? $a->awarded_at->toISOString()
                    : null,
            ];
        });

        return response()->json($data);
    }
}
