"use client";

import { useEffect, useMemo, useState } from "react";


type WeeklyItem = {
  date: string;      
  dayShort: string;  
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export function useWeeklyMealLog(userId: number, tz: string = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Argentina/Buenos_Aires") {
  const [data, setData] = useState<WeeklyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeekly = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/meal-logs/weekly?user_id=${userId}&tz=${encodeURIComponent(tz)}`, {
        headers: { "Accept": "application/json" },
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json: WeeklyItem[] = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekly();
  }, [userId, tz]);

  const barData = useMemo(() => {
    return data.map(d => ({
      day: d.dayShort,
      calories: Math.round(d.calories),
      protein: Math.round(d.protein),
      carbs: Math.round(d.carbs),
      fats: Math.round(d.fats),
      rawDate: d.date,
    }));
  }, [data]);

  return { data, barData, loading, error, refetch: fetchWeekly };
}
