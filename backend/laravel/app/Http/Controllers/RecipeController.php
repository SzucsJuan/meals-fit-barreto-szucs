<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use App\Services\RecipeService;
use App\Http\Requests\{RecipeStoreRequest, RecipeUpdateRequest};

class RecipeController extends Controller
{
    protected RecipeService $recipes;

    public function __construct(RecipeService $recipes)
    {
        $this->recipes = $recipes;
    }

    // GET /api/recipes?q=&per_page=&order=
    public function index(Request $request)
{
    $q       = trim((string) $request->query('q', ''));
    $perPage = (int) $request->query('per_page', 15);
    $order   = $request->query('order', 'latest'); // latest|rating|calories|protein|carbs|fat
    $user    = $request->user();

    $query = Recipe::query()
        ->with(['user:id,name', 'ingredients:id,name'])
        ->withAvg('votes as avg_rating', 'rating')
        ->withCount(['votes', 'favoritedBy'])
        // públicas o del dueño
        ->where(function($w) use ($user) {
            $w->where('visibility', 'public')
              ->orWhere('user_id', $user->id);
        });

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
            $query->latest();
    }

    return $query->paginate($perPage);
}

    // GET
public function show(Recipe $recipe, Request $request)
{
    $isOwner = $recipe->user_id === $request->user()->id;
    abort_unless($recipe->visibility === 'public' || $isOwner, 404);

    return $recipe->load(['user:id,name', 'ingredients:id,name'])
        ->loadCount(['votes', 'favoritedBy'])
        ->loadAvg('votes as avg_rating', 'rating');
}

    // POST
    public function store(RecipeStoreRequest $request)
{
    // 1) Ignoramos user_id del cliente por seguridad
    $data = $request->safe()->except(['user_id']);

    // 2) Creamos por relación del usuario autenticado (no más hardcode)
    $recipe = $request->user()->recipes()->create($data);

    // 3) Ingredientes + macros
    if (!empty($data['ingredients'])) {
        $this->recipes->syncIngredientsAndRecompute(
            $recipe,
            $data['ingredients'],
            ignoreUnitMismatch: false
        );
    } else {
        // sin ingredientes → macros en 0 para no dejar valores sucios
        $recipe->fill(['calories'=>0,'protein'=>0,'carbs'=>0,'fat'=>0])->save();
    }

    return response()->json($recipe->fresh()->load('ingredients:id,name'), 201);
}
    // PUT
    public function update(RecipeUpdateRequest $request, Recipe $recipe)
    {
        // $this->authorize('update', $recipe); // descomentar con auth
        $data = $request->validated();
        
        $recipe->update($data);
        
        if (array_key_exists('ingredients', $data)) {
            // si llegó el array, sincronizamos (aunque esté vacío → elimina todos)
            $this->recipes->syncIngredientsAndRecompute($recipe, $data['ingredients'], ignoreUnitMismatch: false);
        } else {
            // si no llegó, al menos recalcular si cambiaste servings u otros
            $recipe->recomputeMacrosAndSave(true);
        }
    
        return $recipe->load('ingredients:id,name');
        }

    // DELETE
    public function destroy(Recipe $recipe)
    {
        // $this->authorize('delete', $recipe); // descomentar con auth
        $recipe->delete();
        return response()->noContent();
    }
}
