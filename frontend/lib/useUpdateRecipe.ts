import { useState } from 'react';
import { s } from './sanitize';

export type Unit = 'g'|'ml'|'unit';

export interface EditRow {
  tempId: number;
  ingredient_id: number | null;
  quantity: string;
  unit: Unit | '';
  notes?: string;
}

export function useUpdateRecipe() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function updateRecipe(id: number|string, input: {
    title?: string;
    description?: string;
    stepsText?: string; // textarea con \n
    visibility?: 'public'|'unlisted'|'private';
    servings?: string|number;
    prepTime?: string|number;
    cookTime?: string|number;
    rows?: EditRow[]; // si no lo mandás, no se tocan ingredientes
  }) {
    setLoading(true); setError(null);
    try {
      const payload: any = {};

      if (input.title !== undefined)        payload.title = s.text(input.title, 255);
      if (input.description !== undefined)  payload.description = s.text(input.description, 2000) || null;
      if (input.stepsText !== undefined)    payload.steps = s.text(input.stepsText, 10000) || null;
      if (input.visibility !== undefined)   payload.visibility = input.visibility;
      if (input.servings !== undefined)     payload.servings = s.int(input.servings, 1) || 1;
      if (input.prepTime !== undefined)     payload.prep_time_minutes = s.int(input.prepTime, 0);
      if (input.cookTime !== undefined)     payload.cook_time_minutes = s.int(input.cookTime, 0);

      if (input.rows) {
        payload.ingredients = input.rows
          .filter(r => r.ingredient_id && s.unit(r.unit))
          .map(r => ({
            ingredient_id: r.ingredient_id as number,
            quantity: s.float(r.quantity, 0),
            unit: s.unit(r.unit) as Unit,
            notes: s.text(r.notes ?? '', 255) || undefined,
          }))
          .filter(r => r.quantity > 0);
      }

      const { apiRecipes } = await import('./api');
      const out = await apiRecipes.update(id, payload);
      return out;
    } catch (e: any) {
      setError(e.message || 'Error updating recipe');
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { updateRecipe, loading, error };
}
