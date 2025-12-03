// components/RequireAuth.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Props = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

export default function RequireAuth({ children, requireAdmin }: Props) {
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    // No logueado → a /signin
    if (status === "guest" || !user) {
      const from = pathname || "/";
      router.replace(`/signin?from=${encodeURIComponent(from)}`);
      return;
    }

    if (requireAdmin && user.role !== "admin") {
      router.replace("/home");
      return;
    }
  }, [status, user, requireAdmin, pathname, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (status === "guest" || !user) {
    return null;
  }

  if (requireAdmin && user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
