<?php


namespace App\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;


class VoteStoreRequest extends FormRequest
{
public function authorize(): bool { return auth()->check(); }


public function rules(): array
{
return [
'recipe_id' => ['required','exists:recipes,id'],
'rating' => ['required','integer','min:1','max:5'],
];
}
}
