"use client";

const API =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:8000";

function getCookie(name: string) {
  const cookies = document.cookie.split(";").map(c => c.trim());
  const found = cookies.find(c => c.startsWith(name + "="));
  return found ? decodeURIComponent(found.split("=")[1]) : null;
}

async function ensureCsrfCookie() {
  // Pide la cookie de CSRF a Laravel Sanctum
  await fetch(`${API}/sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
  });
}

export function useDeleteRecipe() {
  async function deleteRecipe(id: number) {
    // Antes de hacer delete, se asegura la cookie
    await ensureCsrfCookie();

    const xsrf = getCookie("XSRF-TOKEN");

    // Construimos con headers
    const headers = new Headers();
    headers.set("Accept", "application/json");
    headers.set("X-Requested-With", "XMLHttpRequest");
    if (xsrf) headers.set("X-XSRF-TOKEN", xsrf);

    const res = await fetch(`${API}/api/recipes/${id}`, {
      method: "DELETE",
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText}${txt ? ` - ${txt}` : ""}`);
    }
    return true;
  }

  return { deleteRecipe };
}
