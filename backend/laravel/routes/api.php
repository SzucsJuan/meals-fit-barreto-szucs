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
Route::middleware([EnsureFrontendRequestsAreStateful::class, 'auth:sanctum'])
    ->get('/user', fn (Request $request) => $request->user());

// Registro (login/logout están en web.php)
Route::post('register', [AuthController::class, 'register']);


// ===================== RUTAS PÚBLICAS =====================
// Lectura de recetas e ingredientes
Route::apiResource('recipes', RecipeController::class)->only(['index', 'show']);
Route::apiResource('ingredients', IngredientController::class)->only(['index', 'show']);


// ===================== RUTAS PROTEGIDAS =====================
Route::middleware([EnsureFrontendRequestsAreStateful::class, 'auth:sanctum'])->group(function () {

    Route::apiResource('recipes', RecipeController::class)->only(['store', 'update', 'destroy']);

    Route::get('meal-logs/weekly', [MealLogController::class, 'weekly'])->name('meal-logs.weekly');
    Route::apiResource('meal-logs', MealLogController::class)->only(['index', 'show', 'store']);
    Route::apiResource('meal-details', MealDetailController::class)->only(['destroy', 'update']);

    // Route::apiResource('meal-details', MealDetailController::class)->only(['store','destroy','update']);

    // Acciones de usuario
    // Route::post('votes', [VoteController::class, 'store']);
    // Route::post('recipes/{recipe}/favorite', [FavoriteController::class, 'toggle']);
});


// ===================== RUTAS ADMIN =====================
Route::middleware([EnsureFrontendRequestsAreStateful::class, 'auth:sanctum', 'role:admin'])->group(function () {
    
});



