<?php


namespace App\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;


class MealLogUpdateRequest extends FormRequest
{
public function authorize(): bool { return auth()->check(); }


public function rules(): array
{
return [
'notes' => ['nullable','string','max:255'],
];
}
}