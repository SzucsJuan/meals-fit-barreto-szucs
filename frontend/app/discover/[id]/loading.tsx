export default function DiscoverRecipeDetailLoading() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Imagen principal */}
      <div className="h-64 w-full rounded-xl bg-muted animate-pulse" />

      {/* Título y autor */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded bg-muted animate-pulse" />
          <div className="h-4 w-40 rounded bg-muted animate-pulse" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded bg-muted animate-pulse" />
          ))}
        </div>
      </div>

      {/* Stats rápidos (rating, votos, tiempo, porciones) */}
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-5 w-28 rounded bg-muted animate-pulse" />
        ))}
      </div>

      {/* Descripción breve */}
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-muted animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
      </div>

      {/* Ingredientes */}
      <div className="space-y-2">
        <div className="h-6 w-32 rounded bg-muted animate-pulse" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 w-1/2 rounded bg-muted animate-pulse" />
        ))}
      </div>

      {/* Pasos */}
      <div className="space-y-2">
        <div className="h-6 w-24 rounded bg-muted animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 w-full rounded bg-muted animate-pulse" />
        ))}
      </div>

      {/* Sección de comentarios o recetas relacionadas */}
      <div className="space-y-3">
        <div className="h-6 w-44 rounded bg-muted animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-4 space-y-2">
              <div className="h-32 w-full rounded bg-muted animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
              <div className="h-3 w-1/3 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}