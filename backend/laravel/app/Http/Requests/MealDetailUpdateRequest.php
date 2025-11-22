<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MealDetailUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'meal_type'    => 'sometimes|in:breakfast,lunch,dinner,snack',
            'logged_at'    => 'sometimes|date',     
            'ingredient_id'=> 'sometimes|nullable|exists:ingredients,id',
            'grams'        => 'sometimes|nullable|numeric|min:0',
            'recipe_id'    => 'sometimes|nullable|exists:recipes,id',
            'servings'     => 'sometimes|nullable|numeric|min:0.01',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function($v){
            $data = $this->all();
            $hasIngredient = array_key_exists('ingredient_id',$data);
            $hasRecipe     = array_key_exists('recipe_id',$data);

           
            if ($hasIngredient && $hasRecipe && $data['ingredient_id'] && $data['recipe_id']) {
                $v->errors()->add('ingredient_id', 'No puede editarse como ingrediente y receta a la vez.');
                $v->errors()->add('recipe_id', 'No puede editarse como ingrediente y receta a la vez.');
                return;
            }

            if (($data['ingredient_id'] ?? null) && !isset($data['grams'])) {
                $v->errors()->add('grams','Para ingrediente, enviá "grams".');
            }

            if (($data['recipe_id'] ?? null) && !isset($data['servings'])) {
                $v->errors()->add('servings','Para receta, enviá "servings".');
            }
        });
    }
}