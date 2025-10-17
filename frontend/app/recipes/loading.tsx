export default function RecipesLoading() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="h-10 rounded bg-muted animate-pulse" />
        <div className="h-10 rounded bg-muted animate-pulse" />
        <div className="h-10 rounded bg-muted animate-pulse" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-2xl border p-4">
            <div className="mb-3 h-44 w-full rounded-lg bg-muted animate-pulse" />
            <div className="mb-2 h-5 w-2/3 rounded bg-muted animate-pulse" />
            <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
