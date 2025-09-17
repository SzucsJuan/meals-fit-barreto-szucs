<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MealDetailStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'meal_log_id' => ['required', 'exists:meal_logs,id'],
            'meal_type' => ['nullable', 'in:breakfast,lunch,dinner,snack'],
            'ingredient_id' => ['required', 'exists:ingredients,id'], // ahora obligatorio
            'servings' => ['nullable', 'numeric', 'min:0.001'],
            'grams' => ['nullable', 'numeric', 'min:0.01'],
        ];
    }
}
