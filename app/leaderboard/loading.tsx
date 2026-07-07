export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-6">
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        <div className="h-8 w-24 bg-muted rounded animate-pulse" />
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-32 pb-20 space-y-12">
        {/* Header Skeleton */}
        <div className="text-center space-y-4 max-w-2xl mx-auto animate-pulse">
          <div className="h-8 w-32 bg-muted rounded mx-auto" />
          <div className="h-12 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded mx-auto" />
        </div>

        {/* Legend Skeleton */}
        <div className="flex flex-wrap justify-center gap-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 w-28 bg-card border border-border rounded-xl" />
          ))}
        </div>

        {/* List Skeleton */}
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 md:p-6 rounded-[24px] bg-card border border-border">
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-xl" />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-muted" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-3 w-48 bg-muted rounded" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="h-10 w-24 bg-muted rounded-lg hidden md:block" />
                <div className="h-8 w-16 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
