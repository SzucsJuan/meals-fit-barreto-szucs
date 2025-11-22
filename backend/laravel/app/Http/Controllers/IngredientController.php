<?php

namespace App\Http\Controllers;

use App\Http\Resources\IngredientResource;
use App\Http\Requests\{IngredientStoreRequest, IngredientUpdateRequest};
use App\Models\Ingredient;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    // GET /api/ingredients?q=&per_page=&order=
    public function index(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        $perPage = (int) $request->query('per_page', 20);
        $order = $request->query('order', 'name');

        $query = Ingredient::query();

        if ($q !== '') {
            $query->where('name', 'like', "%{$q}%");
        }

        if (in_array($order, ['name', 'calories', 'protein', 'carbs', 'fat'])) {
            $query->orderBy($order);
        } else {
            $query->orderBy('name');
        }

        $ingredients = $query->paginate($perPage);

        return IngredientResource::collection($ingredients);
    }

    public function store(IngredientStoreRequest $request)
    {
        $ingredient = Ingredient::create($request->validated());
        return (new IngredientResource($ingredient))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Ingredient $ingredient)
    {
        return new IngredientResource($ingredient);
    }

    public function update(IngredientUpdateRequest $request, Ingredient $ingredient)
    {
        $ingredient->update($request->validated());
        return new IngredientResource($ingredient);
    }

    // DELETE /api/ingredients/{ingredient}
    public function destroy(Ingredient $ingredient)
    {
        $ingredient->delete();
        return response()->noContent(); 
    }
}
