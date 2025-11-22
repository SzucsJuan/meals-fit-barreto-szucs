// components/RecipeImageUploader.tsx
"use client";

import { useRef, useState, DragEvent } from "react";
import Image from "next/image";
import { useRecipeImage } from "@/lib/useRecipeImage";

type Props = {
  recipeId: number;
  initialUrl?: string | null;
  initialWebpUrl?: string | null;
  className?: string;
  onChange?: (urls: {
    image_url: string | null;
    image_webp_url: string | null;
    image_thumb_url: string | null;
  } | null) => void;
};

export default function RecipeImageUploader({
  recipeId,
  initialUrl,
  initialWebpUrl,
  className,
  onChange,
}: Props) {
  const { upload, remove, loading, error } = useRecipeImage(recipeId);
  const inputRef = useRef<HTMLInputElement>(null);

  const [imgUrl, setImgUrl] = useState<string | null>(initialUrl || null);
  const [webpUrl, setWebpUrl] = useState<string | null>(initialWebpUrl || null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const displayUrl = localPreview || webpUrl || imgUrl || null;

  async function handleFile(file?: File) {
    if (!file) return;
    const blob = URL.createObjectURL(file);
    setLocalPreview(blob);
    try {
      const r = await upload(file);
      setImgUrl(r.image_url ?? null);
      setWebpUrl(r.image_webp_url ?? null);
      onChange?.({
        image_url: r.image_url ?? null,
        image_webp_url: r.image_webp_url ?? null,
        image_thumb_url: r.image_thumb_url ?? null,
      });
    } catch {
    } finally {
      setLocalPreview(null);
      setTimeout(() => URL.revokeObjectURL(blob), 800);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0]);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  }

  async function onDelete() {
    if (!displayUrl) return;
    if (!confirm("¿Eliminar la imagen de esta receta?")) return;
    await remove();
    setImgUrl(null);
    setWebpUrl(null);
    onChange?.(null);
  }

  return (
    <div className={className}>
      <div className="rounded-2xl border border-dashed p-4 md:p-5">
        <div className="flex flex-col md:flex-row gap-5">
          <div
            className={[
              "relative w-full md:w-64",
              "rounded-xl border overflow-hidden",
              isDragOver ? "border-orange-400 ring-2 ring-orange-300/50" : "border-neutral-200 dark:border-neutral-800",
            ].join(" ")}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={onDrop}
          >
            <div className="aspect-square relative bg-neutral-100 dark:bg-neutral-900">
              {displayUrl ? (
                <Image
                  src={displayUrl}
                  alt="Recipe image"
                  fill
                  sizes="256px"
                  style={{ objectFit: "cover" }}
                  priority
                />
              ) : (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="absolute inset-0 grid place-items-center text-center text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400"
                >
                  <div className="flex flex-col items-center gap-2 px-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" className="opacity-70"><path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    <span>
                      Arrastrá una imagen acá, o <span className="text-orange-600 underline">explorá</span>
                    </span>
                    <span className="text-xs opacity-70">JPG, PNG o WebP · Máx 5MB</span>
                  </div>
                </button>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={onPick}
            />
          </div>

          <div className="flex-1 flex flex-col justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
                           bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Spinner className="h-4 w-4" /> Subiendo...
                  </>
                ) : displayUrl ? (
                  <>
                    <IconImage className="h-4 w-4" /> Cambiar imagen
                  </>
                ) : (
                  <>
                    <IconImage className="h-4 w-4" /> Subir imagen
                  </>
                )}
              </button>

              {displayUrl && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium
                             border border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30
                             disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Spinner className="h-4 w-4" /> Eliminando...
                    </>
                  ) : (
                    <>
                      <IconTrash className="h-4 w-4" /> Eliminar
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {error
                ? <span className="text-red-600 dark:text-red-400">{error}</span>
                : displayUrl
                  ? "Tip: usá una imagen cuadrada para mejor encuadre."
                  : "Formatos soportados: JPG/PNG/WebP · Máx 5MB"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconTrash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="1.5" strokeLinecap="round" d="M4 7h16M10 11v6M14 11v6M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
function IconImage(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="1.5" d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7Z" />
      <path strokeWidth="1.5" d="m7 17 3.5-3.5a1 1 0 0 1 1.4 0L15 16l2-2 2 2" />
      <circle cx="9" cy="9" r="1.25" />
    </svg>
  );
}
function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4Z" />
    </svg>
  );
}
