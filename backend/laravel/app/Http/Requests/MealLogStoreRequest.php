<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MealLogStoreRequest extends FormRequest
{

    public function rules(): array
    {
        return [
            // 'user_id'  => ['required','integer','exists:users,id'], ---con auth
            'user_id'   => 'sometimes|exists:users,id', // quitar cuando uses auth
            'log_date'  => 'required|date_format:Y-m-d', // default hoy
            'notes'     => 'nullable|string|max:500',

            // Detalles del log (ingredientes o receta)
            'details'   => 'required|array|min:1',
            'details.*.meal_type'    => 'required|string|in:breakfast,lunch,dinner,snack',
            'details.*.logged_at'    => 'nullable|date_format:Y-m-d H:i:s',

            // Opción 1: por ingrediente
            'details.*.ingredient_id'=> 'nullable|exists:ingredients,id',
            'details.*.grams'        => 'nullable|numeric|min:0',

            // Opción 2: por receta
            'details.*.recipe_id'    => 'nullable|exists:recipes,id',
            'details.*.servings'     => 'nullable|numeric|min:0',

            // Macros provenientes del cliente se ignoran (se recalculan server-side)
            // pero podés permitírlos como optional si querés auditarlos:
            // 'details.*.calories'  => 'nullable|numeric|min:0',
            // 'details.*.protein'   => 'nullable|numeric|min:0',
            // 'details.*.carbs'     => 'nullable|numeric|min:0',
            // 'details.*.fat'       => 'nullable|numeric|min:0',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($v) {
            $details = $this->input('details', []);
            foreach ($details as $i => $d) {
                $byIngredient = !empty($d['ingredient_id']);
                $byRecipe     = !empty($d['recipe_id']);

                if ($byIngredient === $byRecipe) {
                    $v->errors()->add("details.$i", "Debes enviar **ingredient_id+grams** O **recipe_id+servings**.");
                }
                if ($byIngredient && (!isset($d['grams']) || $d['grams'] <= 0)) {
                    $v->errors()->add("details.$i.grams", "grams es requerido y > 0 para ingredient_id.");
                }
                if ($byRecipe && (!isset($d['servings']) || $d['servings'] <= 0)) {
                    $v->errors()->add("details.$i.servings", "servings es requerido y > 0 para recipe_id.");
                }
            }
        });
    }
        public function authorize(): bool { return true; } //modificar cuando se use auth
}
