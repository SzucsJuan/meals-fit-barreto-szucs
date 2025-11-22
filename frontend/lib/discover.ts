const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export type DiscoverRecipe = {
  id: number;
  title: string;
  description?: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
  prep_time_minutes: number;
  user: { id: number; name: string };
  is_favorited?: boolean;
  image_url?: string | null;        
  image_thumb_url?: string | null; 
};

export async function fetchDiscover({
  q = '',
  order = 'latest',
  page = 1,
  per_page = 12,
}: { q?: string; order?: string; page?: number; per_page?: number }) {
  const params = new URLSearchParams({
    discover: '1',
    q,
    order,
    page: String(page),
    per_page: String(per_page),
  });

  const res = await fetch(`${BASE}/api/recipes?${params.toString()}`, {
    credentials: 'include',
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch discover recipes');
  return res.json(); 
}
