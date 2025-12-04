
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Pass para guardar el token
const TOKEN_KEY = "mf_token";

let accessToken: string | null = null;

// Cargar token 
if (typeof window !== "undefined") {
  accessToken = window.localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  accessToken = token;

  if (typeof window === "undefined") return;

  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

function parseError(status: number, body: any): string {
  if (body?.message && !body?.errors) return body.message;

  if (body?.errors && typeof body.errors === "object") {
    const all = Object.entries(body.errors)
      .flatMap(([field, msgs]) =>
        Array.isArray(msgs) ? msgs.map((m) => `${field}: ${m}`) : String(msgs)
      )
      .join(" | ");
    return all || `HTTP ${status}`;
  }

  return `HTTP ${status}`;
}


export async function api<T>(
  path: string,
  init: RequestInit & { json?: any } = {}
): Promise<T> {
  const headers = new Headers(init.headers || {});
  headers.set("Accept", "application/json");

  if (init.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  // Si token existe, lo mandamos en Authorization
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${BASE}${normalizedPath}`, {
    ...init,
    headers,
    cache: "no-store",
    credentials: "omit", 
    body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
  });

  if (res.status === 204) return {} as T;

  let body: any = null;
  try {
    body = await res.json();
  } catch {
  }

  if (!res.ok) {
    throw new Error(parseError(res.status, body));
  }

  return body as T;
}

/* =========================
   Tipos base
   ========================= */

export type UserDTO = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

/* =========================
   Auth API (token-based)
   ========================= */

export const authApi = {
  // LOGIN via token
  login: (payload: { email: string; password: string }) =>
    api<{ token: string; user: UserDTO }>("/api/auth/login", {
      method: "POST",
      json: payload,
    }),

  me: () => api<UserDTO>("/api/user", { method: "GET" }),

  // LOGOUT 
  logout: () =>
    api<{ message?: string }>("/api/auth/logout", {
      method: "POST",
    }),

  // REGISTER
  register: (payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) =>
    api<{ user: UserDTO; token?: string }>("/api/register", {
      method: "POST",
      json: payload,
    }),
};

// Recipes API

export type RecipeDTO = {
  id: number;
  title: string;
  description?: string | null;
  steps?: string | null;
  visibility: "public" | "private";
  servings: number;
  prep_time_minutes?: number | null;
  cook_time_minutes?: number | null;

  image_url?: string | null;
  image_thumb_url?: string | null;
  image_webp_url?: string | null;
  image_width?: number | null;
  image_height?: number | null;

  calories: number;
  protein: number;
  carbs: number;
  fat: number;

  avg_rating?: number;
  votes_count?: number;
  favorited_by_count?: number;
  is_favorited?: boolean;

  user?: { id: number; name: string };

  ingredients: Array<{
    id: number;
    name: string;
    pivot: {
      quantity: number;
      unit: "g" | "ml" | "unit";
      notes?: string | null;
    };
  }>;
};

export type Paginated<T> = {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
};

export const apiRecipes = {
  index: (params?: Record<string, string | number | boolean | undefined>) => {
    const qs = params
      ? "?" +
        Object.entries(params)
          .filter(([, v]) => v !== undefined && v !== null)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
          .join("&")
      : "";

    return api<Paginated<RecipeDTO>>(`/api/recipes${qs}`, {
      method: "GET",
    });
  },

  create: (payload: any) =>
    api<RecipeDTO>("/api/recipes", {
      method: "POST",
      json: payload,
    }),

  show: (id: number | string) =>
    api<RecipeDTO>(`/api/recipes/${id}`, { method: "GET" }),

  update: (id: number | string, payload: any) =>
    api<RecipeDTO>(`/api/recipes/${id}`, {
      method: "PUT",
      json: payload,
    }),

  destroy: (id: number | string) =>
    api<void>(`/api/recipes/${id}`, {
      method: "DELETE",
    }),
};

// Recipe Images API

export type UploadRecipeImageResponse = {
  image_url: string;
  image_thumb_url: string | null;
  image_webp_url: string | null;
  width: number;
  height: number;
};

export const apiRecipeImages = {
  upload: (id: number | string, file: File) => {
    const form = new FormData();
    form.append("image", file);

    return api<UploadRecipeImageResponse>(`/api/recipes/${id}/image`, {
      method: "POST",
      body: form,
    });
  },

  remove: (id: number | string) =>
    api<void>(`/api/recipes/${id}/image`, {
      method: "DELETE",
    }),
};

// Achievements API

export type AchievementDTO = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  awarded_at: string | null;
};

export const apiAchievements = {
  me: () =>
    api<AchievementDTO[]>("/api/me/achievements", {
      method: "GET",
    }),
};
