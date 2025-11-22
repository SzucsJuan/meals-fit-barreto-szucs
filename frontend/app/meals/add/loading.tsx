// app/meals/add/loading.tsx

export default function MealAddLoading() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        <div className="h-8 w-24 rounded bg-muted animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-10 w-full rounded bg-muted animate-pulse" />
        <div className="h-10 w-full rounded bg-muted animate-pulse" />
        <div className="h-10 w-full rounded bg-muted animate-pulse" />
      </div>

      <div className="space-y-3">
        <div className="h-6 w-44 rounded bg-muted animate-pulse" />
        <div className="h-10 w-full rounded bg-muted animate-pulse" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-20 rounded bg-muted animate-pulse" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border p-4">
            <div className="mb-3 h-32 w-full rounded-lg bg-muted animate-pulse" />
            <div className="mb-2 h-5 w-2/3 rounded bg-muted animate-pulse" />
            <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="h-6 w-40 rounded bg-muted animate-pulse" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border p-3">
            <div className="h-10 w-10 rounded bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
              <div className="h-3 w-1/3 rounded bg-muted animate-pulse" />
            </div>
            <div className="h-10 w-24 rounded bg-muted animate-pulse" />
            <div className="h-8 w-8 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-4 space-y-2">
            <div className="h-4 w-16 rounded bg-muted animate-pulse" />
            <div className="h-6 w-20 rounded bg-muted animate-pulse" />
            <div className="h-3 w-14 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <div className="h-10 w-24 rounded bg-muted animate-pulse" />
        <div className="h-10 w-28 rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}
