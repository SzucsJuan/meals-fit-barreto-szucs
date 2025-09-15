<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MealDetailUpdateRequest extends FormRequest
{
    public function authorize(): bool { return auth()->check(); }

    public function rules(): array
    {
        return [
            'meal_type' => ['sometimes','in:breakfast,lunch,dinner,snack'],
            'ingredient_id' => ['sometimes','exists:ingredients,id'], // opcional en update
            'servings' => ['sometimes','numeric','min:0.001'],
            'grams' => ['nullable','numeric','min:0.01'],
        ];
    }
}
