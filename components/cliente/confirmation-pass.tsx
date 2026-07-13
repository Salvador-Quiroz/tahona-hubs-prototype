"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { CalendarDays, Check, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

/* ============================================================
   ConfirmationPass — la confirmación ES el pase de retiro
   Ruta sugerida: components/cliente/confirmation-pass.tsx
   ============================================================ */

type PassItem = {
  product: { id: string; nombre: string; precio_mxn: number };
  quantity: number;
};

type ConfirmationPassProps = {
  hub: { nombre: string; direccion: string };
  dia?: string;
  hora?: string;
  items: PassItem[];
  total: number;
};

export function ConfirmationPass({ hub, dia, hora, items, total }: ConfirmationPassProps) {
  const reduceMotion = useReducedMotion();
  const [scheduled, setScheduled] = useState(false);

  const pieces = items.reduce((sum, item) => sum + item.quantity, 0);
  // Código de casillero determinístico para el demo
  const locker = `C-${String((Math.round(total) % 24) + 1).padStart(2, "0")}`;
  const qrValue = `tahona://retiro/${locker}/${encodeURIComponent(hub.nombre)}`;

  return (
    <div className="mt-md space-y-5">
      {/* Momento de éxito */}
      <div className="flex flex-col items-center text-center">
        <motion.span
          initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 340, damping: 22 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ok-bg)] text-[var(--ok)]"
        >
          <Check className="h-8 w-8" strokeWidth={2.5} aria-hidden />
        </motion.span>
        <h2 className="mt-4 font-serif text-[clamp(1.5rem,3vw,2rem)] font-medium leading-tight text-[var(--ink)]">
          Tu pan está apartado.
        </h2>
        <p className="mt-2 max-w-[42ch] font-sans text-sm leading-6 text-[var(--ink-soft)]">
          Muestra este pase en el hub o escanéalo en el casillero. También vive en tu cuenta.
        </p>
      </div>

      {/* Pase de retiro */}
      <motion.article
        initial={reduceMotion ? false : { y: 22, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        className="overflow-hidden rounded-[20px] border border-[var(--line)] bg-[var(--paper-raised)] shadow-[var(--shadow-lg)]"
      >
        {/* Encabezado azul de marca */}
        <div className="brand-blueprint flex items-center justify-between px-5 py-4 text-white">
          <div>
            <p className="font-sans text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
              Pase de retiro
            </p>
            <p className="mt-0.5 font-serif text-[1.25rem] font-medium leading-tight">Tahona Hubs</p>
          </div>
          <div className="text-right">
            <p className="font-sans text-[0.625rem] uppercase tracking-[0.1em] text-white/70">Casillero</p>
            <p className="font-mono text-[1.75rem] font-semibold leading-none [font-variant-numeric:tabular-nums]">
              {locker}
            </p>
          </div>
        </div>

        {/* Cuerpo: QR + datos */}
        <div className="grid gap-5 p-5 sm:grid-cols-[132px_1fr] sm:items-center">
          <div className="mx-auto rounded-[14px] border border-[var(--line)] bg-white p-3 shadow-[var(--shadow-sm)]">
            <QRCodeSVG value={qrValue} size={106} bgColor="#ffffff" fgColor="#1c1815" aria-label="Código QR de retiro" />
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" aria-hidden />
              <div>
                <p className="font-sans text-[0.9375rem] font-semibold text-[var(--ink)]">{hub.nombre}</p>
                <p className="font-sans text-[0.8125rem] text-[var(--ink-soft)]">{hub.direccion}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-[var(--brand)]" aria-hidden />
              <p className="font-sans text-[0.9375rem] text-[var(--ink)]">
                {dia ?? "Viernes"} · <span className="font-mono [font-variant-numeric:tabular-nums]">{hora ?? "8:00 – 10:00"}</span>
              </p>
            </div>
            <p className="font-sans text-[0.8125rem] text-[var(--ink-faint)]">
              Te avisamos cuando tu casillero esté cargado y listo.
            </p>
          </div>
        </div>

        {/* Perforación */}
        <div className="relative px-5">
          <div className="border-t-2 border-dashed border-[var(--line-strong)]" />
          <span className="absolute -left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-[var(--line)] bg-[var(--paper)]" aria-hidden />
          <span className="absolute -right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-[var(--line)] bg-[var(--paper)]" aria-hidden />
        </div>

        {/* Resumen del pedido */}
        <div className="space-y-2 p-5">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex items-baseline justify-between gap-3">
              <p className="min-w-0 truncate font-sans text-sm text-[var(--ink)]">
                <span className="font-mono font-medium text-[var(--ink-soft)] [font-variant-numeric:tabular-nums]">
                  {quantity}×
                </span>{" "}
                {product.nombre}
              </p>
              <p className="shrink-0 font-mono text-sm text-[var(--ink-soft)] [font-variant-numeric:tabular-nums]">
                {formatCurrency(product.precio_mxn * quantity)}
              </p>
            </div>
          ))}
          <div className="my-3 h-px bg-[var(--line)]" />
          <div className="flex items-baseline justify-between">
            <p className="font-sans text-sm font-semibold text-[var(--ink)]">
              Total · {pieces} {pieces === 1 ? "pieza" : "piezas"}
            </p>
            <p className="font-mono text-[1.125rem] font-semibold text-[var(--ink)] [font-variant-numeric:tabular-nums]">
              {formatCurrency(total)}
            </p>
          </div>
        </div>
      </motion.article>

      {/* Siguientes pasos */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="flex-1 rounded-[14px]">
          <Link href="/cuenta">Ver mi cuenta</Link>
        </Button>
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="flex-1 rounded-[14px]"
          onClick={() => setScheduled(true)}
          disabled={scheduled}
        >
          {scheduled ? (
            <>
              <Check className="h-4 w-4" aria-hidden /> Agendado
            </>
          ) : (
            <>
              <CalendarDays className="h-4 w-4" aria-hidden /> Agregar al calendario
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
