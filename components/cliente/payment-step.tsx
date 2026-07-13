"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, CreditCard, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { cn, formatCurrency } from "@/lib/utils";

/* ============================================================
   PaymentStep — paso de pago con calidad Stripe
   Ruta sugerida: components/cliente/payment-step.tsx
   ============================================================ */

type PaymentStepProps = {
  total: number;
  nextHref: string;
  update: (patch: { pagado: boolean }) => void;
};

type CardBrand = "visa" | "mastercard" | "amex" | null;

function detectBrand(digits: string): CardBrand {
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  return null;
}

function luhnValid(digits: string) {
  if (digits.length < 15) return false;
  let sum = 0;
  let dbl = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function expiryValid(value: string) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  return true;
}

const brandLabel: Record<Exclude<CardBrand, null>, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "Amex"
};

export function PaymentStep({ total, nextHref, update }: PaymentStepProps) {
  const router = useRouter();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [holder, setHolder] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [extrasOpen, setExtrasOpen] = useState(false);

  const digits = cardNumber.replace(/\D/g, "");
  const brand = useMemo(() => detectBrand(digits), [digits]);

  const cardOk = luhnValid(digits);
  const expiryOk = expiryValid(expiry);
  const cvvOk = /^\d{3,4}$/.test(cvv);
  const holderOk = holder.trim().length >= 3;
  const formOk = cardOk && expiryOk && cvvOk && holderOk;

  const cardError =
    touched.card && !cardOk && digits.length > 0 ? "Revisa el número de tarjeta." : undefined;
  const expiryError =
    touched.expiry && !expiryOk && expiry.length > 0 ? "Fecha inválida o vencida." : undefined;
  const cvvError = touched.cvv && !cvvOk && cvv.length > 0 ? "3 o 4 dígitos." : undefined;
  const holderError =
    touched.holder && !holderOk && holder.length > 0 ? "Escribe el nombre como aparece en la tarjeta." : undefined;

  function markTouched(key: string) {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }

  function pay() {
    if (!formOk || status !== "idle") return;
    setStatus("processing");
    window.setTimeout(() => {
      setStatus("success");
      update({ pagado: true });
      window.setTimeout(() => router.push(nextHref), 900);
    }, 1400);
  }

  return (
    <div className="mt-md space-y-4">
      {/* Fila de confianza */}
      <div className="flex items-center gap-2 font-sans text-sm font-semibold text-[var(--ink-soft)]">
        <LockKeyhole className="h-4 w-4 text-[var(--ok)]" aria-hidden />
        Pago cifrado · Visa · Mastercard · Amex · Procesado por Stripe
      </div>

      {/* Tarjeta */}
      <div className="rounded-[16px] border border-[var(--line)] bg-[var(--paper-raised)] p-5 shadow-[var(--shadow-sm)]">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative md:col-span-2">
            <Field
              label="Número de tarjeta"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              onBlur={() => markTouched("card")}
              error={cardError}
              required
              className="pr-24 font-mono [font-variant-numeric:tabular-nums]"
            />
            <span
              className={cn(
                "pointer-events-none absolute right-3 top-[38px] inline-flex items-center gap-1.5 rounded-[8px] border px-2 py-1 font-sans text-[0.6875rem] font-bold uppercase tracking-[0.06em] transition-opacity duration-fast",
                brand
                  ? "border-[var(--brand)]/20 bg-[var(--brand-tint)] text-[var(--brand)] opacity-100"
                  : "border-[var(--line)] bg-[var(--paper-sunken)] text-[var(--ink-faint)] opacity-70"
              )}
              aria-hidden
            >
              <CreditCard className="h-3.5 w-3.5" />
              {brand ? brandLabel[brand] : "Tarjeta"}
            </span>
          </div>

          <Field
            label="Vencimiento"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/AA"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            onBlur={() => markTouched("expiry")}
            error={expiryError}
            required
            className="font-mono [font-variant-numeric:tabular-nums]"
          />
          <Field
            label="CVV"
            type="password"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="•••"
            maxLength={4}
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            onBlur={() => markTouched("cvv")}
            error={cvvError}
            required
            className="font-mono"
          />
          <Field
            label="Nombre en la tarjeta"
            autoComplete="cc-name"
            placeholder="MARIANA SOTO"
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
            onBlur={() => markTouched("holder")}
            error={holderError}
            required
            className="uppercase md:col-span-2"
          />
        </div>
      </div>

      {/* Recordatorio de cobro */}
      <div className="rounded-[12px] border border-[var(--info)]/20 bg-[var(--info-bg)] px-4 py-3 font-sans text-sm leading-6 text-[var(--info)]">
        Se cobra {formatCurrency(total)} cada viernes antes de tu retiro. Cancela, salta o pausa cuando quieras.
      </div>

      {/* Cupón y facturación */}
      <div className="rounded-[12px] border border-[var(--line)] bg-[var(--paper-raised)]">
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 font-sans text-sm font-semibold text-[var(--ink)]"
          onClick={() => setExtrasOpen((v) => !v)}
          aria-expanded={extrasOpen}
        >
          ¿Tienes un cupón o necesitas factura?
          <ChevronDown
            className={cn("h-4 w-4 text-[var(--ink-faint)] transition-transform duration-fast", extrasOpen && "rotate-180")}
            aria-hidden
          />
        </button>
        {extrasOpen ? (
          <div className="grid gap-4 border-t border-[var(--line)] p-4 md:grid-cols-2">
            <Field label="Cupón" placeholder="TAHONA10" />
            <Field label="RFC" placeholder="Opcional" helper="Te enviamos la factura cada semana." />
          </div>
        ) : null}
      </div>

      {/* Botón de pago con estados */}
      <Button
        type="button"
        size="lg"
        className={cn(
          "w-full rounded-[14px] transition-colors duration-base",
          status === "success" && "bg-[var(--ok)] hover:bg-[var(--ok)]"
        )}
        onClick={pay}
        disabled={!formOk && status === "idle"}
        loading={status === "processing"}
      >
        {status === "success" ? (
          <>
            <Check className="h-4 w-4" aria-hidden /> Pago confirmado
          </>
        ) : status === "processing" ? (
          "Procesando pago…"
        ) : (
          <>
            <LockKeyhole className="h-4 w-4" aria-hidden /> Pagar {formatCurrency(total)}
          </>
        )}
      </Button>

      <p className="text-center font-sans text-xs leading-5 text-[var(--ink-faint)]">
        Al pagar aceptas los{" "}
        <Link href="/soporte" className="underline underline-offset-2 hover:text-[var(--brand)]">
          términos de la suscripción
        </Link>
        . Sin cargos ocultos.
      </p>
    </div>
  );
}
