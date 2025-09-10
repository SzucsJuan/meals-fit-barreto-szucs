<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MealDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'meal_log_id',
        'meal_type',
        'food_name',
        'calories',
        'protein',
        'carbohydrates',
        'fats',
        'quantity',
    ];

    public function mealLog()
    {
        return $this->belongsTo(MealLog::class);
    }
}