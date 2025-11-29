<?php


namespace App\Http\Controllers;


use App\Http\Requests\{MealDetailStoreRequest, MealDetailUpdateRequest};
use App\Models\{Ingredient, MealLog, Recipe, MealDetail};
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;


class MealDetailController extends Controller
{
public function store(MealDetailStoreRequest $request){
return MealDetail::create($request->validated());
}


public function update(MealDetailUpdateRequest $request, MealDetail $mealDetail): JsonResponse
    {
        $data = $request->validated();

        return DB::transaction(function() use ($mealDetail, $data) {
            if (array_key_exists('meal_type',$data)) $mealDetail->meal_type = $data['meal_type'];
            if (array_key_exists('logged_at',$data)) $mealDetail->logged_at = $data['logged_at']; 

            if (!empty($data['ingredient_id'])) {
                $ing   = Ingredient::findOrFail($data['ingredient_id']);
                $grams = (float) ($data['grams'] ?? 0);

                $serving = (float) ($ing->serving_size ?: 1);
                $factor  = ($ing->serving_unit === 'unit')
                    ? ($grams / 1.0)
                    : ($grams / $serving);

                $cals = $ing->calories * $factor;
                $prot = $ing->protein  * $factor;
                $carb = $ing->carbs    * $factor;
                $fat  = $ing->fat      * $factor;

                $mealDetail->ingredient_id = $ing->id;
                $mealDetail->recipe_id     = null;
                $mealDetail->servings      = $serving;
                $mealDetail->grams         = $grams;
                $mealDetail->calories      = round($cals, 2);
                $mealDetail->protein       = round($prot, 2);
                $mealDetail->carbs         = round($carb, 2);
                $mealDetail->fat           = round($fat, 2);
            }

            if (!empty($data['recipe_id'])) {
                $recipe   = Recipe::with('ingredients')->findOrFail($data['recipe_id']);
                $servings = (float) ($data['servings'] ?? 1);

                if ($recipe->calories === null) {
                    $recipe->recomputeMacrosAndSave(true);
                }

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

                $mealDetail->ingredient_id = null;
                $mealDetail->recipe_id     = $recipe->id;
                $mealDetail->servings      = $servings;
                $mealDetail->grams         = null;
                $mealDetail->calories      = round($cals, 2);
                $mealDetail->protein       = round($prot, 2);
                $mealDetail->carbs         = round($carb, 2);
                $mealDetail->fat           = round($fat, 2);
            }

            $mealDetail->save();

            // Recalcular totales
            $this->recalcLogTotals($mealDetail->meal_log_id);

            // Se devuelve el detalle actualizado
            return response()->json(
                $mealDetail->fresh()->load('ingredient:id,name','recipe:id,title')
            );
        });
    }

    public function destroy(MealDetail $mealDetail): JsonResponse
    {
        $logId = $mealDetail->meal_log_id;

        return DB::transaction(function() use ($mealDetail, $logId) {
            $mealDetail->delete();
            $this->recalcLogTotals($logId);

            return response()->json(['status' => 'ok'], 204);
        });
    }

    // Se suman macros de todos los detalles y se actualiza el MealLog
    private function recalcLogTotals(int $mealLogId): void
    {
        $log = MealLog::with('details')->findOrFail($mealLogId);

        $totals = [
            'calories' => 0.0,
            'protein'  => 0.0,
            'carbs'    => 0.0,
            'fat'      => 0.0,
        ];

        foreach ($log->details as $d) {
            $totals['calories'] += (float) $d->calories;
            $totals['protein']  += (float) $d->protein;
            $totals['carbs']    += (float) $d->carbs;
            $totals['fat']      += (float) $d->fat;
        }

        $log->update([
            'total_calories' => round($totals['calories'], 2),
            'total_protein'  => round($totals['protein'],  2),
            'total_carbs'    => round($totals['carbs'],    2),
            'total_fat'      => round($totals['fat'],      2),
        ]);
    }
}