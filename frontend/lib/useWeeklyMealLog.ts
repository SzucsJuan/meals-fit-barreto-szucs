"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

type WeeklyItem = {
  date: string;
  dayShort: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

const DEFAULT_TZ =
  (typeof Intl !== "undefined" &&
    Intl.DateTimeFormat().resolvedOptions().timeZone) ||
  "America/Argentina/Buenos_Aires";

export function useWeeklyMealLog(tz: string = DEFAULT_TZ) {
  const [data, setData] = useState<WeeklyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeekly = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("tz", tz);

      const json = await api<WeeklyItem[] | null>(
        `/api/meal-logs/weekly?${params.toString()}`
      );

      setData(Array.isArray(json) ? json : []);
    } catch (e: any) {
      const msg = e?.message ?? "Unknown error";

      // Si el backend eventualmente devuelve 204/404, api() puede tirar error;
      // en ese caso tratamos como "sin datos" si es 404.
      if (msg.includes("404") || msg.includes("204")) {
        setData([]);
        setError(null);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekly();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tz]);

  const barData = useMemo(
    () =>
      data.map((d) => ({
        day: d.dayShort,
        calories: Math.round(d.calories),
        protein: Math.round(d.protein),
        carbs: Math.round(d.carbs),
        fats: Math.round(d.fats),
        rawDate: d.date,
      })),
    [data]
  );

  return { data, barData, loading, error, refetch: fetchWeekly };
}
