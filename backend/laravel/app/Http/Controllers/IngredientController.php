<?php


namespace App\Http\Controllers;


use App\Models\Ingredient;
use App\Http\Requests\{IngredientStoreRequest, IngredientUpdateRequest};


class IngredientController extends Controller
{
public function index(){ return Ingredient::paginate(20); }


public function store(IngredientStoreRequest $request){
return Ingredient::create($request->validated());
}


public function show(Ingredient $ingredient){ return $ingredient; }


public function update(IngredientUpdateRequest $request, Ingredient $ingredient){
$ingredient->update($request->validated());
return $ingredient;
}


public function destroy(Ingredient $ingredient){
$ingredient->delete();
return response()->noContent();
}
}