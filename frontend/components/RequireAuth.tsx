"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type RequireAuthProps = PropsWithChildren<{
  requireAdmin?: boolean;
}>;

export default function RequireAuth({ children, requireAdmin }: RequireAuthProps) {
  const { status, user } = useAuth(); 
  const router = useRouter();

  useEffect(() => {
    if (status === "guest") {
      router.replace("/signin");
      return;
    }

    if (status === "authed" && requireAdmin && user && user.role !== "admin") {
      router.replace("/home");
      return;
    }
  }, [status, requireAdmin, user, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Verificando sesión...
      </div>
    );
  }

  if (
    status === "guest" ||
    (status === "authed" && requireAdmin && user && user.role !== "admin")
  ) {
    return null;
  }

  return <>{children}</>;
}
