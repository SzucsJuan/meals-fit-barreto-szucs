"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChefHat,
  Plus,
  Heart,
  Target,
  TrendingUp,
  Trophy,
  Award,
  Star,
  Flame,
  Share2,
  User,
  UtensilsCrossed,
  Binoculars,
  Home,
  Droplets,
  Dumbbell,
  Activity,
  Gauge,
  Scale,
  FlameKindling,
} from "lucide-react";
import Link from "next/link";
import Navigation from "@/components/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RequireAuth from "@/components/RequireAuth";
import { useMyFavorites } from "@/lib/useMyFavorites";
import React, { useEffect, useState } from "react";

/** ----- Sanctum helpers (CSRF para SPA) ----- */
function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Debe ejecutarse al menos una vez por sesión antes del primer POST/PUT/PATCH/DELETE
async function ensureCsrf() {
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  await fetch(`${BASE}/sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
}

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
  const [selectedRoutine, setSelectedRoutine] =
    React.useState<"maintain" | "lose" | "gain" | null>(null);

  const [experienceLevel, setExperienceLevel] =
    useState<"beginner" | "advanced" | "professional" | null>(null);
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "light" | "moderate" | "high" | "athlete">(
    "moderate"
  );
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Plan actual
  const [latestPlan, setLatestPlan] = useState<Plan | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<boolean>(true);
  const [planError, setPlanError] = useState<string | null>(null);

  const achievements = [
    { id: 1, title: "First Steps", description: "Log your first meal", icon: Target, unlocked: true,  unlockedDate: "2024-01-15", category: "Getting Started" },
    { id: 2, title: "Recipe Creator", description: "Create your first custom recipe", icon: ChefHat, unlocked: true,  unlockedDate: "2024-01-18", category: "Creativity" },
    { id: 3, title: "Protein Champion", description: "Hit your protein goal for 7 consecutive days", icon: Award, unlocked: true,  unlockedDate: "2024-01-25", category: "Nutrition Goals" },
    { id: 4, title: "Streak Master", description: "Log meals for 30 consecutive days", icon: Flame, unlocked: false, progress: 23, total: 30, category: "Consistency" },
    { id: 5, title: "Recipe Collector", description: "Create 10 different recipes", icon: Star, unlocked: false, progress: 6, total: 10, category: "Creativity" },
    { id: 6, title: "Macro Master", description: "Hit all macro goals in a single day", icon: Trophy, unlocked: true,  unlockedDate: "2024-01-20", category: "Nutrition Goals" },
  ];

  const routineTypes = {
    maintain: { title: "Maintain", description: "Keep your current weight and build healthy habits", icon: "⚖️", calories: 2200, protein: 165, carbs: 275, fats: 73, color: "blue" },
    lose:     { title: "Lose",     description: "Create a calorie deficit to lose weight sustainably", icon: "📉", calories: 1800, protein: 180, carbs: 180, fats: 60, color: "rose" },
    gain:     { title: "Gain",     description: "Build muscle with a calorie surplus and high protein", icon: "📈", calories: 2800, protein: 210, carbs: 350, fats: 93, color: "green" },
  };

  const currentRoutine = selectedRoutine ? routineTypes[selectedRoutine] : null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const canSave = !!selectedRoutine && !!experienceLevel;

  // Favoritos reales (3 más recientes)
  const { data: favorites = [], loading: favLoading, error: favError } = useMyFavorites(3, 1);

  function mapMode(m: "maintain" | "lose" | "gain"): "maintenance" | "loss" | "gain" {
    return m === "maintain" ? "maintenance" : m === "lose" ? "loss" : "gain";
  }

  // ---- Cargar plan actual ----
  async function loadLatestPlan() {
    try {
      setLoadingPlan(true);
      setPlanError(null);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me/goals/latest`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load plan");
      const data = await res.json();
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

      // Paso 1: asegurar cookies de sesión + XSRF-TOKEN
      await ensureCsrf();
      const xsrf = getCookie("XSRF-TOKEN") || "";

      // Paso 2: POST protegido con header X-XSRF-TOKEN y credenciales
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me/goals?source=ai`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-XSRF-TOKEN": xsrf,
        },
        body: JSON.stringify({
          mode: mapMode(selectedRoutine),
          experience: experienceLevel,
          activity_level: activityLevel,
          age: Number(age),
          weight: Number(weight),
          height: Number(height),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to save goals");
      }

      const data = await res.json();
      setSaveMsg("Profile & goals saved. Plan version " + (data?.plan?.version ?? "?"));

      // refrescar resumen del plan
      setLatestPlan(data?.plan ?? null); // inmediato con respuesta del POST
    } catch (e: any) {
      setSaveMsg(e?.message || "Unexpected error");
    } finally {
      setSaving(false);
    }
  }

  // helpers visuales
  const TitleCap = ({ children }: { children: React.ReactNode }) => (
    <span className="capitalize">{children as any}</span>
  );
  const fmtInt = (n?: number) => (typeof n === "number" ? Math.round(n) : "-");
  const fmtOneDec = (n?: number) => (typeof n === "number" ? (Math.round(n * 10) / 10).toFixed(1) : "-");

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Home className="h-8 w-8" style={{ color: "#FF9800" }} />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">Welcome back!</h1>
                  <p className="text-muted-foreground">What’s on your plate today?</p>
                </div>
              </div>
              {/* Achievements Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:from-yellow-100 hover:to-orange-100"
                  >
                    <Trophy className="h-4 w-4 text-yellow-600" />
                    <span className="text-yellow-700">Achievements</span>
                    <Badge variant="secondary" className="ml-1 bg-yellow-100 text-yellow-800">
                      {unlockedCount}/{totalCount}
                    </Badge>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl lg:max-w-4xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
                  <DialogHeader className="pb-4">
                    <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                      <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                      Your Achievements
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">
                      You've unlocked {unlockedCount} out of {totalCount} achievements. Keep going to earn more trophies!
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-4 sm:mt-6 space-y-6 sm:space-y-8">
                    {["Getting Started", "Nutrition Goals", "Creativity", "Consistency"].map((category) => {
                      const categoryAchievements = achievements.filter((a) => a.category === category);
                      return (
                        <div key={category} className="space-y-3 sm:space-y-4">
                          <h3 className="text-base sm:text-lg font-semibold text-foreground">{category}</h3>
                          <div className="grid grid-cols-1 gap-3 sm:gap-4">
                            {categoryAchievements.map((achievement) => {
                              const IconComponent = achievement.icon;
                              return (
                                <Card
                                  key={achievement.id}
                                  className={`${achievement.unlocked ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200" : "opacity-60"}`}
                                >
                                  <CardContent className="p-3 sm:p-4">
                                    <div className="flex items-start gap-3">
                                      <div className={`p-2 rounded-lg flex-shrink-0 ${achievement.unlocked ? "bg-yellow-100" : "bg-muted"}`}>
                                        <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${achievement.unlocked ? "text-yellow-600" : "text-muted-foreground"}`} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1 gap-2">
                                          <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">{achievement.title}</h4>
                                          {achievement.unlocked && (
                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs flex-shrink-0">
                                              Unlocked
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">{achievement.description}</p>
                                        {achievement.unlocked ? (
                                          <div className="flex items-center justify-between gap-2">
                                            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs flex-shrink-0">
                                              <Share2 className="h-3 w-3 mr-1" />
                                              Share
                                            </Button>
                                          </div>
                                        ) : (
                                          (achievement as any).progress !== undefined && (
                                            <div className="space-y-1">
                                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>Progress</span>
                                                <span>
                                                  {(achievement as any).progress}/{(achievement as any).total}
                                                </span>
                                              </div>
                                              <Progress value={(((achievement as any).progress || 0) / ((achievement as any).total || 1)) * 100} className="h-2" />
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 sm:pt-6 border-t border-border">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div className="text-center sm:text-left">
                        <h4 className="font-semibold text-sm sm:text-base text-foreground">Share Your Progress</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">Let the community know about your achievements!</p>
                      </div>
                      <Button className="w-full sm:w-auto sm:self-start">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share with Community
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Personal Information & Goals */}
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="pt-4">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg text-foreground">Personal Information</h3>
              </CardTitle>
              <CardDescription>
                <p className="text-sm text-muted-foreground mt-2">
                  Help us calculate your personalized nutrition targets based on your body metrics and fitness level
                </p>
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2">
              {/* Personal Stats Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm font-medium">Weight (kg)</Label>
                  <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-sm font-medium">Height (cm)</Label>
                  <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-medium">Age (years)</Label>
                  <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full" />
                </div>
              </div>

              {/* Experience Level Selection */}
              <div className="space-y-3 border-b border-border pb-6 mb-8">
                <Label className="text-sm font-medium">Experience Level</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setExperienceLevel("beginner")}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${experienceLevel === "beginner" ? "border-primary bg-primary/10 shadow-md" : "border-border hover:border-primary/50 hover:bg-primary/5"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm text-foreground">Beginner</h4>
                      {experienceLevel === "beginner" && <Badge className="bg-primary text-primary-foreground text-xs">Selected</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">New to fitness and nutrition tracking</p>
                  </button>

                  <button
                    onClick={() => setExperienceLevel("advanced")}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${experienceLevel === "advanced" ? "border-primary bg-primary/10 shadow-md" : "border-border hover:border-primary/50 hover:bg-primary/5"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm text-foreground">Advanced</h4>
                      {experienceLevel === "advanced" && <Badge className="bg-primary text-primary-foreground text-xs">Selected</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">Regular training with good knowledge</p>
                  </button>

                  <button
                    onClick={() => setExperienceLevel("professional")}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${experienceLevel === "professional" ? "border-primary bg-primary/10 shadow-md" : "border-border hover:border-primary/50 hover:bg-primary/5"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm text-foreground">Professional</h4>
                      {experienceLevel === "professional" && <Badge className="bg-primary text-primary-foreground text-xs">Selected</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">Athlete or fitness professional</p>
                  </button>
                </div>
              </div>

              {/* Your Fitness Goal */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg text-foreground">Your Fitness Goal</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Choose your routine type and complete your profile for personalized nutrition targets
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Maintain */}
                  <button
                    onClick={() => setSelectedRoutine("maintain")}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${selectedRoutine === "maintain" ? "border-blue-500 bg-blue-50 shadow-lg scale-105" : "border-border hover:border-blue-300 hover:bg-blue-50/50"}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">⚖️</div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">Maintain</h3>
                        {selectedRoutine === "maintain" && <Badge className="bg-blue-500 text-white text-xs">Active</Badge>}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Keep your current weight and build healthy habits</p>
                  </button>

                  {/* Lose */}
                  <button
                    onClick={() => setSelectedRoutine("lose")}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${selectedRoutine === "lose" ? "border-rose-500 bg-rose-50 shadow-lg scale-105" : "border-border hover:border-rose-300 hover:bg-rose-50/50"}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">📉</div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">Lose</h3>
                        {selectedRoutine === "lose" && <Badge className="bg-rose-500 text-white text-xs">Active</Badge>}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Create a calorie deficit to lose weight sustainably</p>
                  </button>

                  {/* Gain */}
                  <button
                    onClick={() => setSelectedRoutine("gain")}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${selectedRoutine === "gain" ? "border-green-500 bg-green-50 shadow-lg scale-105" : "border-border hover:border-green-300 hover:bg-green-50/50"}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">📈</div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">Gain</h3>
                        {selectedRoutine === "gain" && <Badge className="bg-green-500 text-white text-xs">Active</Badge>}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Build muscle with a calorie surplus and high protein</p>
                  </button>
                </div>

                {/* Activity Level */}
                <div className="space-y-3 mt-6">
                  <Label className="text-sm font-medium">Activity Level</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    How active are you throughout the day? This helps calculate your daily calorie needs.
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
                          activityLevel === opt.key ? "border-primary bg-primary/10 shadow-md" : "border-border hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm text-foreground">{opt.label}</h4>
                          {activityLevel === opt.key && <Badge className="bg-primary text-primary-foreground text-xs">Selected</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {opt.key === "sedentary" && "Little to no exercise, desk job"}
                          {opt.key === "light" && "Exercise 1-3 days/week"}
                          {opt.key === "moderate" && "Exercise 3-5 days/week"}
                          {opt.key === "high" && "Exercise 6-7 days/week"}
                          {opt.key === "athlete" && "Intense training 2x/day"}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-6 flex flex-col items-end gap-2">
                  <Button className="w-full sm:w-auto" disabled={!canSave || saving} onClick={handleSave}>
                    {saving ? "Saving..." : "Save Profile Settings"}
                  </Button>
                  {saveMsg && (
                    <p className="text-sm" style={{ color: saveMsg.startsWith("Profile") ? "#2E7D32" : "#D32F2F" }}>
                      {saveMsg}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* --------- Current Plan Summary --------- */}
          <Card className="mb-8">
            <CardHeader className="pt-4">
              <CardTitle className="flex items-center gap-2">
                <FlameKindling className="h-5 w-5" style={{ color: "#FF9800" }} />
                Your Current Plan
              </CardTitle>
              <CardDescription>Latest personalized targets based on your selections</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPlan && <div className="text-sm text-muted-foreground">Loading plan…</div>}
              {planError && <div className="text-sm text-red-600">Error: {planError}</div>}

              {!loadingPlan && !planError && latestPlan && (
                <div className="space-y-6">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      <Dumbbell className="h-3 w-3 mr-1" /> <TitleCap>{latestPlan.experience}</TitleCap>
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      <Activity className="h-3 w-3 mr-1" /> <TitleCap>{latestPlan.activity_level}</TitleCap>
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      <Target className="h-3 w-3 mr-1" /> <TitleCap>{latestPlan.mode}</TitleCap>
                    </Badge>
                    {typeof latestPlan.version === "number" && (
                      <Badge variant="outline">v{latestPlan.version}</Badge>
                    )}
                  </div>

                  {/* Totales base */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Gauge className="h-4 w-4" /> BMR
                      </div>
                      <div className="text-lg font-semibold text-foreground">{fmtInt(latestPlan.bmr)} kcal</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Gauge className="h-4 w-4" /> TDEE
                      </div>
                      <div className="text-lg font-semibold text-foreground">{fmtInt(latestPlan.tdee)} kcal</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Flame className="h-4 w-4" /> Daily Calories
                      </div>
                      <div className="text-lg font-semibold text-foreground">{fmtInt(latestPlan.calorie_target)} kcal</div>
                    </div>
                  </div>

                  {/* Macros */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="p-4 border rounded-lg">
                      <div className="text-xs text-muted-foreground">Protein</div>
                      <div className="text-lg font-semibold text-foreground">{fmtInt(latestPlan.protein_g)} g</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-xs text-muted-foreground">Carbs</div>
                      <div className="text-lg font-semibold text-foreground">{fmtInt(latestPlan.carbs_g)} g</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-xs text-muted-foreground">Fat</div>
                      <div className="text-lg font-semibold text-foreground">{fmtInt(latestPlan.fat_g)} g</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-xs text-muted-foreground">Fiber</div>
                      <div className="text-lg font-semibold text-foreground">{fmtInt(latestPlan.fiber_g)} g</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-xs text-muted-foreground">Water</div>
                      <div className="text-lg font-semibold text-foreground">
                        {fmtOneDec(latestPlan.water_l)} L
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-xs text-muted-foreground">Calorie Split</div>
                      <div className="text-sm text-foreground">
                        Prot {fmtInt(latestPlan.protein_g * 4)} kcal · Fat {fmtInt(latestPlan.fat_g * 9)} kcal · Carbs {fmtInt(latestPlan.carbs_g * 4)} kcal
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!loadingPlan && !planError && !latestPlan && (
                <div className="text-sm text-muted-foreground">
                  No plan yet. Save your profile settings to generate your personalized targets.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Favorites Section */}
          <Card className="mb-8">
            <CardHeader className="pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6" style={{ color: "#FF9800" }} />
                  <div>
                    <CardTitle>Favorite Recipes</CardTitle>
                    <CardDescription>Your most loved meal recipes</CardDescription>
                  </div>
                </div>
                <Link href="/recipes?tab=fav">
                  <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                    View your favorites
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {favLoading && <div className="text-sm text-muted-foreground">Loading favorites…</div>}
              {favError && <div className="text-sm text-red-600">Error loading favorites</div>}
              {!favLoading && !favError && (
                <>
                  {favorites.length === 0 ? (
                    <Card className="border-dashed">
                      <CardContent className="py-8 text-center">
                        <CardTitle className="mb-2">No favorites yet</CardTitle>
                        <CardDescription>Add recipes to your favorites to see them here.</CardDescription>
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
                              <h4 className="font-medium text-foreground line-clamp-1">{r.title}</h4>
                              <Badge variant="secondary" className="capitalize">{r.visibility}</Badge>
                            </div>
                            {r.description && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{r.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{Math.round(r.calories ?? 0)} cal</span>
                              <span>{Math.round(r.protein ?? 0)}g protein</span>
                              <span>{Math.round(r.carbs ?? 0)}g carbs</span>
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

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Create New Recipe */}
            <Link href="/recipes/create">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2">
                      <ChefHat className="h-6 w-6" style={{ color: "#FF9800" }} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Create New Recipe</CardTitle>
                      <CardDescription>Build and save custom recipes</CardDescription>
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

            {/* Add Meals */}
            <Link href="/meals/add">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2">
                      <Target className="h-6 w-6" style={{ color: "#FF9800" }} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Add Meals</CardTitle>
                      <CardDescription>Log your daily nutrition intake</CardDescription>
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

            {/* Discover */}
            <Link href="/discover">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2">
                      <Binoculars className="h-6 w-6" style={{ color: "#FF9800" }} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Discover new recipes</CardTitle>
                      <CardDescription>Explore recipes from around the world</CardDescription>
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pt-4">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" style={{ color: "#FF9800" }} />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Daily Calories</span>
                    <span className="font-medium">1,923</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Protein Goal Hit</span>
                    <span className="font-medium">5/7 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Recipes Created</span>
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
                    <span className="text-sm">Added breakfast: Oatmeal with berries</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-sm">Created recipe: Veggie Stir Fry</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                    <span className="text-sm">Reached protein goal yesterday</span>
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
