"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

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

function todayISODate() {
  const d = new Date();
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    .toISOString()
    .slice(0, 10);
}

export function useTodayMealLog() {
  const [data, setData] = useState<MealLogDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refetch(date = todayISODate()) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("date", date);

      const json = await api<MealLogDTO | null>(
        `/api/meals?${params.toString()}`
      );

      // api() ya devuelve null en 204; si no hay log, dejamos en null
      setData(json ?? null);
    } catch (e: any) {
      const msg = e?.message ?? "Error";

      // Si el backend devuelve 404 para "no hay log", lo tratamos como "sin datos"
      if (msg.includes("404")) {
        setData(null);
        setError(null);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grouped = useMemo(() => {
    const map: Record<MealType, MealDetailDTO[]> = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };
    (data?.details ?? []).forEach((d) => {
      map[d.meal_type]?.push(d);
    });
    return map;
  }, [data]);

  const mealCards = useMemo(() => {
    const out: {
      type: string;
      details: MealDetailDTO[];
      totals: { calories: number; protein: number; carbs: number; fats: number };
      mealLogId?: number;
    }[] = [];

    (["breakfast", "lunch", "dinner", "snack"] as MealType[]).forEach((mt) => {
      const details = grouped[mt];
      if (!details?.length) return;

      const totals = details.reduce(
        (acc, f) => {
          acc.calories += f.calories;
          acc.protein += f.protein;
          acc.carbs += f.carbs;
          acc.fats += f.fat;
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
      );

      const label = mt[0].toUpperCase() + mt.slice(1);
      out.push({
        type: label,
        details,
        totals,
        mealLogId: data?.id,
      });
    });

    return out;
  }, [grouped, data?.id]);

  // Totales del día
  const dayTotals = useMemo(
    () => ({
      calories: Math.round(data?.total_calories ?? 0),
      protein: Math.round(data?.total_protein ?? 0),
      carbs: Math.round(data?.total_carbs ?? 0),
      fats: Math.round(data?.total_fat ?? 0),
    }),
    [data]
  );

  return { data, loading, error, refetch, mealCards, dayTotals };
}
