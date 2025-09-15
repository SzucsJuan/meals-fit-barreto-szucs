<?php


namespace App\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;


class IngredientStoreRequest extends FormRequest
{
public function authorize(): bool { return auth()->check(); }


public function rules(): array
{
return [
'name' => ['required','string','max:150'],
'serving_size' => ['required','numeric','min:0.1'],
'serving_unit' => ['required','in:g,ml,unit'],
'calories' => ['required','numeric','min:0'],
'protein' => ['required','numeric','min:0'],
'carbs' => ['required','numeric','min:0'],
'fat' => ['required','numeric','min:0'],
'is_verified' => ['sometimes','boolean'],
];
}
}
