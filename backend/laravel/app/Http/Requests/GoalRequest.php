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
            'mode' => 'required|in:maintenance,gain,loss',
            'experience' => 'required|in:beginner,advanced,professional',
            'activity_level' => 'required|in:sedentary,light,moderate,high,athlete',
        ];
    }
}
