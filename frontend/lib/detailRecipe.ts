"use client";

import { useEffect, useState, useCallback } from "react";
import { RecipeDetail } from "./type";
import { s } from "./sanitize";

export function detailRecipe(id: string) {
  const [data, setData] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    const safeId = s.text(id, 100);
    const url = `${
      process.env.NEXT_PUBLIC_API_BASE_URL
    }/api/recipes/${encodeURIComponent(safeId)}`;

    fetch(url)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
