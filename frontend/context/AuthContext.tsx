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

const RAW_API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const API_BASE = RAW_API.endsWith("/") ? RAW_API : RAW_API + "/";

function buildUrl(path: string) {
  return new URL(path, API_BASE).toString();
}

async function ensureCsrfCookie() {
  const url = buildUrl("sanctum/csrf-cookie");
  console.log("ensureCsrfCookie", url);
  await fetch(url, {
    credentials: "include",
    cache: "no-store",
    headers: { "X-Requested-With": "XMLHttpRequest" },
  });
}

async function fetchUser(): Promise<User | null> {
  try {
    const res = await fetch(buildUrl("api/user"), {
      credentials: "include",
      cache: "no-store",
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("fetchUser error", err);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [status, setStatus] = useState<Status>("loading");
  const booted = useRef(false);

  const refresh = async (): Promise<User | null> => {
    try {
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
      if (e.key === "mf-auth-event") {
        refresh();
      }
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