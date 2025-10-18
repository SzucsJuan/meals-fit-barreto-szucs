// lib/detailRecipe.ts
"use client";

import { useEffect, useState } from "react";
import { apiRecipes, type RecipeDTO } from "@/lib/api";

type State = {
  data: RecipeDTO | null;
  loading: boolean;
  error: string | null;
};

export function detailRecipe(id: string | number): State {
  const [data, setData] = useState<RecipeDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const json = await apiRecipes.show(id); // ✅ usa el cliente central
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Error fetching recipe");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  return { data, loading, error };
}
