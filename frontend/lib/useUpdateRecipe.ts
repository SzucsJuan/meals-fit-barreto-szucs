"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export type Unit = "g" | "ml" | "unit";

export interface EditRow {
  tempId: number;
  ingredient_id: number | null;
  quantity: string;
  unit: Unit | "";
  notes?: string;
}

export function useUpdateRecipe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateRecipe(
    id: number | string,
    payload: {
      title: string;
      description: string;
      stepsText: string;
      visibility: "public" | "private";
      servings: string;
      prepTime: string;
      cookTime: string;
      rows: EditRow[];
    }
  ) {
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

      const body = {
        title: payload.title,
        description: payload.description || null,
        steps: payload.stepsText,
        visibility: payload.visibility,
        servings: Number(payload.servings || 1),
        prep_time_minutes: Number(payload.prepTime || 0),
        cook_time_minutes: Number(payload.cookTime || 0),
        ingredients,
      };

      const json = await api<any>(
        `/api/recipes/${encodeURIComponent(String(id))}`,
        {
          method: "PUT",
          json: body,
        }
      );

      return json;
    } catch (e: any) {
      setError(e?.message ?? "Failed to update recipe");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { updateRecipe, loading, error };
}
