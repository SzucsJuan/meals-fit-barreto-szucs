// lib/fetchDiscover.ts (o donde lo tengas)

import { api } from "@/lib/api";

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
  q = "",
  order = "latest",
  page = 1,
  per_page = 12,
}: {
  q?: string;
  order?: string;
  page?: number;
  per_page?: number;
}) {
  const params = new URLSearchParams({
    discover: "1",
    q,
    order,
    page: String(page),
    per_page: String(per_page),
  });


  return api<{ data: DiscoverRecipe[]; meta?: any }>(
    `/api/recipes?${params.toString()}`
    );
}