"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { cn } from "@/lib/utils";

/* ============================================================
   AuthPage — acceso unificado con teléfono + OTP
   Ruta sugerida: components/cliente/auth-page.tsx
   Mismo modelo de identidad que el checkout (AccountStep):
   un solo flujo; si el teléfono no existe, la cuenta se crea.
   ============================================================ */

type AuthPageProps = {
  mode: "login" | "registro";
};

type Phase = "phone" | "code" | "done";

export function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const isLogin = mode === "login";

  const [phase, setPhase] = useState<Phase>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);

  const phoneDigits = phone.replace(/\D/g, "");
  const phoneOk = phoneDigits.length >= 10;
  const codeOk = code.replace(/\D/g, "").length >= 4;

  function formatPhone(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
  }

  function sendCode() {
    if (!phoneOk || sending) return;
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setPhase("code");
      window.setTimeout(() => codeRef.current?.focus(), 60);
    }, 700);
  }

  function verify() {
    if (!codeOk || verifying) return;
    setVerifying(true);
    window.setTimeout(() => {
      setVerifying(false);
      setPhase("done");
      window.setTimeout(() => router.push("/cuenta"), 900);
    }, 900);
  }

  return (
    <main className="storefront-shell grid min-h-[calc(100svh-80px)] lg:grid-cols-[0.95fr_1.05fr]">
      {/* Lado editorial */}
      <section className="relative hidden overflow-hidden bg-foreground text-white lg:block">
        <Image
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=82&w=2000&auto=format&fit=crop"
          alt="Pan recién horneado de Tahona"
          fill
          sizes="50vw"
          className="object-cover opacity-72"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-transparent" aria-hidden />
        <div className="absolute bottom-xl left-xl max-w-lg">
          <p className="eyebrow-mark text-caption font-semibold uppercase text-secondary">Tahona · Desde 1957</p>
          <h1 className="mt-2 font-display text-display font-semibold">Tu pan semanal, listo para retirar.</h1>
        </div>
      </section>

      {/* Lado del formulario */}
      <section className="flex items-center justify-center p-md">
        <motion.div
          initial={reduceMotion ? false : { y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-[20px] border border-[var(--line)] bg-[var(--paper-raised)] p-6 shadow-[var(--shadow-md)] sm:p-8"
        >
          {phase === "done" ? (
            <div className="flex flex-col items-center py-6 text-center">
              <motion.span
                initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 340, damping: 22 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ok-bg)] text-[var(--ok)]"
              >
                <Check className="h-7 w-7" strokeWidth={2.5} aria-hidden />
              </motion.span>
              <h2 className="mt-4 font-serif text-[1.5rem] font-medium text-[var(--ink)]">
                {isLogin ? "Bienvenido de vuelta" : "Cuenta lista"}
              </h2>
              <p className="mt-1 font-sans text-sm text-[var(--ink-soft)]">Entrando a tu cuenta…</p>
            </div>
          ) : (
            <>
              <h2 className="font-serif text-[1.625rem] font-medium leading-tight text-[var(--ink)]">
                {isLogin ? "Entrar a mi cuenta" : "Crear mi cuenta"}
              </h2>
              <p className="mt-2 font-sans text-sm leading-6 text-[var(--ink-soft)]">
                {phase === "phone"
                  ? "Solo necesitas tu teléfono. Te enviamos un código por SMS, sin contraseñas."
                  : `Enviamos un código al ${phone}.`}
              </p>

              {phase === "phone" ? (
                <div className="mt-6 space-y-4">
                  <Field
                    label="Teléfono"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="55 0000 0000"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    onKeyDown={(e) => e.key === "Enter" && sendCode()}
                    required
                    className="font-mono [font-variant-numeric:tabular-nums]"
                  />
                  <Button
                    type="button"
                    size="lg"
                    className="w-full rounded-[14px]"
                    onClick={sendCode}
                    disabled={!phoneOk}
                    loading={sending}
                  >
                    {sending ? "Enviando código…" : "Enviar código"}
                  </Button>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <Field
                    ref={codeRef}
                    label="Código de verificación"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="• • • •"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => e.key === "Enter" && verify()}
                    helper="Te enviamos un SMS. (Demo: escribe 4 dígitos)"
                    className="text-center font-mono text-[1.25rem] tracking-[0.4em] [font-variant-numeric:tabular-nums]"
                  />
                  <Button
                    type="button"
                    size="lg"
                    className="w-full rounded-[14px]"
                    onClick={verify}
                    disabled={!codeOk}
                    loading={verifying}
                  >
                    {verifying ? "Verificando…" : isLogin ? "Entrar" : "Crear cuenta"}
                  </Button>
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--brand)]"
                      onClick={() => {
                        setPhase("phone");
                        setCode("");
                      }}
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden />
                      Cambiar teléfono
                    </button>
                    <button
                      type="button"
                      className="font-sans text-sm font-medium text-[var(--brand)] transition-colors hover:text-[var(--brand-press)]"
                      onClick={sendCode}
                    >
                      Reenviar código
                    </button>
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "mt-6 flex items-start gap-2.5 rounded-[12px] bg-[var(--paper-sunken)] px-4 py-3",
                  phase === "code" && "opacity-80"
                )}
              >
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ok)]" aria-hidden />
                <p className="font-sans text-[0.8125rem] leading-5 text-[var(--ink-soft)]">
                  {isLogin
                    ? "Si tu teléfono aún no tiene cuenta, la creamos en este mismo paso."
                    : "Si tu teléfono ya tiene cuenta, entras directo. Un solo acceso, sin contraseñas."}
                </p>
              </div>
            </>
          )}
        </motion.div>
      </section>
    </main>
  );
}
