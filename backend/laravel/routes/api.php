<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use App\Http\Controllers\{
    FavoriteController,
    GoalsController,
    VoteController,
    MealLogController,
    MealDetailController,
    IngredientController,
    RecipeController,
    AuthController,
    RecipeImageController,
    AdminStatsController,
    AdminUserController,
    AdminRecipeController
};

// --------- Auth de SPA (cookie de sesión) -----------
// Añadimos 'no-store' acá también
Route::middleware([EnsureFrontendRequestsAreStateful::class, 'auth:sanctum', 'no-store'])
    ->get('/user', fn (Request $request) => $request->user());

// Si usás registro por API pública:
Route::post('register', [AuthController::class, 'register']);

// Forzamos que el parámetro {recipe} sea numérico en TODOS los endpoints
Route::pattern('recipe', '[0-9]+');

// ===================== RUTAS PROTEGIDAS =====================
Route::middleware([EnsureFrontendRequestsAreStateful::class, 'auth:sanctum', 'no-store'])->group(function () {

    Route::apiResource('recipes', RecipeController::class)->only(['index', 'show', 'store', 'update', 'destroy']);

    Route::post('/recipes/{recipe}/image', [RecipeImageController::class, 'store'])
        ->whereNumber('recipe');
    Route::delete('/recipes/{recipe}/image', [RecipeImageController::class, 'destroy'])
        ->whereNumber('recipe');

    Route::apiResource('ingredients', IngredientController::class)->only(['index', 'show', 'store']);

    Route::post('/me/goals', [GoalsController::class, 'store']);      
    Route::get('/me/goals/latest', [GoalsController::class, 'latest']); 

    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/recipes/{recipe}/favorite', [FavoriteController::class, 'store'])
    ->whereNumber('recipe');
    Route::delete('/recipes/{recipe}/favorite', [FavoriteController::class, 'destroy'])
    ->whereNumber('recipe');

    Route::apiResource('meals', MealLogController::class)->only(['index', 'show', 'store']);
    Route::apiResource('meal-details', MealDetailController::class)->only(['destroy', 'update']);
    Route::get('meal-logs/weekly', [MealLogController::class, 'weekly'])->name('meal-logs.weekly');
});

// ===================== RUTAS ADMIN =====================
Route::middleware([EnsureFrontendRequestsAreStateful::class, 'auth:sanctum', 'role:admin', 'no-store'])->group(function () {
    Route::get('/admin/stats', [AdminStatsController::class, 'index']);

    Route::get('/admin/users', [AdminUserController::class, 'index']);
    Route::post('/admin/users', [AdminUserController::class, 'store']);
    Route::patch('/admin/users/{user}', [AdminUserController::class, 'update']);
    Route::delete('/admin/users/{user}', [AdminUserController::class, 'destroy']);

    Route::get('/admin/recipes', [AdminRecipeController::class, 'index']);
    Route::patch('/admin/recipes/{recipe}', [AdminRecipeController::class, 'update']);
    Route::delete('/admin/recipes/{recipe}', [AdminRecipeController::class, 'destroy']);
});
