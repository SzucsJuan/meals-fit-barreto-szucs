<?php


namespace App\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;


class MealLogStoreRequest extends FormRequest
{
public function authorize(): bool { return auth()->check(); }


public function rules(): array
{
return [
'log_date' => ['required','date'],
'notes' => ['nullable','string','max:255'],
];
}
}
