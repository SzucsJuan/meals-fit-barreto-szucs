// lib/useRecipe.ts
import { useEffect, useState } from 'react';
import { apiRecipes, type RecipeDTO } from './api';

export function detailRecipe(id: string | number) {
  const [data, setData] = useState<RecipeDTO | null>(null);
  const [loading, setLoad] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const ctrl = new AbortController();
    setLoad(true);
    setErr(null);

    apiRecipes.show(id)
      .then((r) => setData(r))
      .catch((e) => { if (e.name !== 'AbortError') setErr(e.message || 'Error'); })
      .finally(() => setLoad(false));

    return () => ctrl.abort();
  }, [id]);

  return { data, loading, error };
}
