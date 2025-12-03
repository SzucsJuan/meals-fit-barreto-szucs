"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type User = any | null;
type Status = "loading" | "authed" | "guest";

type AuthCtx = {
  user: User;
  status: Status;
  setUser: (u: User) => void;
  refresh: () => Promise<User | null>;
};

const AuthContext = createContext<AuthCtx | null>(null);

// Asumimos que NEXT_PUBLIC_API_BASE_URL es la URL completa de la API, ej: "http://localhost:8000/api"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

// Derivamos la URL Raíz para llamadas que no van al grupo /api (como sanctum/csrf-cookie)
const ROOT_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL.slice(0, -4) // Elimina '/api'
  : API_BASE_URL;

async function ensureCsrfCookie() {
  // CRITICAL FIX: Llama a sanctum/csrf-cookie desde la URL raíz, no desde la URL /api.
  await fetch(`${ROOT_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
    cache: "no-store",
    headers: { "X-Requested-With": "XMLHttpRequest" },
  });
}

async function fetchUser() {
  // CORRECCIÓN: Quitamos el redundante '/api' si API_BASE_URL ya lo incluye
  const res = await fetch(`${API_BASE_URL}/user`, {
    credentials: "include",
    cache: "no-store",
    headers: { "X-Requested-With": "XMLHttpRequest" },
  });
  if (!res.ok) return null;
  return res.json();
}

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
    // Es normal que fetchUser falle si el usuario no está autenticado,
    // pero el error 500 debe ser manejado en la configuración del servidor.
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