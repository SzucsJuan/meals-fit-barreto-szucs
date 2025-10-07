<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string $requiredRole)
    {
        $user = $request->user();
        if (!$user || $user->role !== $requiredRole) {
            abort(403, 'Forbidden.');
        }
        return $next($request);
    }
}
