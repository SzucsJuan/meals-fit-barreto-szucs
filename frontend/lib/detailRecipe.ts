"use client";

import { useEffect, useState } from "react";
import { RecipeDetail } from "./type"; // ajustá el path a tu type.ts

type State = {
  data: RecipeDetail | null;
  loading: boolean;
  error: string | null;
};

const API =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:8000";

export function detailRecipe(id: string | number): State {
  const [data, setData] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API}/api/recipes/${id}`, {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(
            `HTTP ${res.status} ${res.statusText}${txt ? ` - ${txt}` : ""}`
          );
        }

        const json = (await res.json()) as RecipeDetail;
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Error fetching recipe");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { data, loading, error };
}
