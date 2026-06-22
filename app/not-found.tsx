import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[70svh] items-center justify-center bg-background px-sm py-3xl">
      <section className="w-full max-w-xl rounded-xl border border-border bg-card p-lg text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-info-bg text-info">
          <AlertTriangle className="h-7 w-7" aria-hidden />
        </div>
        <p className="mt-md text-caption font-semibold uppercase text-primary">Tahona</p>
        <h1 className="mt-2 text-h1 font-semibold text-foreground">No encontramos esta página.</h1>
        <p className="mt-sm text-body-s text-muted-foreground">
          Puede que el enlace haya cambiado o que la ruta ya no exista.
        </p>
        <Button asChild size="lg" className="mt-md">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </section>
    </main>
  );
}
