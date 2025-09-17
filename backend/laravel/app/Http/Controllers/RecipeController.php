<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use App\Http\Requests\{RecipeStoreRequest, RecipeUpdateRequest};

class RecipeController extends Controller
{
    // GET /api/recipes?q=&per_page=&order=
    public function index(Request $request)
    {
        $q       = trim((string) $request->query('q', ''));
        $perPage = (int) $request->query('per_page', 15);
        $order   = $request->query('order', 'latest'); // latest|rating|calories|protein|carbs|fat

        $query = Recipe::query()
            ->with(['user:id,name', 'ingredients:id,name'])
            ->withAvg('votes as avg_rating', 'rating')
            ->withCount(['votes', 'favoritedBy'])
            ->where('visibility', 'public');

        // filtro de búsqueda: título/descr o nombre de ingrediente
        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('title', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%")
                    ->orWhereHas('ingredients', function ($qIng) use ($q) {
                        $qIng->where('name', 'like', "%{$q}%");
                    });
            });
        }

        switch ($order) {
            case 'rating':
                $query->orderByDesc('avg_rating')->orderByDesc('id');
                break;
            case 'calories':
            case 'protein':
            case 'carbs':
            case 'fat':
                $query->orderByDesc($order)->orderByDesc('id');
                break;
            default:
                $query->latest(); // created_at desc
        }

        return $query->paginate($perPage);
    }

    // GET
    public function show(Recipe $recipe)
    {
        // $this->authorize('view', $recipe); // descomentalo cuando tengas auth/policies
        abort_unless($recipe->visibility === 'public', 404);

        return $recipe->load(['user:id,name', 'ingredients:id,name'])
            ->loadCount(['votes', 'favoritedBy'])
            ->loadAvg('votes as avg_rating', 'rating');
    }

    // POST
    public function store(RecipeStoreRequest $request)
    {
        // Con auth:
        // $recipe = $request->user()->recipes()->create($request->validated());

        // Sin auth (dev): usar un user_id fijo
        $data = $request->validated();
        $data['user_id'] = $data['user_id'] ?? 1; // ⚠️ solo para desarrollo
        $recipe = Recipe::create($data);

        return response()->json($recipe, 201);
    }

    // PUT
    public function update(RecipeUpdateRequest $request, Recipe $recipe)
    {
        // $this->authorize('update', $recipe); // descomentar con auth
        $recipe->update($request->validated());
        return $recipe;
    }

    // DELETE
    public function destroy(Recipe $recipe)
    {
        // $this->authorize('delete', $recipe); // descomentar con auth
        $recipe->delete();
        return response()->noContent();
    }
}
