"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  HelpCircle,
  Home,
  LockKeyhole,
  Mail,
  MapPin,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  QrCode,
  Receipt,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  User,
  Wallet,
  Wheat,
  Flame,
  RefreshCw,
  Sparkles,
  X
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ProductCard as CatalogProductCard } from "@/components/ui/product-card";
import { StatusPill } from "@/components/ui/status-pill";
import { StickyCTA } from "@/components/ui/sticky-cta";
import { Textarea } from "@/components/ui/textarea";
import { HubMap } from "@/components/shared/hub-map";
import { ProgressBar } from "@/components/shared/progress";
import { easeOutSoft, fadeUp, gridStagger, springPress } from "@/lib/motion";
import { useTahonaStore } from "@/lib/store/tahona-store";
import type { Cobro, Entrega, Hub, Producto, Suscripcion } from "@/lib/mock-data";
import { cn, formatCurrency, shortDate } from "@/lib/utils";

type Step = "acceso" | "productos" | "horarios" | "direccion" | "pago" | "confirmacion";

const stepOrder: Step[] = ["productos", "horarios", "direccion", "pago"];
const stepCopy: Record<Step, { eyebrow: string; title: string; body: string; cta: string; next: string }> = {
  acceso: {
    eyebrow: "Pedido semanal",
    title: "Aparta tu pan antes del corte.",
    body: "Elige piezas, confirma hub y paga en una experiencia corta. Tu bolsa queda ligada a un horario y casillero.",
    cta: "Empezar pedido",
    next: "/suscribirme/productos"
  },
  productos: {
    eyebrow: "Paso 1 de 4",
    title: "Arma una bolsa clara, sin friccion.",
    body: "Cada producto muestra precio, disponibilidad y cantidad. Puedes ajustar antes de confirmar.",
    cta: "Elegir horario",
    next: "/suscribirme/horarios"
  },
  horarios: {
    eyebrow: "Paso 2 de 4",
    title: "Selecciona hub y ventana.",
    body: "El horario debe sentirse garantizado: capacidad visible, slots concretos y ubicacion entendible.",
    cta: "Continuar a datos",
    next: "/suscribirme/direccion"
  },
  direccion: {
    eyebrow: "Paso 3 de 4",
    title: "Datos minimos para operar.",
    body: "Solo lo necesario para confirmar cuenta, contacto y zona de retiro. Sin formularios eternos.",
    cta: "Continuar a pago",
    next: "/suscribirme/pago"
  },
  pago: {
    eyebrow: "Paso 4 de 4",
    title: "Pago protegido y pedido listo.",
    body: "Tarjeta, resumen y seguridad visibles. Facturacion y cupon se mantienen como opciones secundarias.",
    cta: "Confirmar pedido",
    next: "/suscribirme/confirmacion"
  },
  confirmacion: {
    eyebrow: "Confirmado",
    title: "Tu retiro quedo programado.",
    body: "Guarda tu pase de retiro. El codigo final aparecera en tu cuenta cuando el casillero este cargado.",
    cta: "Ver mi cuenta",
    next: "/cuenta"
  }
};

function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-4 md:px-6", className)}>{children}</div>;
}

function SectionHeader({
  eyebrow,
  title,
  body,
  action,
  compact = false
}: {
  eyebrow: string;
  title: string;
  body?: string;
  action?: React.ReactNode;
  compact?: boolean;
}) {
  const resolvedBody =
    eyebrow === "Vitrina semanal"
      ? "Conchas, hogazas y piezas laminadas listas para apartar antes del corte. Eliges, pagas y retiras en tu hub."
      : eyebrow === "Catalogo"
        ? "Aparta piezas recien horneadas, compara precios y arma tu bolsa sin perder la ventana de corte."
      : eyebrow === "Pedido con retiro"
        ? "Aparta antes del corte, elige ventana y recoge con pase digital. Sin filas, sin vueltas, sin depender de inventario al llegar."
      : eyebrow === "Hubs"
        ? "Elige el punto de retiro por barrio, horario y capacidad disponible."
      : eyebrow === "Paso 1 de 4"
        ? "Elige cantidades desde la vitrina semanal. Tu bolsa se actualiza en el momento y siempre ves el total antes de avanzar."
      : eyebrow === "Paso 2 de 4"
        ? "Escoge el hub y la ventana que si te funciona. La disponibilidad se lee antes de pagar."
      : eyebrow === "Paso 3 de 4"
        ? "Solo pedimos los datos necesarios para confirmar cuenta, avisos y soporte de retiro."
      : eyebrow === "Paso 4 de 4"
        ? "Pago protegido, resumen claro y cobro visible antes de confirmar."
      : body;
  const resolvedTitle =
    eyebrow === "Pedido con retiro"
      ? "Tu bolsa lista, tu casillero esperando."
      : eyebrow === "Catalogo"
        ? "Tu pan de la semana, recien horneado."
      : eyebrow === "Hubs"
        ? "Retira cerca, sin filas."
      : eyebrow === "Paso 1 de 4"
        ? "Escoge tu pan para la semana."
      : eyebrow === "Paso 2 de 4"
        ? "Elige donde y cuando retirarlo."
      : eyebrow === "Paso 3 de 4"
        ? "Tu cuenta queda lista en un minuto."
      : eyebrow === "Paso 4 de 4"
        ? "Confirma sin cargos sorpresa."
      : title;

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
    >
      <div className={cn("max-w-3xl", compact && "max-w-2xl")}>
        <div className="mb-4 h-0.5 w-8 bg-[var(--brand)]" aria-hidden />
        <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">{eyebrow}</p>
        <h2 className={cn("mt-3 font-serif font-medium tracking-[-0.02em] text-[var(--ink)] text-balance", compact ? "text-h1" : "text-display")}>
          {resolvedTitle}
        </h2>
        {resolvedBody ? <p className="mt-4 max-w-[48ch] font-sans text-[0.875rem] leading-[1.5] text-[var(--ink-soft)] md:text-base">{resolvedBody}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </motion.div>
  );
}

function getProduct(productos: Producto[], id: string) {
  return productos.find((product) => product.id === id) ?? productos[0];
}

function getHub(hubs: Hub[], id: string) {
  return hubs.find((hub) => hub.id === id) ?? hubs[0];
}

function deliveryTotal(productos: Producto[], entrega: Entrega) {
  return entrega.productos.reduce((sum, item) => sum + getProduct(productos, item.producto_id).precio_mxn * item.cantidad, 0);
}

function subscriptionTotal(productos: Producto[], suscripcion: Suscripcion) {
  return suscripcion.productos.reduce((sum, item) => sum + getProduct(productos, item.producto_id).precio_mxn * item.cantidad, 0);
}

function ProductLine({
  product,
  quantity,
  action
}: {
  product: Producto;
  quantity: number;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[72px_1fr_auto] items-center gap-4 rounded-[16px] border border-[var(--line)] bg-[var(--paper-raised)] p-2 shadow-[var(--shadow-sm)]">
      <div className="relative h-[72px] overflow-hidden rounded-[12px] bg-[var(--paper-sunken)]">
        <Image src={product.imagen_url} alt={product.nombre} fill sizes="72px" className="object-cover" />
      </div>
      <div className="min-w-0">
        <p className="line-clamp-1 font-sans text-sm font-semibold text-[var(--ink)]">{product.nombre}</p>
        <p className="mt-1 text-xs text-muted-foreground">{quantity} pza - {formatCurrency(product.precio_mxn)}</p>
      </div>
      {action ?? <p className="font-mono text-sm font-medium text-[var(--ink)] [font-variant-numeric:tabular-nums]">{formatCurrency(product.precio_mxn * quantity)}</p>}
    </div>
  );
}

function AppPass({ entrega, hub, productos }: { entrega: Entrega; hub: Hub; productos: Producto[] }) {
  const locker = entrega.casillero_id.split("-").at(-1)?.replace(/^0/, "") ?? "12";
  return (
    <Card className="overflow-hidden border-0 bg-foreground text-white shadow-lg">
      <div className="brand-blueprint h-2" />
      <CardContent className="p-md">
        <div className="flex items-start justify-between gap-md">
          <div>
            <p className="text-caption font-semibold uppercase text-secondary">Pase Tahona</p>
            <h3 className="mt-2 text-h2 font-semibold">{shortDate(entrega.fecha)}</h3>
            <p className="mt-1 text-sm text-white/70">{hub.nombre} - {entrega.slot}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-white text-foreground">
            <QrCode className="h-7 w-7" aria-hidden />
          </div>
        </div>
        <div className="mt-md grid grid-cols-2 gap-xs">
          <div className="rounded-md border border-white/12 bg-white/8 p-xs">
            <p className="text-xs text-white/55">Casillero</p>
            <p className="mt-1 font-mono text-2xl font-semibold">#{locker}</p>
          </div>
          <div className="rounded-md border border-white/12 bg-white/8 p-xs">
            <p className="text-xs text-white/55">Estado</p>
            <p className="mt-1 text-sm font-semibold capitalize">{entrega.estado.replaceAll("_", " ")}</p>
          </div>
        </div>
        <div className="mt-md space-y-2">
          {entrega.productos.slice(0, 3).map((item) => (
            <div key={item.producto_id} className="flex justify-between gap-sm border-t border-white/10 pt-2 text-sm">
              <span className="line-clamp-1 text-white/78">{item.cantidad}x {getProduct(productos, item.producto_id).nombre}</span>
              <span className="font-mono text-secondary">{formatCurrency(getProduct(productos, item.producto_id).precio_mxn * item.cantidad)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DeliveryTimeline({ estado }: { estado: Entrega["estado"] }) {
  const stages = ["Apartado", "En produccion", "Cargado", "Listo", "Retirado"];
  const activeIndex = estado === "entregado" ? 4 : estado === "listo" ? 3 : estado === "incidencia" ? 3 : 1;

  return (
    <div className="relative">
      <div className="absolute left-5 right-5 top-4 h-px bg-border" aria-hidden />
      <div
        className="absolute left-5 top-4 h-px bg-primary transition-all duration-base"
        style={{ width: `${(activeIndex / (stages.length - 1)) * 100}%` }}
        aria-hidden
      />
      <div className="relative grid grid-cols-5 gap-2">
        {stages.map((stage, index) => {
          const done = index < activeIndex;
          const active = index === activeIndex;
          return (
            <div key={stage} className="flex flex-col items-center gap-2 text-center">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border bg-card text-xs font-semibold",
                  done && "border-primary bg-primary text-white",
                  active && "border-primary bg-primary text-white shadow-[0_0_0_6px_var(--brand-soft)]"
                )}
              >
                {done ? <Check className="h-4 w-4" aria-hidden /> : index + 1}
              </span>
              <span className={cn("text-[11px] leading-4 text-muted-foreground", active && "font-semibold text-primary")}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BoardingPass({ entrega, hub, productos }: { entrega: Entrega; hub: Hub; productos: Producto[] }) {
  const locker = entrega.casillero_id.split("-").at(-1)?.replace(/^0/, "") ?? "1";
  const passCode = `TH-${entrega.id.slice(-4).toUpperCase()}-${entrega.qr_code.slice(-3).toUpperCase()}`;
  const isReady = entrega.estado === "listo";
  const isRetired = entrega.estado === "entregado";
  const isBlocked = entrega.estado === "incidencia" || entrega.estado === "no_entregado";

  return (
    <div className="mx-auto w-full max-w-[480px] space-y-md">
      <DeliveryTimeline estado={entrega.estado} />
      <article className={cn("overflow-hidden rounded-xl bg-card shadow-lg", isRetired && "grayscale")}>
        <div className="bg-primary p-md text-white">
          <p className="text-caption font-semibold uppercase text-white/72">TAHONA - Pase de retiro</p>
          <h2 className="mt-2 text-h2 font-semibold">{hub.nombre}</h2>
          <p className="mt-1 text-body-l text-white/82">{shortDate(entrega.fecha)} - {entrega.slot}</p>
        </div>
        <div className="relative border-y border-dashed border-border bg-card">
          <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[var(--bg)]" aria-hidden />
          <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[var(--bg)]" aria-hidden />
        </div>
        <div className="p-md">
          <div className={cn("mx-auto flex w-fit flex-col items-center rounded-lg border border-border bg-white p-sm", !isReady && !isRetired && "opacity-35")}>
            <QRCodeSVG value={entrega.qr_code} size={200} level="H" includeMargin />
          </div>
          {!isReady && !isRetired ? (
            <div className="mt-sm rounded-md border border-info/20 bg-info-bg p-sm text-sm text-info">
              Tu pan se esta horneando. El QR se activa cuando el casillero queda cargado.
            </div>
          ) : null}
          <p className="mt-sm text-center font-mono text-2xl font-semibold tracking-normal text-foreground">{passCode}</p>
          <p className="mt-1 text-center text-xs text-muted-foreground">Fallback si el escaner no lee el QR</p>
          <div className="mt-md grid grid-cols-2 gap-xs">
            <div className="rounded-md border border-border bg-surface-2 p-sm">
              <p className="text-xs text-muted-foreground">Casillero</p>
              <p className="mt-1 font-mono text-h2 font-semibold">#{locker}</p>
            </div>
            <div className="rounded-md border border-border bg-surface-2 p-sm">
              <p className="text-xs text-muted-foreground">Estado</p>
              <div className="mt-2">
                <StatusPill
                  tone={isBlocked ? "danger" : isRetired ? "neutral" : isReady ? "success" : "info"}
                  label={isRetired ? "Retirado" : entrega.estado.replaceAll("_", " ")}
                />
              </div>
            </div>
          </div>
          <div className={cn("mt-sm rounded-md border p-sm text-center", isReady ? "border-warning/30 bg-warning-bg text-warning" : "border-border bg-surface-2 text-muted-foreground")}>
            <p className="text-xs">Tu ventana cierra en</p>
            <p className="mt-1 font-mono text-h3 font-semibold">02:14:30</p>
          </div>
        </div>
      </article>
      <Card className="">
        <CardHeader><CardTitle>Contenido del pedido</CardTitle></CardHeader>
        <CardContent className="space-y-xs">
          {entrega.productos.map((item) => (
            <ProductLine key={item.producto_id} product={getProduct(productos, item.producto_id)} quantity={item.cantidad} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
/* ------------------------------------------------------------------ *
 *  Tahona — LandingPage (reemplazo directo)
 *
 *  CÓMO INTEGRAR (copiar y pegar dentro de tu proyecto actual):
 *  En  components/cliente/customer-pages.tsx :
 *    1. Sustituye TODA tu función  export function LandingPage() { ... }
 *       por el bloque  LandingPage  de abajo.
 *    2. Pega los 3 subcomponentes auxiliares ( ShowcaseCarousel,
 *       ProcessTimeline, HubsMapEmbed ) en el mismo archivo, justo
 *       debajo de LandingPage.
 *
 *  NO necesitas imports nuevos: todo lo que se usa aquí
 *  (Image, Link, motion, AnimatePresence, useEffect, useState,
 *   ArrowRight, CalendarDays, CreditCard, PackageCheck, ShoppingBag,
 *   Clock, Button, Container, SectionHeader, CatalogProductCard,
 *   HubCard, useWeeklyCutoffCountdown, availabilityLabel,
 *   useTahonaStore, formatCurrency, easeOutSoft, cn, type Hub, Producto)
 *  ya está importado en customer-pages.tsx.
 *
 *  Mapa: usa el embed público de Google Maps (sin API key). Cuando
 *  tengas key y quieras marcadores reales interactivos, avísame y te
 *  paso un <HubsMapLive/> con la JS API y estilo de marca.
 * ------------------------------------------------------------------ */

export function LandingPage() {
  const { productos, hubs, cart, addToCart, removeFromCart } = useTahonaStore();
  const hero = productos[0];
  const featured = productos.slice(0, 4);
  const showcase = productos.slice(0, 4);
  const countdown = useWeeklyCutoffCountdown();

  const marquee = [
    "Hogazas de masa madre",
    "Pan dulce mexicano",
    "Bollería & hojaldres",
    "Horneado cada mañana",
    `${hubs.length} hubs en CDMX`,
    "Desde 1957"
  ];

  return (
    <main className="bg-[var(--paper)] text-[var(--ink)]">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 120% at 15% 10%, #2a4ce0 0%, #2040d0 38%, #16308f 78%, #0f2470 100%)"
          }}
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute -left-40 top-1/4 h-[520px] w-[520px] rounded-full opacity-30 blur-[90px]"
          style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
          animate={{ y: [0, 18, 0] }}
          transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
            maskImage: "radial-gradient(120% 100% at 30% 20%, #000 40%, transparent 92%)"
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "4px 4px"
          }}
          aria-hidden
        />

        <Container className="relative grid min-h-[88svh] items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          {/* Texto */}
          <motion.div
            className="max-w-xl"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          >
            {[
              <span
                key="badge"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-3 py-1 font-sans text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--ink)]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]" /> Pan recién horneado · CDMX
              </span>,
              <h1
                key="h1"
                className="mt-6 font-serif text-[clamp(2.75rem,7vw,5.5rem)] font-medium leading-[0.96] tracking-[-0.03em] text-white"
              >
                Pan fresco,
                <br />
                <span className="italic text-[var(--accent)]">sin fila.</span>
              </h1>,
              <p key="p" className="mt-6 max-w-md font-sans text-[1.0625rem] leading-[1.6] text-white/80">
                Hogazas, pan dulce, bollería y más: aparta tus piezas favoritas y retíralas en un hub con horario y
                casillero confirmados. Del horno a tu semana, sin filas ni vueltas.
              </p>,
              <div key="cta" className="mt-9 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="accent" className="shadow-[0_10px_34px_rgba(255,207,90,.34)]">
                  <Link href="/suscribirme/productos">
                    Apartar mi pan <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                >
                  <Link href="/catalogo">Ver catálogo</Link>
                </Button>
              </div>,
              <div key="stats" className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-white/20 pt-6">
                {([
                  ["Corte", "Vie · 22:00"],
                  ["Retiro", "3 ventanas"],
                  ["Hubs", `${hubs.length} zonas`]
                ] as const).map(([label, value]) => (
                  <div key={label}>
                    <p className="font-sans text-[0.7rem] uppercase tracking-[0.1em] text-[var(--accent)]">{label}</p>
                    <p className="mt-1 font-mono text-sm font-medium text-white [font-variant-numeric:tabular-nums]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            ].map((child, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutSoft } } }}
              >
                {child}
              </motion.div>
            ))}
          </motion.div>

          {/* Foto */}
          <div className="relative hidden lg:block">
            <motion.div
              className="absolute -right-5 -top-5 -z-10 h-28 w-28 rounded-[22px] bg-[var(--accent)]"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
              aria-hidden
            />
            <motion.div
              className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-white/20 shadow-[0_30px_80px_rgba(8,18,60,.5)]"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
            >
              <Image
                src={hero.imagen_url}
                alt={hero.nombre}
                fill
                priority
                sizes="(max-width: 1024px) 0px, 540px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2470]/45 via-transparent to-transparent" aria-hidden />
              <div className="absolute bottom-5 left-5 rounded-[14px] bg-white/95 px-4 py-3 shadow-[var(--shadow-lg)] backdrop-blur-sm">
                <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[var(--brand)]">
                  Recién horneado
                </p>
                <p className="mt-0.5 font-serif text-[1.05rem] font-medium text-[var(--ink)]">{hero.nombre}</p>
              </div>
              <div className="absolute right-4 top-4 rounded-full bg-[var(--accent)] px-3 py-1.5 font-mono text-sm font-medium text-[var(--ink)] shadow-[0_8px_22px_rgba(0,0,0,.2)]">
                {formatCurrency(hero.precio_mxn)}
              </div>
            </motion.div>

            {/* Chip de cuenta regresiva — flotante a la altura del título */}
            <motion.div
              className="absolute -left-10 top-6 z-10 flex items-center gap-3 rounded-2xl border border-white/20 bg-[rgba(16,26,46,.62)] px-4 py-3 shadow-[0_18px_40px_rgba(8,18,60,.4)] backdrop-blur-md"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOutSoft, delay: 0.4 }}
            >
              <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-[var(--accent)]" />
              <div className="min-w-0">
                <p className="font-sans text-[0.625rem] uppercase tracking-[0.1em] text-white/70">El corte cierra en</p>
                <p className="mt-0.5 font-mono text-[1.2rem] font-medium text-white [font-variant-numeric:tabular-nums]">
                  {countdown}
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="overflow-hidden bg-[var(--ink)] py-4 text-white">
        <motion.div
          className="flex w-max whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        >
          {[0, 1].map((dup) => (
            <span key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {marquee.map((item, i) => (
                <span key={`${dup}-${i}`} className="flex items-center">
                  <span className="px-7 font-serif text-xl italic">{item}</span>
                  <span className="text-[var(--accent)]">✦</span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ============ SHOWCASE ROTATIVO (imagen full-bleed, título encima) ============ */}
      <section className="py-xl">
        <Container>
          <ShowcaseCarousel items={showcase} />
        </Container>
      </section>

      {/* ============ VITRINA SEMANAL (antes de los pasos) ============ */}
      <section className="pb-xl">
        <Container>
          <SectionHeader
            eyebrow="Vitrina semanal"
            title="Lo que sale del horno esta semana."
            body="Una selección corta en portada. El catálogo completo queda para comparar, elegir y apartar sin perderse."
            action={
              <Button asChild variant="accent">
                <Link href="/catalogo">Abrir catálogo</Link>
              </Button>
            }
          />
          <motion.div
            className="mt-lg grid gap-sm sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-10%" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          >
            {featured.map((product) => (
              <motion.div
                key={product.id}
                variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutSoft } } }}
              >
                <CatalogProductCard
                  href={`/catalogo/${product.slug}`}
                  imageUrl={product.imagen_url}
                  name={product.nombre}
                  category={product.categoria}
                  price={product.precio_mxn}
                  quantity={cart[product.id] ?? 0}
                  onIncrement={() => addToCart(product.id)}
                  onDecrement={() => removeFromCart(product.id)}
                  availability={availabilityLabel(product.disponibilidad.length)}
                />
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ============ CÓMO FUNCIONA (proceso conectado) ============ */}
      <section className="relative overflow-hidden py-xl text-white">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(120% 120% at 85% 0%, #2a4ce0 0%, #2040d0 42%, #16308f 100%)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
            backgroundSize: "52px 52px"
          }}
          aria-hidden
        />
        <Container className="relative">
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: easeOutSoft }}
          >
            <div className="mb-4 h-1 w-10 rounded-full bg-[var(--accent)]" aria-hidden />
            <p className="font-sans text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[var(--accent)]">
              Pedido con retiro
            </p>
            <h2 className="mt-3 font-serif text-display font-medium leading-[1.05] text-balance text-white">
              Tu bolsa lista, tu casillero esperando.
            </h2>
            <p className="mt-4 max-w-[50ch] font-sans text-[0.95rem] leading-[1.6] text-white/80">
              Sabes qué pediste, cuánto pagas y dónde retiras. Cuatro pasos y el pan es tuyo.
            </p>
          </motion.div>
          <ProcessTimeline />
        </Container>
      </section>

      {/* ============ RED TAHONA (hubs + mapa Google) ============ */}
      <section className="bg-[var(--paper-sunken)] py-xl">
        <Container className="grid items-center gap-lg lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, ease: easeOutSoft }}
            >
              <div className="mb-4 h-1 w-9 rounded-full bg-[var(--brand)]" aria-hidden />
              <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[var(--ink-soft)]">
                Red Tahona · CDMX
              </p>
              <h2 className="mt-3 max-w-[18ch] font-serif text-display font-medium leading-[1.05] text-balance">
                Tres barrios, una rutina más fácil.
              </h2>
              <p className="mt-4 max-w-[46ch] font-sans text-[0.95rem] leading-[1.6] text-[var(--ink-soft)]">
                Casilleros refrigerados a pasos de tu casa o tu oficina. Llegas, escaneas y te llevas el pan tibio.
              </p>
            </motion.div>

            <div className="mt-md grid gap-3">
              {hubs.map((hub, i) => {
                const occupation = Math.round((hub.casilleros_ocupados_actual / hub.casilleros_total) * 100);
                return (
                  <motion.div
                    key={hub.id}
                    className="flex items-center gap-4 rounded-2xl border border-[var(--line)] bg-[var(--paper-raised)] px-4 py-4"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.55, ease: easeOutSoft, delay: i * 0.08 }}
                  >
                    <span className="h-3 w-3 shrink-0 rounded-full bg-[var(--brand)]" />
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-[1.125rem] font-medium">{hub.nombre}</p>
                      <p className="mt-0.5 font-sans text-[0.8125rem] text-[var(--ink-soft)]">{hub.direccion}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[0.9375rem] font-medium [font-variant-numeric:tabular-nums]">
                        {occupation}%
                      </p>
                      <p className="mt-px font-sans text-[0.6875rem] uppercase tracking-[0.06em] text-[var(--ink-faint)]">
                        ocupación
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease: easeOutSoft }}
          >
            <HubsMapEmbed hubs={hubs} />
          </motion.div>
        </Container>
      </section>

      {/* ============ CIERRE CON CTA AMARILLO ============ */}
      <section className="px-4 pb-xl">
        <Container className="relative overflow-hidden rounded-[28px] bg-[var(--accent)] px-8 py-14 text-[var(--ink)] md:px-14 md:py-20">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-50 blur-2xl"
            style={{ background: "radial-gradient(circle, #fff, transparent 70%)" }}
            aria-hidden
          />
          <div className="relative max-w-2xl">
            <p className="font-sans text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[var(--brand)]">
              Tahona Hubs
            </p>
            <h2 className="mt-3 font-serif text-display font-medium leading-[1.05] text-balance">
              Empieza tu semana con pan recién horneado.
            </h2>
            <p className="mt-4 max-w-[44ch] font-sans text-[1rem] leading-[1.6] text-[var(--ink)]/75">
              Aparta hoy, recoge esta semana. Sin filas, sin compromisos largos, cancela cuando quieras.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/suscribirme/productos">
                Apartar mi pan <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}

/* ---------- Subcomponentes auxiliares (pegar debajo de LandingPage) ---------- */

function ShowcaseCarousel({ items }: { items: Producto[] }) {
  const [cur, setCur] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => setCur((c) => (c + 1) % items.length), 5000);
    return () => window.clearInterval(t);
  }, [items.length]);

  const p = items[cur];

  return (
    <div className="relative min-h-[clamp(440px,62vh,640px)] overflow-hidden rounded-[26px] shadow-editorial">
      <AnimatePresence>
        <motion.div
          key={p.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: easeOutSoft }}
        >
          <Image src={p.imagen_url} alt={p.nombre} fill sizes="(max-width: 1024px) 100vw, 1100px" className="object-cover" />
        </motion.div>
      </AnimatePresence>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,16,40,.84) 0%, rgba(8,16,40,.55) 40%, rgba(8,16,40,.08) 72%), linear-gradient(0deg, rgba(8,16,40,.7), transparent 48%)"
        }}
        aria-hidden
      />

      <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: easeOutSoft }}
          >
            <div className="mb-3 flex items-center gap-2.5">
              <span className="font-mono text-sm font-medium text-[var(--accent)]">
                {String(cur + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-9 bg-[var(--accent)]" />
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-white/85">
                {p.categoria}
              </span>
            </div>
            <h2 className="max-w-[16ch] font-serif text-[clamp(2rem,4.6vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.02em] text-white [text-shadow:0_2px_30px_rgba(8,16,40,.5)]">
              {p.nombre}
            </h2>
            <p className="mt-4 max-w-[46ch] font-sans text-[0.95rem] leading-[1.6] text-white/85">
              {p.descripcion_premium}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <span className="font-serif text-3xl font-medium text-white">{formatCurrency(p.precio_mxn)}</span>
              <Button asChild variant="accent">
                <Link href={`/catalogo/${p.slug}`}>
                  Apartar esta pieza <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-7 right-7 flex items-center gap-2.5 md:bottom-14 md:right-14">
        {items.map((item, k) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Pieza ${k + 1}`}
            onClick={() => setCur(k)}
            className="h-2.5 rounded-full transition-all duration-base ease-out-soft"
            style={{ width: k === cur ? 30 : 10, background: k === cur ? "var(--accent)" : "rgba(255,255,255,.45)" }}
          />
        ))}
      </div>
    </div>
  );
}

function ProcessTimeline() {
  const steps = [
    [ShoppingBag, "Arma tu bolsa", "Precios y cantidades visibles desde el primer paso."],
    [CalendarDays, "Elige ventana", "Hub, horario y capacidad aparecen antes del pago."],
    [CreditCard, "Pago protegido", "Resumen, tarjeta y opciones secundarias sin ruido."],
    [PackageCheck, "Retira con pase", "QR, casillero, estado y soporte desde tu cuenta."]
  ] as const;

  return (
    <div className="relative mt-12">
      {/* Línea conectora (solo en lg, donde hay 4 columnas) */}
      <div className="pointer-events-none absolute inset-x-[12.5%] top-9 hidden h-0.5 lg:block" aria-hidden>
        <div className="absolute inset-0 rounded-full bg-white/20" />
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent)]"
          style={{ boxShadow: "0 0 12px var(--accent)" }}
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: easeOutSoft }}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(([Icon, title, body], i) => (
          <motion.div
            key={title}
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, ease: easeOutSoft, delay: i * 0.08 }}
          >
            <span className="relative z-[2] flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-[var(--accent)] bg-[#16308f] text-[var(--accent)] shadow-[0_14px_32px_rgba(8,18,60,.45)]">
              <Icon className="h-6 w-6" aria-hidden />
            </span>
            <span className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--accent)]">
              Paso 0{i + 1}
            </span>
            <h3 className="mt-2 font-serif text-[1.35rem] font-medium text-white">{title}</h3>
            <p className="mt-2.5 max-w-[25ch] font-sans text-sm leading-[1.55] text-white/70">{body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function HubsMapEmbed({ hubs }: { hubs: Hub[] }) {
  // Posiciones aproximadas de los pines sobre el embed (Polanco / Condesa / Del Valle).
  const pinPos = [
    { left: "30%", top: "26%" },
    { left: "52%", top: "46%" },
    { left: "44%", top: "70%" }
  ];

  return (
    <div className="relative aspect-square overflow-hidden rounded-[24px] bg-[#16308f] shadow-editorial">
      <iframe
        title="Hubs Tahona en CDMX"
        src="https://www.google.com/maps?q=19.4075,-99.179&z=12&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0"
      />
      <div className="pointer-events-none absolute inset-0">
        {hubs.slice(0, 3).map((hub, i) => (
          <div key={hub.id} className="absolute" style={pinPos[i]}>
            <span className="block h-[18px] w-[18px] animate-pulse rounded-full border-[3px] border-white bg-[var(--accent)] shadow-[0_4px_12px_rgba(8,16,40,.45)]" />
            <span className="absolute -top-0.5 left-6 whitespace-nowrap rounded-full bg-[rgba(16,26,46,.9)] px-2.5 py-0.5 font-sans text-[11px] font-semibold text-white">
              {hub.colonia}
            </span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute left-3.5 top-3.5 flex items-center gap-1.5 rounded-full bg-[rgba(16,26,46,.78)] px-2.5 py-1.5 font-sans text-[11px] font-semibold text-white backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> {hubs.length} sucursales · CDMX
      </div>
    </div>
  );
}
export function CatalogoPage() {
  return <CatalogoExactPage />;
}

function availabilityLabel(days: number) {
  if (days >= 6) return "Disponible diario";
  if (days >= 4) return "Disponible esta semana";
  return "Pocas horneadas";
}
function CatalogoExactPage() {
  const { productos, suscripciones, clientes, currentClientId, cart, addToCart, removeFromCart, setCartQuantity } =
    useTahonaStore();
  const [category, setCategory] = useState("Todo");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState("");
  const countdown = useWeeklyCutoffCountdown();
  const hub = useSelectedHub();

  const cliente = clientes.find((c) => c.id === currentClientId);
  const suscripcion = suscripciones.find((s) => s.cliente_id === currentClientId);
  const isSubscriber = Boolean(suscripcion && suscripcion.estado !== "cancelada");

  const categories = ["Todo", ...Array.from(new Set(productos.map((product) => product.categoria)))];
  const filtered = productos.filter((product) => category === "Todo" || product.categoria === category);

  const cartItems = productos
    .map((product) => ({ product, qty: cart[product.id] ?? 0 }))
    .filter((item) => item.qty > 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.precio_mxn * item.qty, 0);

  const loDeSiempre = (suscripcion?.productos ?? [])
    .map((item) => ({ product: productos.find((p) => p.id === item.producto_id), cantidad: item.cantidad }))
    .filter((x): x is { product: Producto; cantidad: number } => Boolean(x.product));

  const especiales = productos.filter((p) => p.categoria === "Especiales");
  const weekIndex = Math.floor(Date.now() / (7 * 24 * 3600 * 1000));
  const especial = especiales.length
    ? especiales[weekIndex % especiales.length]
    : productos[weekIndex % productos.length];

  const dayNames = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const today = dayNames[new Date().getDay()];
  const recienHoy = productos.filter((p) => (p.disponibilidad as string[]).includes(today)).slice(0, 8);

  function flash(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2000);
  }
  function handleAdd(product: Producto) {
    addToCart(product.id);
    flash(`${product.nombre} agregado a tu bolsa`);
  }
  function handleAddUsual() {
    loDeSiempre.forEach(({ product, cantidad }) =>
      setCartQuantity(product.id, Math.max(cart[product.id] ?? 0, cantidad))
    );
    flash("Tu bolsa de siempre, lista");
  }

  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <div className="mx-auto w-full max-w-[1240px] px-4 pb-28 pt-10 md:px-6 lg:pb-16">
        <section className="grid gap-6 pb-7 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div>
            {hub ? (
              <p className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-tint)] px-3 py-1 font-sans text-[0.75rem] font-semibold text-[var(--brand)]">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                Retiras en {hub.nombre}
              </p>
            ) : null}
            <h1 className="mt-3 max-w-[18ch] font-serif text-display font-medium text-[var(--ink)]">
              {isSubscriber && cliente
                ? `Hola de nuevo, ${cliente.nombre}.`
                : "Pan recién horneado, listo para tu semana."}
            </h1>
            <p className="mt-3 max-w-[48ch] font-sans text-[0.875rem] leading-[1.5] text-[var(--ink-soft)] md:text-base">
              {isSubscriber
                ? "Repite tu bolsa de siempre o suma un antojo antes del corte del viernes."
                : "Elige tus piezas y arma la bolsa. Recoges en tu hub, sin filas."}
            </p>
          </div>
          <div className="rounded-[14px] border border-[var(--line)] bg-[var(--paper-raised)] px-5 py-4 shadow-[var(--shadow-sm)]">
            <p className="flex items-center gap-2 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">
              <Clock className="h-4 w-4" aria-hidden />
              Corte semanal
            </p>
            <p className="mt-2 font-serif text-[1.125rem] font-medium text-[var(--ink)]">Viernes · 10:00 PM</p>
            <p className="mt-1 font-mono text-sm font-medium text-[var(--brand)] [font-variant-numeric:tabular-nums]">
              Cierra en {countdown}
            </p>
          </div>
        </section>

        {isSubscriber && loDeSiempre.length > 0 ? (
          <CatalogRail
            icon={RefreshCw}
            title="Lo de siempre"
            subtitle="Tu bolsa habitual, a un toque"
            action={
              <Button type="button" size="sm" variant="outline" className="rounded-full" onClick={handleAddUsual}>
                Agregar todo
              </Button>
            }
            products={loDeSiempre.map((x) => x.product)}
            cart={cart}
            onAdd={handleAdd}
            onRemove={(p) => removeFromCart(p.id)}
          />
        ) : null}

        {especial ? (
          <PanaderoSpecial
            product={especial}
            quantity={cart[especial.id] ?? 0}
            onAdd={() => handleAdd(especial)}
            onRemove={() => removeFromCart(especial.id)}
          />
        ) : null}

        {recienHoy.length > 0 ? (
          <CatalogRail
            icon={Flame}
            title="Recién horneado hoy"
            subtitle="Sale del horno esta mañana"
            products={recienHoy}
            cart={cart}
            onAdd={handleAdd}
            onRemove={(p) => removeFromCart(p.id)}
          />
        ) : null}

        <section className="mt-8 sticky top-[calc(64px+env(safe-area-inset-top))] z-20 -mx-4 border-y border-[var(--line)] bg-[rgba(251,248,243,.86)] px-4 py-4 backdrop-blur-[12px] md:-mx-6 md:px-6">
          <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto">
              {categories.map((item) => {
                const active = item === category;
                return (
                  <button
                    key={item}
                    type="button"
                    className={cn(
                      "h-10 shrink-0 rounded-full px-4 font-sans text-[0.875rem] font-medium transition-all duration-base ease-out-soft",
                      active
                        ? "bg-[var(--brand)] text-white shadow-[var(--shadow-sm)]"
                        : "bg-[var(--paper-sunken)] text-[var(--ink-soft)] hover:bg-[var(--paper-raised)] hover:text-[var(--ink)]"
                    )}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
            <p className="hidden shrink-0 font-mono text-sm font-medium text-[var(--ink-faint)] [font-variant-numeric:tabular-nums] sm:block">
              {filtered.length} piezas
            </p>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <TahonaCatalogCard
                key={product.id}
                product={product}
                quantity={cart[product.id] ?? 0}
                onAdd={() => handleAdd(product)}
                onRemove={() => removeFromCart(product.id)}
              />
            ))}
            {!filtered.length ? <CatalogEmptyState onReset={() => setCategory("Todo")} /> : null}
          </div>
          <CatalogBag
            items={cartItems}
            count={cartCount}
            total={cartTotal}
            onIncrement={(product) => handleAdd(product)}
            onDecrement={(product) => removeFromCart(product.id)}
            onRemove={(product) => setCartQuantity(product.id, 0)}
          />
        </section>
      </div>

      <MobileCatalogBar count={cartCount} total={cartTotal} onOpen={() => setSheetOpen(true)} />
      <BottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Tu bolsa"
        description={`${cartCount} piezas seleccionadas`}
      >
        <CatalogBagContent
          items={cartItems}
          count={cartCount}
          total={cartTotal}
          onIncrement={(product) => handleAdd(product)}
          onDecrement={(product) => removeFromCart(product.id)}
          onRemove={(product) => setCartQuantity(product.id, 0)}
        />
      </BottomSheet>
      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.24, ease: easeOutSoft }}
            className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] left-1/2 z-50 w-[calc(100%-32px)] max-w-sm -translate-x-1/2 rounded-[14px] border border-[var(--line)] bg-[var(--paper-raised)] px-4 py-3 text-center font-sans text-sm font-medium text-[var(--ink)] shadow-[var(--shadow-lg)] lg:bottom-6"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}

function useSelectedHub() {
  const hubs = useTahonaStore((s) => s.hubs);
  const clientes = useTahonaStore((s) => s.clientes);
  const currentClientId = useTahonaStore((s) => s.currentClientId);
  const fallback = clientes.find((c) => c.id === currentClientId)?.hub_asignado_id ?? hubs[0]?.id ?? "";
  const [hubId, setHubId] = useState(fallback);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const read = () => {
      const v = window.localStorage.getItem("tahona:hub");
      if (v && hubs.some((h) => h.id === v)) setHubId(v);
    };
    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, [hubs]);

  return hubs.find((h) => h.id === hubId) ?? hubs[0];
}

function CatalogRail({
  icon: Icon,
  title,
  subtitle,
  action,
  products,
  cart,
  onAdd,
  onRemove
}: {
  icon: typeof Flame;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  products: Producto[];
  cart: Record<string, number>;
  onAdd: (product: Producto) => void;
  onRemove: (product: Producto) => void;
}) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-tint)] text-[var(--brand)]">
            <Icon className="h-[18px] w-[18px]" aria-hidden />
          </span>
          <div>
            <h2 className="font-serif text-[1.25rem] font-medium leading-tight text-[var(--ink)]">{title}</h2>
            {subtitle ? <p className="font-sans text-[0.8125rem] text-[var(--ink-soft)]">{subtitle}</p> : null}
          </div>
        </div>
        {action}
      </div>
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <div key={product.id} className="w-[230px] shrink-0 sm:w-[250px]">
            <TahonaCatalogCard
              product={product}
              quantity={cart[product.id] ?? 0}
              onAdd={() => onAdd(product)}
              onRemove={() => onRemove(product)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function PanaderoSpecial({
  product,
  quantity,
  onAdd,
  onRemove
}: {
  product: Producto;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <section className="mt-8 overflow-hidden rounded-[20px] border border-[var(--line)] shadow-[var(--shadow-sm)]">
      <div className="grid md:grid-cols-[1.1fr_1fr]">
        <div className="relative min-h-[220px] overflow-hidden bg-[var(--paper-sunken)]">
          <Image
            src={product.imagen_url}
            alt={product.nombre}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
          />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1 font-sans text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[var(--ink)]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Especial de la semana
          </span>
        </div>
        <div className="flex flex-col justify-center gap-3 bg-[var(--brand)] p-6 text-white md:p-8">
          <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-white/70">
            El especial del panadero
          </p>
          <h2 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-[1.05]">{product.nombre}</h2>
          <p className="max-w-[42ch] font-sans text-[0.9375rem] leading-[1.55] text-white/80">
            {product.descripcion_premium || product.descripcion_corta}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <span className="font-mono text-[1.5rem] font-medium [font-variant-numeric:tabular-nums]">
              {formatCurrency(product.precio_mxn)}
            </span>
            {quantity > 0 ? (
              <div className="flex items-center gap-3 rounded-full bg-white/15 px-2 py-1">
                <button type="button" onClick={onRemove} aria-label="Quitar pieza" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15">
                  <Minus className="h-4 w-4" aria-hidden />
                </button>
                <span className="min-w-6 text-center font-mono text-sm font-medium [font-variant-numeric:tabular-nums]">{quantity}</span>
                <button type="button" onClick={onAdd} aria-label="Agregar pieza" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15">
                  <Plus className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ) : (
              <Button type="button" variant="accent" onClick={onAdd}>
                Agregar a mi bolsa
              </Button>
            )}
            <Button asChild variant="ghost" className="text-white hover:bg-white/10">
              <Link href={`/catalogo/${product.slug}`}>
                Ver detalle <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function useWeeklyCutoffCountdown() {
  const [countdown, setCountdown] = useState("02:14:30");

  useEffect(() => {
    function nextFridayCutoff(now: Date) {
      const target = new Date(now);
      const day = target.getDay();
      const daysUntilFriday = (5 - day + 7) % 7;
      target.setDate(target.getDate() + daysUntilFriday);
      target.setHours(22, 0, 0, 0);
      if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 7);
      return target;
    }

    function update() {
      const now = new Date();
      const diff = Math.max(0, nextFridayCutoff(now).getTime() - now.getTime());
      const hours = Math.floor(diff / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000) / 60_000);
      const seconds = Math.floor((diff % 60_000) / 1000);
      setCountdown(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
    }

    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return countdown;
}

function useCountUp(value: number) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      previous.current = value;
      return;
    }

    const start = performance.now();
    const from = previous.current;
    const diff = value - from;
    let frame = 0;

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / 240);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + diff * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        previous.current = value;
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduceMotion]);

  return display;
}

function availabilityTone(days: number) {
  return days >= 4 ? "Disponible" : "Pocas piezas";
}

function TahonaCatalogCard({
  product,
  quantity,
  onAdd,
  onRemove
}: {
  product: Producto;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const freshToday = product.disponibilidad.includes("viernes");

  return (
    <motion.article
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : { y: -4, boxShadow: "var(--shadow-md)" }}
      transition={{ duration: 0.24, ease: easeOutSoft }}
      className="group overflow-hidden rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] shadow-[var(--shadow-sm)]"
    >
      <div className="skeleton-shimmer relative aspect-[4/5] overflow-hidden">
        <Image
          src={product.imagen_url}
          alt={product.nombre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 292px"
          className="object-cover transition-transform duration-base ease-out-soft group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 rounded-full border border-white/50 bg-white/85 px-2.5 py-1 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-soft)] backdrop-blur-[8px]">
          {product.categoria}
        </div>
        {freshToday ? (
          <span
            className="absolute right-3.5 top-3.5 h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_0_4px_rgba(255,207,90,.25)]"
            aria-label="Recien horneado"
          />
        ) : null}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="line-clamp-2 font-sans text-[1.0625rem] font-semibold leading-[1.25] text-[var(--ink)]">
              {product.nombre}
            </h2>
            <p className="mt-1 line-clamp-1 font-sans text-[0.875rem] font-normal leading-[1.5] text-[var(--ink-soft)]">
              {product.descripcion_corta}
            </p>
          </div>
          <span
            className={cn(
              "hidden shrink-0 rounded-full px-2 py-1 font-sans text-[0.75rem] font-semibold sm:inline-flex",
              availabilityTone(product.disponibilidad.length) === "Disponible"
                ? "bg-[var(--ok-bg)] text-[var(--ok)]"
                : "bg-[var(--warn-bg)] text-[var(--warn)]"
            )}
          >
            {availabilityTone(product.disponibilidad.length)}
          </span>
        </div>
        <div className="mt-[14px] flex items-center justify-between">
          <p className="font-mono text-[1.125rem] font-medium text-[var(--ink)] transition-colors group-hover:text-[var(--brand)] [font-variant-numeric:tabular-nums]">
            {formatCurrency(product.precio_mxn)}
          </p>
          <motion.div
            layout
            animate={{ width: quantity > 0 ? 112 : 40 }}
            transition={{ duration: 0.24, ease: easeOutSoft }}
            className={cn(
              "flex h-10 items-center overflow-hidden rounded-full",
              quantity > 0 ? "bg-[var(--brand-tint)] text-[var(--brand)]" : "bg-[var(--brand)] text-white"
            )}
          >
            {quantity > 0 ? (
              <>
                <motion.button
                  type="button"
                  className="flex h-10 w-8 shrink-0 items-center justify-center"
                  whileTap={{ scale: 0.92 }}
                  transition={springPress}
                  onClick={onRemove}
                  aria-label="Quitar pieza"
                >
                  <Minus className="h-4 w-4" aria-hidden />
                </motion.button>
                <span className="flex h-10 min-w-12 flex-1 items-center justify-center font-mono text-sm font-medium [font-variant-numeric:tabular-nums]">
                  {quantity}
                </span>
                <motion.button
                  type="button"
                  className="flex h-10 w-8 shrink-0 items-center justify-center"
                  whileTap={{ scale: 0.92 }}
                  transition={springPress}
                  onClick={onAdd}
                  aria-label="Agregar pieza"
                >
                  <Plus className="h-[18px] w-[18px]" aria-hidden />
                </motion.button>
              </>
            ) : (
              <motion.button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[var(--brand-press)]"
                whileTap={{ scale: 0.92 }}
                transition={springPress}
                onClick={onAdd}
                aria-label={`Agregar ${product.nombre}`}
              >
                <Plus className="h-[18px] w-[18px]" aria-hidden />
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

function CatalogEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="col-span-full rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] px-6 py-12 text-center shadow-[var(--shadow-sm)]">
      <ShoppingBag className="mx-auto h-8 w-8 text-[var(--ink-faint)]" aria-hidden />
      <h2 className="mt-4 font-serif text-2xl font-medium text-[var(--ink)]">No hay piezas en esta categoria</h2>
      <p className="mt-2 font-sans text-sm text-[var(--ink-faint)]">Vuelve a ver toda la vitrina semanal.</p>
      <Button type="button" className="mt-5" onClick={onReset}>
        Ver todas
      </Button>
    </div>
  );
}

function CatalogBag({
  items,
  count,
  total,
  onIncrement,
  onDecrement,
  onRemove
}: {
  items: Array<{ product: Producto; qty: number }>;
  count: number;
  total: number;
  onIncrement: (product: Producto) => void;
  onDecrement: (product: Producto) => void;
  onRemove: (product: Producto) => void;
}) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-[88px] rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] p-5 shadow-[var(--shadow-sm)]">
        <CatalogBagContent
          items={items}
          count={count}
          total={total}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onRemove={onRemove}
        />
      </div>
    </aside>
  );
}

function CatalogBagContent({
  items,
  count,
  total,
  onIncrement,
  onDecrement,
  onRemove
}: {
  items: Array<{ product: Producto; qty: number }>;
  count: number;
  total: number;
  onIncrement: (product: Producto) => void;
  onDecrement: (product: Producto) => void;
  onRemove: (product: Producto) => void;
}) {
  const animatedCount = useCountUp(count);
  const animatedTotal = useCountUp(total);
  const empty = items.length === 0;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-serif text-[1.25rem] font-medium text-[var(--ink)]">Tu bolsa</h2>
        <span className="font-mono text-sm font-medium text-[var(--ink-faint)] [font-variant-numeric:tabular-nums]">
          {Math.round(animatedCount)} piezas
        </span>
      </div>

      <div className="mt-5 min-h-[132px]">
        <AnimatePresence initial={false}>
          {empty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center"
            >
              <ShoppingBag className="mx-auto h-8 w-8 text-[var(--ink-faint)]" aria-hidden />
              <p className="mt-3 font-sans text-sm font-medium text-[var(--ink)]">Tu bolsa esta vacia</p>
              <p className="mt-1 font-sans text-sm text-[var(--ink-faint)]">Agrega piezas desde la vitrina</p>
            </motion.div>
          ) : (
            items.map(({ product, qty }) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: easeOutSoft }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-3 py-2">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[10px] bg-[var(--paper-sunken)]">
                    <Image src={product.imagen_url} alt="" fill sizes="44px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-sans text-sm font-medium text-[var(--ink)]">{product.nombre}</p>
                    <p className="font-mono text-xs font-medium text-[var(--ink-faint)] [font-variant-numeric:tabular-nums]">
                      {qty}x {formatCurrency(product.precio_mxn)}
                    </p>
                  </div>
                  <div className="flex items-center rounded-full bg-[var(--paper-sunken)]">
                    <button type="button" className="flex h-8 w-8 items-center justify-center text-[var(--ink-soft)]" onClick={() => onDecrement(product)} aria-label="Quitar pieza">
                      <Minus className="h-3.5 w-3.5" aria-hidden />
                    </button>
                    <button type="button" className="flex h-8 w-8 items-center justify-center text-[var(--brand)]" onClick={() => onIncrement(product)} aria-label="Agregar pieza">
                      <Plus className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>
                  <button type="button" className="flex h-8 w-8 items-center justify-center text-[var(--ink-faint)]" onClick={() => onRemove(product)} aria-label="Eliminar producto">
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="my-4 h-px bg-[var(--line)]" />
      <div className="space-y-2">
        <div className="flex justify-between font-sans text-sm text-[var(--ink-soft)]">
          <span>Subtotal</span>
          <span className="font-mono [font-variant-numeric:tabular-nums]">{formatCurrency(Math.round(animatedTotal))}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="font-serif text-[1.25rem] font-medium text-[var(--ink)]">Total</span>
          <span className="font-mono text-[1.25rem] font-medium text-[var(--ink)] [font-variant-numeric:tabular-nums]">
            {formatCurrency(Math.round(animatedTotal))}
          </span>
        </div>
      </div>
      <Button asChild={!empty} disabled={empty} className="mt-5 h-[52px] w-full rounded-[14px]">
        {empty ? <span>Continuar</span> : <Link href="/suscribirme/productos">Continuar</Link>}
      </Button>
    </div>
  );
}

function MobileCatalogBar({ count, total, onOpen }: { count: number; total: number; onOpen: () => void }) {
  const animatedCount = useCountUp(count);
  const animatedTotal = useCountUp(total);

  return (
    <AnimatePresence>
      {count > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.24, ease: easeOutSoft }}
          className="fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 rounded-[16px] border border-[var(--line)] bg-[var(--paper-raised)] px-4 py-3 shadow-[var(--shadow-lg)] lg:hidden"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-mono text-sm font-medium text-[var(--ink)] [font-variant-numeric:tabular-nums]">
                <ShoppingBag className="h-4 w-4 text-[var(--brand)]" aria-hidden />
                {Math.round(animatedCount)} piezas
              </p>
              <p className="mt-1 font-mono text-sm font-medium text-[var(--ink-soft)] [font-variant-numeric:tabular-nums]">
                {formatCurrency(Math.round(animatedTotal))}
              </p>
            </div>
            <Button type="button" className="h-11 rounded-[12px]" onClick={onOpen}>
              Ver bolsa
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function ProductDetailPage({ slug }: { slug: string }) {
  const { productos } = useTahonaStore();
  const product = productos.find((item) => item.slug === slug) ?? productos[0];
  const related = productos.filter((item) => item.categoria === product.categoria && item.id !== product.id).slice(0, 3);

  return (
    <main className="storefront-shell py-lg">
      <Container className="grid gap-lg lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted shadow-lg lg:sticky lg:top-28">
          <Image src={product.imagen_url} alt={product.nombre} fill priority sizes="(max-width: 1024px) 100vw, 560px" className="object-cover" />
        </div>
        <section>
          <Badge variant="info">{product.categoria}</Badge>
          <h1 className="mt-sm font-display text-display font-black text-foreground">{product.nombre}</h1>
          <p className="mt-sm text-body-l text-muted-foreground">{product.descripcion_premium}</p>
          <div className="mt-md grid gap-xs sm:grid-cols-3">
            <Card className=""><CardContent className="p-sm"><p className="text-xs text-muted-foreground">Precio</p><p className="mt-1 text-h2 font-semibold">{formatCurrency(product.precio_mxn)}</p></CardContent></Card>
            <Card className=""><CardContent className="p-sm"><p className="text-xs text-muted-foreground">Horneado</p><p className="mt-1 text-h2 font-semibold">6:00 AM</p></CardContent></Card>
            <Card className=""><CardContent className="p-sm"><p className="text-xs text-muted-foreground">Disponible</p><p className="mt-1 text-h2 font-semibold">{availabilityTone(product.disponibilidad.length)}</p></CardContent></Card>
          </div>
          <div className="mt-md rounded-lg border border-border bg-card p-md">
            <div className="flex flex-col gap-sm md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold">Agregar a bolsa semanal</p>
                <p className="mt-1 text-sm text-muted-foreground">Puedes ajustar cantidades antes del pago.</p>
              </div>
              <Button asChild size="lg"><Link href="/suscribirme/productos">Apartar pieza</Link></Button>
            </div>
          </div>
          <div className="mt-md grid gap-xs md:grid-cols-2">
            <Card className="">
              <CardHeader><CardTitle>Ingredientes</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {product.ingredientes.map((ingredient) => <Badge key={ingredient} variant="soft">{ingredient}</Badge>)}
              </CardContent>
            </Card>
            <Card className="">
              <CardHeader><CardTitle>Disponibilidad</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {product.disponibilidad.map((day) => <Badge key={day} variant="outline" className="capitalize">{day}</Badge>)}
              </CardContent>
            </Card>
          </div>
          {related.length > 0 ? (
            <div className="mt-lg">
              <SectionHeader eyebrow="Tambien puede interesarte" title="Misma familia, otra textura." compact />
              <div className="mt-sm grid gap-xs md:grid-cols-3">
                {related.map((item) => <ProductLine key={item.id} product={item} quantity={1} action={<Button asChild variant="outline" size="sm"><Link href={`/catalogo/${item.slug}`}>Ver</Link></Button>} />)}
              </div>
            </div>
          ) : null}
        </section>
      </Container>
    </main>
  );
}

export function ComoFuncionaPage() {
  return (
    <main className="storefront-shell py-lg">
      <Container>
        <SectionHeader
          eyebrow="Como funciona"
          title="Una compra de pan debe sentirse tan simple como recoger una llave."
          body="El proceso completo cabe en cuatro decisiones. Todo lo demas queda automatizado por operacion."
        />
        <div className="mt-lg grid gap-sm md:grid-cols-4">
          {[
            [Wheat, "Elige", "Escoge piezas de la vitrina semanal."],
            [CalendarDays, "Agenda", "Selecciona hub y ventana disponible."],
            [CreditCard, "Paga", "Confirma tarjeta y resumen de pedido."],
            [QrCode, "Retira", "Usa tu pase digital en el casillero."]
          ].map(([Icon, title, body], index) => (
            <Card key={String(title)} className="">
              <CardContent className="p-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-info-bg text-info"><Icon className="h-5 w-5" aria-hidden /></div>
                <p className="mt-md text-caption font-semibold uppercase text-primary">0{index + 1}</p>
                <h2 className="mt-2 text-h3 font-semibold">{title as string}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{body as string}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </main>
  );
}

function HubCard({ hub }: { hub: Hub }) {
  const occupation = Math.round((hub.casilleros_ocupados_actual / hub.casilleros_total) * 100);
  return (
    <Link href={`/hubs/${hub.slug}`} className="group block overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image src={hub.imagen_exterior} alt={hub.nombre} fill sizes="(max-width: 768px) 100vw, 420px" className="object-cover transition-transform duration-base group-hover:scale-[1.02]" />
      </div>
      <div className="p-md">
        <div className="flex items-start justify-between gap-sm">
          <div>
            <p className="text-caption font-semibold uppercase text-primary">{hub.colonia}</p>
            <h3 className="mt-1 text-h3 font-semibold">{hub.nombre}</h3>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden />
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{hub.direccion}</p>
        <div className="mt-sm">
          <div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>Ocupacion</span><span>{occupation}%</span></div>
          <ProgressBar value={occupation} />
        </div>
      </div>
    </Link>
  );
}

export function HubsPage() {
  const { hubs } = useTahonaStore();
  return (
    <main className="storefront-shell py-lg">
      <Container>
        <SectionHeader eyebrow="Hubs" title="Red de retiro con horarios concretos." body="Cada hub muestra direccion, capacidad y ventanas para que el cliente decida con confianza." />
        <div className="mt-lg grid gap-md lg:grid-cols-[1fr_0.9fr]">
          <HubMap hubs={hubs} />
          <div className="grid gap-sm">
            {hubs.map((hub) => <HubCard key={hub.id} hub={hub} />)}
          </div>
        </div>
      </Container>
    </main>
  );
}

export function HubDetailPage({ slug }: { slug: string }) {
  const { hubs } = useTahonaStore();
  const hub = hubs.find((item) => item.slug === slug) ?? hubs[0];
  const occupation = Math.round((hub.casilleros_ocupados_actual / hub.casilleros_total) * 100);

  return (
    <main className="storefront-shell py-lg">
      <Container className="grid gap-lg lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted shadow-lg">
          <Image src={hub.imagen_exterior} alt={hub.nombre} fill priority sizes="(max-width: 1024px) 100vw, 560px" className="object-cover" />
        </div>
        <section>
          <p className="text-caption font-semibold uppercase text-primary">{hub.colonia}</p>
          <h1 className="mt-2 font-display text-display font-black">{hub.nombre}</h1>
          <p className="mt-sm text-body-l text-muted-foreground">{hub.direccion}</p>
          <div className="mt-md grid gap-xs md:grid-cols-3">
            <Card className=""><CardContent className="p-sm"><p className="text-xs text-muted-foreground">Casilleros</p><p className="mt-1 text-h2 font-semibold">{hub.casilleros_total}</p></CardContent></Card>
            <Card className=""><CardContent className="p-sm"><p className="text-xs text-muted-foreground">Ocupacion</p><p className="mt-1 text-h2 font-semibold">{occupation}%</p></CardContent></Card>
            <Card className=""><CardContent className="p-sm"><p className="text-xs text-muted-foreground">Clientes</p><p className="mt-1 text-h2 font-semibold">{hub.clientes_activos}</p></CardContent></Card>
          </div>
          <Card className="mt-md">
            <CardHeader><CardTitle>Ventanas disponibles</CardTitle></CardHeader>
            <CardContent className="grid gap-xs sm:grid-cols-3">
              {hub.slots_horarios.map((slot) => <StatusPill key={slot} tone="info" icon={Clock} label={slot} />)}
            </CardContent>
          </Card>
          <Button asChild size="lg" className="mt-md"><Link href="/suscribirme/horarios">Elegir este hub</Link></Button>
        </section>
      </Container>
    </main>
  );
}

function StepProgress({ step }: { step: Step }) {
  const index = Math.max(0, stepOrder.indexOf(step));
  if (step === "acceso" || step === "confirmacion") return null;
  return (
    <div className="mb-md">
      <div className="mb-xs flex justify-between text-xs font-semibold text-muted-foreground">
        {stepOrder.map((item) => <span key={item} className={cn(item === step && "text-primary")}>{stepCopy[item].eyebrow.replace("Paso ", "")}</span>)}
      </div>
      <ProgressBar value={((index + 1) / stepOrder.length) * 100} />
    </div>
  );
}

function CheckoutContactFields() {
  return (
    <div className="mt-md grid gap-sm md:grid-cols-2">
      <Field label="Nombre" placeholder="Mariana Soto" autoComplete="name" required />
      <Field label="Telefono" type="tel" inputMode="tel" placeholder="55 0000 0000" autoComplete="tel" required />
      <Field label="Email" type="email" inputMode="email" placeholder="nombre@correo.com" autoComplete="email" required />
      <div className="space-y-2 md:col-span-2">
        <label htmlFor="hub-note" className="block text-sm font-semibold text-foreground">Nota para el hub</label>
        <Textarea id="hub-note" placeholder="Opcional: referencia breve para el equipo de retiro" />
      </div>
      <label className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-card px-sm text-sm md:col-span-2">
        <input type="checkbox" className="h-4 w-4 accent-primary" />
        Crear cuenta para gestionar mi bolsa despues de pagar
      </label>
    </div>
  );
}

function CheckoutPaymentFields({ total }: { total: number }) {
  return (
    <div className="mt-md grid gap-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <LockKeyhole className="h-4 w-4 text-success" aria-hidden />
        Pago seguro - Visa - Mastercard - Stripe
      </div>
      <Card className="">
        <CardContent className="grid gap-sm p-md md:grid-cols-2">
          <Field label="Numero de tarjeta" inputMode="numeric" placeholder="4242 4242 4242 4242" required className="md:col-span-2" />
          <Field label="Vencimiento" inputMode="numeric" placeholder="MM/AA" required />
          <Field label="CVV" inputMode="numeric" placeholder="123" required />
        </CardContent>
      </Card>
      <div className="rounded-lg border border-info/20 bg-info-bg p-sm text-sm leading-6 text-info">
        Se cobra {formatCurrency(total)} cada viernes antes de tu retiro. Cancela, salta o pausa cuando quieras.
      </div>
      <Accordion type="single" collapsible className="rounded-lg border border-border bg-card px-sm">
        <AccordionItem value="coupon">
          <AccordionTrigger>Tienes un codigo o facturacion?</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-xs md:grid-cols-2">
              <Field label="Cupon" placeholder="TAHONA10" />
              <Field label="RFC" placeholder="Opcional" />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function SubscriptionStepPage({ step }: { step: Step }) {
  const { productos, hubs } = useTahonaStore();
  const copy = stepCopy[step];
  const [quantities, setQuantities] = useState<Record<string, number>>(() => Object.fromEntries(productos.slice(0, 4).map((product, index) => [product.id, index === 0 ? 1 : 0])));
  const selected = productos.map((product) => ({ product, quantity: quantities[product.id] ?? 0 })).filter((item) => item.quantity > 0);
  const subtotal = selected.reduce((sum, item) => sum + item.product.precio_mxn * item.quantity, 0);
  const total = subtotal || productos[0].precio_mxn;

  function updateQuantity(id: string, delta: number) {
    setQuantities((current) => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + delta) }));
  }

  return (
    <main className="storefront-shell py-lg">
      <Container className="grid gap-lg lg:grid-cols-[1fr_380px]">
        <section>
          <StepProgress step={step} />
          <SectionHeader eyebrow={copy.eyebrow} title={copy.title} body={copy.body} compact />
          {step === "acceso" ? (
            <div className="mt-lg grid gap-sm md:grid-cols-3">
              {["Sin filas", "Sin pago en tienda", "Con casillero"].map((item) => <Card key={item} className=""><CardContent className="p-md"><Check className="h-5 w-5 text-success" /><p className="mt-sm font-semibold">{item}</p></CardContent></Card>)}
            </div>
          ) : null}
          {step === "productos" ? (
            <div className="mt-md grid gap-sm md:grid-cols-2">
              {productos.slice(0, 8).map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="grid grid-cols-[112px_1fr]">
                    <div className="relative min-h-[150px] bg-muted"><Image src={product.imagen_url} alt={product.nombre} fill sizes="120px" className="object-cover" /></div>
                    <CardContent className="p-sm">
                      <Badge variant="outline">{product.categoria}</Badge>
                      <h3 className="mt-2 line-clamp-2 text-sm font-semibold">{product.nombre}</h3>
                      <p className="mt-1 font-mono text-sm">{formatCurrency(product.precio_mxn)}</p>
                      <div className="mt-sm flex items-center justify-between gap-xs">
                        <Button type="button" variant="outline" size="icon" onClick={() => updateQuantity(product.id, -1)} aria-label="Quitar"><Minus className="h-4 w-4" /></Button>
                        <span className="font-mono text-lg font-semibold">{quantities[product.id] ?? 0}</span>
                        <Button type="button" variant="outline" size="icon" onClick={() => updateQuantity(product.id, 1)} aria-label="Agregar"><Plus className="h-4 w-4" /></Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          ) : null}
          {step === "horarios" ? (
            <div className="mt-md grid gap-sm">
              {hubs.map((hub) => (
                <Card key={hub.id} className="">
                  <CardContent className="p-md">
                    <div className="flex flex-col justify-between gap-sm md:flex-row md:items-center">
                      <div><p className="text-caption font-semibold uppercase text-primary">{hub.colonia}</p><h3 className="mt-1 text-h3 font-semibold">{hub.nombre}</h3><p className="mt-1 text-sm text-muted-foreground">{hub.direccion}</p></div>
                      <div className="flex flex-wrap gap-2">{hub.slots_horarios.map((slot) => <Button key={slot} variant="outline" size="sm">{slot}</Button>)}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
          {step === "direccion" ? <CheckoutContactFields /> : null}
          {step === "pago" ? <CheckoutPaymentFields total={total} /> : null}
          {step === "confirmacion" ? (
            <div className="mt-md grid gap-sm md:grid-cols-2">
              <StatusPill tone="success" label="Pedido confirmado" />
              <StatusPill tone="info" label="QR disponible al cargar casillero" icon={QrCode} />
            </div>
          ) : null}
        </section>
        <aside className="h-fit lg:sticky lg:top-28">
          <Card className="shadow-md">
            <CardHeader><CardTitle>Resumen</CardTitle></CardHeader>
            <CardContent className="space-y-xs">
              {(selected.length ? selected : [{ product: productos[0], quantity: 1 }]).map(({ product, quantity }) => <ProductLine key={product.id} product={product} quantity={quantity} />)}
              <div className="border-t border-border pt-sm">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(total)}</span></div>
                <div className="mt-2 flex justify-between text-sm text-muted-foreground"><span>Retiro</span><span>Incluido</span></div>
                <div className="mt-sm flex justify-between text-h3 font-semibold"><span>Total</span><span>{formatCurrency(total)}</span></div>
              </div>
              <Button asChild size="lg" className="w-full">
                <Link href={copy.next}>{copy.cta}</Link>
              </Button>
              <p className="text-xs leading-5 text-muted-foreground">Sin cargos ocultos. Puedes pausar o editar desde tu cuenta.</p>
            </CardContent>
          </Card>
        </aside>
      </Container>
      {step !== "confirmacion" ? <StickyCTA label="Pedido Tahona" helper="Resumen visible antes de pagar" price={formatCurrency(total)} buttonProps={{ asChild: true, children: <Link href={copy.next}>{copy.cta}</Link> }} /> : null}
    </main>
  );
}

function useAccountData() {
  const store = useTahonaStore();
  const client = store.clientes.find((item) => item.id === store.currentClientId) ?? store.clientes[0];
  const subscription = store.suscripciones.find((item) => item.cliente_id === client.id) ?? store.suscripciones[0];
  const deliveries = store.entregas.filter((item) => item.cliente_id === client.id).slice(0, 10);
  const charges = store.cobros.filter((item) => item.cliente_id === client.id).slice(0, 8);
  const nextDelivery = deliveries.find((item) => item.estado === "listo") ?? deliveries[0] ?? store.entregas[0];
  const hub = getHub(store.hubs, nextDelivery.hub_id);
  return { ...store, client, subscription, deliveries, charges, nextDelivery, hub };
}

function AccountNav({ active }: { active: string }) {
  const items = [
    ["/cuenta", "Resumen"],
    ["/cuenta/entregas", "Entregas"],
    ["/cuenta/suscripcion", "Suscripcion"],
    ["/cuenta/pagos", "Pagos"],
    ["/cuenta/perfil", "Perfil"]
  ];
  return (
    <nav className="flex gap-2 overflow-x-auto pb-1">
      {items.map(([href, label]) => (
        <Button key={href} asChild size="sm" variant={(active === "resumen" && href === "/cuenta") || href.includes(active) ? "default" : "outline"}>
          <Link href={href}>{label}</Link>
        </Button>
      ))}
    </nav>
  );
}

type AccountData = ReturnType<typeof useAccountData>;

function AccountSummary({ data, delivery }: { data: AccountData; delivery: Entrega }) {
  const failedCharge = data.charges.find((charge) => charge.estado === "fallido");
  const weeklyTotal = subscriptionTotal(data.productos, data.subscription);

  return (
    <div className="space-y-md">
      {failedCharge ? (
        <div className="flex flex-col justify-between gap-sm rounded-lg border border-danger/20 bg-danger-bg p-sm md:flex-row md:items-center">
          <div className="flex gap-sm">
            <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-danger" aria-hidden />
            <div>
              <p className="font-semibold text-danger">Tu pago no se proceso.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Actualiza tu tarjeta antes del corte del viernes. Monto pendiente: {formatCurrency(failedCharge.monto)}.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="bg-card">
            <Link href="/cuenta/pagos">Actualizar tarjeta</Link>
          </Button>
        </div>
      ) : null}
      <div className="grid gap-md lg:grid-cols-[480px_1fr]">
        <BoardingPass entrega={delivery} hub={data.hub} productos={data.productos} />
        <div className="space-y-sm">
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-sm">
                <div>
                  <StatusPill tone={delivery.estado === "incidencia" ? "danger" : delivery.estado === "listo" ? "success" : "info"} label={delivery.estado.replaceAll("_", " ")} />
                  <CardTitle className="mt-sm">Tu bolsa del {shortDate(delivery.fecha)}</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">{data.hub.nombre} - {delivery.slot}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Se cobra el viernes previo - {formatCurrency(weeklyTotal)}</p>
                </div>
                <Button asChild>
                  <Link href={`/cuenta/entrega/${delivery.id}`}>Ver pase</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-xs">
              <div className="grid gap-xs sm:grid-cols-3">
                <Button variant="outline" className="w-full">Saltar esta semana</Button>
                <Button asChild variant="outline" className="w-full"><Link href="/cuenta/suscripcion/pausar">Pausar</Link></Button>
                <Button asChild variant="outline" className="w-full"><Link href="/cuenta/suscripcion/editar">Editar bolsa</Link></Button>
              </div>
            </CardContent>
          </Card>
          <Card className="">
            <CardHeader><CardTitle>Contenido de la bolsa</CardTitle></CardHeader>
            <CardContent className="space-y-xs">
              {data.subscription.productos.map((item) => (
                <ProductLine key={item.producto_id} product={getProduct(data.productos, item.producto_id)} quantity={item.cantidad} />
              ))}
              <div className="flex justify-between border-t border-border pt-sm text-h3 font-semibold">
                <span>Total semanal</span>
                <span className="font-mono">{formatCurrency(weeklyTotal)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function AccountPage({ view, entregaId }: { view: string; entregaId?: string }) {
  const data = useAccountData();
  const delivery = entregaId ? data.entregas.find((item) => item.id === entregaId) ?? data.nextDelivery : data.nextDelivery;
  const activeView = view === "entrega" ? "entregas" : view;

  return (
    <main className="storefront-shell py-lg">
      <Container>
        <div className="mb-md flex flex-col justify-between gap-sm md:flex-row md:items-end">
          <SectionHeader eyebrow="Mi cuenta" title={`Hola, ${data.client.nombre}.`} body="Tu proximo retiro, suscripcion y pagos en una sola lectura." compact />
          <AccountNav active={activeView} />
        </div>
        {view === "resumen" ? <AccountSummary data={data} delivery={delivery} /> : null}
        {view === "entregas" ? <DeliveryList entregas={data.deliveries} productos={data.productos} hubs={data.hubs} /> : null}
        {view === "entrega" ? <DeliveryDetail entrega={delivery} productos={data.productos} hub={getHub(data.hubs, delivery.hub_id)} /> : null}
        {view === "suscripcion" ? <SubscriptionPanelV2 subscription={data.subscription} productos={data.productos} charges={data.charges} /> : null}
        {view === "editar" ? <EditSubscription subscription={data.subscription} productos={data.productos} /> : null}
        {view === "pausar" ? <PauseSubscription /> : null}
        {view === "pagos" ? <PaymentsPanel charges={data.charges} /> : null}
        {view === "perfil" ? <ProfilePanel /> : null}
      </Container>
    </main>
  );
}

function DeliveryList({ entregas, productos, hubs }: { entregas: Entrega[]; productos: Producto[]; hubs: Hub[] }) {
  return (
    <div className="grid gap-xs">
      {entregas.map((entrega) => (
        <Link key={entrega.id} href={`/cuenta/entrega/${entrega.id}`} className="grid gap-sm rounded-lg border border-border bg-card p-sm shadow-sm md:grid-cols-[1fr_auto_auto] md:items-center">
          <div><p className="font-semibold">{shortDate(entrega.fecha)} - {getHub(hubs, entrega.hub_id).nombre}</p><p className="mt-1 text-sm text-muted-foreground">{entrega.productos.length} tipos - {entrega.slot}</p></div>
          <StatusPill tone={entrega.estado === "incidencia" ? "danger" : entrega.estado === "listo" ? "warning" : "success"} label={entrega.estado.replaceAll("_", " ")} />
          <p className="font-mono text-sm font-semibold">{formatCurrency(deliveryTotal(productos, entrega))}</p>
        </Link>
      ))}
    </div>
  );
}

function DeliveryDetail({ entrega, productos, hub }: { entrega: Entrega; productos: Producto[]; hub: Hub }) {
  return (
    <div className="mx-auto grid max-w-[920px] gap-md lg:grid-cols-[480px_1fr]">
      <BoardingPass entrega={entrega} hub={hub} productos={productos} />
      <Card className="">
        <CardHeader><CardTitle>Instrucciones de retiro</CardTitle></CardHeader>
        <CardContent className="space-y-sm">
          {["Llega dentro de tu ventana.", "Escanea el codigo QR en el modulo.", "Abre el casillero asignado y confirma retiro."].map((text, index) => <div key={text} className="flex gap-sm"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-info-bg text-sm font-semibold text-info">{index + 1}</span><p className="pt-1 text-sm text-muted-foreground">{text}</p></div>)}
          <div className="rounded-md border border-danger/20 bg-danger-bg p-sm">
            <p className="text-sm font-semibold text-danger">El casillero no abre?</p>
            <p className="mt-1 text-sm text-muted-foreground">Ten listo tu codigo de respaldo y contacta soporte desde aqui.</p>
            <Button asChild variant="outline" className="mt-sm bg-card">
              <Link href="/soporte">Necesito ayuda</Link>
            </Button>
          </div>
          <div className="border-t border-border pt-sm">
            <p className="text-sm font-semibold">Bitacora</p>
            {["Pedido apartado", "Produccion confirmada", "Casillero asignado", "QR activado"].map((event) => (
              <div key={event} className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                {event}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function shiftIsoDate(value: string, days: number) {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function SubscriptionPanelV2({
  subscription,
  productos,
  charges
}: {
  subscription: Suscripcion;
  productos: Producto[];
  charges: Cobro[];
}) {
  const [skipNext, setSkipNext] = useState(false);
  const [pauseWindow, setPauseWindow] = useState<"none" | "30" | "60">("none");
  const [cancelStep, setCancelStep] = useState<0 | 1 | 2 | 3>(0);
  const [cancelReason, setCancelReason] = useState("viaje");
  const failedCharge = charges.find((charge) => charge.estado === "fallido");
  const weeklyTotal = subscriptionTotal(productos, subscription);
  const chargeDate = shortDate(shiftIsoDate(subscription.proxima_entrega, -3));

  const reasonOptions = [
    ["viaje", "Estare fuera de la ciudad"],
    ["precio", "Quiero bajar el gasto semanal"],
    ["producto", "La bolsa no se ajusta a lo que necesito"],
    ["horario", "El horario de retiro no me funciona"]
  ];

  return (
    <div className="grid gap-md lg:grid-cols-[1fr_400px]">
      <div className="space-y-sm">
        {failedCharge ? (
          <div className="flex flex-col justify-between gap-sm rounded-lg border border-danger/20 bg-danger-bg p-sm md:flex-row md:items-center">
            <div className="flex gap-sm">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-danger" aria-hidden />
              <div>
                <p className="font-semibold text-danger">Pago fallido pendiente</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatCurrency(failedCharge.monto)} no se pudo cobrar. Actualiza la tarjeta para mantener activo el retiro.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="bg-card">
              <Link href="/cuenta/pagos">Actualizar tarjeta</Link>
            </Button>
          </div>
        ) : null}

        <Card className="overflow-hidden shadow-sm">
          <div className="brand-rule h-1" />
          <CardHeader className="flex-row items-start justify-between gap-sm">
            <div>
              <p className="text-caption font-semibold uppercase text-primary">Bolsa semanal activa</p>
              <CardTitle className="mt-1">Tu suscripcion queda bajo control.</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">Se cobra el {chargeDate} - {formatCurrency(weeklyTotal)}</p>
            </div>
            <StatusPill tone={subscription.estado === "activa" ? "success" : "warning"} label={subscription.estado} />
          </CardHeader>
          <CardContent className="space-y-xs">
            {subscription.productos.map((item) => (
              <ProductLine key={item.producto_id} product={getProduct(productos, item.producto_id)} quantity={item.cantidad} />
            ))}
            <div className="mt-sm rounded-lg border border-border bg-surface-2 p-sm">
              <div className="flex items-center justify-between gap-sm">
                <div>
                  <p className="text-sm font-semibold">Total recurrente</p>
                  <p className="mt-1 text-xs text-muted-foreground">Editable antes del corte. Sin cargos sorpresa.</p>
                </div>
                <p className="font-mono text-2xl font-semibold">{formatCurrency(weeklyTotal)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-sm">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Controles rapidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-xs">
            <Button asChild className="w-full justify-between">
              <Link href="/cuenta/suscripcion/editar">Editar bolsa <ChevronRight className="h-4 w-4" aria-hidden /></Link>
            </Button>
            <Button
              type="button"
              variant={skipNext ? "default" : "outline"}
              className="w-full justify-between"
              onClick={() => setSkipNext((current) => !current)}
            >
              Saltar esta semana
              {skipNext ? <Check className="h-4 w-4" aria-hidden /> : <CalendarDays className="h-4 w-4" aria-hidden />}
            </Button>
            <div className="grid grid-cols-2 gap-xs">
              <Button
                type="button"
                variant={pauseWindow === "30" ? "default" : "outline"}
                onClick={() => setPauseWindow((current) => current === "30" ? "none" : "30")}
              >
                Pausar 30 dias
              </Button>
              <Button
                type="button"
                variant={pauseWindow === "60" ? "default" : "outline"}
                onClick={() => setPauseWindow((current) => current === "60" ? "none" : "60")}
              >
                Pausar 60 dias
              </Button>
            </div>
            {skipNext || pauseWindow !== "none" ? (
              <div className="rounded-md border border-info/20 bg-info-bg p-xs text-sm text-info">
                {skipNext ? "La proxima bolsa queda omitida." : `La suscripcion queda pausada ${pauseWindow} dias.`}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Cancelar suscripcion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-sm">
            {cancelStep === 0 ? (
              <>
                <p className="text-sm leading-6 text-muted-foreground">
                  Antes de cancelar, Tahona puede saltar, pausar o ajustar la bolsa para no perder la rutina.
                </p>
                <Button type="button" variant="outline" className="w-full border-danger/30 text-danger hover:bg-danger-bg" onClick={() => setCancelStep(1)}>
                  Iniciar cancelacion
                </Button>
              </>
            ) : null}

            {cancelStep === 1 ? (
              <>
                <p className="text-sm font-semibold">1. Motivo principal</p>
                <div className="grid gap-2">
                  {reasonOptions.map(([value, label]) => (
                    <label key={value} className={cn("flex cursor-pointer items-center gap-2 rounded-md border p-xs text-sm", cancelReason === value ? "border-primary bg-info-bg text-info" : "border-border bg-card text-muted-foreground")}>
                      <input
                        type="radio"
                        name="cancel-reason"
                        value={value}
                        checked={cancelReason === value}
                        onChange={() => setCancelReason(value)}
                        className="h-4 w-4 accent-[var(--brand)]"
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <Button type="button" className="w-full" onClick={() => setCancelStep(2)}>Continuar</Button>
              </>
            ) : null}

            {cancelStep === 2 ? (
              <>
                <p className="text-sm font-semibold">2. Opcion para conservar la cuenta</p>
                <div className="grid gap-2">
                  <button type="button" className="rounded-md border border-border bg-surface-2 p-xs text-left hover:border-primary" onClick={() => { setSkipNext(true); setCancelStep(0); }}>
                    <span className="flex items-center gap-2 font-semibold"><CalendarDays className="h-4 w-4 text-primary" aria-hidden />Saltar la siguiente bolsa</span>
                    <span className="mt-1 block text-xs text-muted-foreground">Mantiene el historial, preferencias y tarjeta.</span>
                  </button>
                  <button type="button" className="rounded-md border border-border bg-surface-2 p-xs text-left hover:border-primary" onClick={() => { setPauseWindow("30"); setCancelStep(0); }}>
                    <span className="flex items-center gap-2 font-semibold"><Clock className="h-4 w-4 text-primary" aria-hidden />Pausar 30 dias</span>
                    <span className="mt-1 block text-xs text-muted-foreground">Regresa automaticamente antes del siguiente ciclo.</span>
                  </button>
                  <button type="button" className="rounded-md border border-border bg-surface-2 p-xs text-left hover:border-primary" onClick={() => setCancelStep(3)}>
                    <span className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-primary" aria-hidden />Confirmar cancelacion</span>
                    <span className="mt-1 block text-xs text-muted-foreground">Continua solo si ninguna alternativa funciona.</span>
                  </button>
                </div>
              </>
            ) : null}

            {cancelStep === 3 ? (
              <>
                <div className="rounded-md border border-danger/20 bg-danger-bg p-xs">
                  <p className="text-sm font-semibold text-danger">3. Confirmacion final</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Motivo registrado: {reasonOptions.find(([value]) => value === cancelReason)?.[1]}. La cuenta queda sin proxima bolsa.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-xs">
                  <Button type="button" variant="outline" onClick={() => setCancelStep(0)}>Volver</Button>
                  <Button type="button" variant="outline" className="border-danger/30 text-danger hover:bg-danger-bg">Cancelar cuenta</Button>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function EditSubscription({ subscription, productos }: { subscription: Suscripcion; productos: Producto[] }) {
  return (
    <Card className="">
      <CardHeader><CardTitle>Editar bolsa semanal</CardTitle></CardHeader>
      <CardContent className="grid gap-xs md:grid-cols-2">
        {productos.slice(0, 8).map((product) => {
          const current = subscription.productos.find((item) => item.producto_id === product.id)?.cantidad ?? 0;
          return <ProductLine key={product.id} product={product} quantity={current} action={<Button variant="outline" size="sm">Ajustar</Button>} />;
        })}
      </CardContent>
    </Card>
  );
}

function PauseSubscription() {
  return (
    <Card className="max-w-2xl">
      <CardHeader><CardTitle>Pausar suscripcion</CardTitle></CardHeader>
      <CardContent className="space-y-sm">
        {[1, 2, 4].map((weeks) => <Button key={weeks} variant="outline" className="w-full justify-between">Pausar {weeks} semana{weeks > 1 ? "s" : ""}<ChevronRight className="h-4 w-4" /></Button>)}
        <p className="text-sm text-muted-foreground">La pausa no cancela tu cuenta ni elimina tu configuracion.</p>
      </CardContent>
    </Card>
  );
}

function PaymentsPanel({ charges }: { charges: Cobro[] }) {
  return (
    <div className="grid gap-xs">
      {charges.map((charge) => (
        <Card key={charge.id} className=""><CardContent className="grid gap-sm p-sm md:grid-cols-[1fr_auto_auto] md:items-center"><div><p className="font-semibold">{shortDate(charge.fecha)}</p><p className="text-sm text-muted-foreground">{charge.metodo}</p></div><StatusPill tone={charge.estado === "cobrado" ? "success" : charge.estado === "fallido" ? "danger" : "warning"} label={charge.estado} /><p className="font-mono font-semibold">{formatCurrency(charge.monto)}</p></CardContent></Card>
      ))}
    </div>
  );
}

function ProfilePanel() {
  return (
    <Card className="max-w-3xl">
      <CardHeader><CardTitle>Datos personales</CardTitle></CardHeader>
      <CardContent className="grid gap-sm md:grid-cols-2">
        <Field label="Nombre" defaultValue="Mariana" />
        <Field label="Apellido" defaultValue="Soto" />
        <Field label="Correo" defaultValue="mariana@correo.com" />
        <Field label="Telefono" defaultValue="55 3200 7800" />
        <Field label="Hub principal" defaultValue="Hub Polanco" />
        <Field label="Colonia" defaultValue="Polanco" />
      </CardContent>
    </Card>
  );
}

export function SupportPage() {
  return (
    <main className="storefront-shell py-lg">
      <Container className="grid gap-lg lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeader eyebrow="Soporte" title="Ayuda clara antes, durante y despues del retiro." body="La prioridad es resolver incidencias de casillero, cobro o pedido sin forzar llamadas innecesarias." />
        <div className="grid gap-sm">
          {[
            [HelpCircle, "No puedo abrir mi casillero", "Valida codigo, hub y ventana de retiro."],
            [Receipt, "Tengo un problema de cobro", "Revisa reintentos, recibos y tarjeta."],
            [PackageCheck, "Mi pedido no corresponde", "Levanta incidencia con foto y detalle."]
          ].map(([Icon, title, body]) => <Card key={String(title)} className=""><CardContent className="flex gap-sm p-md"><Icon className="h-5 w-5 text-primary" /><div><h2 className="font-semibold">{title as string}</h2><p className="mt-1 text-sm text-muted-foreground">{body as string}</p></div></CardContent></Card>)}
        </div>
      </Container>
    </main>
  );
}

export function AuthPage({ mode }: { mode: "login" | "registro" }) {
  const isLogin = mode === "login";
  return (
    <main className="storefront-shell grid min-h-[calc(100svh-80px)] lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-foreground text-white lg:block">
        <Image src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=82&w=2000&auto=format&fit=crop" alt="Pan Tahona" fill sizes="50vw" className="object-cover opacity-72" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-transparent" />
        <div className="absolute bottom-xl left-xl max-w-lg"><p className="eyebrow-mark text-caption font-semibold uppercase text-secondary">Tahona</p><h1 className="mt-2 font-display text-display font-semibold">Tu pan semanal, listo para retirar.</h1></div>
      </section>
      <section className="flex items-center justify-center p-md">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader><CardTitle>{isLogin ? "Entrar a mi cuenta" : "Crear cuenta"}</CardTitle></CardHeader>
          <CardContent className="space-y-sm">
            {!isLogin ? <Field label="Nombre" placeholder="Mariana Soto" /> : null}
            <Field label="Correo" type="email" placeholder="nombre@correo.com" />
            <Field label="Contrasena" type="password" placeholder="********" />
            <Button asChild className="w-full"><Link href="/cuenta">{isLogin ? "Entrar" : "Crear cuenta"}</Link></Button>
            <Button asChild variant="ghost" className="w-full"><Link href={isLogin ? "/registro" : "/login"}>{isLogin ? "Crear cuenta" : "Ya tengo cuenta"}</Link></Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
