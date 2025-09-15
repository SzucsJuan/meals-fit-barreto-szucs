<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ingredient extends Model
{
    protected $fillable = [
        'name','serving_size','serving_unit','calories','protein','carbs','fat',
        'is_verified','created_by'
    ];

    protected $casts = [
        'serving_size' => 'float',
        'calories'     => 'float',
        'protein'      => 'float',
        'carbs'        => 'float',
        'fat'          => 'float',
        'is_verified'  => 'boolean',
    ];

    public function recipes(): BelongsToMany
    {
        return $this->belongsToMany(Recipe::class, 'recipe_ingredient')
                    ->withPivot(['quantity','unit','notes'])
                    ->withTimestamps();
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
