"use client";
import { useEffect, useState } from "react";
import { buildUrl } from "@/lib/api";

export function useMyFavorites(perPage = 12, page = 1) {
  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const url = new URL(buildUrl("/api/recipes/favorites"));
    url.searchParams.set("per_page", String(perPage));
    url.searchParams.set("page", String(page));

    setLoading(true);
    setError(null);

    fetch(url.toString(), {
      signal: ctrl.signal,
      credentials: "include",
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json = await r.json();
        setData(json.data ?? []);
        setMeta({
          current_page: json.current_page,
          last_page: json.last_page,
          total: json.total,
        });
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [perPage, page]);

  return { data, meta, loading, error };
}
