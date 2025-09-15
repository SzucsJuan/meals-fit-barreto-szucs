<?php


namespace App\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;


class IngredientUpdateRequest extends FormRequest
{
public function authorize(): bool { return auth()->check(); }


public function rules(): array
{
return [
'name' => ['sometimes','string','max:150'],
'serving_size' => ['sometimes','numeric','min:0.1'],
'serving_unit' => ['sometimes','in:g,ml,unit'],
'calories' => ['sometimes','numeric','min:0'],
'protein' => ['sometimes','numeric','min:0'],
'carbs' => ['sometimes','numeric','min:0'],
'fat' => ['sometimes','numeric','min:0'],
'is_verified' => ['sometimes','boolean'],
];
}
}
