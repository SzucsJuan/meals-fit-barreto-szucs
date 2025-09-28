import { useState } from "react";
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
      visibility: "public" | "unlisted" | "private";
      servings: string;
      prepTime: string;
      cookTime: string;
      rows: EditRow[];
    }
  ) {
    setLoading(true);
    setError(null);

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

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/recipes/${encodeURIComponent(
        String(id)
      )}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const msg = `HTTP ${res.status}`;
      setError(msg);
      setLoading(false);
      throw new Error(msg);
    }

    const json = await res.json();
    setLoading(false);
    return json;
  }

  return { updateRecipe, loading, error };
}
