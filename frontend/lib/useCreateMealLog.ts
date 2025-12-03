"use client";

import { useState } from "react";
import { s } from "./sanitize";
import { api } from "@/lib/api";

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

    try {
      const json = await api<any>("/api/meals", {
        method: "POST",
        json: body,
      });
      setLoading(false);
      return json;
    } catch (e: any) {
      const msg = e?.message ?? "Error creating meal log";
      setError(msg);
      setLoading(false);
      throw e;
    }
  }

  return { createMealLog, loading, error };
}
