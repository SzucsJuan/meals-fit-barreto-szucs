<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Recipe;
use App\Models\MealLog;
use App\Models\MealDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminStatsController extends Controller
{
    public function index(Request $request)
    {
        $totalUsers = User::where('role', 'user')->count();
        $totalRecipes = Recipe::count();
        $totalMealsLogged = MealLog::count();

        // ----- Weekly Activity (últimos 7 días) -----
        $today = Carbon::today();
        $start = $today->copy()->subDays(6);

        $usersByDay = User::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('role', 'user')
            ->whereBetween('created_at', [$start->copy()->startOfDay(), $today->copy()->endOfDay()])
            ->groupBy('date')
            ->pluck('count', 'date');

        $recipesByDay = Recipe::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->whereBetween('created_at', [$start->copy()->startOfDay(), $today->copy()->endOfDay()])
            ->groupBy('date')
            ->pluck('count', 'date');

        $mealsByDay = MealLog::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->whereBetween('created_at', [$start->copy()->startOfDay(), $today->copy()->endOfDay()])
            ->groupBy('date')
            ->pluck('count', 'date');

        $weeklyActivity = [];
        $cursor = $start->copy();
        while ($cursor->lte($today)) {
            $key = $cursor->toDateString();
            $weeklyActivity[] = [
                'name' => $cursor->format('D'),
                'users' => (int) ($usersByDay[$key] ?? 0),
                'recipes' => (int) ($recipesByDay[$key] ?? 0),
                'meals' => (int) ($mealsByDay[$key] ?? 0),
            ];
            $cursor->addDay();
        }

        $rawCategories = MealDetail::select('meal_type', DB::raw('COUNT(*) as count'))
            ->groupBy('meal_type')
            ->get();

        $labels = [
            'breakfast' => 'Breakfast',
            'lunch' => 'Lunch',
            'dinner' => 'Dinner',
            'snack' => 'Snacks',
        ];

        $recipeCategoryDistribution = $rawCategories->map(function ($row) use ($labels) {
            $key = $row->meal_type;
            return [
                'name' => $labels[$key] ?? ucfirst($key),
                'value' => (int) $row->count,
            ];
        })->values()->all();

        $events = collect();

        $events = $events->merge(
            User::where('role', 'user')
                ->orderByDesc('created_at')
                ->take(5)
                ->get()
                ->map(function ($u) {
                    return [
                        'type' => 'user',
                        'title' => 'New user registered',
                        'description' => trim(($u->name ?? 'User') . ' (' . $u->email . ')'),
                        'created_at' => $u->created_at->toIso8601String(),
                        'created_at_formatted' => $u->created_at->format('Y-m-d H:i'),
                        'created_at_human' => $u->created_at->diffForHumans(),
                    ];
                })
        );

        $events = $events->merge(
            Recipe::with('user')
                ->orderByDesc('created_at')
                ->take(5)
                ->get()
                ->map(function ($r) {
                    $author = $r->user?->name ?? $r->user?->email ?? 'Unknown';
                    return [
                        'type' => 'recipe',
                        'title' => 'Recipe published',
                        'description' => sprintf('%s created by %s', $r->title, $author),
                        'created_at' => $r->created_at->toIso8601String(),
                        'created_at_formatted' => $r->created_at->format('Y-m-d H:i'),
                        'created_at_human' => $r->created_at->diffForHumans(),
                    ];
                })
        );

        $events = $events->merge(
            MealLog::with('user')
                ->orderByDesc('created_at')
                ->take(5)
                ->get()
                ->map(function ($m) {
                    $who = $m->user?->name ?? $m->user?->email ?? 'Unknown user';
                    $forDate = $m->logged_at?->format('d-m-Y') ?? $m->created_at->format('d-m-Y');

                    return [
                        'type' => 'meal',
                        'title' => 'Meal logged',
                        'description' => sprintf('Created on %s by %s', $forDate, $who),
                        'created_at' => $m->created_at->toIso8601String(),
                        'created_at_formatted' => $m->created_at->format('d-m-Y H:i'),
                        'created_at_human' => $m->created_at->diffForHumans(),
                    ];
                })
        );

        $recentActivity = $events
            ->sortByDesc('created_at')
            ->values()
            ->take(5)
            ->all();

        return response()->json([
            'total_users' => $totalUsers,
            'total_recipes' => $totalRecipes,
            'total_meals_logged' => $totalMealsLogged,
            'weekly_activity' => $weeklyActivity,
            'recipe_category_distribution' => $recipeCategoryDistribution,
            'recent_activity' => $recentActivity
        ]);
    }
}
