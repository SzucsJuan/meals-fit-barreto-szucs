<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserNutritionPlan extends Model
{
    protected $fillable = [
        'user_id','mode','experience','activity_level',
        'bmr','tdee','calorie_target','protein_g','fat_g','carbs_g','fiber_g','water_l',
        'generated_by','ai_model','prompt_snapshot','ai_raw_json','version','effective_from','notes',
    ];

    protected $casts = [
        'bmr' => 'float',
        'tdee' => 'float',
        'calorie_target' => 'float',
        'protein_g' => 'float',
        'fat_g' => 'float',
        'carbs_g' => 'float',
        'fiber_g' => 'float',
        'water_l' => 'float',
        'ai_raw_json' => 'array',
        'effective_from' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
