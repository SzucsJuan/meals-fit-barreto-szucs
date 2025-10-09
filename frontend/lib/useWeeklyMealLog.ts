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

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[2]) : null;
}

const DEFAULT_TZ =
  (typeof Intl !== "undefined" &&
    Intl.DateTimeFormat().resolvedOptions().timeZone) ||
  "America/Argentina/Buenos_Aires";

export function useWeeklyMealLog(tz: string = DEFAULT_TZ) {
  const [data, setData] = useState<WeeklyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchWeekly = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = new URL(`${apiBase}/api/meal-logs/weekly`);
      url.searchParams.set("tz", tz);

      const xsrf = getCookie("XSRF-TOKEN");

      const res = await fetch(url.toString(), {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          ...(xsrf ? { "X-XSRF-TOKEN": xsrf } : {}),
        },
        cache: "no-store",
      });

      if (res.status === 204) {
        setData([]);
        return;
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json: WeeklyItem[] = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekly();
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
