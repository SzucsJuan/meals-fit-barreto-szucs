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
            // Aceptamos tanto los valores del front como fallback en back:
            'mode'           => 'required|in:maintenance,gain,loss,maintain,lose',
            'experience'     => 'required|in:beginner,advanced,professional',
            'activity_level' => 'required|in:sedentary,light,moderate,high,athlete',

            // Datos personales opcionales (si llegan, se persisten en User)
            'age'    => 'nullable|integer|min:10|max:100',
            'weight' => 'nullable|numeric|min:20|max:400',   // kg
            'height' => 'nullable|numeric|min:100|max:250',  // cm
        ];
    }

    /** Normalizamos mode por si viene maintain/lose */
    protected function prepareForValidation(): void
    {
        $mode = $this->input('mode');
        $map = ['maintain' => 'maintenance', 'lose' => 'loss', 'gain' => 'gain'];
        if (isset($map[$mode])) {
            $this->merge(['mode' => $map[$mode]]);
        }
    }
}
