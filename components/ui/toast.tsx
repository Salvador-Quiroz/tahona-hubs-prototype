"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { easeOutSoft } from "@/lib/motion";

/* ============================================================
   Toast — fuente única (antes duplicado en 4 vistas)
   Ruta: components/ui/toast.tsx

   Uso:
     const { toast, showToast } = useToast();
     showToast("Agregado a tu bolsa");
     ...
     <Toast message={toast} />
   ============================================================ */

const TOAST_DURATION_MS = 2000;

export function useToast() {
  const [toast, setToast] = useState("");
  const timeoutRef = useRef<number | null>(null);

  const showToast = useCallback((message: string) => {
    // Corrige el bug de las copias anteriores: un toast nuevo
    // reinicia el temporizador en vez de heredar el del anterior.
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    setToast(message);
    timeoutRef.current = window.setTimeout(() => setToast(""), TOAST_DURATION_MS);
  }, []);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    },
    []
  );

  return { toast, showToast };
}

type ToastProps = {
  message: string;
  /** true en vistas con StickyCTA inferior: eleva el toast para no quedar detrás de la barra fija. */
  raised?: boolean;
};

export function Toast({ message, raised = false }: ToastProps) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.24, ease: easeOutSoft }}
          className={
            (raised
              ? "bottom-[calc(9rem+env(safe-area-inset-bottom))]"
              : "bottom-[calc(6rem+env(safe-area-inset-bottom))]") +
            " fixed left-1/2 z-50 w-[calc(100%-32px)] max-w-sm -translate-x-1/2 rounded-[14px] border border-[var(--line)] bg-[var(--paper-raised)] px-4 py-3 text-center font-sans text-sm font-medium text-[var(--ink)] shadow-[var(--shadow-lg)] lg:bottom-6"
          }
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
