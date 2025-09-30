<?php

namespace App\Http\Controllers;

use App\Http\Requests\MealLogStoreRequest;
use App\Models\{MealLog, MealDetail, Ingredient, Recipe};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MealLogController extends Controller
{
    // GET /api/meal-logs?user_id=1&from=2025-09-01&to=2025-09-30
    public function index(Request $request)
    {
        // cuando tengas auth: $userId = (int) auth()->id();
        $userId = (int) $request->query('user_id', 2);

        $date = $request->query('date'); // YYYY-MM-DD (si viene, devolvemos 1 registro)
        $from = $request->query('from'); // opcional
        $to   = $request->query('to');   // opcional

        $base = MealLog::with([
            'details.ingredient:id,name',
            'details.recipe:id,title',
        ])->where('user_id', $userId);

        // ====== MODO A: por fecha exacta (un solo log, no paginado) ======
        if ($date) {
            $log = (clone $base)
                ->whereDate('log_date', $date)
                ->first();

            if (!$log) {
                return response()->noContent(); // 204 si no hay log para ese día
            }
            return response()->json($log);
        }

        // ====== MODO B: historial paginado (rango) ======
        $q = (clone $base)->orderByDesc('log_date');
        if ($from) $q->whereDate('log_date', '>=', $from);
        if ($to)   $q->whereDate('log_date', '<=', $to);

        return $q->paginate(30);
    }

    // GET /api/meal-logs/{id}
    public function show(MealLog $mealLog)
    {
        // $this->authorize('view', $mealLog);
        return $mealLog->load('details.ingredient:id,name', 'details.recipe:id,title');
    }

    // POST /api/meal-logs
    public function store(MealLogStoreRequest $request)
    {
        // $userId = $request->user()->id; // cuando haya auth
        $userId = (int) $request->input('user_id', 1); // ⚠️ solo dev

        $logDate = $request->input('log_date', now()->toDateString());
        $notes   = $request->input('notes');

        $details = $request->input('details');

        return DB::transaction(function () use ($userId, $logDate, $notes, $details) {

            $mealLog = MealLog::create([
                'user_id'        => $userId,
                'log_date'       => $logDate,
                'total_calories' => 0,
                'total_protein'  => 0,
                'total_carbs'    => 0,
                'total_fat'      => 0,
                'notes'          => $notes,
            ]);

            $totals = [
                'calories' => 0.0,
                'protein'  => 0.0,
                'carbs'    => 0.0,
                'fat'      => 0.0,
            ];

            foreach ($details as $d) {
                $mealType = $d['meal_type'];
                $loggedAt = $d['logged_at'] ?? $logDate.' 12:00:00';

                if (!empty($d['ingredient_id'])) {
                    // ----- detalle por INGREDIENTE -----
                    $ing   = Ingredient::findOrFail($d['ingredient_id']);
                    $grams = (float) $d['grams'];

                    // Validamos unidad (g o ml) en base a serving_unit del ingrediente
                    // (si quisieras permitir ml -> g necesitarías densidad)
                    if (!in_array($ing->serving_unit, ['g','ml'])) {
                        // 'unit' (pieza) → interpretás grams como "cantidad" y serving_size como 1 unidad
                        // aquí lo tratamos como 'unit' con "serving_size" unidades
                    }

                    $serving = (float) ($ing->serving_size ?: 1);
                    // Si el ingrediente usa 'unit', el campo grams representa "cantidad de unidades"
                    $factor  = ($ing->serving_unit === 'unit')
                        ? ($grams / 1.0)
                        : ($grams / $serving);

                    $cals = $ing->calories * $factor;
                    $prot = $ing->protein  * $factor;
                    $carb = $ing->carbs    * $factor;
                    $fat  = $ing->fat      * $factor;

                    MealDetail::create([
                        'meal_log_id' => $mealLog->id,
                        'meal_type'   => $mealType,
                        'ingredient_id'=> $ing->id,
                        'recipe_id'   => null,
                        'servings'    => $serving,
                        'grams'       => $grams,
                        'calories'    => round($cals, 2),
                        'protein'     => round($prot, 2),
                        'carbs'       => round($carb, 2),
                        'fat'         => round($fat, 2),
                        'logged_at'   => $loggedAt,
                    ]);

                    $totals['calories'] += $cals;
                    $totals['protein']  += $prot;
                    $totals['carbs']    += $carb;
                    $totals['fat']      += $fat;

                } elseif (!empty($d['recipe_id'])) {
                    // ----- detalle por RECETA -----
                    $recipe   = Recipe::with('ingredients')->findOrFail($d['recipe_id']);
                    $servings = (float) $d['servings'];

                    // Aseguramos que la receta tenga sus macros totales correctos (si no, recalculamos)
                    if ($recipe->calories === null) {
                        $recipe->recomputeMacrosAndSave(true);
                    }

                    // Macros por porción si la receta define servings > 0
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

                    $cals = $base['cal'] * $servings;
                    $prot = $base['pro'] * $servings;
                    $carb = $base['car'] * $servings;
                    $fat  = $base['fat'] * $servings;

                    MealDetail::create([
                        'meal_log_id' => $mealLog->id,
                        'meal_type'   => $mealType,
                        'ingredient_id'=> null,
                        'recipe_id'   => $recipe->id,
                        'servings'    => $servings,
                        'grams'       => null,
                        'calories'    => round($cals, 2),
                        'protein'     => round($prot, 2),
                        'carbs'       => round($carb, 2),
                        'fat'         => round($fat, 2),
                        'logged_at'   => $loggedAt,
                    ]);

                    $totals['calories'] += $cals;
                    $totals['protein']  += $prot;
                    $totals['carbs']    += $carb;
                    $totals['fat']      += $fat;
                }
            }

            $mealLog->update([
                'total_calories' => round($totals['calories'], 2),
                'total_protein'  => round($totals['protein'], 2),
                'total_carbs'    => round($totals['carbs'], 2),
                'total_fat'      => round($totals['fat'], 2),
            ]);

            return $mealLog->load('details.ingredient:id,name', 'details.recipe:id,title');
        });
    }
}
