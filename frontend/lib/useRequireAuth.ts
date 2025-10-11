// /lib/useRequireAuth.ts
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type AuthState = { user: any | null; loading: boolean; authed: boolean };

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function ensureCsrfCookie() {
  // importante: credenciales incluidas para setear XSRF-TOKEN y atar la cookie de sesión
  await fetch(`${API}/sanctum/csrf-cookie`, {
    credentials: "include",
    cache: "no-store",
    headers: { "X-Requested-With": "XMLHttpRequest" },
  });
}

async function fetchUser() {
  const res = await fetch(`${API}/api/user`, {
    credentials: "include",
    cache: "no-store",
    headers: { "X-Requested-With": "XMLHttpRequest" },
  });
  if (!res.ok) return null;
  return res.json();
}

export function useRequireAuth(redirectTo = "/signin"): AuthState {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({ user: null, loading: true, authed: false });

  useEffect(() => {
    let mounted = true;
    (async () => {
      await ensureCsrfCookie();

      const user = await fetchUser();

      if (!mounted) return;
      if (!user) {
        router.replace(redirectTo);
        setState({ user: null, loading: false, authed: false });
      } else {
        setState({ user, loading: false, authed: true });
      }
    })();
    return () => { mounted = false; };
  }, [router, redirectTo]);

  return state;
}
