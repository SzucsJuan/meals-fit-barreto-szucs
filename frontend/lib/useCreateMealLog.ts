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
  user_id: number;            // si no hay auth, envialo; si tenés Sanctum, el back puede ignorarlo
  log_date: string;
  notes?: string | null;
  details: CreateMealItem[];
}

export function useCreateMealLog() {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  async function createMealLog(payload: CreateMealLogPayload) {
    setLoading(true);
    setError(null);

    const body = {
      user_id: Number(payload.user_id),
      log_date: s.text(payload.log_date, 10),             
      notes: payload.notes ?? null,
      details: payload.details.map(d => ({
        ingredient_id: Number(d.ingredient_id),
        servings: Number(d.servings),
        grams: (d.grams ?? null) as number | null,
        meal_type: d.meal_type,
        logged_at: d.logged_at ?? null,
      })),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/meal-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
        const err = await res.json();
        if (err?.message) msg = `${msg} – ${err.message}`;
        // si hay validation errors:
        if (err?.errors) {
        const first = Object.values(err.errors).flat?.()[0];
        if (first) msg = `${msg} – ${first}`;
        }
    } catch {
    }
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
