"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="storefront-shell min-h-[70svh] px-sm py-2xl text-foreground">
      <section className="mx-auto max-w-xl rounded-lg border border-border bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-lg shadow-md">
        <p className="eyebrow-mark text-caption font-semibold uppercase text-primary">Cuenta</p>
        <h1 className="mt-sm font-display text-h1 font-semibold">No pudimos cargar tu cuenta.</h1>
        <p className="mt-xs text-sm leading-6 text-muted-foreground">Tu pase, suscripcion y pagos se mantienen guardados.</p>
        <button className="mt-md h-11 rounded-md bg-primary px-sm text-sm font-semibold text-primary-foreground" onClick={reset}>
          Reintentar
        </button>
      </section>
    </main>
  );
}
