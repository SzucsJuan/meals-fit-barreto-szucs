"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

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

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("per_page", "50");
        if (search) params.set("q", search);

        const path = `/api/ingredients?${params.toString()}`;
        const json = await api<any>(path, {
          signal: ctrl.signal,
        });

        setData(json.data ?? json);
      } catch (e: any) {
        if (e.name === "AbortError") return;
        setError(e?.message ?? "Error fetching ingredients");
      } finally {
        setLoading(false);
      }
    };

    run();

    return () => ctrl.abort();
  }, [search]);

  return { data, loading, error };
}
