"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="panel-shell min-h-[70svh] px-sm py-xl text-foreground">
      <section className="mx-auto max-w-xl rounded-lg border border-border bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-lg shadow-md">
        <p className="eyebrow-mark text-caption font-semibold uppercase text-primary">Dashboard</p>
        <h1 className="mt-sm text-h1 font-semibold">No pudimos cargar los indicadores.</h1>
        <p className="mt-xs text-sm leading-6 text-muted-foreground">Reintenta para recuperar ingresos, clientes y riesgo operativo.</p>
        <button className="mt-md h-11 rounded-md bg-primary px-sm text-sm font-semibold text-primary-foreground" onClick={reset}>
          Reintentar
        </button>
      </section>
    </main>
  );
}
