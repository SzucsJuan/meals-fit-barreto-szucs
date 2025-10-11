<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use App\Http\Controllers\{
    FavoriteController,
    VoteController,
    MealLogController,
    MealDetailController,
    IngredientController,
    RecipeController,
    AuthController,
};

// --------- Auth de SPA (cookie de sesión) -----------
// Añadimos 'no-store' acá también
Route::middleware([EnsureFrontendRequestsAreStateful::class, 'auth:sanctum', 'no-store'])
    ->get('/user', fn (Request $request) => $request->user());

// Si usás registro por API pública:
Route::post('register', [AuthController::class, 'register']);

// ===================== RUTAS PROTEGIDAS =====================
Route::middleware([EnsureFrontendRequestsAreStateful::class, 'auth:sanctum', 'no-store'])->group(function () {

    Route::apiResource('recipes', RecipeController::class)->only(['index', 'show', 'store', 'update', 'destroy']);

    Route::apiResource('ingredients', IngredientController::class)->only(['index', 'show', 'store']);

    Route::apiResource('meals', MealLogController::class)->only(['index', 'show', 'store']);
    Route::apiResource('meal-details', MealDetailController::class)->only(['destroy', 'update']);
    Route::get('meal-logs/weekly', [MealLogController::class, 'weekly'])->name('meal-logs.weekly');
});

// ===================== RUTAS ADMIN =====================
Route::middleware([EnsureFrontendRequestsAreStateful::class, 'auth:sanctum', 'role:admin', 'no-store'])->group(function () {
    // admin...
});
