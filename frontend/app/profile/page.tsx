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
import { api } from "@/lib/api";

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

  weight?: number | string | null;
  height?: number | string | null;
  age?: number | string | null;
};

type ProfileDTO = {
  weight?: number | string | null;
  height?: number | string | null;
  age?: number | string | null;
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
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineKey | null>(
    null
  );
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

  const canSave =
    !!selectedRoutine && !!experienceLevel && !!weight && !!height && !!age;

  // helper para normalizar valor numérico (number o string) a string de input
  function normalizeNumericField(
    value: number | string | null | undefined
  ): string {
    if (value === null || value === undefined) return "";
    const v = String(value).trim();
    if (!v) return "";
    // small sanity check: si no es número, devolvemos tal cual para debug
    return isNaN(Number(v)) ? v : v;
  }

  // Carga inicial del último plan/perfil
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoadingInitial(true);
        setLoadError(null);

        const data: any = await api<any>("/api/me/goals/latest", {
          method: "GET",
        });

        const plan: Plan | null = (data?.plan as Plan) ?? null;
        const profile: ProfileDTO | null =
          (data?.profile as ProfileDTO) ?? null;

        if (!cancelled) {
          if (plan) {
            setSelectedRoutine(mapModeFromApi(plan.mode));
            setExperienceLevel(plan.experience);
            setActivityLevel(plan.activity_level);
          }

          // Tomamos primero de profile, y si no hay, de plan
          const w = profile?.weight ?? plan?.weight ?? null;
          const h = profile?.height ?? plan?.height ?? null;
          const a = profile?.age ?? plan?.age ?? null;

          setWeight(normalizeNumericField(w));
          setHeight(normalizeNumericField(h));
          setAge(normalizeNumericField(a));
        }
      } catch (e: any) {
        if (!cancelled) {
          setLoadError(e?.message || "Unexpected error");
        }
      } finally {
        if (!cancelled) {
          setLoadingInitial(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Maneja el guardado del perfil del usuario + generación de plan
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

      const data: any = await api<any>("/api/me/goals?source=ai", {
        method: "POST",
        json: {
          mode: mapModeToApi(selectedRoutine),
          experience: experienceLevel,
          activity_level: activityLevel,
          age: Number(age),
          weight: Number(weight),
          height: Number(height),
        },
      });

      const plan: Plan | null = (data?.plan as Plan) ?? null;

      if (plan) {
        setExperienceLevel(plan.experience);
        setActivityLevel(plan.activity_level);
        setSelectedRoutine(mapModeFromApi(plan.mode));

        // si el backend devuelve los valores normalizados, también actualizamos
        const w = plan.weight ?? Number(weight);
        const h = plan.height ?? Number(height);
        const a = plan.age ?? Number(age);

        setWeight(normalizeNumericField(w));
        setHeight(normalizeNumericField(h));
        setAge(normalizeNumericField(a));
      }

      setSaveMsg(
        "Profile & goals saved. Plan version " + (plan?.version ?? "?")
      );
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

              {/* resto de la UI igual que antes */}

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

                {/* Resto igual, no lo repito para no hacerlo eterno */}
                {/* ... */}
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
