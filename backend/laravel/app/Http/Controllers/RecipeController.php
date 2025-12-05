<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use App\Services\RecipeService;
use App\Http\Requests\{RecipeStoreRequest, RecipeUpdateRequest};
use App\Services\AchievementService;

class RecipeController extends Controller
{
    protected RecipeService $recipes;

    public function __construct(RecipeService $recipes)
    {
        $this->recipes = $recipes;
    }

    public function index(Request $request)
    {
        $q       = trim((string) $request->query('q', ''));
        $perPage = (int) $request->query('per_page', 15);
        $order   = $request->query('order', 'latest');
        $user    = $request->user();
        $userId  = optional($user)->id;

        $mine     = $request->boolean('mine');    
        $discover = $request->boolean('discover'); 

        $query = Recipe::query()
            ->with(['user:id,name', 'ingredients:id,name'])
            ->withIsFavorited($userId)
            ->withAvg('votes as avg_rating', 'rating')
            ->withCount(['votes', 'favoredBy']);

        if ($mine && $user) {
            $query->where('user_id', $user->id);
        } elseif ($discover) {
            $query->where('visibility', 'public');
        } else {
            $query->where(function ($w) use ($user) {
                $w->where('visibility', 'public');
                if ($user) {
                    $w->orWhere('user_id', $user->id);
                }
            });
        }

        if ($q !== '') {
            $normalizedQ = mb_strtolower($q, 'UTF-8');

            $query->where(function ($sub) use ($normalizedQ) {
                $sub
                    ->whereRaw('LOWER(title) LIKE ?', ["%{$normalizedQ}%"])
                    ->orWhereRaw('LOWER(description) LIKE ?', ["%{$normalizedQ}%"])
                    ->orWhereHas('ingredients', function ($qIng) use ($normalizedQ) {
                        $qIng->whereRaw('LOWER(name) LIKE ?', ["%{$normalizedQ}%"]);
                    });
            });
        }


        switch ($order) {
            case 'rating':
                $query->orderByDesc('avg_rating')->orderByDesc('id');
                break;
            case 'name':
                $query->orderBy('title');
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

    // GET /api/recipes/{recipe}
    public function show(Recipe $recipe, Request $request)
    {
        $user   = $request->user();
        $userId = optional($user)->id;

        $isOwner = $recipe->user_id === $userId;
        $isAdmin = $user && ($user->role === 'admin');

        // Si es privada, solo puede ver recetas dueño o admin
        abort_unless(
            $recipe->visibility === 'public' || $isOwner || $isAdmin,
            404
        );

        $recipe = Recipe::query()
            ->whereKey($recipe->id)
            ->withIsFavorited($userId)
            ->with([
                'user:id,name',
                'ingredients:id,name,serving_size,serving_unit,calories,protein,carbs,fat',
            ])
            ->withCount(['votes', 'favoredBy'])
            ->withAvg('votes as avg_rating', 'rating')
            ->firstOrFail();

        return response()->json($recipe);
    }

    // POST /api/recipes
    public function store(RecipeStoreRequest $request)
    {
        $user = $request->user();

        $data = $request->safe()->except(['user_id']);

        if (empty($data['visibility'])) {
            $data['visibility'] = 'public';
        }

        $recipe = $user->recipes()->create($data);

        if (!empty($data['ingredients'])) {
            $this->recipes->syncIngredientsAndRecompute(
                $recipe,
                $data['ingredients'],
                ignoreUnitMismatch: false
            );
        } else {
            $recipe->fill([
                'calories' => 0,
                'protein'  => 0,
                'carbs'    => 0,
                'fat'      => 0,
            ])->save();
        }

        return response()->json(
            $recipe->fresh()->load('ingredients:id,name'),
            201
        );
    }

    // PUT/PATCH /api/recipes/{recipe}
    public function update(RecipeUpdateRequest $request, Recipe $recipe)
    {
        $data = $request->validated();

        // Si viene visibility vacía, la normalizamos a 'public'
        if (array_key_exists('visibility', $data) && empty($data['visibility'])) {
            $data['visibility'] = 'public';
        }

        $recipe->update($data);

        if (array_key_exists('ingredients', $data)) {
            $this->recipes->syncIngredientsAndRecompute(
                $recipe,
                $data['ingredients'],
                ignoreUnitMismatch: false
            );
        } else {
            $recipe->recomputeMacrosAndSave(true);
        }

        return $recipe->load('ingredients:id,name');
    }

    // DELETE /api/recipes/{recipe}
    public function destroy(Request $request, Recipe $recipe)
    {
        $user = $request->user();

        abort_unless(
            $user && ($user->id === $recipe->user_id || $user->isAdmin()),
            403
        );

        $recipe->delete();

        return response()->noContent();
    }
}
