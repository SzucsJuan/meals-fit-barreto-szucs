<?php


namespace App\Http\Controllers;


use App\Models\MealLog;
use App\Models\User;
use App\Http\Requests\{MealLogStoreRequest, MealLogUpdateRequest};
use Illuminate\Auth\AuthenticationException;


class MealLogController extends Controller
{
public function index(){
return MealLog::with('details')->where('user_id',auth()->id())->paginate(15);
}


public function store(MealLogStoreRequest $request)
{
    $user = $request->user();

    if (! $user instanceof User) {
        throw new AuthenticationException();
    }

    return $user->mealLogs()->create($request->validated());
}


public function show(MealLog $mealLog){
$this->authorize('view',$mealLog);
return $mealLog->load('details');
}


public function update(MealLogUpdateRequest $request, MealLog $mealLog){
$this->authorize('update',$mealLog);
$mealLog->update($request->validated());
return $mealLog;
}


public function destroy(MealLog $mealLog){
$this->authorize('delete',$mealLog);
$mealLog->delete();
return response()->noContent();
}
}