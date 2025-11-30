"use client";

import { useCallback, useState } from "react";
import { buildUrl } from "@/lib/api";

function readCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([$?*|{}\]\\^])/g, "\\$1") + "=([^;]*)"));
  return m ? m[1] : null;
}

async function ensureCsrfCookie() {
  await fetch(buildUrl("sanctum/csrf-cookie"), {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
}

export function useToggleFavorite() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = useCallback(async (recipeId: number, currentlyFavorited: boolean) => {
    setLoading(true);
    setError(null);

    try {
      await ensureCsrfCookie();
      const xsrfCookie = readCookie("XSRF-TOKEN");
      const xsrfHeader = xsrfCookie ? decodeURIComponent(xsrfCookie) : null;

      const method = currentlyFavorited ? "DELETE" : "POST";

      const res = await fetch(buildUrl(`/api/recipes/${recipeId}/favorite`), {
        method,
        credentials: "include",
        headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": xsrfHeader ?? "",
        },
      });

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const err = await res.json();
          if (err?.message) msg += ` - ${err.message}`;
        } catch {}
        throw new Error(msg);
      }

      const json = await res.json().catch(() => ({}));
      return { recipeId: json?.recipe_id ?? recipeId, isFavorited: json?.is_favorited ?? !currentlyFavorited };
    } catch (e: any) {
      setError(e?.message ?? "Favorite toggle failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { toggle, loading, error };
}
