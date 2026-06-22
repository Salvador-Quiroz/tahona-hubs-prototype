export default function Loading() {
  return (
    <main className="panel-shell px-sm py-xl lg:ml-72">
      <div className="mx-auto grid max-w-[1540px] gap-md">
        <div className="skeleton-shimmer h-36 rounded-lg bg-muted" />
        <div className="skeleton-shimmer h-40 rounded-lg bg-muted" />
        <div className="grid gap-md xl:grid-cols-[1.15fr_0.85fr]">
          <div className="skeleton-shimmer h-[420px] rounded-lg bg-muted" />
          <div className="skeleton-shimmer h-[420px] rounded-lg bg-muted" />
        </div>
      </div>
    </main>
  );
}
