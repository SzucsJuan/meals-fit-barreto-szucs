<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AchievementController extends Controller
{
    public function me(Request $request)
    {
        $achievements = $request->user()->achievements;
        return response()->json($achievements);
    }
}
