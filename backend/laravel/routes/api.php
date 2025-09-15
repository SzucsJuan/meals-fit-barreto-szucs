<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    FavoriteController, VoteController,
    MealLogController, MealDetailController, 
    IngredientController, RecipeController
};

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->apiResource('recipes', RecipeController::class);
Route::middleware('auth:sanctum')->apiResource('meal-logs', MealLogController::class);
Route::middleware('auth:sanctum')->apiResource('meal-details', MealDetailController::class)->only(['store','destroy','update']);

Route::post('votes', [VoteController::class, 'store']);
Route::post('recipes/{recipe}/favorite', [FavoriteController::class, 'toggle']);
Route::get('/ingredients', [IngredientController::class, 'index']);