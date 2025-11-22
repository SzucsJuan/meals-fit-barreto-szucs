<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\MealLog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;    

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $role   = $request->query('role');  
        $search = $request->query('search'); 

        $query = User::query()
            ->select('users.*')
            ->selectSub(
                MealLog::selectRaw('MAX(created_at)')
                    ->whereColumn('user_id', 'users.id'),
                'last_activity_at'
            )
            ->withCount([
                'recipes',
                'mealLogs as meals_logged_count',
            ])
            ->orderByDesc('created_at');

        if (in_array($role, ['admin', 'user'], true)) {
            $query->where('role', $role);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->get();

        $data = $users->map(function (User $u) {
            return [
                'id'                 => $u->id,
                'name'               => $u->name,
                'email'              => $u->email,
                'role'               => $u->role,
                'created_at'         => $u->created_at?->toIso8601String(),
                'joined_date'        => $u->created_at?->format('Y-m-d'),
                'recipes_count'      => $u->recipes_count ?? 0,
                'meals_logged_count' => $u->meals_logged_count ?? 0,
                'last_activity_at'   => $u->last_activity_at,
                'last_activity_date' => $u->last_activity_at
                    ? \Carbon\Carbon::parse($u->last_activity_at)->format('Y-m-d')
                    : null,
            ];
        });

        return response()->json($data);
    }

   public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role'  => ['required', 'in:admin,user'],
        ]);

        // Generar pass random
        $rawPassword = Str::random(12);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'role'     => $validated['role'],
            'password' => $rawPassword,
        ]);

        return response()->json([
            'user'     => $user,
            'password' => $rawPassword,
        ], 201);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'  => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255'],
            'role'  => ['sometimes', 'in:admin,user'],
        ]);

        $user->fill($validated);
        $user->save();

        return response()->json($user->only(['id', 'name', 'email', 'role']));
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->noContent();
    }
}
