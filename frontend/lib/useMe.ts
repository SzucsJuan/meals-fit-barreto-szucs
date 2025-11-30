"use client";

import { useEffect, useState } from "react";
import { buildUrl } from "@/lib/api";

export interface Me {
  id: number;
  name: string;
  email: string;
  role?: string | null;
}

export function useMe() {
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(buildUrl("/api/me"), {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const me = (await res.json()) as Me;
        if (!cancelled) setUser(me);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load user");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return { user, loading, error };
}
