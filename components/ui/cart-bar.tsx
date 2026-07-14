"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useTahonaStore } from "@/lib/store/tahona-store";
import { formatCurrency } from "@/lib/utils";

/* ============================================================
   CartBar — barra de bolsa persistente (patrón Uber Eats)
   Ruta: components/ui/cart-bar.tsx
   Aparece en cuanto hay piezas en la bolsa y vive fija abajo:
   el feedback de "Agregar" es inmediato sin importar el scroll.
   ============================================================ */

export function CartBar() {
  const cart = useTahonaStore((s) => s.cart);
  const productos = useTahonaStore((s) => s.productos);
  const reduceMotion = useReducedMotion();

  const pieces = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const total = productos.reduce((sum, p) => sum + p.precio_mxn * (cart[p.id] ?? 0), 0);

  return (
    <AnimatePresence>
      {pieces > 0 ? (
        <motion.div
          initial={reduceMotion ? false : { y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? undefined : { y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
          className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] left-1/2 z-40 w-[calc(100%-24px)] max-w-xl -translate-x-1/2 lg:bottom-6"
        >
          <Link
            href="/suscribirme"
            className="flex items-center gap-3 rounded-[16px] bg-[var(--brand)] px-4 py-3.5 text-white shadow-[0_18px_50px_rgba(32,64,208,0.45)] transition-transform duration-fast hover:scale-[1.01] active:scale-[0.99]"
          >
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/12">
              <ShoppingBag className="h-4.5 w-4.5" aria-hidden />
              <motion.span
                key={pieces}
                initial={reduceMotion ? false : { scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 24 }}
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 font-mono text-[0.6875rem] font-semibold text-[var(--ink)] [font-variant-numeric:tabular-nums]"
              >
                {pieces}
              </motion.span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-sans text-[0.9375rem] font-semibold leading-tight">Ver mi bolsa</span>
              <span className="block font-sans text-[0.75rem] leading-tight text-white/75">
                {pieces} {pieces === 1 ? "pieza" : "piezas"} antes del corte
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5 font-mono text-[1rem] font-semibold [font-variant-numeric:tabular-nums]">
              {formatCurrency(total)}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </Link>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
