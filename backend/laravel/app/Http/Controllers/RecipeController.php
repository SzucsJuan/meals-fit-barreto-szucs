<?php


namespace App\Http\Controllers;


use App\Models\Recipe;
use App\Http\Requests\{RecipeStoreRequest, RecipeUpdateRequest};
use Illuminate\Http\Request;


class RecipeController extends Controller
{
public function index(Request $request)
{
return Recipe::with(['user:id,name','ingredients:id,name'])
->withAvg('votes as avg_rating','rating')
->withCount(['votes','favoritedBy'])
->where('visibility','public')
->latest()
->paginate(15);
}


public function show(Recipe $recipe)
{
$this->authorize('view',$recipe);
return $recipe->load(['user:id,name','ingredients:id,name'])
->loadCount(['votes','favoritedBy'])
->loadAvg('votes as avg_rating','rating');
}


public function store(RecipeStoreRequest $request)
{
$recipe = $request->user()->recipes()->create($request->validated());
return response()->json($recipe,201);
}


public function update(RecipeUpdateRequest $request, Recipe $recipe)
{
$this->authorize('update',$recipe);
$recipe->update($request->validated());
return $recipe;
}


public function destroy(Recipe $recipe)
{
$this->authorize('delete',$recipe);
$recipe->delete();
return response()->noContent();
}
}