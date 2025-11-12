<?php

namespace App\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;


class RecipeUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
        //return auth()->check();
    }


    public function rules(): array
    {
        $routeParam = $this->route('recipe');
        $id = is_object($routeParam) ? ($routeParam->id ?? null) : $routeParam; 


        return [
            'title' => ['sometimes', 'string', 'max:180'],
            'slug' => ['nullable', 'string', 'max:200', 'unique:recipes,slug,' . $routeParam->id],
            'description' => ['nullable', 'string'],
            'steps' => ['nullable', 'string'],
            'visibility' => 'sometimes|in:public,private',
            'servings' => ['sometimes', 'numeric', 'min:0.1'],
            'prep_time_minutes' => ['sometimes', 'integer', 'min:0'],
            'cook_time_minutes' => ['sometimes', 'integer', 'min:0'],
            'image_url' => ['nullable', 'string', 'max:255'],

            'ingredients' => 'sometimes|array',
            'ingredients.*.ingredient_id' => 'required_with:ingredients|integer|exists:ingredients,id',
            'ingredients.*.quantity'      => 'required_with:ingredients|numeric|min:0.01',
            'ingredients.*.unit'          => 'required_with:ingredients|in:g,ml,unit',
            'ingredients.*.notes'         => 'sometimes|nullable|string|max:255',
        ];
    }
}
