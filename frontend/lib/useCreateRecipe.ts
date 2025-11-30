"use client";
import { useState } from "react";

export type Unit = "g" | "ml" | "unit" | ""; 

export type FormRow = {
  tempId: number;
  ingredient_id: number | null;
  quantity: string;
  unit: Unit | "";
  notes?: string;
};

const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:8000";

function readCookie(name: string): string | null {
  const m = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([$?*|{}\]\\^])/g, "\\$1") + "=([^;]*)")
  );
  return m ? m[1] : null;
}

async function ensureCsrfCookie() {
  await fetch(`${API}sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
}

export function useCreateRecipe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createRecipe(payload: {
    title: string;
    description: string;
    stepsList: string[];
    visibility: "public" | "unlisted" | "private";
    servings: string;
    prepTime: string;
    cookTime: string;
    rows: FormRow[];
  }) {
    setLoading(true);
    setError(null);

    try {
      await ensureCsrfCookie();
      const xsrf = readCookie("XSRF-TOKEN");

      const ingredients = payload.rows
        .filter((r) => r.ingredient_id && r.quantity && r.unit)
        .map((r) => ({
          ingredient_id: r.ingredient_id!,
          quantity: Number(r.quantity),
          unit: r.unit as Unit,
          notes: r.notes?.trim() || undefined,
        }));

      const steps = payload.stepsList.map((s) => s.trim()).filter(Boolean).join("\n");

      const body = {
        title: payload.title,
        description: payload.description || null,
        steps,
        visibility: payload.visibility,
        servings: Number(payload.servings || 1),
        prep_time_minutes: Number(payload.prepTime || 0),
        cook_time_minutes: Number(payload.cookTime || 0),
        ingredients,
      };

      const res = await fetch(`${API}/api/recipes`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrf ? decodeURIComponent(xsrf) : "",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const e = await res.json();
          if (e?.message) msg += ` - ${e.message}`;
        } catch {}
        setError(msg);
        throw new Error(msg);
      }

      return await res.json();
    } finally {
      setLoading(false);
    }
  }

  return { createRecipe, loading, error };
}
