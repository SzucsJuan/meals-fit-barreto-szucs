// lib/useMe.ts
"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/lib/api";

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
        setError(null);

        const me = await authApi.me();

        if (!cancelled) {
          setUser(me);
        }
      } catch (e: any) {
        if (cancelled) return;

        setError(e?.message ?? "Failed to load user");
        setUser(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading, error };
}
