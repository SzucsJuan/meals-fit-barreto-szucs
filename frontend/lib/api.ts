const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Normalizamos la base: sin / al final
const BASE = RAW_BASE.replace(/\/+$/, "");

// Helper para armar URLs sin dobles barras
function buildUrl(path: string) {
  const cleanPath = path.replace(/^\/+/, ""); // sin / al inicio
  return `${BASE}/${cleanPath}`;
}

// Lee la cookie
function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[2]) : null;
}

export async function ensureCsrf() {
  await fetch(buildUrl("sanctum/csrf-cookie"), {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
}

function isMutating(method?: string) {
  const m = (method || "GET").toUpperCase();
  return m === "POST" || m === "PUT" || m === "PATCH" || m === "DELETE";
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

/** Cliente base con CSRF + cookies de sesión */
export async function api<T>(
  path: string,
  init: RequestInit & { json?: any } = {}
): Promise<T> {
  if (isMutating(init.method)) {
    await ensureCsrf();
  }

  const headers = new Headers(init.headers || {});
  headers.set("Accept", "application/json");

  if (init.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const xsrf = getCookie("XSRF-TOKEN");
  if (xsrf) headers.set("X-XSRF-TOKEN", xsrf);

  const url = buildUrl(path);

  const res = await fetch(url, {
    ...init,
    credentials: "include",
    cache: "no-store",
    headers,
    body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
  });

  if (res.status === 204) return {} as T;

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // va sin JSON la respuesta
  }

  if (!res.ok) {
    throw new Error(parseError(res.status, body));
  }

  return body as T;
}

// ==================== AUTENTICACIÓN ====================

export type UserDTO = { id: number; name: string; email: string };

export const authApi = {
  register: (payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) =>
    api<{ user: UserDTO; token: string }>("api/register", {
      method: "POST",
      json: payload,
    }),

  login: (payload: { email: string; password: string }) =>
    api<{ message: string; user: UserDTO }>("login", {
      method: "POST",
      json: payload,
    }),

  logout: () => api<{ message?: string }>("logout", { method: "POST" }),

  me: () => api<UserDTO>("api/user", { method: "GET" }),
};

// ==================== RECETAS ====================

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

export const apiRecipes = {
  create: (payload: any) =>
    api<RecipeDTO>("api/recipes", {
      method: "POST",
      json: payload,
    }),
  show: (id: number | string) => api<RecipeDTO>(`api/recipes/${id}`),
  update: (id: number | string, payload: any) =>
    api<RecipeDTO>(`api/recipes/${id}`, {
      method: "PUT",
      json: payload,
    }),
};

// ==================== IMÁGENES ====================

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
    return api<UploadRecipeImageResponse>(`api/recipes/${id}/image`, {
      method: "POST",
      body: form,
    });
  },
  remove: (id: number | string) =>
    api<void>(`api/recipes/${id}/image`, { method: "DELETE" }),
};

// ==================== ACHIEVEMENTS ====================

export type AchievementDTO = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  awarded_at: string | null;
};

export const apiAchievements = {
  me: () => api<AchievementDTO[]>("api/me/achievements", { method: "GET" }),
};