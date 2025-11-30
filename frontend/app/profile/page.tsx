"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/navigation";
import RequireAuth from "@/components/RequireAuth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Target } from "lucide-react";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

async function ensureCsrf() {
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  await fetch(`${BASE}sanctum/csrf-cookie`, {
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

  weight?: number | null;
  height?: number | null;
  age?: number | null;
};

type ProfileDTO = {
  weight?: number | null;
  height?: number | null;
  age?: number | null;
};

type RoutineKey = "maintain" | "lose" | "gain";

function mapModeToApi(m: RoutineKey): "maintenance" | "loss" | "gain" {
  if (m === "maintain") return "maintenance";
  if (m === "lose") return "loss";
  return "gain";
}

function mapModeFromApi(m: "maintenance" | "loss" | "gain"): RoutineKey {
  if (m === "maintenance") return "maintain";
  if (m === "loss") return "lose";
  return "gain";
}

/* ===== Page ===== */

export default function ProfilePage() {
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineKey | null>(null);
  const [experienceLevel, setExperienceLevel] =
    useState<"beginner" | "advanced" | "professional" | null>(null);

  const [activityLevel, setActivityLevel] = useState<
    "sedentary" | "light" | "moderate" | "high" | "athlete"
  >("moderate");

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const canSave = !!selectedRoutine && !!experienceLevel && !!weight && !!height && !!age;

useEffect(() => {
  (async () => {
    try {
      setLoadingInitial(true);
      setLoadError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me/goals/latest`,
        {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
          cache: "no-store",
        }
      );

      if (!res.ok) throw new Error("Failed to load profile");

      const data: any = await res.json();

      const plan: Plan | null = (data?.plan as Plan) ?? null;
      const profile: ProfileDTO | null = (data?.profile as ProfileDTO) ?? null;

      if (plan) {
        setSelectedRoutine(mapModeFromApi(plan.mode)); 
        setExperienceLevel(plan.experience);
        setActivityLevel(plan.activity_level);
      }

      const w = profile?.weight;
      const h = profile?.height;
      const a = profile?.age;

      setWeight(typeof w === "number" ? String(w) : "");
      setHeight(typeof h === "number" ? String(h) : "");
      setAge(typeof a === "number" ? String(a) : "");
    } catch (e: any) {
      setLoadError(e?.message || "Unexpected error");
    } finally {
      setLoadingInitial(false);
    }
  })();
}, []);

  //Esto maneja el guardado del perfil del usuario
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

      await ensureCsrf();
      const xsrf = getCookie("XSRF-TOKEN") || "";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me/goals?source=ai`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-XSRF-TOKEN": xsrf,
          },
          body: JSON.stringify({
            mode: mapModeToApi(selectedRoutine),
            experience: experienceLevel,
            activity_level: activityLevel,
            age: Number(age),
            weight: Number(weight),
            height: Number(height),
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to save goals");
      }

      const data = await res.json();
      const plan: Plan | null = (data?.plan as Plan) ?? null;

      if (plan) {
        setExperienceLevel(plan.experience);
        setActivityLevel(plan.activity_level);
        setSelectedRoutine(mapModeFromApi(plan.mode));
      }

      setSaveMsg("Profile & goals saved. Plan version " + (plan?.version ?? "?"));
    } catch (e: any) {
      setSaveMsg(e?.message || "Unexpected error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8" style={{ color: "#4CAF50" }} />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  My Profile
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage your personal information and fitness goals.
                </p>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="pt-4">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg text-foreground">
                  Personal Information
                </h3>
              </CardTitle>
              <CardDescription>
                <p className="text-sm text-muted-foreground mt-2">
                  Help us calculate your personalized nutrition targets based on
                  your body metrics and fitness level.
                </p>
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2">
              {loadingInitial && (
                <p className="text-xs text-muted-foreground mb-3">
                  Loading your current profile…
                </p>
              )}
              {loadError && !loadingInitial && (
                <p className="text-xs text-red-600 mb-3">Error: {loadError}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm font-medium">
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
                  <Label htmlFor="height" className="text-sm font-medium">
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
                  <Label htmlFor="age" className="text-sm font-medium">
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
                <Label className="text-sm font-medium">Experience Level</Label>
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
                  personalized nutrition targets.
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
                  <Label className="text-sm font-medium">Activity Level</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    How active are you throughout the day? This helps calculate
                    your daily calorie needs.
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
                          {opt.key === "light" && "Exercise 1-3 days/week"}
                          {opt.key === "moderate" && "Exercise 3-5 days/week"}
                          {opt.key === "high" && "Exercise 6-7 days/week"}
                          {opt.key === "athlete" && "Intense training 2x/day"}
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
        </main>
      </div>
    </RequireAuth>
  );
}
