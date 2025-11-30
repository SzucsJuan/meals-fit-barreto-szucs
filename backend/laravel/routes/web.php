<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes (SPA + vistas)
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return view('welcome');
});


Route::post('/login', [AuthController::class, 'login']); // va con middleware 'web' por defecto

Route::post('/logout', function (Request $request) {
    Auth::guard('web')->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return response()->noContent();
})->middleware(['web', 'auth']);

/**
 
Ruta de debug */
Route::get('/debug-auth', function (Request $request) {
    return response()->json([
        'authenticated' => Auth::check(),
        'via_remember'  => Auth::viaRemember(),
        'user' => Auth::user() ? [
            'id'    => Auth::user()->id,
            'name'  => Auth::user()->name,
            'email' => Auth::user()->email,
        ] : null,
        'session_id' => $request->session()->getId(),
        'cookies'    => array_keys($request->cookies->all()),
    ]);
})->middleware(['web', 'auth']);