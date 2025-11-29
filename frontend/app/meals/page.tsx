"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, TrendingUp, Edit, Trash2, X, Search } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useTodayMealLog } from "@/lib/useTodayMealLog";
import { useWeeklyMealLog } from "@/lib/useWeeklyMealLog";
import RequireAuth from "@/components/RequireAuth";
import Navigation from "@/components/navigation";

type IngredientOpt = { id: number; name: string };

type Detail = {
  id: number;
  ingredient?: { id: number; name: string } | null;
  recipe?: { id: number; title: string } | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type MealCard = {
  type: string;
  totals: { calories: number; protein: number; carbs: number; fats: number };
  details: Detail[];
  mealLogId?: number;
};

type PlanDTO = {
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

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
  return match ? match[2] : null;
}

async function ensureCsrfCookie(apiBase = "") {
  await fetch(`${apiBase}/sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
}

function IngredientSelector({
  valueId,
  onChange,
  defaultLabel = "",
}: {
  valueId: number | "";
  onChange: (opt: IngredientOpt) => void;
  defaultLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<IngredientOpt[]>([]);
  const [selectedLabel, setSelectedLabel] = useState(defaultLabel);

  useEffect(() => {
    let alive = true;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const url = `/api/ingredients?search=${encodeURIComponent(query)}&limit=20`;
        const res = await fetch(url, {
          credentials: "include",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        const data = await res.json();
        if (alive) setOptions(Array.isArray(data) ? data : data?.data ?? []);
      } catch {
        if (alive) setOptions([]);
      } finally {
        if (alive) setLoading(false);
      }
    }, 250);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [query]);

  useEffect(() => {
    if (!open || options.length) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/ingredients?limit=20`, {
          credentials: "include",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        const data = await res.json();
        setOptions(Array.isArray(data) ? data : data?.data ?? []);
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, options.length]);

  useEffect(() => {
    setSelectedLabel(defaultLabel);
  }, [defaultLabel]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-left text-sm"
      >
        {selectedLabel || (valueId ? `ID: ${valueId}` : "Elegí un ingrediente…")}
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-background shadow-xl">
          <div className="flex items-center gap-2 p-2 border-b border-border">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar ingrediente…"
              className="flex-1 bg-transparent text-sm outline-none"
            />
            <button className="p-1 rounded hover:bg-muted" onClick={() => setOpen(false)} aria-label="Cerrar">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-64 overflow-auto">
            {loading ? (
              <div className="p-3 text-sm text-muted-foreground">Buscando…</div>
            ) : options.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">Sin resultados</div>
            ) : (
              <ul className="py-1">
                {options.map((opt) => (
                  <li key={opt.id}>
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                      onClick={() => {
                        onChange(opt);
                        setSelectedLabel(opt.name);
                        setOpen(false);
                      }}
                    >
                      {opt.name}
                      <span className="ml-2 text-xs text-muted-foreground">#{opt.id}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function xsrfHeaderValue() {
  const xsrf = getCookie("XSRF-TOKEN");
  return xsrf ? decodeURIComponent(xsrf) : "";
}

async function apiUpdateMealDetail(
  detailId: number,
  payload: { ingredient_id: number; grams: number },
  apiBase = ""
) {
  await ensureCsrfCookie(apiBase);
  const res = await fetch(`${apiBase}/api/meal-details/${detailId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": xsrfHeaderValue(),
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.text().catch(() => "")) || `HTTP ${res.status}`);
  return res.json();
}

async function apiDeleteMealDetail(detailId: number, apiBase = "") {
  await ensureCsrfCookie(apiBase);
  const res = await fetch(`${apiBase}/api/meal-details/${detailId}`, {
    method: "DELETE",
    credentials: "include",
    headers: { Accept: "application/json", "X-XSRF-TOKEN": xsrfHeaderValue() },
    cache: "no-store",
  });
  if (!res.ok && res.status !== 204) throw new Error((await res.text().catch(() => "")) || `HTTP ${res.status}`);
  return true;
}

async function apiDeleteMealLog(mealLogId: number, apiBase = "") {
  await ensureCsrfCookie(apiBase);
  const res = await fetch(`${apiBase}/api/meal-logs/${mealLogId}`, {
    method: "DELETE",
    credentials: "include",
    headers: { Accept: "application/json", "X-XSRF-TOKEN": xsrfHeaderValue() },
    cache: "no-store",
  });
  if (!res.ok && res.status !== 204) throw new Error((await res.text().catch(() => "")) || `HTTP ${res.status}`);
  return true;
}

// Fallback: borrar todos los detalles de un meal
async function apiBulkDeleteDetails(detailIds: number[], apiBase = "") {
  for (const id of detailIds) {
    await apiDeleteMealDetail(id, apiBase);
  }
  return true;
}

export default function MealsPage() {
  const [selectedView, setSelectedView] = useState<"today" | "week">("today");

  const { dayTotals, mealCards, loading, error, refetch } = useTodayMealLog();
  const {
    barData: weeklyData,
    loading: wLoading,
    error: wError,
    refetch: wRefetch,
  } = useWeeklyMealLog();

  // Trae las goals desde el plan del usuario
  const [goals, setGoals] = useState({
    calories: 2200,
    protein: 165,
    carbs: 275,
    fats: 73,
  });
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [goalsError, setGoalsError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoadingGoals(true);
        setGoalsError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/me/goals/latest`,
          {
            method: "GET",
            credentials: "include",
            headers: { Accept: "application/json" },
            cache: "no-store",
          }
        );

        if (!res.ok) throw new Error("Failed to load goals");

        const data: any = await res.json();
        const plan: PlanDTO | null = (data?.plan as PlanDTO) ?? null;

        if (plan) {
          setGoals({
            calories: Math.round(plan.calorie_target ?? 0),
            protein: Math.round(plan.protein_g ?? 0),
            carbs: Math.round(plan.carbs_g ?? 0),
            fats: Math.round(plan.fat_g ?? 0),
          });
        }
      } catch (e: any) {
        setGoalsError(e?.message || "Unexpected error");
      } finally {
        setLoadingGoals(false);
      }
    })();
  }, []);

  const macroData = useMemo(
    () => [
      { name: "Protein", value: dayTotals.protein, color: "#F74800" },
      { name: "Carbs", value: dayTotals.carbs, color: "#629178" },
      { name: "Fats", value: dayTotals.fats, color: "#475569" },
    ],
    [dayTotals]
  );

  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editingDetail, setEditingDetail] = useState<Detail | null>(null);

  const [ingredientId, setIngredientId] = useState<number | "">("");
  const [ingredientNameHint, setIngredientNameHint] = useState<string>("");
  const [grams, setGrams] = useState<number | "">("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingDetail, setDeletingDetail] = useState<Detail | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [deleteLogOpen, setDeleteLogOpen] = useState(false);
  const [deletingMeal, setDeletingMeal] = useState<MealCard | null>(null);
  const [deleteLogLoading, setDeleteLogLoading] = useState(false);
  const [deleteLogError, setDeleteLogError] = useState<string | null>(null);

  function openEdit(detail: Detail) {
    setEditingDetail(detail);
    setEditError(null);

    if (detail.ingredient) {
      setIngredientId(detail.ingredient.id);
      setIngredientNameHint(detail.ingredient.name || "");
    } else {
      setIngredientId("");
      setIngredientNameHint("");
    }
    setGrams("");
    setEditOpen(true);
  }
  function closeEdit() {
    setEditOpen(false);
    setEditingDetail(null);
    setEditError(null);
    setIngredientId("");
    setIngredientNameHint("");
    setGrams("");
  }
  async function handleSave() {
    if (!editingDetail) return;
    try {
      setEditLoading(true);
      setEditError(null);
      const iid = Number(ingredientId);
      const g = Number(grams);
      if (!iid || isNaN(iid)) throw new Error("Ingresá un ingrediente válido.");
      if (!g || isNaN(g) || g <= 0) throw new Error("Ingresá una cantidad (gramos/unidades) válida.");
      await apiUpdateMealDetail(editingDetail.id, { ingredient_id: iid, grams: g });
      await refetch();
      closeEdit();
    } catch (e: any) {
      setEditError(e?.message || "Error al guardar");
    } finally {
      setEditLoading(false);
    }
  }

  function openDelete(detail: Detail) {
    setDeletingDetail(detail);
    setDeleteError(null);
    setDeleteOpen(true);
  }
  function closeDelete() {
    setDeleteOpen(false);
    setDeletingDetail(null);
    setDeleteError(null);
  }
  async function handleConfirmDelete() {
    if (!deletingDetail) return;
    try {
      setDeleteLoading(true);
      setDeleteError(null);
      await apiDeleteMealDetail(deletingDetail.id);
      await refetch();
      closeDelete();
    } catch (e: any) {
      setDeleteError(e?.message || "Error al eliminar");
    } finally {
      setDeleteLoading(false);
    }
  }

  // Deletear meal completo
  function openDeleteLog(meal: MealCard) {
    setDeletingMeal(meal);
    setDeleteLogError(null);
    setDeleteLogOpen(true);
  }
  function closeDeleteLog() {
    setDeleteLogOpen(false);
    setDeletingMeal(null);
    setDeleteLogError(null);
  }
  async function handleConfirmDeleteLog() {
    if (!deletingMeal) return;
    try {
      setDeleteLogLoading(true);
      setDeleteLogError(null);

      if (deletingMeal.mealLogId) {
        await apiDeleteMealLog(deletingMeal.mealLogId);
      } else {
        const ids = deletingMeal.details.map((d) => d.id);
        await apiBulkDeleteDetails(ids);
      }

      await refetch();
      closeDeleteLog();
    } catch (e: any) {
      setDeleteLogError(e?.message || "Error al eliminar el log");
    } finally {
      setDeleteLogLoading(false);
    }
  }

  const caloriesGoal = goals.calories || 1;
  const proteinGoal = goals.protein || 1;
  const carbsGoal = goals.carbs || 1;
  const fatsGoal = goals.fats || 1;

  const caloriesPct = Math.min(100, (dayTotals.calories / caloriesGoal) * 100);
  const proteinPct = Math.min(100, (dayTotals.protein / proteinGoal) * 100);
  const carbsPct = Math.min(100, (dayTotals.carbs / carbsGoal) * 100);
  const fatsPct = Math.min(100, (dayTotals.fats / fatsGoal) * 100);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8" style={{ color: "#FF9800" }} />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Meal Tracking</h1>
                  <p className="text-muted-foreground">Monitor your daily nutrition intake</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex p-2">
                  <Button
                    variant={selectedView === "today" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedView("today")}
                    className="mr-1"
                  >
                    Today
                  </Button>
                  <Button
                    variant={selectedView === "week" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedView("week")}
                  >
                    Week
                  </Button>
                </div>
                <Link href="/meals/add">
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Meal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
          {error && <div className="text-sm text-red-600">Error: {error}</div>}
          {goalsError && (
            <div className="text-xs text-red-600 mb-4">
              Error loading goals: {goalsError} (usando valores por defecto)
            </div>
          )}

          {selectedView === "today" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Calories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{Math.round(dayTotals.calories)}</div>
                    <div className="text-xs text-muted-foreground">of {Math.round(goals.calories)} goal</div>
                    <Progress value={caloriesPct} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Protein</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{Math.round(dayTotals.protein)}g</div>
                    <div className="text-xs text-muted-foreground">of {Math.round(goals.protein)}g goal</div>
                    <Progress value={proteinPct} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Carbs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{Math.round(dayTotals.carbs)}g</div>
                    <div className="text-xs text-muted-foreground">of {Math.round(goals.carbs)}g goal</div>
                    <Progress value={carbsPct} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Fats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{Math.round(dayTotals.fats)}g</div>
                    <div className="text-xs text-muted-foreground">of {Math.round(goals.fats)}g goal</div>
                    <Progress value={fatsPct} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader className="pt-4">
                    <CardTitle>Macro Distribution</CardTitle>
                    <CardDescription>Today's macronutrient breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={macroData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {macroData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}g`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      {macroData.map((macro) => (
                        <div key={macro.name} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: macro.color }}
                          />
                          <span className="text-sm text-muted-foreground">{macro.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pt-4">
                    <CardTitle>Calorie Progress</CardTitle>
                    <CardDescription>Daily calorie intake vs goal</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Current Intake</span>
                        <span className="font-bold text-2xl text-primary">
                          {Math.round(dayTotals.calories)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Daily Goal</span>
                        <span className="font-medium">{Math.round(goals.calories)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Remaining</span>
                        <span className="font-medium">
                          {Math.round(goals.calories - dayTotals.calories)}
                        </span>
                      </div>
                      <Progress value={caloriesPct} className="h-3" />
                      <div className="text-center text-sm text-muted-foreground">
                        {Math.round(caloriesPct)}% of daily goal
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">Today's Meals</h2>
                  <div className="flex gap-2">
                    <Link href="/meals/add">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Meal
                      </Button>
                    </Link>
                  </div>
                </div>

                {mealCards.length === 0 && !loading && (
                  <Card>
                    <CardContent className="py-6 text-sm text-muted-foreground">
                      No meals logged today.
                    </CardContent>
                  </Card>
                )}

                {mealCards.map((meal: MealCard, idx: number) => (
                  <Card key={idx}>
                    <CardHeader className="pt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{meal.type}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteLog(meal)}
                            aria-label="Eliminar log completo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {meal.details.map((d) => {
                          const label =
                            d.ingredient?.name ?? d.recipe?.title ?? `Item #${d.id}`;
                          return (
                            <div
                              key={d.id}
                              className="flex items-center justify-between py-2 border-b border-border last:border-0"
                            >
                              <div>
                                <div className="font-medium text-foreground">{label}</div>
                                <div className="text-sm text-muted-foreground">
                                  {Math.round(d.calories)} cal •{" "}
                                  {Math.round(d.protein)}g protein •{" "}
                                  {Math.round(d.carbs)}g carbs • {Math.round(d.fat)}g fats
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEdit(d)}
                                  aria-label="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openDelete(d)}
                                  className="text-red-600 hover:text-red-700"
                                  aria-label="Eliminar ítem"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="font-medium text-foreground">Meal Total</span>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium text-primary">
                              {Math.round(meal.totals.calories)} cal
                            </span>{" "}
                            • {Math.round(meal.totals.protein)}g protein •{" "}
                            {Math.round(meal.totals.carbs)}g carbs •{" "}
                            {Math.round(meal.totals.fats)}g fats
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Weekly Nutrition Trends</CardTitle>
                      <CardDescription>
                        Your nutrition intake over the past week
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => wRefetch()}>
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {wLoading && (
                    <div className="text-sm text-muted-foreground">
                      Loading weekly data…
                    </div>
                  )}
                  {wError && (
                    <div className="text-sm text-red-600">Error: {wError}</div>
                  )}
                  {!wLoading && !wError && (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="calories" name="Calories" fill="#FC9A0E" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pt-4">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Weekly Average
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!wLoading && !wError ? (
                      <div className="text-sm text-muted-foreground">
                        {Math.round(
                          weeklyData.reduce(
                            (a, d) => a + (d.calories || 0),
                            0
                          ) / Math.max(weeklyData.length, 1)
                        )}{" "}
                        cal/día
                      </div>
                    ) : (
                      "—"
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pt-4">
                    <CardTitle>Goals Met</CardTitle>
                  </CardHeader>
                  <CardContent>Conectaremos luego</CardContent>
                </Card>

                <Card>
                  <CardHeader className="pt-4">
                    <CardTitle>Streak</CardTitle>
                  </CardHeader>
                  <CardContent>Conectaremos luego</CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeEdit} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-background shadow-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Edit Log</h3>
              <button
                onClick={closeEdit}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">Ingredient</label>
                  <IngredientSelector
                    valueId={ingredientId}
                    defaultLabel={ingredientNameHint}
                    onChange={(opt) => {
                      setIngredientId(opt.id);
                      setIngredientNameHint(opt.name);
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-muted-foreground">
                    Quantity (grams or units)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Ej: 150"
                    value={grams}
                    onChange={(e) =>
                      setGrams(e.target.value === "" ? "" : Number(e.target.value))
                    }
                  />
                </div>
              </div>

              {editError && <div className="text-sm text-red-600">{editError}</div>}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={closeEdit} disabled={editLoading}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={editLoading}>
                  {editLoading ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteOpen && deletingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeDelete} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-background shadow-xl border border-border p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">Delete ítem</h3>
              <button
                onClick={closeDelete}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {deletingDetail.ingredient?.name ??
                  deletingDetail.recipe?.title ??
                  `Item #${deletingDetail.id}`}
              </span>
              ? This action can't be undone.
            </p>

            {deleteError && (
              <div className="text-sm text-red-600 mb-3">{deleteError}</div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeDelete} disabled={deleteLoading}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {deleteLogOpen && deletingMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeDeleteLog} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-background shadow-xl border border-border p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">Delete entire log</h3>
              <button
                onClick={closeDeleteLog}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete the entire meal? This action can't be
              undone.
            </p>

            {deleteLogError && (
              <div className="text-sm text-red-600 mb-3">{deleteLogError}</div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={closeDeleteLog}
                disabled={deleteLogLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDeleteLog}
                disabled={deleteLogLoading}
              >
                {deleteLogLoading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </RequireAuth>
  );
}
