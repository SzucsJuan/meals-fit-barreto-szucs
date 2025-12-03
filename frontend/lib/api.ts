const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// --- VALIDACIÓN CRUCIAL ---
// La variable BASE DEBE terminar en /api si todas las rutas de Laravel la usan,
// o DEBE ser el dominio base si el prefijo /api se agrega en cada llamada.
// Dado el error, asumimos que NEXT_PUBLIC_API_BASE_URL ya contiene "https://mealsandfit.onrender.com/api".
// Si BASE es solo el dominio "https://mealsandfit.onrender.com", ignora esta corrección y déjalo como estaba.
// Si tu archivo .env de Next.js configura NEXT_PUBLIC_API_BASE_URL como SÓLO el dominio:
// NEXT_PUBLIC_API_BASE_URL="https://mealsandfit.onrender.com"
// Entonces, las rutas de abajo *DEBEN* incluir /api.
// Si el problema es solo con el register, revisa tu router de Laravel.

// --- Corregido el problema de doble /api en las llamadas authApi y apiRecipes ---

// Lee la cookie

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[2]) : null;
}

export async function ensureCsrf() {
  // Sanctum CSRF endpoint
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
  
  // Normalizar el path: asegurar que el path siempre empiece con /, pero no sea doble //
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const res = await fetch(`${BASE}${normalizedPath}`, {
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


// LLamada a Usuarios

export type UserDTO = { id: number; name: string; email: string };

export const authApi = {
  // CORRECCIÓN: Quitamos '/api' del path para evitar la duplicidad
  register: (payload: {
    name: string; email: string; password: string; password_confirmation: string;
  }) => api<{ user: UserDTO; token: string }>("register", {
    method: "POST", json: payload,
  }),

  login: (payload: { email: string; password: string }) =>
    api<{ message: string; user: UserDTO }>("login", {
      method: "POST", json: payload,
    }),

  logout: () => api<{ message?: string }>("logout", { method: "POST" }),

  me: () => api<UserDTO>("user", { method: "GET" }),
};


// LLamada a Recetas

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
  // CORRECCIÓN: Quitamos '/api' del path
  create: (payload: any) => api<RecipeDTO>("recipes", {
    method: "POST", json: payload,
  }),
  // CORRECCIÓN: Quitamos '/api' del path
  show: (id: number | string) => api<RecipeDTO>(`recipes/${id}`),
  // CORRECCIÓN: Quitamos '/api' del path
  update: (id: number | string, payload: any) => api<RecipeDTO>(`recipes/${id}`, {
    method: "PUT", json: payload,
  }),
};


// Llamado a imagenes

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
    // CORRECCIÓN: Quitamos '/api' del path
    return api<UploadRecipeImageResponse>(`recipes/${id}/image`, {
      method: "POST",
      body: form, 
    });
  },
  // CORRECCIÓN: Quitamos '/api' del path
  remove: (id: number | string) =>
    api<void>(`recipes/${id}/image`, { method: "DELETE" }),
};


//Llamado a achievements

export type AchievementDTO = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  awarded_at: string | null;
};

export const apiAchievements = {
  // CORRECCIÓN: Quitamos '/api' del path
  me: () =>
    api<AchievementDTO[]>("me/achievements", {
      method: "GET",
    }),
};