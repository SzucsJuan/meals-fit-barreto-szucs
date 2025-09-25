<?php


namespace App\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;


class RecipeStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
        //return auth()->check();
    }

    

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:180'],
            'slug' => ['nullable', 'string', 'max:200', 'unique:recipes,slug'],
            'description' => ['nullable', 'string'],
            'steps' => ['nullable', 'string'],
            'visibility' => ['nullable', 'in:public,unlisted,private'],
            'servings' => ['nullable', 'numeric', 'min:0.1'],
            'prep_time_minutes' => ['nullable', 'integer', 'min:0'],
            'cook_time_minutes' => ['nullable', 'integer', 'min:0'],
            'image_url' => ['nullable', 'string', 'max:255'],

            'ingredients' => 'array',
            'ingredients.*.ingredient_id' => 'required|integer|exists:ingredients,id',
            'ingredients.*.quantity'      => 'required|numeric|min:0.01',
            'ingredients.*.unit'          => 'required|in:g,ml,unit',
            'ingredients.*.notes'         => 'nullable|string|max:255',
        ];
    }
}