// lib/api.ts

const RAW_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Siempre una URL absoluta válida
const BASE = RAW_BASE;

// Helper definitivo: usa URL para evitar dobles barras
export function buildUrl(path: string) {
  return new URL(path, BASE).toString();
}

// Lee la cookie
function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[2]) : null;
}

let csrfReady = false;

export async function ensureCsrf() {
  const url = buildUrl("sanctum/csrf-cookie");
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    headers: { "X-Requested-With": "XMLHttpRequest" },
  });
  if (!res.ok) {
    throw new Error("CSRF cookie failed: " + res.status);
  }
  csrfReady = true;
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

/** Hace la request una sola vez (sin reintentos) */
async function doRequestOnce<T>(
  path: string,
  init: RequestInit & { json?: any } = {}
): Promise<{ status: number; body: any }> {
  const headers = new Headers(init.headers || {});
  headers.set("Accept", "application/json");
  headers.set("X-Requested-With", "XMLHttpRequest");

  // Solo ponemos Content-Type json cuando usamos .json
  if (init.json !== undefined && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Header CSRF desde la cookie
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

  if (res.status === 204) {
    return { status: res.status, body: {} as T };
  }

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // respuesta sin JSON, dejamos body = null
  }

  return { status: res.status, body };
}

/** Cliente base con CSRF + cookies de sesión + retry si 419 */
export async function api<T>(
  path: string,
  init: RequestInit & { json?: any } = {}
): Promise<T> {
  const mutating = isMutating(init.method);

  // Para mutaciones, siempre nos aseguramos de tener CSRF fresco
  if (mutating) {
    await ensureCsrf();
  }

  // Primer intento
  let { status, body } = await doRequestOnce<T>(path, init);

  // Si Laravel devuelve 419 (CSRF mismatch) en una mutación,
  // forzamos un refresh del CSRF y reintentamos UNA vez.
  if (mutating && status === 419) {
    console.warn("Got 419, refreshing CSRF and retrying once:", path);
    csrfReady = false;
    await ensureCsrf();
    ({ status, body } = await doRequestOnce<T>(path, init));
  }

  if (!String(status).startsWith("2")) {
    throw new Error(parseError(status, body));
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