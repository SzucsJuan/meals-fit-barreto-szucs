// lib/useCreateRecipe.ts
import { useState } from 'react';
import { s } from './sanitize';

export type Unit = 'g'|'ml'|'unit';

export interface FormRow {
  tempId: number;
  ingredient_id: number | null;
  quantity: string;
  unit: Unit | '';
  notes?: string;
}

export function useCreateRecipe() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string|null>(null);

  async function createRecipe(input: {
    title: string;
    description?: string;
    stepsList?: string[];
    visibility: 'public'|'unlisted'|'private';
    servings: string|number;
    prepTime?: string|number;
    cookTime?: string|number;
    rows: FormRow[];
  }) {
    setLoading(true); setError(null);
    try {
      const payload = {
        title: s.text(input.title, 255),
        description: s.text(input.description ?? '', 2000) || undefined,
        steps: (input.stepsList ?? []).map(t => s.text(t, 1000)).filter(Boolean).join('\n') || undefined,
        visibility: input.visibility,
        servings: s.int(input.servings, 1) || 1,
        prep_time_minutes: s.int(input.prepTime ?? '', 0),
        cook_time_minutes: s.int(input.cookTime ?? '', 0),
        ingredients: input.rows
          .filter(r => r.ingredient_id && s.unit(r.unit))
          .map(r => ({
            ingredient_id: r.ingredient_id as number,
            quantity: s.float(r.quantity, 0),
            unit: s.unit(r.unit) as Unit,
            notes: s.text(r.notes ?? '', 255) || undefined,
          }))
          .filter(r => r.quantity > 0),
      };

      // Importación lazzy para evitar ciclo
      const { apiRecipes } = await import('./api');
      const out = await apiRecipes.create(payload);
      return out;
    } catch (e: any) {
      setError(e.message || 'Error creating recipe');
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { createRecipe, loading, error };
}
