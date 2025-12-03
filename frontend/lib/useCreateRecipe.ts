// hooks/useCreateRecipe.ts
"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export type Unit = "g" | "ml" | "unit" | "";

export type FormRow = {
  tempId: number;
  ingredient_id: number | null;
  quantity: string;
  unit: Unit | "";
  notes?: string;
};

export function useCreateRecipe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createRecipe(payload: {
    title: string;
    description: string;
    stepsList: string[];
    visibility: "public" | "unlisted" | "private";
    servings: string;
    prepTime: string;
    cookTime: string;
    rows: FormRow[];
  }) {
    setLoading(true);
    setError(null);

    try {
      const ingredients = payload.rows
        .filter((r) => r.ingredient_id && r.quantity && r.unit)
        .map((r) => ({
          ingredient_id: r.ingredient_id!,
          quantity: Number(r.quantity),
          unit: r.unit as Unit,
          notes: r.notes?.trim() || undefined,
        }));

      const steps = payload.stepsList
        .map((s) => s.trim())
        .filter(Boolean)
        .join("\n");

      const body = {
        title: payload.title,
        description: payload.description || null,
        steps,
        visibility: payload.visibility,
        servings: Number(payload.servings || 1),
        prep_time_minutes: Number(payload.prepTime || 0),
        cook_time_minutes: Number(payload.cookTime || 0),
        ingredients,
      };

      const json = await api<any>("/api/recipes", {
        method: "POST",
        json: body,
      });

      return json;
    } catch (e: any) {
      const msg = e?.message || "Error al crear la receta";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { createRecipe, loading, error };
}
