<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo};

class MealDetail extends Model
{
    protected $fillable = [
        'meal_log_id','meal_type','ingredient_id','recipe_id','servings','grams',
        'calories','protein','carbs','fat','logged_at'
    ];

    protected $casts = ['logged_at' => 'datetime'];

    public function log(): BelongsTo
    {
        return $this->belongsTo(MealLog::class, 'meal_log_id');
    }

    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(Ingredient::class);
    }

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }
}
