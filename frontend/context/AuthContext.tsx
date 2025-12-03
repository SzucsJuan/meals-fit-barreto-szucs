"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

// BACKEND_ROOT → para rutas de web.php (login, register, csrf, logout)
const rawRoot =
  process.env.NEXT_PUBLIC_BACKEND_ROOT || "http://localhost:8000";
const BACKEND_ROOT = rawRoot.replace(/\/+$/, "");

// API_BASE_URL → para rutas de api.php (/api/*)
const rawApi =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
const API_BASE = rawApi.replace(/\/+$/, "");

// Types
type User = any | null;
type Status = "loading" | "authed" | "guest";

type AuthCtx = {
  user: User;
  status: Status;
  setUser: (u: User) => void;
  refresh: () => Promise<User | null>;
};

const AuthContext = createContext<AuthCtx | null>(null);

// ============================
//   HELPERS
// ============================

// Sanctum CSRF
async function ensureCsrfCookie() {
  await fetch(`${BACKEND_ROOT}/sanctum/csrf-cookie`, {
    credentials: "include",
    cache: "no-store",
    headers: { "X-Requested-With": "XMLHttpRequest",
     "ngrok-skip-browser-warning": "true",
     },
  });
}

// GET /api/user
async function fetchUser() {
  const res = await fetch(`${API_BASE}/user`, {
    credentials: "include",
    cache: "no-store",
    headers: { "X-Requested-With": "XMLHttpRequest" },
  });

  if (!res.ok) return null;
  return res.json();
}

// ============================
//   PROVIDER
// ============================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [status, setStatus] = useState<Status>("loading");
  const booted = useRef(false);

  const refresh = async (): Promise<User | null> => {
    try {
      await ensureCsrfCookie();
      const u = await fetchUser();
      setUser(u);
      setStatus(u ? "authed" : "guest");
      return u;
    } catch (err) {
      console.error("Error en refresh()", err);
      setUser(null);
      setStatus("guest");
      return null;
    }
  };

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    refresh();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "mf-auth-event") refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, setUser, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};

export default useAuth;