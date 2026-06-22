export default function Loading() {
  return (
    <main className="panel-shell px-sm py-xl lg:ml-72">
      <div className="mx-auto grid max-w-[1540px] gap-md">
        <div className="skeleton-shimmer h-36 rounded-lg bg-muted" />
        <div className="grid gap-sm md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton-shimmer h-36 rounded-lg bg-muted" />
          ))}
        </div>
        <div className="skeleton-shimmer h-[420px] rounded-lg bg-muted" />
      </div>
    </main>
  );
}
