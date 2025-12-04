<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\{
    BelongsTo,
    BelongsToMany,
    HasMany
};
use Illuminate\Database\Eloquent\Factories\HasFactory;
use InvalidArgumentException;
use Illuminate\Support\Facades\Storage;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'description',
        'steps',
        'visibility',
        'servings',
        'prep_time_minutes',
        'cook_time_minutes',
        'image_disk',
        'image_path',
        'image_thumb_path',
        'image_webp_path',
        'image_width',
        'image_height',
        'calories',
        'protein',
        'carbs',
        'fat'
    ];

    protected $casts = [
        'calories'          => 'float',
        'protein'           => 'float',
        'carbs'             => 'float',
        'fat'               => 'float',
        'servings'          => 'integer',
        'image_width'       => 'integer',
        'image_height'      => 'integer',
        'is_favorited'      => 'boolean',
    ];

    protected $hidden = [
        'image_disk',
        'image_path',
        'image_thumb_path',
        'image_webp_path',
    ];

    protected $appends = ['image_url', 'image_thumb_url', 'image_webp_url'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'recipe_ingredient')
            ->using(RecipeIngredient::class)
            ->withPivot(['quantity', 'unit', 'notes'])
            ->withTimestamps();
    }

    public function voters(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'votes')
            ->withPivot('rating')->withTimestamps();
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    public function favoredBy()
    {
        return $this->belongsToMany(User::class, 'favorites')
            ->withPivot('created_at');
    }

    public function scopeWithIsFavorited($query, ?int $userId)
    {
        return $query->when($userId, function ($q) use ($userId) {
            $q->addSelect([
                'is_favorited' => \App\Models\Favorite::query()
                    ->selectRaw('1')
                    ->whereColumn('favorites.recipe_id', 'recipes.id')
                    ->where('favorites.user_id', $userId)
                    ->limit(1)
            ]);
        });
    }

    public function scopePublic($q)
    {
        return $q->where('visibility', 'public');
    }
    public function scopePrivate($q)
    {
        return $q->where('visibility', 'private');
    }

    public function averageRating(): float
    {
        return (float) ($this->votes()->avg('rating') ?? 0);
    }

    //Cálculo de macros

    public function calculateMacros(bool $perServing = false, bool $ignoreUnitMismatch = false): array
    {
        $this->loadMissing([
            'ingredients' => function ($q) {
                $q->select('ingredients.id', 'name', 'serving_size', 'serving_unit', 'calories', 'protein', 'carbs', 'fat');
            }
        ]);

        $totals = ['calories' => 0.0, 'protein' => 0.0, 'carbs' => 0.0, 'fat' => 0.0];

        foreach ($this->ingredients as $ing) {
            $qty = (float) ($ing->pivot->quantity ?? 0);
            $unit = (string) ($ing->pivot->unit ?? '');

            if ($unit !== $ing->serving_unit) {
                if ($ignoreUnitMismatch)
                    continue;
                throw new InvalidArgumentException(
                    "Unidad incompatible para {$ing->name}: en receta '{$unit}' vs ingrediente '{$ing->serving_unit}'"
                );
            }

            $serving = (float) ($ing->serving_size ?: 1.0);
            $factor = $qty / $serving;

            $totals['calories'] += (float) $ing->calories * $factor;
            $totals['protein'] += (float) $ing->protein * $factor;
            $totals['carbs'] += (float) $ing->carbs * $factor;
            $totals['fat'] += (float) $ing->fat * $factor;
        }

        if ($perServing && (int) $this->servings > 0) {
            $totals['calories'] /= (int) $this->servings;
            $totals['protein'] /= (int) $this->servings;
            $totals['carbs'] /= (int) $this->servings;
            $totals['fat'] /= (int) $this->servings;
        }

        foreach ($totals as $k => $v)
            $totals[$k] = round((float) $v, 2);
        return $totals;
    }

    public function recomputeMacrosAndSave(bool $ignoreUnitMismatch = false): self
    {
        $totals = $this->calculateMacros(false, $ignoreUnitMismatch);
        $this->fill($totals)->save();
        return $this->refresh();
    }

    // Slugs

 protected static function booted(): void
{
    static::creating(function (Recipe $recipe) {
        if (empty($recipe->slug)) {
            $recipe->slug = static::makeUniqueSlug($recipe->title);
        }
    });

    static::updating(function (Recipe $recipe) {
        $titleChanged = $recipe->isDirty('title');
        $slugProvided = $recipe->isDirty('slug') && !empty($recipe->slug);

        if ($titleChanged && !$slugProvided) {
            $recipe->slug = static::makeUniqueSlug($recipe->title, $recipe->id);
        }
    });

    // Cuando se borra la receta, también se eliminan imágenes
    static::deleting(function (Recipe $recipe) {
        if (!$recipe->image_disk) {
            return;
        }

        // Cloudinary: usamos la API, no Storage
        if ($recipe->image_disk === 'cloudinary') {
            try {
                Cloudinary::destroy($recipe->image_path);
            } catch (\Throwable $e) {
                // no rompemos el delete si falla
            }
            return;
        }

        // Legacy: imágenes en disco local / S3, etc.
        $disk = $recipe->image_disk;

        foreach (['image_path', 'image_thumb_path', 'image_webp_path'] as $col) {
            $p = $recipe->{$col};
            if ($p && Storage::disk($disk)->exists($p)) {
                Storage::disk($disk)->delete($p);
            }
        }
    });
}

    protected static function makeUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'recipe';
        $slug = $base;
        $i = 1;

        while (
            static::query()
            ->when($ignoreId, fn($q) => $q->where('id', '!=', $ignoreId))
            ->where('slug', $slug)
            ->exists()
        ) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }


    /* ============================= */
    /* ======= ACCESSORS URL ======= */
    /* ============================= */


    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_disk || !$this->image_path) {
            return null;
        }

        // Cuando viene de Cloudinary, usamos directamente el facade
        if ($this->image_disk === 'cloudinary') {
            return Cloudinary::getUrl($this->image_path, [
                'quality'      => 'auto:good',
                'fetch_format' => 'auto',
            ]);
        }

        // Imágenes locales (legacy)
        return Storage::disk($this->image_disk)->url($this->image_path);
    }

    public function getImageThumbUrlAttribute(): ?string
    {
        if (!$this->image_disk || !$this->image_path) {
            return null;
        }

        if ($this->image_disk === 'cloudinary') {
            return Cloudinary::getUrl($this->image_path, [
                'width'        => 512,
                'crop'         => 'limit',
                'quality'      => 'auto:good',
                'fetch_format' => 'auto',
            ]);
        }

        if ($this->image_thumb_path) {
            return Storage::disk($this->image_disk)->url($this->image_thumb_path);
        }

        // fallback razonable
        return $this->image_url;
    }

    public function getImageWebpUrlAttribute(): ?string
    {
        if (!$this->image_disk || !$this->image_path) {
            return null;
        }

        if ($this->image_disk === 'cloudinary') {
            return Cloudinary::getUrl($this->image_path, [
                'fetch_format' => 'webp',
                'quality'      => 'auto:good',
            ]);
        }

        if ($this->image_webp_path) {
            return Storage::disk($this->image_disk)->url($this->image_webp_path);
        }

        return $this->image_url;
    }
