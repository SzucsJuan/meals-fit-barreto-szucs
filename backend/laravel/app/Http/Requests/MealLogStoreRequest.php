<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MealLogStoreRequest extends FormRequest
{

    public function rules(): array
    {
        return [
            'log_date' => ['required','date_format:Y-m-d'],
            'notes'    => ['nullable','string','max:5000'],
            'details'  => ['array'],
            'details.*.meal_type'     => ['required','in:breakfast,lunch,dinner,snack'],
            'details.*.ingredient_id' => ['nullable','integer','exists:ingredients,id'],
            'details.*.recipe_id'     => ['nullable','integer','exists:recipes,id'],
            'details.*.servings'      => ['nullable','numeric','min:0'],
            'details.*.grams'         => ['nullable','numeric','min:0'],
            'details.*.logged_at'     => ['nullable','date_format:Y-m-d H:i:s'],

            'user_id' => ['prohibited'],
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
        public function authorize(): bool { return true; } 
}
