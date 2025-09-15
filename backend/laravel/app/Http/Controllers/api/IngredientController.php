<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\IngredientResource;
use App\Models\Ingredient;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    public function index(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $perPage = (int) $request->input('per_page', 20);

        $query = Ingredient::query();

        if ($q !== '') {
            $query->where('name', 'like', "%{$q}%");
        }

        $ingredients = $query->orderBy('name')->paginate($perPage);

        return IngredientResource::collection($ingredients);
    }
}
