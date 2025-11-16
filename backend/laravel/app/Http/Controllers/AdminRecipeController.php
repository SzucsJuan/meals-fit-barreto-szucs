<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;

class AdminRecipeController extends Controller
{
    public function index(Request $request)
    {
        $query = Recipe::query()
            ->with('user');

        if ($request->filled('visibility')) {
            if (in_array($request->visibility, ['public', 'private'], true)) {
                $query->where('visibility', $request->visibility);
            }
        }

        // Búsqueda por título o autor
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        $recipes = $query
            ->orderByDesc('created_at')
            ->get();

        $data = $recipes->map(function (Recipe $r) {
            return [
                'id'          => $r->id,
                'name'        => $r->title,
                'description' => $r->description,
                'author'      => optional($r->user)->name,
                'author_email'=> optional($r->user)->email,
                'visibility'  => $r->visibility === 'private' ? 'private' : 'public',
                'category'    => $r->category ?? null,
                'calories'    => $r->calories ?? 0,
                'protein'     => $r->protein ?? 0,
                'carbs'       => $r->carbs ?? 0,
                'fats'        => $r->fats ?? 0,
                'created_at' => optional($r->created_at)->format('d-m-Y'),
            ];
        });

        return response()->json($data);
    }

    public function update(Request $request, Recipe $recipe)
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'visibility'  => ['required', 'in:public,private'],
        ]);

        $recipe->title       = $data['name'];
        $recipe->description = $data['description'] ?? $recipe->description;
        $recipe->visibility  = $data['visibility'];

        $recipe->save();
        $recipe->load('user');

        return response()->json([
            'id'          => $recipe->id,
            'name'        => $recipe->title ?? $recipe->name,
            'description' => $recipe->description,
            'author'      => optional($recipe->user)->name,
            'author_email'=> optional($recipe->user)->email,
            'visibility'  => $recipe->visibility === 'private' ? 'private' : 'public',
            'category'    => $recipe->category ?? null,
            'calories'    => $recipe->calories ?? 0,
            'protein'     => $recipe->protein ?? 0,
            'carbs'       => $recipe->carbs ?? 0,
            'fats'        => $recipe->fats ?? 0,
            'created_at' => optional($recipe->created_at)->format('d-m-Y'),
        ]);
    }

    public function destroy(Recipe $recipe)
    {
        $recipe->delete();
        return response()->noContent();
    }
}
