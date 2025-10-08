const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : null;
}

/** Llama al endpoint que setea la cookie XSRF-TOKEN (obligatorio antes de mutaciones) */
export async function ensureCsrf() {
  await fetch(`${BASE}/sanctum/csrf-cookie`, {
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
    // Une los mensajes de validación
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
  // Asegura CSRF antes de mutaciones
  if (isMutating(init.method)) {
    await ensureCsrf();
  }

  const headers = new Headers(init.headers || {});
  headers.set("Accept", "application/json");

  if (init.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  // Agrega X-XSRF-TOKEN desde la cookie
  const xsrf = getCookie("XSRF-TOKEN");
  if (xsrf) headers.set("X-XSRF-TOKEN", xsrf);

  const res = await fetch(`${BASE}${path}`, {
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
    // puede no haber body (html, vacío, etc.)
  }

  if (!res.ok) {
    throw new Error(parseError(res.status, body));
  }

  return body as T;
}

/* =======================
   Endpoints de autenticación
   ======================= */
export type UserDTO = { id: number; name: string; email: string };

export const authApi = {
  // Tu backend tiene register en api.php => /api/register
  register: (payload: { name: string; email: string; password: string; password_confirmation: string }) =>
    api<{ user: UserDTO; token: string }>("/api/register", {
      method: "POST",
      json: payload,
    }),

  // Tu backend tiene login en web.php => /login
  login: (payload: { email: string; password: string }) =>
    api<{ message: string; user: UserDTO }>("/login", {
      method: "POST",
      json: payload,
    }),

  // web.php => /logout (requiere estar autenticado)
  logout: () => api<{ message?: string }>("/logout", { method: "POST" }),

  // api.php protegido por sanctum
  me: () => api<UserDTO>("/api/user", { method: "GET" }),
};


export type RecipeDTO = {
  id: number;
  title: string;
  description?: string | null;
  steps?: string | null;
  visibility: "public" | "unlisted" | "private";
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
    pivot: {
      quantity: number;
      unit: "g" | "ml" | "unit";
      notes?: string | null;
    };
  }>;
};

export const apiRecipes = {
  create: (payload: any) =>
    api("/api/recipes", { method: "POST", json: payload }),
  show: (id: number | string) => api<RecipeDTO>(`/api/recipes/${id}`),
  update: (id: number | string, payload: any) =>
    api(`/api/recipes/${id}`, { method: "PUT", json: payload }),
};
