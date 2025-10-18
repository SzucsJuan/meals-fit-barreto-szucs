// lib/useRecipeImage.ts
"use client";
import { useState } from "react";
import { apiRecipeImages } from "./api";

export function useRecipeImage(recipeId: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function upload(file: File) {
    setLoading(true); setError(null);
    try {
      return await apiRecipeImages.upload(recipeId, file);
    } catch (e: any) {
      setError(e?.message || "No se pudo subir la imagen");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    setLoading(true); setError(null);
    try {
      await apiRecipeImages.remove(recipeId);
    } catch (e: any) {
      setError(e?.message || "No se pudo eliminar la imagen");
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { upload, remove, loading, error };
}
