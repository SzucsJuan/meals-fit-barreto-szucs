<?php


namespace App\Http\Controllers;


use App\Models\MealDetail;
use App\Http\Requests\{MealDetailStoreRequest, MealDetailUpdateRequest};


class MealDetailController extends Controller
{
public function store(MealDetailStoreRequest $request){
return MealDetail::create($request->validated());
}


public function update(MealDetailUpdateRequest $request, MealDetail $mealDetail){
$mealDetail->update($request->validated());
return $mealDetail;
}


public function destroy(MealDetail $mealDetail){
$mealDetail->delete();
return response()->noContent();
}
}