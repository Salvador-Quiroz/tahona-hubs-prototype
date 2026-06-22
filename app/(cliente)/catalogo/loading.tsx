export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--paper)] px-4 py-12 md:px-6">
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="grid gap-6 pb-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div>
            <div className="mb-4 h-0.5 w-8 bg-[var(--brand)]" />
            <div className="skeleton-shimmer h-4 w-36 rounded-full" />
            <div className="skeleton-shimmer mt-4 h-24 max-w-lg rounded-[18px]" />
            <div className="skeleton-shimmer mt-4 h-5 max-w-sm rounded-full" />
          </div>
          <div className="skeleton-shimmer h-28 rounded-[14px] border border-[var(--line)]" />
        </div>
        <div className="sticky top-[calc(64px+env(safe-area-inset-top))] z-20 -mx-4 border-y border-[var(--line)] bg-[rgba(251,248,243,.86)] px-4 py-4 backdrop-blur-[12px] md:-mx-6 md:px-6">
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="skeleton-shimmer h-10 w-28 shrink-0 rounded-full" />
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] shadow-[var(--shadow-sm)]">
                <div className="skeleton-shimmer aspect-[4/5]" />
                <div className="p-4">
                  <div className="skeleton-shimmer h-5 rounded-full" />
                  <div className="skeleton-shimmer mt-2 h-4 w-4/5 rounded-full" />
                  <div className="mt-[14px] flex items-center justify-between">
                    <div className="skeleton-shimmer h-6 w-20 rounded-full" />
                    <div className="skeleton-shimmer h-10 w-10 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-[88px] skeleton-shimmer h-80 rounded-[18px] border border-[var(--line)]" />
          </div>
        </div>
      </div>
    </main>
  );
}
