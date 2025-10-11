<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Cookie;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {    
        $data = $request->validated();

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => $data['password'], 
        ]);
        
        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user'  => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
        ], 201);
    }
    public function login(Request $request)
    {
        $creds = $request->validate([
            'email' => ['required','email'],
            'password' => ['required','string'],
        ]);

        if (!Auth::attempt($creds)) {
            return response()->json(['message' => 'Invalid credentials'], 422);
        }

        // Regenera la sesión para evitar fixation
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Logged in',
            'user' => Auth::user(),
        ], 200);
    }

    public function logout(Request $request)
    {
        // Cierra sesión del guard web
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $forgetSession = Cookie::forget(config('session.cookie', 'laravel_session'));
        $forgetXSRF    = Cookie::forget('XSRF-TOKEN');

        return response()->noContent()
            ->withCookie($forgetSession)
            ->withCookie($forgetXSRF);
    }
}


