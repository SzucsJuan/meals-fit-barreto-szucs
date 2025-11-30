"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type RequireAuthProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
};

export default function RequireAuth({
  children,
  requireAdmin = false,
  redirectTo = "/signin",
}: RequireAuthProps) {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Invitado → siempre a /signin
    if (status === "guest") {
      router.replace("/signin");
      return;
    }

    // Logueado pero sin rol admin en una ruta de admin
    if (status === "authed" && requireAdmin && user?.role !== "admin") {
      // Podés cambiar "/home" por lo que prefieras
      router.replace("/home");
    }
  }, [status, requireAdmin, user, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Checking your session…
      </div>
    );
  }

  // Mientras hacemos el replace, no mostramos nada para evitar parpadeos
  if (status === "guest") {
    return null;
  }

  if (requireAdmin && user?.role !== "admin") {
    return null;
  }

  // status === "authed" y (si requiere admin) lo es.
  return <>{children}</>;
}

export const useRequireAuth = () => useAuth();