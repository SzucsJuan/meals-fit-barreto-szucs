"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, Target, TrendingUp, Award, EggFried } from "lucide-react";
import { authApi } from "@/lib/api";

// Validaciones simples (sin libs)
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const minLen = (v: string, n: number) => v.trim().length >= n;

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!minLen(name, 2)) errs.name = "Tu nombre debe tener al menos 2 caracteres.";
    if (!isEmail(email)) errs.email = "Email inválido.";
    if (!minLen(password, 8)) errs.password = "La contraseña debe tener al menos 8 caracteres.";
    if (confirm !== password) errs.confirm = "Las contraseñas no coinciden.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    try {
      setLoading(true);
      // 1) Registro (token devuelto no lo usamos; la sesión es por cookie)
      await authApi.register({ name, email, password, password_confirmation: confirm });

      // 2) Auto-login para crear la sesión web y tener cookie de sesión
      await authApi.login({ email, password });

      router.push("/home");
    } catch (err: any) {
      setFormError(err.message || "Error al registrarte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-12">
        <div className="max-w-md space-y-6">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <EggFried className="h-8 w-8 text-primary" />
              <span className="text-4xl font-bold text-foreground">Meals&Fit</span>
            </Link>
            <h1 className="text-2xl font-bold text-balance text-foreground">Start your transformation today</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Join thousands of users who are achieving their health and fitness goals with smart nutrition tracking.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-border">
              <Target className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground mb-1">Track Goals</h3>
              <p className="text-xs text-muted-foreground">Monitor your daily nutrition targets</p>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-border">
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground mb-1">See Progress</h3>
              <p className="text-xs text-muted-foreground">Visualize your health journey</p>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-border">
              <Award className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground mb-1">Earn Rewards</h3>
              <p className="text-xs text-muted-foreground">Unlock achievements</p>
            </div>
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-border">
              <Apple className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold text-foreground mb-1">Custom Recipes</h3>
              <p className="text-xs text-muted-foreground">Create your meal plans</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground">Create your account</h2>
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link href="/signin" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <Card className="border-border">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl">Get started for free</CardTitle>
              <CardDescription>No credit card required</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-4" onSubmit={onSubmit} noValidate>
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="h-11"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={!!fieldErrors.name}
                  />
                  {fieldErrors.name && <p className="text-xs text-red-600">{fieldErrors.name}</p>}
                </div>

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
                  {fieldErrors.email && <p className="text-xs text-red-600">{fieldErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    className="h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!fieldErrors.password}
                  />
                  <p className="text-xs text-muted-foreground">Must be at least 8 characters long</p>
                  {fieldErrors.password && <p className="text-xs text-red-600">{fieldErrors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    className="h-11"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    aria-invalid={!!fieldErrors.confirm}
                  />
                  <p className="text-xs text-muted-foreground">Passwords must match</p>
                  {fieldErrors.confirm && <p className="text-xs text-red-600">{fieldErrors.confirm}</p>}
                </div>

                <Button type="submit" className="w-full h-11" size="lg" disabled={loading}>
                  {loading ? "Creating..." : "Create account"}
                </Button>

                {formError && <p className="text-sm text-red-600">{formError}</p>}
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            By creating an account, you agree to our{" "}
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
