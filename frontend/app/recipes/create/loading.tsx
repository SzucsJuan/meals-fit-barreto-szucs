export default function RecipeCreateLoading() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-56 bg-muted rounded animate-pulse" />
        <div className="h-8 w-20 bg-muted rounded animate-pulse" />
      </div>

      {/* Formulario principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="h-10 w-full bg-muted rounded animate-pulse" />
          <div className="h-24 w-full bg-muted rounded animate-pulse" />
          <div className="h-10 w-1/2 bg-muted rounded animate-pulse" />
        </div>

        {/* Imagen de preview */}
        <div className="h-56 w-full bg-muted rounded-xl animate-pulse" />
      </div>

      {/* Ingredientes */}
      <div className="space-y-2">
        <div className="h-6 w-28 bg-muted rounded animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 w-full bg-muted rounded animate-pulse" />
        ))}
      </div>

      {/* Botones */}
      <div className="flex gap-3 justify-end">
        <div className="h-10 w-24 bg-muted rounded animate-pulse" />
        <div className="h-10 w-28 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}
