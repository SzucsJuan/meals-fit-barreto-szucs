<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{
    BelongsTo, BelongsToMany, HasMany
};
use InvalidArgumentException;
use Illuminate\Support\Facades\Storage;

class Recipe extends Model
{
    protected $fillable = [
        'user_id','title','slug','description','steps','visibility',
        'servings','prep_time_minutes','cook_time_minutes','image_url',
        'calories','protein','carbs','fat'
    ];

    protected $appends = ['image_url']; // si usás accessor de imagen (opcional)

    /** Relaciones **/
    public function user(): BelongsTo { return $this->belongsTo(User::class); }

    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'recipe_ingredient')
            ->withPivot(['quantity','unit','notes'])
            ->withTimestamps();
    }

    public function voters(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'votes')
            ->withPivot('rating')->withTimestamps();
    }

    public function votes(): HasMany { return $this->hasMany(Vote::class); }

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

    /* ============================= */
    /* ======= MACROS CÁLCULO ====== */
    /* ============================= */

    /**
     * Calcula los macros de la receta sumando los ingredientes según sus cantidades en la pivot.
     *
     * @param  bool $perServing          Si true, divide los totales por $this->servings (si > 0).
     * @param  bool $ignoreUnitMismatch  Si true, ignora ingredientes con unidad distinta a la definida en el ingrediente.
     *                                   Si false (default), lanza excepción si hay desajuste de unidades.
     * @return array{calories:float, protein:float, carbs:float, fat:float}
     */
    public function calculateMacros(bool $perServing = false, bool $ignoreUnitMismatch = false): array
    {
        // Cargamos solo lo necesario si aún no está cargado
        $this->loadMissing(['ingredients' => function ($q) {
            $q->select('ingredients.id','name','serving_size','serving_unit','calories','protein','carbs','fat');
        }]);

        $totals = [
            'calories' => 0.0,
            'protein'  => 0.0,
            'carbs'    => 0.0,
            'fat'      => 0.0,
        ];

        foreach ($this->ingredients as $ing) {
            $qty  = (float) ($ing->pivot->quantity ?? 0);
            $unit = (string) ($ing->pivot->unit ?? '');

            // Validación de unidad: SIN conversiones automáticas (g ↔ ml necesitan densidad)
            if ($unit !== $ing->serving_unit) {
                if ($ignoreUnitMismatch) {
                    // Simplemente salteamos este ingrediente
                    continue;
                }
                throw new InvalidArgumentException(
                    "Unidad incompatible para {$ing->name}: en receta '{$unit}' vs ingrediente '{$ing->serving_unit}'"
                );
            }

            // Factor de escala: cuánto de la porción base estamos usando
            $serving = (float) ($ing->serving_size ?: 0);
            if ($serving <= 0) {
                // Evitamos división por 0: si el serving del ingrediente es 0 o null, asumimos 1
                $serving = 1.0;
            }

            $factor = $qty / $serving;

            $totals['calories'] += (float)$ing->calories * $factor;
            $totals['protein']  += (float)$ing->protein  * $factor;
            $totals['carbs']    += (float)$ing->carbs    * $factor;
            $totals['fat']      += (float)$ing->fat      * $factor;
        }

        // Si se pide por porción y la receta declara "servings"
        if ($perServing && (int)$this->servings > 0) {
            $totals['calories'] /= (int)$this->servings;
            $totals['protein']  /= (int)$this->servings;
            $totals['carbs']    /= (int)$this->servings;
            $totals['fat']      /= (int)$this->servings;
        }

        // Redondeamos a 2 decimales para presentación/consistencia
        foreach ($totals as $k => $v) {
            $totals[$k] = round((float)$v, 2);
        }

        return $totals;
    }

    /**
     * Recalcula macros (totales) y los guarda en la receta (campos calories/protein/carbs/fat).
     * Por convención se guardan los **totales de la receta completa**.
     *
     * @param  bool $ignoreUnitMismatch  Igual que en calculateMacros()
     * @return $this
     */
    public function recomputeMacrosAndSave(bool $ignoreUnitMismatch = false): self
    {
        $totals = $this->calculateMacros(perServing: false, ignoreUnitMismatch: $ignoreUnitMismatch);

        $this->fill([
            'calories' => $totals['calories'],
            'protein'  => $totals['protein'],
            'carbs'    => $totals['carbs'],
            'fat'      => $totals['fat'],
        ])->save();

        return $this->refresh();
    }

    //=== (opcional) accessor de imagen si usás storage público ===
    
    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? Storage::url($this->image_path) : null;
    }
}
