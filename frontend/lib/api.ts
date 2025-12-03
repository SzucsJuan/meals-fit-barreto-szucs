// ================== BASES ==================

const rawRoot = process.env.NEXT_PUBLIC_BACKEND_ROOT || "http://localhost:8000";
const BACKEND_ROOT = rawRoot.replace(/\/+$/, "");

const rawApi = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
const API_BASE = rawApi.replace(/\/+$/, "");

// ================== HELPERS ==================

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[2]) : null;
}

export async function ensureCsrf() {
  await fetch(`${BACKEND_ROOT}/sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
}

function isMutating(method?: string) {
  const m = (method || "GET").toUpperCase();
  return ["POST", "PUT", "PATCH", "DELETE"].includes(m);
}

function parseError(status: number, body: any): string {
  if (body?.message && !body?.errors) return body.message;
  if (body?.errors) {
    return Object.entries(body.errors)
      .flatMap(([k, v]) => (Array.isArray(v) ? v.map((m) => `${k}: ${m}`) : String(v)))
      .join(" | ");
  }
  return `HTTP ${status}`;
}

// ================== API CLIENT ==================

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
  
  headers.set("ngrok-skip-browser-warning", "true");

  const isApi = path.startsWith("/api/");
  const base = isApi ? API_BASE : BACKEND_ROOT;

  const url = `${base}${path}`;

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
  } catch {}

  if (!res.ok) {
    throw new Error(parseError(res.status, body));
  }

  return body as T;
}

// ================== AUTH ==================

export type UserDTO = { id: number; name: string; email: string };

export const authApi = {
  register: (payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) =>
    api<{ user: UserDTO }>("/api/register", {
      method: "POST",
      json: payload,
      credentials: "include",
    }),

  login: (payload: { email: string; password: string }) =>
    api<{ message: string; user: UserDTO }>("/login", {
      method: "POST",
      json: payload,
      credentials: "include",
    }),

  logout: () =>
    api<{ message?: string }>("/logout", {
      method: "POST",
      credentials: "include",
    }),

  me: () =>
    api<UserDTO>("/api/user", {
      method: "GET",
      credentials: "include",
    }),
};

// ================== RECIPES ==================

export type RecipeDTO = { /* tu tipo, sin cambios */ };

export const apiRecipes = {
  create: (payload: any) =>
    api<RecipeDTO>("/api/recipes", {
      method: "POST",
      json: payload,
    }),

  show: (id: number | string) => api<RecipeDTO>(`/api/recipes/${id}`),

  update: (id: number | string, payload: any) =>
    api<RecipeDTO>(`/api/recipes/${id}`, {
      method: "PUT",
      json: payload,
    }),
};

// ================== IMAGES ==================

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
    api<void>(`/api/recipes/${id}/image`, { method: "DELETE" }),
};

// ================== ACHIEVEMENTS ==================

export type AchievementDTO = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  awarded_at: string | null;
};

export const apiAchievements = {
  me: () => api<AchievementDTO[]>("/api/me/achievements", { method: "GET" }),
};
