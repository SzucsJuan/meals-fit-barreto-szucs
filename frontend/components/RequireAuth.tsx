"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Props = {
  children: React.ReactNode;
  redirectTo?: string;
};

export default function RequireAuth({ children, redirectTo = "/signin" }: Props) {
  const { status } = useAuth();
  const router = useRouter();

  // Si el usuario es guest, lo mandamos a /signin
  useEffect(() => {
    if (status === "guest") {
      router.replace(redirectTo);
    }
  }, [status, redirectTo, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Checking your session…
      </div>
    );
  }

  if (status === "guest") {
    // Mientras hacemos el replace no mostramos contenido para que no parpadee
    return null;
  }

  // status === "authed"
  return <>{children}</>;
}