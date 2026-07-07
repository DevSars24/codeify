export default function HistoryLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-zinc-300 animate-pulse" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        {/* Top Stats Row Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 rounded-2xl bg-card border border-border flex items-center justify-between animate-pulse">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="h-6 w-24 bg-muted rounded" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-muted" />
            </div>
          ))}
        </div>

        {/* Charts Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border h-[380px] animate-pulse">
            <div className="h-4 w-48 bg-muted rounded mb-6" />
            <div className="h-[280px] w-full bg-muted/50 rounded-xl" />
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border h-[380px] flex flex-col justify-between animate-pulse">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="w-48 h-48 rounded-full bg-muted/50 mx-auto" />
            <div className="h-4 w-20 bg-muted rounded mx-auto" />
          </div>
        </div>

        {/* Logs Table Skeleton */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden animate-pulse">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-8 w-40 bg-muted rounded" />
          </div>
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-border/50">
                <div className="h-4 w-12 bg-muted rounded" />
                <div className="h-4 w-48 bg-muted rounded" />
                <div className="h-4 w-16 bg-muted rounded" />
                <div className="h-4 w-24 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
