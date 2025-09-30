<?php

namespace App\Http\Controllers;


use App\Http\Requests\MealLogStoreRequest;
use App\Models\{MealLog, MealDetail, Ingredient, Recipe};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MealLogController extends Controller
{
    // GET /api/meal-logs?user_id=1&from=YYYY-MM-DD&to=YYYY-MM-DD
    public function index(Request $request)
    {
        $userId = (int) $request->query('user_id', 1); // reemplazar por auth()->id() al tener login
        $date   = $request->query('date');
        $from   = $request->query('from');
        $to     = $request->query('to');
        
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

        if ($from) $q->whereDate('log_date', '>=', $from);
        if ($to)   $q->whereDate('log_date', '<=', $to);

        return $q->paginate(30);
    }

    // GET /api/meal-logs/{mealLog}
    public function show(MealLog $mealLog)
    {
        return $mealLog->load('details.ingredient:id,name', 'details.recipe:id,title');
    }

    // POST /api/meal-logs
    public function store(MealLogStoreRequest $request)
    {
        // $userId = $request->user()->id; // con auth
        $userId  = (int) $request->input('user_id', 1); // DEV
        $logDate = (string) $request->input('log_date'); // YYYY-MM-DD (local)
        $notes   = $request->input('notes');             // opcional
        $details = $request->input('details', []);

        return DB::transaction(function () use ($userId, $logDate, $notes, $details) {

            // 1) Header diario (crea si no existe). Evita duplicados por el índice único.
            $mealLog = MealLog::firstOrCreate(
                ['user_id' => $userId, 'log_date' => $logDate],
                [
                    'total_calories' => 0,
                    'total_protein'  => 0,
                    'total_carbs'    => 0,
                    'total_fat'      => 0,
                    'notes'          => $notes,
                ]
            );

            $batchTotals = [
                'calories' => 0.0,
                'protein'  => 0.0,
                'carbs'    => 0.0,
                'fat'      => 0.0,
            ];

            foreach ($details as $d) {
                $mealType = $d['meal_type']; // 'breakfast' | 'lunch' | 'dinner' | 'snack'
                $loggedAt = $d['logged_at'] ?? null;

                if(!$loggedAt){
                    $loggedAt = $logDate . ' 12:00:00'; // default si no envías
                }

                if (!empty($d['ingredient_id'])) {

                    // ===== Detalle por INGREDIENTE =====
                    $ing   = Ingredient::findOrFail((int)$d['ingredient_id']);
                    $grams = isset($d['grams']) ? (float)$d['grams'] : null;
                    $servs = isset($d['servings']) ? (float)$d['servings'] : 1.0;

                    // Cálculo:
                    // - Si vino grams y el ingrediente es g/ml => factor = grams / serving_size
                    // - Si NO vino grams => usamos "servings" como múltiplo de la porción base.
                    $serving = (float) ($ing->serving_size ?: 1);

                    if ($grams !== null && in_array($ing->serving_unit, ['g','ml'])) {
                        $factor = $serving > 0 ? ($grams / $serving) : 0;
                    } else {
                        $factor = $servs; // múltiplos de la porción base
                    }

                    $cals = $ing->calories * $factor;
                    $prot = $ing->protein  * $factor;
                    $carb = $ing->carbs    * $factor;
                    $fat  = $ing->fat      * $factor;

                    MealDetail::create([
                        'meal_log_id'  => $mealLog->id,
                        'meal_type'    => $mealType,
                        'ingredient_id'=> $ing->id,
                        'recipe_id'    => null,
                        'servings'     => $servs,
                        'grams'        => $grams,
                        'calories'     => round($cals, 2),
                        'protein'      => round($prot, 2),
                        'carbs'        => round($carb, 2),
                        'fat'          => round($fat, 2),
                        'logged_at'    => $loggedAt,
                    ]);

                    $batchTotals['calories'] += $cals;
                    $batchTotals['protein']  += $prot;
                    $batchTotals['carbs']    += $carb;
                    $batchTotals['fat']      += $fat;

                } elseif (!empty($d['recipe_id'])) {

                    // ===== Detalle por RECETA =====
                    $recipe   = Recipe::with('ingredients')->findOrFail((int)$d['recipe_id']);
                    $servs    = isset($d['servings']) ? (float)$d['servings'] : 1.0;

                    // Garantizamos macros totales de la receta (si faltan)
                    if ($recipe->calories === null) {
                        $recipe->recomputeMacrosAndSave(true);
                    }

                    // Macros base por porción si la receta tiene servings > 0
                    $base = $recipe->servings > 0
                        ? [
                            'cal' => $recipe->calories / $recipe->servings,
                            'pro' => $recipe->protein  / $recipe->servings,
                            'car' => $recipe->carbs    / $recipe->servings,
                            'fat' => $recipe->fat      / $recipe->servings,
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
                    $fat  = $base['fat'] * $servs;

                    MealDetail::create([
                        'meal_log_id'  => $mealLog->id,
                        'meal_type'    => $mealType,
                        'ingredient_id'=> null,
                        'recipe_id'    => $recipe->id,
                        'servings'     => $servs,
                        'grams'        => null,
                        'calories'     => round($cals, 2),
                        'protein'      => round($prot, 2),
                        'carbs'        => round($carb, 2),
                        'fat'          => round($fat, 2),
                        'logged_at'    => $loggedAt,
                    ]);

                    $batchTotals['calories'] += $cals;
                    $batchTotals['protein']  += $prot;
                    $batchTotals['carbs']    += $carb;
                    $batchTotals['fat']      += $fat;
                }
            }

            // 3) Recalcular totales del día (sumando TODO lo que haya en details)
            $sums = $mealLog->details()
                ->selectRaw('
                    COALESCE(SUM(calories),0) as cals,
                    COALESCE(SUM(protein),0)  as prot,
                    COALESCE(SUM(carbs),0)    as carb,
                    COALESCE(SUM(fat),0)      as fat
                ')
                ->first();

            $mealLog->update([
                'total_calories' => round((float)$sums->cals, 2),
                'total_protein'  => round((float)$sums->prot, 2),
                'total_carbs'    => round((float)$sums->carb, 2),
                'total_fat'      => round((float)$sums->fat, 2),
            ]);

            return $mealLog->load('details.ingredient:id,name', 'details.recipe:id,title');
        });
    }
}