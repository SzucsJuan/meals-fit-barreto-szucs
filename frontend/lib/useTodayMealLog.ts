"use client";

import { useEffect, useMemo, useState } from "react";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealDetailDTO {
  id: number;
  meal_type: MealType;
  ingredient_id: number | null;
  recipe_id: number | null;
  servings: number;
  grams: number | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  logged_at: string | null;
  ingredient?: { id: number; name: string } | null;
  recipe?: { id: number; title: string } | null;
}

export interface MealLogDTO {
  id: number;
  user_id: number;
  log_date: string;
  notes: string | null;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  details: MealDetailDTO[];
}

export function useTodayMealLog() {
  const [data, setData] = useState<MealLogDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

   function todayISODate() {
    const d = new Date();
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
      .toISOString().slice(0, 10);
  }

   async function refetch(date = todayISODate()) {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/meals`);
      url.searchParams.set("date", date);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 204 || res.status === 404) {
        setData(null);
      } else if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      } else {
        const json = await res.json();
        setData(json);
      }
    } catch (e: any) {
      setError(e.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refetch(); }, []);

  const grouped = useMemo(() => {
    const map: Record<MealType, MealDetailDTO[]> = {
      breakfast: [], lunch: [], dinner: [], snack: [],
    };
    (data?.details ?? []).forEach(d => { map[d.meal_type]?.push(d); });
    return map;
  }, [data]);

  const mealCards = useMemo(() => {
    const out: {
      type: string;
      details: MealDetailDTO[];
      totals: { calories: number; protein: number; carbs: number; fats: number };
    }[] = [];

    (["breakfast", "lunch", "dinner", "snack"] as MealType[]).forEach(mt => {
      const details = grouped[mt];
      if (!details?.length) return;
      const totals = details.reduce((acc, f) => {
        acc.calories += f.calories;
        acc.protein  += f.protein;
        acc.carbs    += f.carbs;
        acc.fats     += f.fat;
        return acc;
      }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
      const label = mt[0].toUpperCase() + mt.slice(1);
      out.push({ type: label, details, totals });
    });

    return out;
  }, [grouped]);

  // Totales del día
  const dayTotals = useMemo(() => ({
    calories: Math.round(data?.total_calories ?? 0),
    protein:  Math.round(data?.total_protein ?? 0),
    carbs:    Math.round(data?.total_carbs ?? 0),
    fats:     Math.round(data?.total_fat ?? 0),
  }), [data]);

  return { data, loading, error, refetch, mealCards, dayTotals };
}
