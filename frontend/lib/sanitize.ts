// lib/sanitize.ts
export const s = {
  text(v: unknown, max = 1000): string {
    let t = String(v ?? "").trim();
    // ❗ Esto quita TODOS los control chars (incluye \n). Úsalo solo para campos de una línea.
    t = t.replace(/[\u0000-\u001F\u007F]/g, "");
    if (t.length > max) t = t.slice(0, max);
    return t;
  },

  // ✅ NUEVO: preserva \n y \r, limpia el resto
  multiline(v: unknown, max = 5000): string {
    let t = String(v ?? "");
    // eliminar control chars excepto \t \n \r
    t = t.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
    // normalizar EOL a \n
    t = t.replace(/\r\n?/g, "\n");
    // colapsar espacios en blanco pero NO romper \n
    t = t
      .split("\n")
      .map((line) => line.replace(/[ \t]+/g, " ").trimEnd())
      .join("\n")
      .trim();
    if (t.length > max) t = t.slice(0, max);
    return t;
  },

  int(v: unknown, fallback = 0): number {
    const n = Number.parseInt(String(v ?? "").trim(), 10);
    return Number.isFinite(n) ? n : fallback;
  },
  float(v: unknown, fallback = 0): number {
    const n = Number.parseFloat(String(v ?? "").replace(",", "."));
    return Number.isFinite(n) ? n : fallback;
  },
  unit(v: unknown): "g" | "ml" | "unit" | "" {
    const u = String(v ?? "").trim();
    return u === "g" || u === "ml" || u === "unit" ? (u as any) : "";
  },
};
