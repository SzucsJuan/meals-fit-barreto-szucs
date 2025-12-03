// hooks/useMyRecipes.ts
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type PaginationMeta = {
  current_page: number;
  last_page: number;
  total: number;
};

export function useMyRecipes(perPage = 12, page = 1, q = "") {
  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
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
        params.set("mine", "1");
        params.set("per_page", String(perPage));
        params.set("page", String(page));
        if (q) params.set("q", q);

        const json = await api<any>(`/api/recipes?${params.toString()}`, {
          method: "GET",
          signal: ctrl.signal,
        });

        if (cancelled) return;

        setData(json.data ?? []);
        setMeta({
          current_page: json.current_page,
          last_page: json.last_page,
          total: json.total,
        });
      } catch (e: any) {
        if (cancelled) return;
        if (e.name !== "AbortError") {
          setError(e.message || "Error loading recipes");
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
  }, [perPage, page, q]);

  return { data, meta, loading, error };
}
