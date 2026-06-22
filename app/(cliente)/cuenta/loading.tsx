export default function Loading() {
  return (
    <main className="storefront-shell px-sm py-xl">
      <div className="mx-auto grid max-w-7xl gap-md">
        <div className="skeleton-shimmer h-24 rounded-lg bg-muted" />
        <div className="grid gap-md lg:grid-cols-[480px_1fr]">
          <div className="skeleton-shimmer h-[620px] rounded-xl bg-muted" />
          <div className="grid gap-sm">
            <div className="skeleton-shimmer h-48 rounded-lg bg-muted" />
            <div className="skeleton-shimmer h-64 rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    </main>
  );
}
