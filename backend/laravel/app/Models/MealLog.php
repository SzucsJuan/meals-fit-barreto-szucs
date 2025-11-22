<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{BelongsTo, HasMany};
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MealLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'log_date',
        'total_calories',
        'total_protein',
        'total_carbs',
        'total_fat',
        'notes'
    ];

    protected $casts = [
        'log_date' => 'date:Y-m-d',
        'total_calories' => 'float',
        'total_protein' => 'float',
        'total_carbs' => 'float',
        'total_fat' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function details(): HasMany
    {
        return $this->hasMany(MealDetail::class);
    }
}
