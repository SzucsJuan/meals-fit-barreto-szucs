"use client";

import { useCallback, useState } from "react";
import { api } from "@/lib/api";

export function useToggleFavorite() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = useCallback(
    async (recipeId: number, currentlyFavorited: boolean) => {
      setLoading(true);
      setError(null);

      try {
        const method = currentlyFavorited ? "DELETE" : "POST";

        const res = await api<any>(
          `/api/recipes/${encodeURIComponent(String(recipeId))}/favorite`,
          { method }
        );

        const nextIsFav =
          typeof res?.is_favorited === "boolean"
            ? res.is_favorited
            : !currentlyFavorited;

        const returnedId =
          typeof res?.recipe_id === "number" ? res.recipe_id : recipeId;

        return {
          recipeId: returnedId,
          isFavorited: nextIsFav,
        };
      } catch (e: any) {
        setError(e?.message ?? "Favorite toggle failed");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { toggle, loading, error };
}
