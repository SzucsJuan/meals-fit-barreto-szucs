<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    FavoriteController,
    VoteController,
    MealLogController,
    MealDetailController,
    IngredientController,
    RecipeController
};

// (opcional) endpoint de prueba de auth
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/**
 * --- RUTAS PÚBLICAS (sin auth) ---
 * Listado y detalle de recetas e ingredientes
 */
Route::apiResource('recipes', RecipeController::class)->only(['index','show', 'store', 'update', 'destroy']);
Route::apiResource('ingredients', IngredientController::class)->only(['index','show']);
// Route::apiResource('meal-logs', MealLogController::class);
Route::apiResource('meal-logs', MealLogController::class)->only(['index','show','store']);
Route::apiResource('meal-details', MealDetailController::class)->only(['destroy','update']);


/**
 * --- RUTAS PROTEGIDAS (con auth) ---
 * Crear/editar/borrar recetas e ingredientes
 * Crear/eliminar/actualizar meal logs/details
 * Votar y marcar favoritos
 */
// Route::middleware('auth:sanctum')->group(function () {
//     // CRUD parcial protegido
//     Route::apiResource('recipes', RecipeController::class)->only(['store','update','destroy']);
//     Route::apiResource('ingredients', IngredientController::class)->only(['store','update','destroy']);

//     // Meal logs / details
//     //Route::apiResource('meal-logs', MealLogController::class);
//     Route::apiResource('meal-details', MealDetailController::class)->only(['store','destroy','update']);

//     // Acciones de usuario
//     Route::post('votes', [VoteController::class, 'store']);
//     Route::post('recipes/{recipe}/favorite', [FavoriteController::class, 'toggle']);
// });
