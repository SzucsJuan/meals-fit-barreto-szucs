import { useEffect, useState } from "react";

export interface RecipeListItem {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number; // ⚠️ es "fat" en el back
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  avg_rating?: number | null;
  votes_count?: number;
  favorited_by_count?: number;
  user?: { id: number; name: string };
  // ingredients?: { id: number; name: string }[]; // descomenta si lo querés usar
}

export function useRecipes(search: string, order: string = "latest") {
  const [data, setData] = useState<RecipeListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/recipes`);
    if (search) url.searchParams.set("q", search);
    if (order) url.searchParams.set("order", order);
    url.searchParams.set("per_page", "24");

    setLoading(true);
    setError(null);

    fetch(url.toString(), { signal: ctrl.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        setData(json.data ?? json);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
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
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/recipes/${id}`;

    setLoading(true);
    setError(null);

    fetch(url, { signal: ctrl.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        setRecipe(json.data ?? json);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [id]);

  return { recipe, loading, error };
}
