<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{
    BelongsTo, BelongsToMany, HasMany
};

class Recipe extends Model
{
    protected $fillable = [
        'user_id','title','slug','description','steps','visibility',
        'servings','prep_time_minutes','cook_time_minutes','image_url',
        'calories','protein','carbs','fat'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'recipe_ingredient')
                    ->withPivot(['quantity','unit','notes'])
                    ->withTimestamps();
    }

    public function voters(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'votes')
                    ->withPivot('rating')
                    ->withTimestamps();
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }


    public function scopePublic($q){ return $q->where('visibility','public'); }
    public function scopeUnlisted($q){ return $q->where('visibility','unlisted'); }
    public function scopePrivate($q){ return $q->where('visibility','private'); }


    public function averageRating(): float
    {
        return (float) ($this->votes()->avg('rating') ?? 0);
    }
}
