<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\MealLogStoreRequest;
use App\Models\{MealLog, MealDetail, Ingredient, Recipe};
use App\Services\AchievementService;

class MealLogController extends Controller
{
    public function index(Request $request)
    {
        $userId = auth()->id(); 
        $date = $request->query('date');
        $from = $request->query('from');
        $to = $request->query('to');

        $q = MealLog::with('details.ingredient:id,name', 'details.recipe:id,title')
            ->where('user_id', $userId)
            ->orderByDesc('log_date');

        if ($date) {
            $log = (clone $q)
                ->whereDate('log_date', $date)
                ->first();

            if (!$log) {
                return response()->noContent();
            }
            return response()->json($log);
        }

        if ($from)
            $q->whereDate('log_date', '>=', $from);
        if ($to)
            $q->whereDate('log_date', '<=', $to);

        return $q->paginate(30);
    }

    public function show(MealLog $mealLog)
    {
        return $mealLog->load('details.ingredient:id,name', 'details.recipe:id,title');
    }

    public function store(MealLogStoreRequest $request)
    {

        $userId  = $request->user()->id;
        $logDate = (string) $request->input('log_date');
        $notes   = $request->input('notes');
        $details = $request->input('details', []);
        $user = $request->user();
        $achievementService = new AchievementService();


        return DB::transaction(function () use ($userId, $logDate, $notes, $details, $user, $achievementService) {

            $mealLog = MealLog::firstOrCreate(
                ['user_id' => $userId, 'log_date' => $logDate],
                [
                    'total_calories' => 0,
                    'total_protein' => 0,
                    'total_carbs' => 0,
                    'total_fat' => 0,
                    'notes' => $notes,
                ]
            );

            $batchTotals = [
                'calories' => 0.0,
                'protein' => 0.0,
                'carbs' => 0.0,
                'fat' => 0.0,
            ];

            foreach ($details as $d) {
                $mealType = $d['meal_type'];
                $loggedAt = $d['logged_at'] ?? null;

                if (!$loggedAt) {
                    $loggedAt = $logDate . ' 12:00:00'; 
                }

                if (!empty($d['ingredient_id'])) {

                    // Detalle por cada Ingrediente
                    $ing = Ingredient::findOrFail((int) $d['ingredient_id']);
                    $grams = isset($d['grams']) ? (float) $d['grams'] : null;
                    $servs = isset($d['servings']) ? (float) $d['servings'] : 1.0;

                    $serving = (float) ($ing->serving_size ?: 1);

                    if ($grams !== null && in_array($ing->serving_unit, ['g', 'ml'])) {
                        $factor = $serving > 0 ? ($grams / $serving) : 0;
                    } else {
                        $factor = $servs; 
                    }

                    $cals = $ing->calories * $factor;
                    $prot = $ing->protein * $factor;
                    $carb = $ing->carbs * $factor;
                    $fat = $ing->fat * $factor;

                    MealDetail::create([
                        'meal_log_id' => $mealLog->id,
                        'meal_type' => $mealType,
                        'ingredient_id' => $ing->id,
                        'recipe_id' => null,
                        'servings' => $servs,
                        'grams' => $grams,
                        'calories' => round($cals, 2),
                        'protein' => round($prot, 2),
                        'carbs' => round($carb, 2),
                        'fat' => round($fat, 2),
                        'logged_at' => $loggedAt,
                    ]);

                    $batchTotals['calories'] += $cals;
                    $batchTotals['protein'] += $prot;
                    $batchTotals['carbs'] += $carb;
                    $batchTotals['fat'] += $fat;

                    $achievementService->checkAfterMealLogged($user);

                } elseif (!empty($d['recipe_id'])) {

                    // Detalle por cada Receta
                    $recipe = Recipe::with('ingredients')->findOrFail((int) $d['recipe_id']);
                    $servs = isset($d['servings']) ? (float) $d['servings'] : 1.0;

                    if ($recipe->calories === null) {
                        $recipe->recomputeMacrosAndSave(true);
                    }

                    $base = $recipe->servings > 0
                        ? [
                            'cal' => $recipe->calories / $recipe->servings,
                            'pro' => $recipe->protein / $recipe->servings,
                            'car' => $recipe->carbs / $recipe->servings,
                            'fat' => $recipe->fat / $recipe->servings,
                        ]
                        : [
                            'cal' => $recipe->calories,
                            'pro' => $recipe->protein,
                            'car' => $recipe->carbs,
                            'fat' => $recipe->fat,
                        ];

                    $cals = $base['cal'] * $servs;
                    $prot = $base['pro'] * $servs;
                    $carb = $base['car'] * $servs;
                    $fat = $base['fat'] * $servs;

                    MealDetail::create([
                        'meal_log_id' => $mealLog->id,
                        'meal_type' => $mealType,
                        'ingredient_id' => null,
                        'recipe_id' => $recipe->id,
                        'servings' => $servs,
                        'grams' => null,
                        'calories' => round($cals, 2),
                        'protein' => round($prot, 2),
                        'carbs' => round($carb, 2),
                        'fat' => round($fat, 2),
                        'logged_at' => $loggedAt,
                    ]);

                    $batchTotals['calories'] += $cals;
                    $batchTotals['protein'] += $prot;
                    $batchTotals['carbs'] += $carb;
                    $batchTotals['fat'] += $fat;
                }
            }

            // Se recalculan los totales del día
            $sums = $mealLog->details()
                ->selectRaw('
                    COALESCE(SUM(calories),0) as cals,
                    COALESCE(SUM(protein),0)  as prot,
                    COALESCE(SUM(carbs),0)    as carb,
                    COALESCE(SUM(fat),0)      as fat
                ')
                ->first();

            $mealLog->update([
                'total_calories' => round((float) $sums->cals, 2),
                'total_protein' => round((float) $sums->prot, 2),
                'total_carbs' => round((float) $sums->carb, 2),
                'total_fat' => round((float) $sums->fat, 2),
            ]);
            return $mealLog->load('details.ingredient:id,name', 'details.recipe:id,title');
        });
        
        if ($user->meals()->count() === 1) {
            app(AchievementService::class)->unlockByCode($user, 'first_log'); 
            }
    }

    public function weekly(Request $request)
    {
        $userId = auth()->id();
        $tz = (string) $request->query('tz', 'America/Argentina/Buenos_Aires');

        // Últimos 7 días del usuario
        $today = Carbon::now($tz)->toDateString();                   
        $start = Carbon::now($tz)->subDays(7)->toDateString();       

        // Suma de macros por día
        $rows = MealDetail::query()
            ->selectRaw('
                ml.log_date AS d,
                COALESCE(SUM(meal_details.calories),0) AS calories,
                COALESCE(SUM(meal_details.protein),0)  AS protein,
                COALESCE(SUM(meal_details.carbs),0)    AS carbs,
                COALESCE(SUM(meal_details.fat),0)      AS fats
            ')
            ->join('meal_logs as ml', 'ml.id', '=', 'meal_details.meal_log_id')
            ->where('ml.user_id', $userId)
            ->whereBetween('ml.log_date', [$start, $today])
            ->groupBy('ml.log_date')
            ->orderBy('ml.log_date')
            ->get()
            ->keyBy('d'); 

        // Armado de esqueleto con data 
        $out = [];
        $cursor = Carbon::parse($start, $tz);
        $end = Carbon::parse($today, $tz);

        while ($cursor->lte($end)) {
            $date = $cursor->toDateString();
            $label = $cursor->format('D'); 
            $out[$date] = [
                'date' => $date,
                'dayShort' => $label,
                'calories' => 0,
                'protein' => 0,
                'carbs' => 0,
                'fats' => 0,
            ];
            $cursor->addDay();
        }

        // Datos de los detalles
        foreach ($rows as $d => $row) {
            if (isset($out[$d])) {
                $out[$d]['calories'] = (float) $row->calories;
                $out[$d]['protein'] = (float) $row->protein;
                $out[$d]['carbs'] = (float) $row->carbs;
                $out[$d]['fats'] = (float) $row->fats;
            }
        }

        $lastKey = array_key_last($out);
        if ($lastKey) {
            $out[$lastKey]['dayShort'] = 'Today';
        }

        return response()->json(array_values($out));
    }
}