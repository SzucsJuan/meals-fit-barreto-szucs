
export function buildDiskBaseUrl(disk?: string | null): string | null {
  if (!disk) return null;
  switch (disk) {
    case "public":
      return process.env.NEXT_PUBLIC_STORAGE_BASE_URL || "http://localhost:8000/storage";
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

  const candidate =
    r.image_webp_path || r.image_thumb_path || r.image_path;

  if (!candidate) return null;

  if (/^https?:\/\//i.test(candidate)) return candidate;

  return `${base.replace(/\/+$/, "")}/${String(candidate).replace(/^\/+/, "")}`;
}
