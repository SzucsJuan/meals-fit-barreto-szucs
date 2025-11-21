<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;

class AchievementController extends Controller
{
    /**
     * Devuelve todos los achievements y, para el usuario autenticado,
     * la fecha en la que los desbloqueó (unlocked_at) o null si aún no.
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

        // Opcional: castear unlocked_at a string ISO y no a objeto Carbon
        $data = $achievements->map(function ($a) {
            return [
                'id' => $a->id,
                'code' => $a->code,
                'name' => $a->name,
                'description' => $a->description,
                'icon_url' => $a->icon_url,
                'awarde_at' => $a->awarded_at
                    ? $a->awarded_at->toISOString()
                    : null,
            ];
        });

        return response()->json($data);
    }
}
