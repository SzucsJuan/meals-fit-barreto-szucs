import { api } from "@/lib/api";
import type { RecipeDTO } from "@/lib/api";

export type DiscoverRecipe = RecipeDTO;

type DiscoverMeta = {
  current_page: number;
  last_page: number;
  total: number;
};

type DiscoverParams = {
  q?: string;
  order?: string;
  page?: number;
  per_page?: number;
};

type RawPaginated<T> = {
  data?: T[];
  current_page?: number;
  last_page?: number;
  total?: number;
};

export async function fetchDiscover(
  params: DiscoverParams
): Promise<{ data: DiscoverRecipe[]; meta: DiscoverMeta }> {
  const qs = new URLSearchParams();

  qs.set("discover", "1");

  if (params.q) qs.set("q", params.q);
  if (params.order) qs.set("order", params.order);
  if (params.page) qs.set("page", String(params.page));
  if (params.per_page) qs.set("per_page", String(params.per_page));

  const raw = await api<RawPaginated<DiscoverRecipe> | DiscoverRecipe[]>(
    `/api/recipes?${qs.toString()}`,
    {
      method: "GET",
    }
  );

  let data: DiscoverRecipe[] = [];
  let current_page = 1;
  let last_page = 1;
  let total = 0;

  if (Array.isArray(raw)) {
    data = raw;
    total = raw.length;
  } else {
    data = raw.data ?? [];
    current_page = raw.current_page ?? 1;
    last_page = raw.last_page ?? 1;
    total = raw.total ?? data.length;
  }

  return {
    data,
    meta: {
      current_page,
      last_page,
      total,
    },
  };
}
