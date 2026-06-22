"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[70svh] bg-[var(--paper)] px-4 py-16 text-center text-[var(--ink)]">
      <div className="mx-auto max-w-xl rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] p-8 shadow-[var(--shadow-sm)]">
        <h2 className="font-serif text-3xl font-medium">Algo salio mal en la vitrina.</h2>
        <p className="mt-3 font-sans text-sm leading-6 text-[var(--ink-soft)]">{error.message}</p>
        <button
          className="mt-4 h-11 rounded-[12px] bg-[var(--brand)] px-5 font-sans text-sm font-semibold text-white"
          onClick={reset}
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
