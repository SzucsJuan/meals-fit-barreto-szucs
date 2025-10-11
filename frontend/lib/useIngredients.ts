import { useEffect, useState } from "react";

export interface Ingredient {
  id: number;
  name: string;
  serving_size: number;
  serving_unit: "g" | "ml" | "unit";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  is_verified: boolean;
}

export function useIngredients(search: string) {
  const [data, setData] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const url = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ingredients`
    );
    if (search) url.searchParams.set("q", search);
    url.searchParams.set("per_page", "50");

    setLoading(true);
    setError(null);

    fetch(url.toString(), { signal: ctrl.signal, credentials: "include" })
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
  }, [search]);

  return { data, loading, error };
}
