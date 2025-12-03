<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController; 

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

// Login/Logout
Route::post('/login', [AuthController::class, 'login']);     // SIN auth

Route::post('/logout', function (Illuminate\Http\Request $request) {
    Auth::guard('web')->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return response()->noContent();
})->middleware(['auth', 'web']);



// RUTAS QUE SE USARON PARA TESTING - DEBUG

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
})->middleware('web', 'auth');


