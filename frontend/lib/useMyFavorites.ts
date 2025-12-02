"use client";
import { useEffect, useState } from "react";

const rawBase =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const API_BASE = rawBase.replace(/\/+$/, "");

export function useMyFavorites(perPage = 12, page = 1, q = "") {
  const [data, setData] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();

    const params = new URLSearchParams();
    params.set("mine", "1");
    params.set("per_page", String(perPage));
    params.set("page", String(page));
    if (q) params.set("q", q);

    const url = `${API_BASE}/favorites?${params.toString()}`;

    setLoading(true);
    setError(null);

    fetch(url, {
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
      .catch((e: any) => {
        if (e.name !== "AbortError") setError(e.message || "Error desconocido");
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [perPage, page]);

  return { data, meta, loading, error };
}
