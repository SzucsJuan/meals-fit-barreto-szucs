"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { EggFried } from "lucide-react";
import { authApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext"; // 👈 IMPORTANTE

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!isEmail(email)) errs.email = "Email inválido.";
    if (!password.trim()) errs.password = "Ingresá tu contraseña.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    try {
      setLoading(true);

      await authApi.login({ email, password });

      await refresh();

      if (typeof window !== "undefined") {
        window.localStorage.setItem("mf-auth-event", Date.now().toString());
      }

      router.push("/home");
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || "Credenciales inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-12">
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <EggFried className="h-8 w-8 text-primary" />
              <span className="text-4xl font-bold text-foreground">Meals&Fit</span>
            </Link>
            <h1 className="text-2xl font-bold text-balance text-foreground mt-2">
              Welcome back to your health journey
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Track your nutrition, discover recipes, and achieve your fitness goals with personalized insights.
            </p>
          </div>

          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-foreground">Smart Meal Tracking</h3>
                <p className="text-sm text-muted-foreground">Log meals and monitor your daily nutrition intake</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-foreground">Custom Recipes</h3>
                <p className="text-sm text-muted-foreground">Create and save your favorite healthy recipes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <h3 className="font-semibold text-foreground">Achievement System</h3>
                <p className="text-sm text-muted-foreground">Unlock trophies and stay motivated</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground">Sign in and stay on track</h2>
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>

          <Card className="border-border">
            <CardContent className="space-y-4">
              <form className="space-y-4" onSubmit={onSubmit} noValidate>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="h-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!fieldErrors.email}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-600">{fieldErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!fieldErrors.password}
                  />
                  {fieldErrors.password && (
                    <p className="text-xs text-red-600">{fieldErrors.password}</p>
                  )}
                </div>

                <Button type="submit" className="w-full h-11" size="lg" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>

                {formError && <p className="text-sm text-red-600">{formError}</p>}
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="#" className="underline hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
