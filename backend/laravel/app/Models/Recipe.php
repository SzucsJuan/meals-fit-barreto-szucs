<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category',
        'status',
        'prep_time',
        'cook_time',
        'servings',
        'calories',
        'proteins',
        'carbs',
        'fats',
        'image',
        'instructions',
        'creation_date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class, 'recipe_ingredients')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }

    public function mealLogs()
    {
        return $this->belongsToMany(MealLog::class, 'meal_log_recipes')
                    ->withPivot('servings')
                    ->withTimestamps();
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}