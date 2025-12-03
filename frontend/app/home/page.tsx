"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RequireAuth  from "@/components/RequireAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  ChefHat,
  Plus,
  Heart,
  Target,
  TrendingUp,
  Flame,
  User,
  UtensilsCrossed,
  Binoculars,
  Home,
  Dumbbell,
  Activity,
  Gauge,
  FlameKindling,
} from "lucide-react";

import Navigation from "@/components/navigation";
import { useMyFavorites } from "@/lib/useMyFavorites";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type Plan = {
  id: number;
  mode: "maintenance" | "gain" | "loss";
  experience: "beginner" | "advanced" | "professional";
  activity_level: "sedentary" | "light" | "moderate" | "high" | "athlete";
  bmr: number;
  tdee: number;
  calorie_target: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  fiber_g: number;
  water_l: number;
  version?: number;
};

export default function HomePage() {
  const router = useRouter();
  const { status } = useAuth(); // 👈 info de auth desde el contexto

  // Redirección cliente si NO está logueado
  useEffect(() => {
    if (status === "guest") {
      router.replace("/signin?from=/home");
    }
  }, [status, router]);

  // Mientras carga el estado de auth
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Si no está authed, no renderizamos nada (ya lo redirige el effect)
  if (status === "guest") {
    return null;
  }

  // --- el resto de tu lógica de estado ---

  const [selectedRoutine, setSelectedRoutine] =
    React.useState<"maintain" | "lose" | "gain" | null>(null);

  const [experienceLevel, setExperienceLevel] =
    useState<"beginner" | "advanced" | "professional" | null>(null);
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState<
    "sedentary" | "light" | "moderate" | "high" | "athlete"
  >("moderate");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const [latestPlan, setLatestPlan] = useState<Plan | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<boolean>(true);
  const [planError, setPlanError] = useState<string | null>(null);

  const {
    data: favorites = [],
    loading: favLoading,
    error: favError,
  } = useMyFavorites(3, 1);

  const routineTypes = {
    maintain: {
      title: "Maintain",
      description: "Keep your current weight and build healthy habits",
      icon: "⚖️",
      calories: 2200,
      protein: 165,
      carbs: 275,
      fats: 73,
      color: "blue",
    },
    lose: {
      title: "Lose",
      description: "Create a calorie deficit to lose weight sustainably",
      icon: "📉",
      calories: 1800,
      protein: 180,
      carbs: 180,
      fats: 60,
      color: "rose",
    },
    gain: {
      title: "Gain",
      description: "Build muscle with a calorie surplus and high protein",
      icon: "📈",
      calories: 2800,
      protein: 210,
      carbs: 350,
      fats: 93,
      color: "green",
    },
  } as const;

  const currentRoutine = selectedRoutine ? routineTypes[selectedRoutine] : null;
  const canSave = !!selectedRoutine && !!experienceLevel;

  function mapMode(m: "maintain" | "lose" | "gain"): "maintenance" | "loss" | "gain" {
    return m === "maintain" ? "maintenance" : m === "lose" ? "loss" : "gain";
  }

  // Cargar último plan usando el cliente api() con token
  async function loadLatestPlan() {
    try {
      setLoadingPlan(true);
      setPlanError(null);

      const data = await api<{ plan: Plan | null }>("/api/me/goals/latest", {
        method: "GET",
      });

      setLatestPlan(data?.plan ?? null);
    } catch (e: any) {
      setPlanError(e?.message || "Unexpected error");
      setLatestPlan(null);
    } finally {
      setLoadingPlan(false);
    }
  }

  useEffect(() => {
    loadLatestPlan();
  }, []);

  async function handleSave() {
    setSaveMsg(null);

    if (!selectedRoutine || !experienceLevel) {
      setSaveMsg("Select your goal and experience level.");
      return;
    }
    if (!weight || !height || !age) {
      setSaveMsg("Complete weight, height and age.");
      return;
    }

    try {
      setSaving(true);

      const data = await api<{ plan: Plan }>("/api/me/goals?source=ai", {
        method: "POST",
        json: {
          mode: mapMode(selectedRoutine),
          experience: experienceLevel,
          activity_level: activityLevel,
          age: Number(age),
          weight: Number(weight),
          height: Number(height),
        },
      });

      setSaveMsg(
        "Profile & goals saved. Plan version " + (data?.plan?.version ?? "?")
      );

      setLatestPlan(data?.plan ?? null);
    } catch (e: any) {
      setSaveMsg(e?.message || "Unexpected error");
    } finally {
      setSaving(false);
    }
  }

  const TitleCap = ({ children }: { children: React.ReactNode }) => (
    <span className="capitalize">{children as any}</span>
  );
  const fmtInt = (n?: number) =>
    typeof n === "number" ? Math.round(n) : "-";
  const fmtOneDec = (n?: number) =>
    typeof n === "number"
      ? (Math.round(n * 10) / 10).toFixed(1)
      : "-";

  const showPersonalInfo = !loadingPlan && !latestPlan;

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Home className="h-8 w-8" style={{ color: "#FF9800" }} />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                    Welcome back!
                  </h1>
                  <p className="text-muted-foreground">
                    What’s on your plate today?
                  </p>
                </div>
              </div>
            </div>
          </div>

          {showPersonalInfo && (
            <Card className="mb-6 overflow-hidden">
              <CardHeader className="pt-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg text-foreground">
                    Personal Information
                  </h3>
                </CardTitle>
                <CardDescription>
                  <p className="text-sm text-muted-foreground mt-2">
                    Help us calculate your personalized nutrition targets based
                    on your body metrics and fitness level
                  </p>
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="weight"
                      className="text-sm font-medium"
                    >
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="height"
                      className="text-sm font-medium"
                    >
                      Height (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="age"
                      className="text-sm font-medium"
                    >
                      Age (years)
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-3 border-b border-border pb-6 mb-8">
                  <Label className="text-sm font-medium">
                    Experience Level
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => setExperienceLevel("beginner")}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        experienceLevel === "beginner"
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-foreground">
                          Beginner
                        </h4>
                        {experienceLevel === "beginner" && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        New to fitness and nutrition tracking
                      </p>
                    </button>

                    <button
                      onClick={() => setExperienceLevel("advanced")}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        experienceLevel === "advanced"
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-foreground">
                          Advanced
                        </h4>
                        {experienceLevel === "advanced" && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Regular training with good knowledge
                      </p>
                    </button>

                    <button
                      onClick={() => setExperienceLevel("professional")}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        experienceLevel === "professional"
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm text-foreground">
                          Professional
                        </h4>
                        {experienceLevel === "professional" && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Athlete or fitness professional
                      </p>
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg text-foreground">
                      Your Fitness Goal
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Choose your routine type and complete your profile for
                    personalized nutrition targets
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <button
                      onClick={() => setSelectedRoutine("maintain")}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        selectedRoutine === "maintain"
                          ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                          : "border-border hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">⚖️</div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">
                            Maintain
                          </h3>
                          {selectedRoutine === "maintain" && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Keep your current weight and build healthy habits
                      </p>
                    </button>

                    <button
                      onClick={() => setSelectedRoutine("lose")}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        selectedRoutine === "lose"
                          ? "border-rose-500 bg-rose-50 shadow-lg scale-105"
                          : "border-border hover:border-rose-300 hover:bg-rose-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">📉</div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">
                            Lose
                          </h3>
                          {selectedRoutine === "lose" && (
                            <Badge className="bg-rose-500 text-white text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create a calorie deficit to lose weight sustainably
                      </p>
                    </button>

                    <button
                      onClick={() => setSelectedRoutine("gain")}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        selectedRoutine === "gain"
                          ? "border-green-500 bg-green-50 shadow-lg scale-105"
                          : "border-border hover:border-green-300 hover:bg-green-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">📈</div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">
                            Gain
                          </h3>
                          {selectedRoutine === "gain" && (
                            <Badge className="bg-green-500 text-white text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Build muscle with a calorie surplus and high protein
                      </p>
                    </button>
                  </div>

                  <div className="space-y-3 mt-6">
                    <Label className="text-sm font-medium">
                      Activity Level
                    </Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      How active are you throughout the day? This helps
                      calculate your daily calorie needs.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                      {[
                        { key: "sedentary", label: "Sedentary" },
                        { key: "light", label: "Light" },
                        { key: "moderate", label: "Moderate" },
                        { key: "high", label: "High" },
                        { key: "athlete", label: "Athlete" },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => setActivityLevel(opt.key as any)}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            activityLevel === opt.key
                              ? "border-primary bg-primary/10 shadow-md"
                              : "border-border hover:border-primary/50 hover:bg-primary/5"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm text-foreground">
                              {opt.label}
                            </h4>
                            {activityLevel === opt.key && (
                              <Badge className="bg-primary text-primary-foreground text-xs">
                                Selected
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {opt.key === "sedentary" &&
                              "Little to no exercise, desk job"}
                            {opt.key === "light" &&
                              "Exercise 1-3 days/week"}
                            {opt.key === "moderate" &&
                              "Exercise 3-5 days/week"}
                            {opt.key === "high" &&
                              "Exercise 6-7 days/week"}
                            {opt.key === "athlete" &&
                              "Intense training 2x/day"}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col items-end gap-2">
                    <Button
                      className="w-full sm:w-auto"
                      disabled={!canSave || saving}
                      onClick={handleSave}
                    >
                      {saving ? "Saving..." : "Save Profile Settings"}
                    </Button>
                    {saveMsg && (
                      <p
                        className="text-sm"
                        style={{
                          color: saveMsg.startsWith("Profile")
                            ? "#2E7D32"
                            : "#D32F2F",
                        }}
                      >
                        {saveMsg}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mb-8">
            <CardHeader className="pt-4">
              <CardTitle className="flex items-center gap-2">
                <FlameKindling
                  className="h-5 w-5"
                  style={{ color: "#FF9800" }}
                />
                Your Current Plan
              </CardTitle>
              <CardDescription>
                Latest personalized targets based on your selections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPlan && (
                <div className="text-sm text-muted-foreground">
                  Loading plan…
                </div>
              )}
              {planError && (
                <div className="text-sm text-red-600">Error: {planError}</div>
              )}

              {!loadingPlan && !planError && latestPlan && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      <Dumbbell className="h-3 w-3 mr-1" />{" "}
                      <TitleCap>{latestPlan.experience}</TitleCap>
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      <Activity className="h-3 w-3 mr-1" />{" "}
                      <TitleCap>{latestPlan.activity_level}</TitleCap>
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      <Target className="h-3 w-3 mr-1" />{" "}
                      <TitleCap>{latestPlan.mode}</TitleCap>
                    </Badge>
                    {typeof latestPlan.version === "number" && (
                      <Badge variant="outline">v{latestPlan.version}</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Gauge className="h-4 w-4" /> BMR
                      </div>
                      <div className="text-lg font-semibold text-foreground">
                        {fmtInt(latestPlan.bmr)} kcal
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Gauge className="h-4 w-4" /> TDEE
                      </div>
                      <div className="text-lg font-semibold text-foreground">
                        {fmtInt(latestPlan.tdee)} kcal
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Flame className="h-4 w-4" /> Daily Calories
                      </div>
                      <div className="text-lg font-semibold text-foreground">
                        {fmtInt(latestPlan.calorie_target)} kcal
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="p-4 border rounded-lg">
                      <div className="text-xs text-muted-foreground">
                        Protein
                      </div>
                      <div className="text-lg font-semibold text-foreground">
                        {fmtInt(latestPlan.protein_g)} g
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-xs text-muted-foreground">
                        Carbs
                      </div>
                      <div className="text-lg font-semibold text-foreground">
                        {fmtInt(latestPlan.carbs_g)} g
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-xs text-muted-foreground">Fat</div>
                      <div className="text-lg font-semibold text-foreground">
                        {fmtInt(latestPlan.fat_g)} g
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-xs text-muted-foreground">
                        Fiber
                      </div>
                      <div className="text-lg font-semibold text-foreground">
                        {fmtInt(latestPlan.fiber_g)} g
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-xs text-muted-foreground">
                        Water
                      </div>
                      <div className="text-lg font-semibold text-foreground">
                        {fmtOneDec(latestPlan.water_l)} L
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-xs text-muted-foreground">
                        Calorie Split
                      </div>
                      <div className="text-sm text-foreground">
                        Prot {fmtInt(latestPlan.protein_g * 4)} kcal · Fat{" "}
                        {fmtInt(latestPlan.fat_g * 9)} kcal · Carbs{" "}
                        {fmtInt(latestPlan.carbs_g * 4)} kcal
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!loadingPlan && !planError && !latestPlan && (
                <div className="text-sm text-muted-foreground">
                  No plan yet. Save your profile settings to generate your
                  personalized targets.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader className="pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Heart
                    className="h-6 w-6"
                    style={{ color: "#FF9800" }}
                  />
                  <div>
                    <CardTitle>Favorite Recipes</CardTitle>
                    <CardDescription>
                      Your most loved meal recipes
                    </CardDescription>
                  </div>
                </div>
                <Link href="/recipes?tab=fav">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    View your favorites
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {favLoading && (
                <div className="text-sm text-muted-foreground">
                  Loading favorites…
                </div>
              )}
              {favError && (
                <div className="text-sm text-red-600">
                  Error loading favorites
                </div>
              )}
              {!favLoading && !favError && (
                <>
                  {favorites.length === 0 ? (
                    <Card className="border-dashed">
                      <CardContent className="py-8 text-center">
                        <CardTitle className="mb-2">
                          No favorites yet
                        </CardTitle>
                        <CardDescription>
                          Add recipes to your favorites to see them here.
                        </CardDescription>
                        <div className="mt-4">
                          <Link href="/discover">
                            <Button>Discover recipes</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favorites.map((r: any) => (
                        <Link key={r.id} href={`/recipes/${r.id}`}>
                          <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-foreground line-clamp-1">
                                {r.title}
                              </h4>
                              <Badge
                                variant="secondary"
                                className="capitalize"
                              >
                                {r.visibility}
                              </Badge>
                            </div>
                            {r.description && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {r.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                {Math.round(r.calories ?? 0)} cal
                              </span>
                              <span>
                                {Math.round(r.protein ?? 0)}g protein
                              </span>
                              <span>
                                {Math.round(r.carbs ?? 0)}g carbs
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <Link href="/recipes/create">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2">
                      <ChefHat
                        className="h-6 w-6"
                        style={{ color: "#FF9800" }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Create New Recipe
                      </CardTitle>
                      <CardDescription>
                        Build and save custom recipes
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    New Recipe
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/meals/add">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2">
                      <Target
                        className="h-6 w-6"
                        style={{ color: "#FF9800" }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Add Meals</CardTitle>
                      <CardDescription>
                        Log your daily nutrition intake
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Meal
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/discover">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2">
                      <Binoculars
                        className="h-6 w-6"
                        style={{ color: "#FF9800" }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Discover new recipes
                      </CardTitle>
                      <CardDescription>
                        Explore recipes from around the world
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <UtensilsCrossed className="h-4 w-4 mr-2" />
                    Discover
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pt-4">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp
                    className="h-6 w-6"
                    style={{ color: "#FF9800" }}
                  />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Avg Daily Calories
                    </span>
                    <span className="font-medium">1,923</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Protein Goal Hit
                    </span>
                    <span className="font-medium">5/7 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Recipes Created
                    </span>
                    <span className="font-medium">3 this week</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pt-4">
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">
                      Added breakfast: Oatmeal with berries
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-sm">
                      Created recipe: Veggie Stir Fry
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                    <span className="text-sm">
                      Reached protein goal yesterday
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
