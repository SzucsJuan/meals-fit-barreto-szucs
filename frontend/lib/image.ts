// lib/images.ts

export function buildDiskBaseUrl(disk?: string | null): string | null {
  // Ajusta si usas otro disk; para "public" en Laravel suele ser /storage
  if (!disk) return null;
  switch (disk) {
    case "public":
      return process.env.NEXT_PUBLIC_STORAGE_BASE_URL || "http://localhost:8000/storage";
    // case "s3": return "https://<tu-bucket>.s3.amazonaws.com"; // ejemplo
    default:
      return null;
  }
}

export function getRecipeImageUrl(r: {
  image_disk?: string | null;
  image_webp_path?: string | null;
  image_thumb_path?: string | null;
  image_path?: string | null;
}): string | null {
  const base = buildDiskBaseUrl(r.image_disk);
  if (!base) return null;

  // Prioridad: webp -> thumb -> original
  const candidate =
    r.image_webp_path || r.image_thumb_path || r.image_path;

  if (!candidate) return null;

  // Si ya viene absoluta, devuélvela
  if (/^https?:\/\//i.test(candidate)) return candidate;

  // Normaliza el join
  return `${base.replace(/\/+$/, "")}/${String(candidate).replace(/^\/+/, "")}`;
}
