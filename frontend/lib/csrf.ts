let csrfReady = false;

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : null;
}

// Llama /sanctum/csrf-cookie una vez por sesión y deja listo el XSRF-TOKEN cookie
export async function ensureCsrf(baseUrl: string) {
  if (csrfReady) return;
  const res = await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`CSRF cookie failed: ${res.status}`);
  csrfReady = true;
}

// Lee el cookie XSRF-TOKEN y arma el header esperado por Laravel
export function xsrfHeader() {
  const token = getCookie("XSRF-TOKEN");
  return token ? { "X-XSRF-TOKEN": token, "X-Requested-With": "XMLHttpRequest" } : {};
}
