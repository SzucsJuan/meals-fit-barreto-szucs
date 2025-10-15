<?php
namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class FavoriteController extends Controller
{
    // GET /api/me/favorites
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user(); // idéntico a Auth::user(), pero tipa mejor

        $recipes = $user->favorites()
            ->select('recipes.*')
            ->with(['user:id,name'])
            ->orderBy('favorites.created_at', 'desc') // OK
            ->paginate($request->integer('per_page', 12));

        $recipes->getCollection()->transform(function ($r) {
            $r->is_favorited = true;
            return $r;
        });

        return response()->json($recipes);
    }

    // POST /api/recipes/{recipe}/favorite
    public function store(Recipe $recipe)
    {
        $user = auth()->user();

        Favorite::firstOrCreate([
            'user_id' => $user->id,
            'recipe_id' => $recipe->id,
        ]);

        return response()->json([
            'ok' => true,
            'recipe_id' => $recipe->id,
            'is_favorited' => true,
        ], 201);
    }

    // DELETE /api/recipes/{recipe}/favorite
    public function destroy(Recipe $recipe)
    {
        $user = auth()->user();

        Favorite::where('user_id', $user->id)
            ->where('recipe_id', $recipe->id)
            ->delete();

        return response()->json([
            'ok' => true,
            'recipe_id' => $recipe->id,
            'is_favorited' => false,
        ]);
    }
}