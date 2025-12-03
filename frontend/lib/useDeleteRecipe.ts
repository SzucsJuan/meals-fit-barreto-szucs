"use client";

import { api } from "@/lib/api";

export function useDeleteRecipe() {
  async function deleteRecipe(id: number) {
    await api<void>(`/api/recipes/${id}`, {
      method: "DELETE",
    });

    return true;
  }

  return { deleteRecipe };
}
