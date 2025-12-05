<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    // GET /api/me/favorites
    public function index(Request $request)
    {
        $user = $request->user();
        abort_unless($user, 401);

        $perPage = (int) $request->query('per_page', 12);

        $recipes = $user->favorites()
            ->select('recipes.*')
            ->with(['user:id,name'])
            ->orderBy('favorites.created_at', 'desc')
            ->paginate($perPage);

        $recipes->getCollection()->transform(function ($r) {
            $r->is_favorited = true;
            return $r;
        });

        return response()->json($recipes);
    }

    // POST /api/recipes/{recipe}/favorite
    public function store(Request $request, Recipe $recipe)
    {
        $user = $request->user();
        abort_unless($user, 401);

        $user->favorites()->syncWithoutDetaching([$recipe->id]);

        return response()->json([
            'ok'           => true,
            'recipe_id'    => $recipe->id,
            'is_favorited' => true,
        ], 201);
    }

    // DELETE /api/recipes/{recipe}/favorite
    public function destroy(Request $request, Recipe $recipe)
    {
        $user = $request->user();
        abort_unless($user, 401);

        $user->favorites()->detach($recipe->id);

        return response()->json([
            'ok'           => true,
            'recipe_id'    => $recipe->id,
            'is_favorited' => false,
        ], 200);
    }
}
