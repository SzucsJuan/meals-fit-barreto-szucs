export default function DiscoverLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="h-10 w-64 rounded bg-muted animate-pulse" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 w-24 rounded bg-muted animate-pulse" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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