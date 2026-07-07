export default function BlogsLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl flex items-center justify-between px-6">
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        <div className="h-8 w-24 bg-muted rounded animate-pulse" />
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-20 space-y-12">
        {/* Hero Header Skeleton */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6 animate-pulse">
          <div className="h-8 w-40 bg-muted rounded mx-auto" />
          <div className="h-16 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded mx-auto" />
          <div className="h-12 w-96 bg-muted rounded-full mx-auto" />
        </div>

        {/* Content Grid Skeleton */}
        <div className="space-y-8 animate-pulse">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="h-[1px] flex-1 bg-border" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-[32px] overflow-hidden h-[450px] flex flex-col justify-between p-6">
                <div className="space-y-4">
                  <div className="aspect-[16/10] bg-muted rounded-[24px]" />
                  <div className="h-3 w-24 bg-muted rounded" />
                  <div className="h-6 w-full bg-muted rounded" />
                  <div className="h-4 w-5/6 bg-muted rounded" />
                </div>
                <div className="h-4 w-24 bg-muted rounded mt-4" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
