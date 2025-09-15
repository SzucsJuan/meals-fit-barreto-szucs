<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class IngredientResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'serving_size' => $this->serving_size,
            'serving_unit' => $this->serving_unit,
            'calories'     => $this->calories,
            'protein'      => $this->protein,
            'carbs'        => $this->carbs,
            'fat'          => $this->fat,    
            'is_verified'  => $this->is_verified,
        ];
    }
}