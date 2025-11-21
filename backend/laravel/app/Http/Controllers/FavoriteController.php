<?php
namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\AchievementService;


class FavoriteController extends Controller
{
    // GET /api/me/favorites
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user(); // idéntico a Auth::user(), pero tipa mejor

        $perPage = (int) $request->query('per_page', 12);

        $recipes = $user->favorites()
            ->select('recipes.*')
            ->with(['user:id,name'])
            ->orderBy('favorites.created_at', 'desc') // OK
            ->paginate($perPage);

        $recipes->getCollection()->transform(function ($r) {
            $r->is_favorited = true;
            return $r;
        });

        return response()->json($recipes);
    }

    // POST /api/recipes/{recipe}/favorite
    public function store(
        Request $request,
        Recipe $recipe,
        AchievementService $achievementService
    ) {
        $user = $request->user();
        
        if ($recipe->user_id === $user->id) {
            return response()->json([
                'ok' => false,
               'message' => 'No puedes agregar a favoritos tu propia receta.',
            ], 422);
        }

        // ¿Ya existe el favorito?
        $existing = Favorite::where('user_id', $user->id)
            ->where('recipe_id', $recipe->id)
            ->first();

        if ($existing) {
            // --> ya estaba en favoritos, lo quitamos (toggle off)
            $existing->delete();

            return response()->json([
                'ok' => true,
                'recipe_id' => $recipe->id,
                'is_favorited' => false,
            ], 200);
        }

        // --> no existía, lo agregamos (toggle on)
        Favorite::create([
            'user_id' => $user->id,
            'recipe_id' => $recipe->id,
        ]);

        // Chequear logro "community_helper"
        $achievementService->checkAfterFavoriteAdded($user);

        return response()->json([
            'ok' => true,
            'recipe_id' => $recipe->id,
            'is_favorited' => true,
        ], 201); // created
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