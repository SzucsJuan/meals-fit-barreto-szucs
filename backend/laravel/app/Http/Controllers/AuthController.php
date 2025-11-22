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

        // Se regenera sesión para evitar falsos positivos
           if ($request->hasSession()) {
        $request->session()->regenerate();
           }

        $user = $request->user();

        $user->tokens()->delete(); // Se elimina tokens anteriores
        $token = $user->createToken('mobile')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' =>  $user,
        ], 200);
    }

    public function logout(Request $request)
    {
        if ($request->hasSession()) {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $forgetSession = Cookie::forget(config('session.cookie', 'laravel_session'));
        $forgetXSRF    = Cookie::forget('XSRF-TOKEN');
    }

        if ($request->user()) {
        $request->user()->currentAccessToken()?->delete();
    }

        return response()->json([
            'message' => 'Logged out',
        ], 200);

         if (isset($forgetSession, $forgetXSRF)) {
        $response = $response
            ->withCookie($forgetSession)
            ->withCookie($forgetXSRF);
    }

        return $response;
            
    }
    
    
}


