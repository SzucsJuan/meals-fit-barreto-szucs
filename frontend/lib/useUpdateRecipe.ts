import { useState } from "react";
export type Unit = "g" | "ml" | "unit";

export interface EditRow {
  tempId: number;
  ingredient_id: number | null;
  quantity: string;
  unit: Unit | "";
  notes?: string;
}

const API =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:8000";

function readCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([$?*|{}\]\\^])/g, "\\$1") + "=([^;]*)"));
  return m ? m[1] : null;
}

export function useUpdateRecipe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ensureCsrfCookie() {
    // Carga / renueva XSRF-TOKEN si hiciera falta
    await fetch(`${API}/sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
  }

  async function updateRecipe(
    id: number | string,
    payload: {
      title: string;
      description: string;
      stepsText: string;
      visibility: "public" | "unlisted" | "private";
      servings: string;
      prepTime: string;
      cookTime: string;
      rows: EditRow[];
    }
  ) {
    setLoading(true);
    setError(null);

    try {
      // Asegurar el CSRF para métodos no idempotentes
      await ensureCsrfCookie();

      const xsrfCookie = readCookie("XSRF-TOKEN");
      const xsrfHeader = xsrfCookie ? decodeURIComponent(xsrfCookie) : null;

      const ingredients = payload.rows
        .filter((r) => r.ingredient_id && r.quantity && r.unit)
        .map((r) => ({
          ingredient_id: r.ingredient_id!,
          quantity: Number(r.quantity),
          unit: r.unit as Unit,
          notes: r.notes?.trim() || undefined,
        }));

      const body = {
        title: payload.title,
        description: payload.description || null,
        steps: payload.stepsText,
        visibility: payload.visibility,
        servings: Number(payload.servings || 1),
        prep_time_minutes: Number(payload.prepTime || 0),
        cook_time_minutes: Number(payload.cookTime || 0),
        ingredients,
      };

      const res = await fetch(
        `${API}/api/recipes/${encodeURIComponent(String(id))}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(xsrfHeader ? { "X-XSRF-TOKEN": xsrfHeader } : {}),
          },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const err = await res.json();
          if (err?.message) msg += ` - ${err.message}`;
        } catch {
          // ignore json parse
        }
        setError(msg);
        throw new Error(msg);
      }

      const json = await res.json();
      return json;
    } finally {
      setLoading(false);
    }
  }

  return { updateRecipe, loading, error };
}
