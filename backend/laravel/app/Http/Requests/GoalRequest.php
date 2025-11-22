<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GoalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'mode'           => 'required|in:maintenance,gain,loss,maintain,lose',
            'experience'     => 'required|in:beginner,advanced,professional',
            'activity_level' => 'required|in:sedentary,light,moderate,high,athlete',

            'age'    => 'nullable|integer|min:10|max:100',
            'weight' => 'nullable|numeric|min:20|max:400',   
            'height' => 'nullable|numeric|min:100|max:250',  
        ];
    }

    protected function prepareForValidation(): void
    {
        $mode = $this->input('mode');
        $map = ['maintain' => 'maintenance', 'lose' => 'loss', 'gain' => 'gain'];
        if (isset($map[$mode])) {
            $this->merge(['mode' => $map[$mode]]);
        }
    }
}
