"use client";

import { useState } from "react";
import { s } from "./sanitize";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface CreateMealItem {
  ingredient_id: number;
  name?: string;
  servings: number;
  grams?: number | null;
  meal_type: MealType;
  logged_at?: string | null;
}

export interface CreateMealLogPayload {
  log_date: string;
  notes?: string | null;
  details: CreateMealItem[];
}

export function useCreateMealLog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lee la cookie del navegador
  function getCookie(name: string) {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(
      new RegExp("(^|; )" + name + "=([^;]*)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  }

  async function createMealLog(payload: CreateMealLogPayload) {
    setLoading(true);
    setError(null);

    const body = {
      log_date: s.text(payload.log_date, 10),
      notes: payload.notes ?? null,
      details: payload.details.map((d) => ({
        ingredient_id: Number(d.ingredient_id),
        servings: Number(d.servings),
        grams: (d.grams ?? null) as number | null,
        meal_type: d.meal_type,
        logged_at: d.logged_at ?? null,
      })),
    };

    const xsrf = getCookie("XSRF-TOKEN");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/meals`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          ...(xsrf ? { "X-XSRF-TOKEN": xsrf } : {}),
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      try {
        const err = await res.json();
        if (err?.message) msg = `${msg} – ${err.message}`;
        if (err?.errors) {
          const first = (Object.values(err.errors) as any).flat?.()[0];
          if (first) msg = `${msg} – ${first}`;
        }
      } catch {}
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }

    const json = await res.json();
    setLoading(false);
    return json;
  }

  return { createMealLog, loading, error };
}
