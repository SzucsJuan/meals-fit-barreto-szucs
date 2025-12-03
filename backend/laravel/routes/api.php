<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    FavoriteController,
    AchievementController,
    GoalsController,
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

// ====================================================
//  AUTH API (tokens) – usado por Next y por mobile
// ====================================================

// Login que devuelve token (no usa cookies de sesión)
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Para tipar el parámetro {recipe}
Route::pattern('recipe', '[0-9]+');

// ====================================================
//  Rutas PROTEGIDAS por token Sanctum
// ====================================================

Route::middleware(['auth:sanctum', 'no-store'])->group(function () {

    // Usuario autenticado (para /me, etc.)
    Route::get('/user', fn (Request $request) => $request->user());

    // Logout de token (revoca el token actual)
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // ---------------- RECIPES ----------------
    Route::apiResource('recipes', RecipeController::class)
        ->only(['index', 'show', 'store', 'update', 'destroy']);

    Route::post('/recipes/{recipe}/image', [RecipeImageController::class, 'store'])
        ->whereNumber('recipe');
    Route::delete('/recipes/{recipe}/image', [RecipeImageController::class, 'destroy'])
        ->whereNumber('recipe');

    // ---------------- INGREDIENTS ----------------
    Route::apiResource('ingredients', IngredientController::class)
        ->only(['index', 'show', 'store']);

    // ---------------- GOALS (plan / metas) ----------------
    Route::post('/me/goals', [GoalsController::class, 'store']);
    Route::get('/me/goals/latest', [GoalsController::class, 'latest']);

    // ---------------- FAVORITES ----------------
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/recipes/{recipe}/favorite', [FavoriteController::class, 'store'])
        ->whereNumber('recipe');
    Route::delete('/recipes/{recipe}/favorite', [FavoriteController::class, 'destroy'])
        ->whereNumber('recipe');

    // ---------------- MEALS & MEAL DETAILS ----------------
    Route::apiResource('meals', MealLogController::class)
        ->only(['index', 'show', 'store']);

    Route::apiResource('meal-details', MealDetailController::class)
        ->only(['update', 'destroy']);

    Route::get('meal-logs/weekly', [MealLogController::class, 'weekly'])
        ->name('meal-logs.weekly');

    // ---------------- ACHIEVEMENTS ----------------
    Route::get('/me/achievements', [AchievementController::class, 'me']);

    // ---------------- ADMIN ----------------
    Route::middleware('role:admin')->prefix('admin')->group(function () {

        Route::get('/stats', [AdminStatsController::class, 'index']);

        // Users
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::post('/users', [AdminUserController::class, 'store']);
        Route::patch('/users/{user}', [AdminUserController::class, 'update']);
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);

        // Recipes
        Route::get('/recipes', [AdminRecipeController::class, 'index']);
        Route::patch('/recipes/{recipe}', [AdminRecipeController::class, 'update']);
        Route::delete('/recipes/{recipe}', [AdminRecipeController::class, 'destroy']);
    });
});
