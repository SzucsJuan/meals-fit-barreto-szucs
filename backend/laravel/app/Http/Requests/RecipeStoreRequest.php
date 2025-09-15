<?php


namespace App\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;


class RecipeStoreRequest extends FormRequest
{
public function authorize(): bool { return auth()->check(); }


public function rules(): array
{
return [
'title' => ['required','string','max:180'],
'slug' => ['nullable','string','max:200','unique:recipes,slug'],
'description' => ['nullable','string'],
'steps' => ['nullable','string'],
'visibility' => ['nullable','in:public,unlisted,private'],
'servings' => ['nullable','numeric','min:0.1'],
'prep_time_minutes' => ['nullable','integer','min:0'],
'cook_time_minutes' => ['nullable','integer','min:0'],
'image_url' => ['nullable','string','max:255'],
];
}
}