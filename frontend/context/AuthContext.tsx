"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type User = any | null;
type Status = "loading" | "authed" | "guest";

type AuthCtx = {
  user: User;
  status: Status;
  setUser: (u: User) => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function ensureCsrfCookie() {
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [status, setStatus] = useState<Status>("loading");
  const booted = useRef(false);

  const refresh = async () => {
    await ensureCsrfCookie();
    const u = await fetchUser();
    setUser(u);
    setStatus(u ? "authed" : "guest");
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