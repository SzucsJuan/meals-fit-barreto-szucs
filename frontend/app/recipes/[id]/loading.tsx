export default function RecipeDetailLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="h-64 w-full rounded-xl bg-muted animate-pulse" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-56 bg-muted rounded animate-pulse" />
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-20 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-5 w-28 bg-muted rounded animate-pulse" />
        ))}
      </div>

      <div className="space-y-2">
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 w-1/2 bg-muted rounded animate-pulse" />
        ))}
      </div>

      <div className="space-y-2">
        <div className="h-6 w-28 bg-muted rounded animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 w-full bg-muted rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}