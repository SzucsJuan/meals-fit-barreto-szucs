// hooks/useRecipes.ts
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface RecipeListItem {
  id: number;
  title: string;
  description: string | null;
  image_disk: string | null;
  image_path: string | null;
  image_thumb_path: string | null;
  image_webp_path: string | null;
  image_width: number | null;
  image_height: number | null;

  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  avg_rating?: number | null;
  votes_count?: number;
  favorited_by_count?: number;
  user?: { id: number; name: string };
}

type PaginatedRecipes = {
  data?: RecipeListItem[];
  current_page?: number;
  last_page?: number;
  total?: number;
};

export function useRecipes(search: string, order: string = "latest") {
  const [data, setData] = useState<RecipeListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (search) params.set("q", search);
        if (order) params.set("order", order);
        params.set("per_page", "24");

        const json = await api<PaginatedRecipes | RecipeListItem[]>(
          `/api/recipes?${params.toString()}`,
          {
            method: "GET",
            signal: ctrl.signal,
          }
        );

        if (cancelled) return;

        if (Array.isArray(json)) {
          setData(json);
        } else {
          setData(json.data ?? []);
        }
      } catch (e: any) {
        if (cancelled) return;
        if (e.name !== "AbortError") {
          setError(e.message || "Error al cargar recetas");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, [search, order]);

  return { data, loading, error };
}

export function useRecipe(id: number | string | null) {
  const [recipe, setRecipe] = useState<RecipeListItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const ctrl = new AbortController();
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const json = await api<RecipeListItem | { data: RecipeListItem }>(
          `/api/recipes/${id}`,
          {
            method: "GET",
            signal: ctrl.signal,
          }
        );

        if (cancelled) return;

        if ("data" in json) {
          setRecipe(json.data);
        } else {
          setRecipe(json);
        }
      } catch (e: any) {
        if (cancelled) return;
        if (e.name !== "AbortError") {
          setError(e.message || "Error al cargar la receta");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, [id]);

  return { recipe, loading, error };
}
