// /lib/useRequireAuth.ts
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type AuthState = { user: any | null; loading: boolean; authed: boolean };

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function ensureCsrfCookie() {
  await fetch(`${API}/sanctum/csrf-cookie`, {
    credentials: "include",
    cache: "no-store",
    headers: { "X-Requested-With": "XMLHttpRequest" },
  });
}

async function fetchUser(): Promise<any | null> {
  try {
    const res = await fetch(`${API}/api/user`, {
      credentials: "include",
      cache: "no-store",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Accept": "application/json",
      },
    });

    // No autenticado o sin cuerpo todavía
    if (res.status === 204 || res.status === 401) return null;

    if (!res.ok) return null;

    // Algunos servidores pueden devolver "" en vez de JSON
    const text = await res.text();
    if (!text) return null;

    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function useRequireAuth(redirectTo = "/signin"): AuthState {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({ user: null, loading: true, authed: false });

  useEffect(() => {
    let mounted = true;

    (async () => {
      // Siempre aseguramos CSRF antes de consultar el user
      await ensureCsrfCookie();

      // Primer intento
      let user = await fetchUser();

      // Si no hay user, reintentamos una vez tras un pequeño delay
      if (!user) {
        await new Promise((r) => setTimeout(r, 250));
        await ensureCsrfCookie();
        user = await fetchUser();
      }

      if (!mounted) return;

      if (!user) {
        setState({ user: null, loading: false, authed: false });
        router.replace(redirectTo);
      } else {
        setState({ user, loading: false, authed: true });
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router, redirectTo]);

  return state;
}
