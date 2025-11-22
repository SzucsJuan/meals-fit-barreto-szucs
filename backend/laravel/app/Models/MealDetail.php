<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo};
use Carbon\Carbon;

class MealDetail extends Model
{
    protected $fillable = [
        'meal_log_id',
        'meal_type',
        'ingredient_id',
        'recipe_id',
        'servings',
        'grams',
        'calories',
        'protein',
        'carbs',
        'fat',
        'logged_at'
    ];

    protected $casts = [
        'servings' => 'float',
        'grams' => 'float',
        'calories' => 'float',
        'protein' => 'float',
        'carbs' => 'float',
        'fat' => 'float',
        'logged_at' => 'datetime',
    ];

        protected function userTz(): string
    {
        return config('app.timezone', 'UTC');
    }

    public function setLoggedAtAttribute($value): void
    {
        if (!$value) {
            $this->attributes['logged_at'] = null;
            return;
        }
        $local = Carbon::parse($value, $this->userTz());
        $this->attributes['logged_at'] = $local->clone()->setTimezone('UTC')->format('Y-m-d H:i:s');
    }

    public function getLoggedAtAttribute($value): ?string
    {
        if (!$value) return null;
        return Carbon::parse($value, 'UTC')->setTimezone($this->userTz())->format('Y-m-d H:i:s');
    }

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
