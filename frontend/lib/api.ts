// lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });
  let body: any = null;
  try { body = await res.json(); } catch {}
  if (!res.ok) {
    throw new Error(body?.message || `HTTP ${res.status}`);
  }
  return body as T;
}

export type RecipeDTO = {
  id: number;
  title: string;
  description?: string | null;
  steps?: string | null; // viene como texto (unimos/partimos por \n)
  visibility: 'public'|'unlisted'|'private';
  servings: number;
  prep_time_minutes?: number | null;
  cook_time_minutes?: number | null;
  image_url?: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  avg_rating?: number;
  votes_count?: number;
  favorited_by_count?: number;
  user?: { id: number; name: string };
  ingredients: Array<{
    id: number;
    name: string;
    pivot: { quantity: number; unit: 'g'|'ml'|'unit'; notes?: string|null };
  }>;
};

export const apiRecipes = {
  create: (payload: any) => api('/api/recipes', { method: 'POST', body: JSON.stringify(payload) }),
  show: (id: number | string) => api<RecipeDTO>(`/api/recipes/${id}`)
};
