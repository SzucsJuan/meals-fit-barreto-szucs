<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class RecipeIngredient extends Pivot
{
    protected $table = 'recipe_ingredient';
    public $timestamps = true;

    protected $fillable = ['recipe_id','ingredient_id','quantity','unit','notes'];

    protected static function booted(): void
    {
        static::saved(function (RecipeIngredient $pivot) {
            optional($pivot->recipe)->recomputeMacrosAndSave(true);
        });

        static::deleted(function (RecipeIngredient $pivot) {
            optional($pivot->recipe)->recomputeMacrosAndSave(true);
        });
    }

    public function recipe()
    {
        return $this->belongsTo(Recipe::class);
    }

    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class);
    }
}