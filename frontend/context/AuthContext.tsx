"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { authApi, setAuthToken } from "@/lib/api";

type User = any | null;
type Status = "loading" | "authed" | "guest";

type AuthCtx = {
  user: User;
  status: Status;
  setUser: (u: User) => void;
  refresh: () => Promise<User | null>;
  logout: () => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<User>; 
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [status, setStatus] = useState<Status>("loading");
  const booted = useRef(false);

  const refresh = async (): Promise<User | null> => {
    try {
      const u = await authApi.me();
      setUser(u);
      setStatus(u ? "authed" : "guest");
      return u;
    } catch {
      setUser(null);
      setStatus("guest");
      return null;
    }
  };

  const login = async (payload: {
    email: string;
    password: string;
  }): Promise<User> => {
    const { token, user: u } = await authApi.login(payload);

    setAuthToken(token);

    setUser(u);
    setStatus("authed");

    if (typeof window !== "undefined") {
      window.localStorage.setItem("mf-auth-event", Date.now().toString());
    }

    return u;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
    }
    setAuthToken(null);
    setUser(null);
    setStatus("guest");
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mf-auth-event", Date.now().toString());
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
    <AuthContext.Provider
      value={{ user, status, setUser, refresh, logout, login }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
