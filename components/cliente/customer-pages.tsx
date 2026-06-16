"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Clock,
  CreditCard,
  HelpCircle,
  Home,
  MapPin,
  PackageCheck,
  Pause,
  QrCode,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TimerReset,
  User,
  Wallet,
  Wheat
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/empty-state";
import { HubMap } from "@/components/shared/hub-map";
import { ProgressBar } from "@/components/shared/progress";
import { StatusBadge } from "@/components/shared/status-badge";
import { useTahonaStore } from "@/lib/store/tahona-store";
import type { Producto } from "@/lib/mock-data";
import { formatCurrency, shortDate } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28 }
};

function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 ${className}`}>{children}</div>;
}

function SectionTitle({
  eyebrow,
  title,
  body
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-balance md:text-5xl">
        {title}
      </h2>
      {body ? <p className="mt-4 text-muted-foreground md:text-lg">{body}</p> : null}
    </div>
  );
}

function ProductCard({ product }: { product: Producto }) {
  return (
    <Link href={`/catalogo/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
        <Image
          src={product.imagen_url}
          alt={product.nombre}
          fill
          sizes="(max-width: 768px) 90vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-semibold">{product.nombre}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{product.descripcion_corta}</p>
        </div>
        <span className="text-sm font-semibold">{formatCurrency(product.precio_mxn)}</span>
      </div>
    </Link>
  );
}

export function LandingPage() {
  const { productos, hubs } = useTahonaStore();
  const hero = productos[0];
  const featured = productos.slice(0, 4);
  return (
    <main>
      <section className="relative min-h-[86vh] overflow-hidden bg-tahona-ink text-white">
        <Image
          src={hero.imagen_url}
          alt="Hogaza de pan artesanal Tahona"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-tahona-ink/30 via-tahona-ink/55 to-tahona-ink" />
        <Container className="relative flex min-h-[86vh] flex-col justify-end pb-14 pt-28">
          <motion.div {...fadeUp} className="max-w-3xl">
            <Badge className="bg-tahona-crust text-tahona-ink">Desde 1957</Badge>
            <h1 className="mt-5 font-display text-6xl font-semibold leading-[0.95] text-balance md:text-8xl">
              Pan recién horneado, esperándote en tu hub.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/85 md:text-xl">
              Suscríbete a tus panes favoritos de Tahona, elige horario fijo y retira tu bolsa
              caliente en casilleros inteligentes de CDMX.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href="/suscribirme">
                  Suscribirme <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                <Link href="/catalogo">Ver vitrina</Link>
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="bg-tahona-cream py-16">
        <Container>
          <SectionTitle
            eyebrow="Cómo funciona"
            title="Un ritual semanal con operación precisa."
            body="La experiencia conserva el oficio de panadería y elimina la fila, la incertidumbre y la planeación de último minuto."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              ["Te suscribes", User],
              ["Elegimos tus panes", Wheat],
              ["Llegan a tu hub", MapPin],
              ["Abres tu casillero", QrCode]
            ].map(([label, Icon], index) => (
              <Card key={label as string}>
                <CardContent className="p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-secondary text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <p className="mt-5 text-sm font-semibold text-muted-foreground">Paso {index + 1}</p>
                  <h3 className="mt-1 text-xl font-semibold">{label as string}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle eyebrow="Vitrina" title="Piezas que justifican la vuelta." />
            <Button asChild variant="outline">
              <Link href="/catalogo">Catálogo completo</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-7 md:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-tahona-ink py-16 text-white">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <SectionTitle
              eyebrow="Hubs CDMX"
              title="Tres puntos de retiro para empezar a escalar."
              body="Polanco, Condesa y Del Valle operan con ventanas fijas, capacidad visible y trazabilidad por casillero."
            />
            <HubMap hubs={hubs} />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Llegué a mi hub a las 7:10 y mi pan seguía tibio. Cambió mi rutina de desayuno.",
              "La app deja clarísimo qué viene en la bolsa y el casillero abre sin fricción.",
              "Se siente como Tahona, pero con operación de producto digital serio."
            ].map((quote, index) => (
              <Card key={quote}>
                <CardContent className="p-6">
                  <p className="font-display text-2xl leading-snug">“{quote}”</p>
                  <p className="mt-5 text-sm font-semibold text-muted-foreground">
                    Cliente piloto {index + 1}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}

export function CatalogoPage() {
  const { productos } = useTahonaStore();
  const categorias = ["Todos", ...Array.from(new Set(productos.map((p) => p.categoria)))];
  const [categoria, setCategoria] = useState("Todos");
  const filtered = categoria === "Todos" ? productos : productos.filter((p) => p.categoria === categoria);
  return (
    <main className="bg-tahona-masa">
      <div className="sticky top-[65px] z-20 border-b bg-tahona-masa/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto">
          {categorias.map((item) => (
            <button
              key={item}
              onClick={() => setCategoria(item)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                categoria === item ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <Container className="py-16">
          <EmptyState icon={Search} title="Sin piezas en esta categoría" body="Prueba otro filtro de la vitrina." />
        </Container>
      ) : (
        filtered.map((product, index) => (
          <motion.section
            key={product.id}
            {...fadeUp}
            className="relative flex min-h-screen items-end overflow-hidden border-b bg-tahona-ink text-white"
          >
            <Image src={product.imagen_url} alt={product.nombre} fill sizes="100vw" className="object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-r from-tahona-ink via-tahona-ink/55 to-transparent" />
            <Container className="relative pb-16 pt-28">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-tahona-crust">
                  {String(index + 1).padStart(2, "0")} / {product.categoria}
                </p>
                <h1 className="mt-5 font-display text-6xl font-semibold leading-none text-balance md:text-8xl">
                  {product.nombre}
                </h1>
                <p className="mt-6 max-w-xl text-lg text-white/85">{product.descripcion_premium}</p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <span className="font-display text-3xl">{formatCurrency(product.precio_mxn)}</span>
                  <Button asChild variant="accent">
                    <Link href={`/catalogo/${product.slug}`}>Ver detalle</Link>
                  </Button>
                </div>
              </div>
            </Container>
          </motion.section>
        ))
      )}
    </main>
  );
}

export function ProductDetailPage({ slug }: { slug: string }) {
  const { productos } = useTahonaStore();
  const product = productos.find((item) => item.slug === slug);
  if (!product) {
    return (
      <Container className="py-16">
        <EmptyState icon={Wheat} title="Producto no disponible" body="La pieza cambió de temporada." action="Volver al catálogo" />
      </Container>
    );
  }
  return (
    <main className="min-h-screen bg-tahona-cream">
      <section className="grid min-h-[calc(100vh-65px)] lg:grid-cols-2">
        <div className="relative min-h-[52vh] lg:min-h-full">
          <Image src={product.imagen_url} alt={product.nombre} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="flex items-center px-5 py-12 lg:px-14">
          <div className="max-w-xl">
            <Badge variant="secondary">{product.categoria}</Badge>
            <h1 className="mt-5 font-display text-6xl font-semibold leading-none text-balance md:text-7xl">
              {product.nombre}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{product.descripcion_premium}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {product.ingredientes.map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <InfoPill label="Precio" value={formatCurrency(product.precio_mxn)} />
              <InfoPill label="Horneado" value={`${product.tiempo_horneado_min} min`} />
              <InfoPill label="Agenda" value={product.disponibilidad.slice(0, 2).join(", ")} />
            </div>
            <Button asChild size="lg" className="mt-8 w-full sm:w-auto">
              <Link href="/suscribirme/productos">
                Agregar a mi pedido <ShoppingBag className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}

export function ComoFuncionaPage() {
  const steps = [
    ["Te suscribes", "Crea tu cuenta, elige frecuencia y define tus preferencias de pan.", User],
    ["Armamos tu menú", "Selecciona piezas base y deja que Tahona sugiera panes de temporada.", Wheat],
    ["Horneamos por ventana", "Producción consolida cantidades por hub y horario para reducir merma.", Clock],
    ["Retiras con QR", "Tu bolsa queda en casillero y abres desde la app con trazabilidad.", QrCode]
  ] as const;
  return (
    <main className="py-14">
      <Container>
        <SectionTitle eyebrow="Experiencia" title="Del horno al casillero en cuatro movimientos." />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {steps.map(([title, body, Icon], index) => (
            <Card key={title} className="overflow-hidden">
              <CardContent className="grid gap-6 p-6 md:grid-cols-[auto_1fr]">
                <div className="flex h-16 w-16 items-center justify-center rounded-md bg-tahona-ink text-tahona-crust">
                  <Icon className="h-7 w-7" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-secondary">Paso {index + 1}</p>
                  <h2 className="mt-1 font-display text-3xl font-semibold">{title}</h2>
                  <p className="mt-3 text-muted-foreground">{body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </main>
  );
}

export function HubsPage() {
  const { hubs } = useTahonaStore();
  const [activeHubId, setActiveHubId] = useState(hubs[0]?.id);
  return (
    <main className="py-14">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionTitle eyebrow="Encuentra tu hub" title="Elige la zona donde tu pan te espera." />
            <div className="mt-8 space-y-3">
              {hubs.map((hub, index) => (
                <button
                  key={hub.id}
                  onClick={() => setActiveHubId(hub.id)}
                  className={`w-full rounded-lg border bg-card p-4 text-left transition-all hover:shadow-soft ${
                    activeHubId === hub.id ? "border-secondary shadow-soft" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{hub.nombre}</h3>
                      <p className="text-sm text-muted-foreground">{hub.direccion}</p>
                    </div>
                    <Badge variant="soft">{(1.2 + index * 1.4).toFixed(1)} km</Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <HubMap hubs={hubs} activeHubId={activeHubId} />
        </div>
      </Container>
    </main>
  );
}

export function HubDetailPage({ slug }: { slug: string }) {
  const { hubs } = useTahonaStore();
  const hub = hubs.find((item) => item.slug === slug);
  if (!hub) return <EmptyState icon={MapPin} title="Hub no encontrado" body="Revisa la lista de ubicaciones activas." />;
  const occupied = Math.round((hub.casilleros_ocupados_actual / hub.casilleros_total) * 100);
  return (
    <main className="py-10">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[420px] overflow-hidden rounded-lg">
            <Image src={hub.imagen_exterior} alt={`Exterior de ${hub.nombre}`} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <Badge variant="secondary">{hub.colonia}</Badge>
            <h1 className="mt-4 font-display text-6xl font-semibold">{hub.nombre}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{hub.direccion}</p>
            <div className="mt-7 space-y-4">
              <InfoPill label="Operación" value={hub.horario_operacion} />
              <InfoPill label="Gerente" value={hub.gerente} />
              <div className="rounded-lg border bg-card p-4">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Ocupación actual</span>
                  <span>{occupied}%</span>
                </div>
                <ProgressBar value={occupied} className="mt-3" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {hub.slots_horarios.map((slot) => (
                  <div key={slot} className="rounded-md border bg-card p-3 text-center text-sm font-semibold">
                    {slot}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

export function SubscriptionStepPage({ step }: { step: "acceso" | "productos" | "horarios" | "direccion" | "pago" | "confirmacion" }) {
  const { productos, hubs } = useTahonaStore();
  const [selected, setSelected] = useState<Record<string, number>>({
    [productos[0].id]: 1,
    [productos[3].id]: 1,
    [productos[10].id]: 1
  });
  const stepIndex = ["acceso", "productos", "horarios", "direccion", "pago", "confirmacion"].indexOf(step) + 1;
  const nextHref = {
    acceso: "/suscribirme/productos",
    productos: "/suscribirme/horarios",
    horarios: "/suscribirme/direccion",
    direccion: "/suscribirme/pago",
    pago: "/suscribirme/confirmacion",
    confirmacion: "/cuenta"
  }[step];
  return (
    <main className="py-10">
      <Container className="max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
            <span>Suscripción Tahona</span>
            <span>Paso {stepIndex} de 6</span>
          </div>
          <ProgressBar value={(stepIndex / 6) * 100} className="mt-3" />
        </div>
        <Card>
          <CardContent className="p-6 md:p-8">
            {step === "acceso" ? <AccessStep /> : null}
            {step === "productos" ? (
              <ProductsStep productos={productos} selected={selected} setSelected={setSelected} />
            ) : null}
            {step === "horarios" ? <ScheduleStep /> : null}
            {step === "direccion" ? <AddressStep hubs={hubs} /> : null}
            {step === "pago" ? <PaymentStep /> : null}
            {step === "confirmacion" ? <ConfirmStep /> : null}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button asChild variant="ghost">
                <Link href="/">Salir</Link>
              </Button>
              <Button asChild size="lg">
                <Link href={nextHref}>
                  {step === "confirmacion" ? "Ir a mi cuenta" : "Continuar"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}

function AccessStep() {
  return (
    <div>
      <SectionTitle eyebrow="Acceso" title="Empieza con una cuenta para guardar tu ritual." />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Input placeholder="correo@ejemplo.com" />
        <Input placeholder="Teléfono" />
        <Button variant="secondary" className="md:col-span-2">
          Entrar con código simulado
        </Button>
      </div>
    </div>
  );
}

function ProductsStep({
  productos,
  selected,
  setSelected
}: {
  productos: Producto[];
  selected: Record<string, number>;
  setSelected: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) {
  return (
    <div>
      <SectionTitle eyebrow="Menú semanal" title="Elige las piezas que quieres recibir." />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {productos.slice(0, 6).map((product) => (
          <div key={product.id} className="flex gap-4 rounded-lg border bg-card p-3">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md">
              <Image src={product.imagen_url} alt={product.nombre} fill sizes="96px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold">{product.nombre}</h3>
              <p className="text-sm text-muted-foreground">{formatCurrency(product.precio_mxn)}</p>
              <div className="mt-3 flex items-center gap-2">
                {[0, 1, 2, 3].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => setSelected((prev) => ({ ...prev, [product.id]: qty }))}
                    className={`h-8 w-8 rounded-md border text-sm font-semibold ${
                      selected[product.id] === qty ? "bg-primary text-primary-foreground" : "bg-background"
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleStep() {
  return (
    <div>
      <SectionTitle eyebrow="Horarios" title="Define tus ventanas de retiro." />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {["7:00 AM", "1:30 PM", "7:30 PM"].map((slot, index) => (
          <label key={slot} className="rounded-lg border bg-card p-5">
            <input type="checkbox" defaultChecked={index < 2} className="h-4 w-4 accent-tahona-terracotta" />
            <span className="mt-4 block text-2xl font-semibold">{slot}</span>
            <span className="mt-2 block text-sm text-muted-foreground">
              {index === 0 ? "Antes de oficina" : index === 1 ? "Hora de comida" : "Regreso a casa"}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function AddressStep({ hubs }: { hubs: ReturnType<typeof useTahonaStore.getState>["hubs"] }) {
  return (
    <div>
      <SectionTitle eyebrow="Dirección" title="Calculamos el hub más conveniente." />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <Input defaultValue="Amsterdam 214" aria-label="Calle y número" />
          <Input defaultValue="Condesa" aria-label="Colonia" />
          <Input defaultValue="06140" aria-label="Código postal" />
        </div>
        <div>
          <HubMap hubs={hubs} activeHubId="hub-condesa" compact />
          <p className="mt-3 rounded-md bg-tahona-cream p-3 text-sm font-semibold">
            Hub asignado: Hub Condesa, 1.4 km de distancia.
          </p>
        </div>
      </div>
    </div>
  );
}

function PaymentStep() {
  return (
    <div>
      <SectionTitle eyebrow="Pago" title="Cobro automático semanal, sin filas." />
      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_0.9fr]">
        <div className="space-y-3">
          <Input defaultValue="4242 4242 4242 4242" aria-label="Número de tarjeta" />
          <div className="grid grid-cols-2 gap-3">
            <Input defaultValue="08/29" aria-label="Expiración" />
            <Input defaultValue="123" aria-label="CVC" />
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-tahona-terracotta" />
            Acepto términos de suscripción y política de reintentos.
          </label>
        </div>
        <Card className="bg-tahona-ink text-white">
          <CardContent className="p-6">
            <CreditCard className="h-6 w-6 text-tahona-crust" aria-hidden />
            <p className="mt-8 text-sm text-white/60">Tarjeta guardada</p>
            <p className="mt-2 text-2xl font-semibold">•••• •••• •••• 4242</p>
            <p className="mt-8 text-sm text-white/70">Próximo cobro estimado: $364 MXN</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ConfirmStep() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-tahona-nopal text-white">
        <Check className="h-7 w-7" aria-hidden />
      </div>
      <h1 className="mt-6 font-display text-5xl font-semibold">Tu pan ya tiene ruta.</h1>
      <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
        Primera entrega: martes 16 de junio, 7:00 AM, Hub Condesa. Te avisaremos cuando el
        casillero esté cargado.
      </p>
    </div>
  );
}

export function AccountPage({ view, entregaId }: { view: string; entregaId?: string }) {
  const store = useTahonaStore();
  const client = store.clientes.find((item) => item.id === store.currentClientId) ?? store.clientes[0];
  const subscription = store.suscripciones.find((item) => item.cliente_id === client.id);
  const clientDeliveries = store.entregas.filter((item) => item.cliente_id === client.id).slice(0, 12);
  const clientCharges = store.cobros.filter((item) => item.cliente_id === client.id).slice(0, 8);
  const activeDelivery =
    store.entregas.find((item) => item.id === entregaId) ??
    clientDeliveries.find((item) => item.estado === "listo") ??
    store.entregas[0];

  return (
    <main className="py-10">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <AccountNav />
          <div>
            {view === "resumen" ? (
              <AccountSummary clientName={client.nombre} subscription={subscription} entrega={activeDelivery} />
            ) : null}
            {view === "suscripcion" && subscription ? <SubscriptionView subscription={subscription} /> : null}
            {view === "editar" && subscription ? <EditOrderView subscription={subscription} /> : null}
            {view === "pausar" && subscription ? <PauseSubscriptionView subscription={subscription} /> : null}
            {view === "entregas" ? <DeliveriesView entregas={clientDeliveries} /> : null}
            {view === "entrega" ? <ReadyDeliveryView entrega={activeDelivery} /> : null}
            {view === "pagos" ? <PaymentsView cobros={clientCharges} /> : null}
            {view === "perfil" ? <ProfileView client={client} /> : null}
          </div>
        </div>
      </Container>
    </main>
  );
}

function AccountNav() {
  const items = [
    ["/cuenta", "Resumen", Home],
    ["/cuenta/suscripcion", "Suscripción", Wheat],
    ["/cuenta/entregas", "Entregas", PackageCheck],
    ["/cuenta/pagos", "Pagos", Wallet],
    ["/cuenta/perfil", "Perfil", User]
  ] as const;
  return (
    <nav className="space-y-2">
      {items.map(([href, label, Icon]) => (
        <Link key={href} href={href} className="flex items-center gap-3 rounded-md border bg-card px-3 py-3 text-sm font-semibold hover:bg-muted">
          <Icon className="h-4 w-4 text-secondary" aria-hidden />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function AccountSummary({
  clientName,
  subscription,
  entrega
}: {
  clientName: string;
  subscription?: ReturnType<typeof useTahonaStore.getState>["suscripciones"][number];
  entrega: ReturnType<typeof useTahonaStore.getState>["entregas"][number];
}) {
  return (
    <div>
      <SectionTitle eyebrow={`Hola, ${clientName}`} title="Tu próxima bolsa ya está planeada." />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Próxima entrega</p>
                <h3 className="mt-2 text-3xl font-semibold">{shortDate(entrega.fecha)} · {entrega.slot}</h3>
                <p className="mt-3 text-muted-foreground">Casillero {entrega.casillero_id.slice(-2)} listo en tu hub asignado.</p>
              </div>
              <StatusBadge status={entrega.estado} />
            </div>
            <Button asChild className="mt-6">
              <Link href={`/cuenta/entrega/${entrega.id}`}>Ver QR</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-semibold text-muted-foreground">Suscripción</p>
            <p className="mt-2 text-3xl font-semibold capitalize">{subscription?.estado ?? "activa"}</p>
            <Button asChild variant="outline" className="mt-6 w-full">
              <Link href="/cuenta/suscripcion">Administrar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SubscriptionView({ subscription }: { subscription: ReturnType<typeof useTahonaStore.getState>["suscripciones"][number] }) {
  const { productos } = useTahonaStore();
  return (
    <div>
      <SectionTitle eyebrow="Mi suscripción" title="Tu menú y horarios activos." />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {subscription.productos.map((item) => {
          const product = productos.find((p) => p.id === item.producto_id);
          return product ? (
            <Card key={item.producto_id}>
              <CardContent className="p-5">
                <h3 className="font-semibold">{product.nombre}</h3>
                <p className="text-sm text-muted-foreground">Cantidad semanal: {item.cantidad}</p>
              </CardContent>
            </Card>
          ) : null;
        })}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild><Link href="/cuenta/suscripcion/editar">Editar pedido</Link></Button>
        <Button asChild variant="outline"><Link href="/cuenta/suscripcion/pausar">Pausar</Link></Button>
      </div>
    </div>
  );
}

function EditOrderView({ subscription }: { subscription: ReturnType<typeof useTahonaStore.getState>["suscripciones"][number] }) {
  const { productos, updateWeeklyOrder } = useTahonaStore();
  const [items, setItems] = useState(subscription.productos);
  return (
    <div>
      <SectionTitle eyebrow="Editar pedido" title="Puedes cambiar hasta el viernes 10:00 PM." />
      <div className="mt-8 space-y-3">
        {items.map((item) => {
          const product = productos.find((p) => p.id === item.producto_id);
          return product ? (
            <div key={item.producto_id} className="flex items-center justify-between rounded-lg border bg-card p-4">
              <div>
                <p className="font-semibold">{product.nombre}</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(product.precio_mxn)}</p>
              </div>
              <input
                type="number"
                min={0}
                max={6}
                value={item.cantidad}
                onChange={(event) =>
                  setItems((prev) =>
                    prev.map((entry) =>
                      entry.producto_id === item.producto_id
                        ? { ...entry, cantidad: Number(event.target.value) }
                        : entry
                    )
                  )
                }
                className="h-10 w-20 rounded-md border bg-background px-3"
              />
            </div>
          ) : null;
        })}
      </div>
      <Button onClick={() => updateWeeklyOrder(subscription.id, items)} className="mt-6">
        Guardar cambios
      </Button>
    </div>
  );
}

function PauseSubscriptionView({ subscription }: { subscription: ReturnType<typeof useTahonaStore.getState>["suscripciones"][number] }) {
  const pauseSubscription = useTahonaStore((state) => state.pauseSubscription);
  return (
    <div>
      <SectionTitle eyebrow="Pausar" title="Guardamos tu lugar y ajustamos producción." />
      <div className="mt-8 space-y-4">
        <Textarea placeholder="Cuéntanos brevemente por qué quieres pausar." />
        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 4].map((weeks) => (
            <Button key={weeks} variant="outline" onClick={() => pauseSubscription(subscription.id, weeks)}>
              <Pause className="h-4 w-4" /> {weeks} semana{weeks === 1 ? "" : "s"}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeliveriesView({ entregas }: { entregas: ReturnType<typeof useTahonaStore.getState>["entregas"] }) {
  return (
    <div>
      <SectionTitle eyebrow="Mis entregas" title="Historial de bolsas y retiros." />
      <div className="mt-8 space-y-3">
        {entregas.map((entrega) => (
          <Link key={entrega.id} href={`/cuenta/entrega/${entrega.id}`} className="flex items-center justify-between rounded-lg border bg-card p-4 hover:bg-muted">
            <div>
              <p className="font-semibold">{shortDate(entrega.fecha)} · {entrega.slot}</p>
              <p className="text-sm text-muted-foreground">Casillero {entrega.casillero_id.slice(-2)}</p>
            </div>
            <StatusBadge status={entrega.estado} />
          </Link>
        ))}
      </div>
    </div>
  );
}

function ReadyDeliveryView({ entrega }: { entrega: ReturnType<typeof useTahonaStore.getState>["entregas"][number] }) {
  return (
    <div>
      <SectionTitle eyebrow="Mi pan está listo" title="Abre tu casillero con este código." />
      <div className="mt-8 grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardContent className="p-6 text-center">
            <QrMock code={entrega.qr_code} />
            <p className="mt-4 font-mono text-sm">{entrega.qr_code}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-secondary">
              <TimerReset className="h-5 w-5" aria-hidden />
              <span className="font-semibold">Tienes 2 horas para recoger</span>
            </div>
            <h3 className="mt-6 text-4xl font-semibold">Casillero {entrega.casillero_id.slice(-2)}</h3>
            <p className="mt-3 text-muted-foreground">Muestra el QR en el lector del hub. Si el casillero no abre, contacta soporte desde la app.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QrMock({ code }: { code: string }) {
  const cells = Array.from({ length: 81 }, (_, index) => (code.charCodeAt(index % code.length) + index) % 3 !== 0);
  return (
    <div className="mx-auto grid h-64 w-64 grid-cols-9 gap-1 rounded-lg bg-white p-4">
      {cells.map((filled, index) => (
        <div key={`${code}-${index}`} className={filled ? "bg-tahona-ink" : "bg-white"} />
      ))}
    </div>
  );
}

function PaymentsView({ cobros }: { cobros: ReturnType<typeof useTahonaStore.getState>["cobros"] }) {
  return (
    <div>
      <SectionTitle eyebrow="Pagos" title="Historial y método de cobro." />
      <Card className="mt-8 bg-tahona-ink text-white">
        <CardContent className="p-6">
          <CreditCard className="h-6 w-6 text-tahona-crust" aria-hidden />
          <p className="mt-6 text-2xl font-semibold">•••• 4242</p>
          <p className="text-white/60">Visa · cobro semanal automático</p>
        </CardContent>
      </Card>
      <div className="mt-6 space-y-3">
        {cobros.map((cobro) => (
          <div key={cobro.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
            <div>
              <p className="font-semibold">{formatCurrency(cobro.monto)}</p>
              <p className="text-sm text-muted-foreground">{shortDate(cobro.fecha)}</p>
            </div>
            <StatusBadge status={cobro.estado} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileView({ client }: { client: ReturnType<typeof useTahonaStore.getState>["clientes"][number] }) {
  return (
    <div>
      <SectionTitle eyebrow="Perfil" title="Tus datos de entrega y contacto." />
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        <Input defaultValue={`${client.nombre} ${client.apellido}`} aria-label="Nombre" />
        <Input defaultValue={client.email} aria-label="Correo" />
        <Input defaultValue={client.telefono} aria-label="Teléfono" />
        <Input defaultValue={`${client.direccion}, ${client.colonia}`} aria-label="Dirección" />
      </div>
      <div className="mt-6 flex items-center gap-3 rounded-lg border bg-card p-4">
        <ShieldCheck className="h-5 w-5 text-tahona-nopal" aria-hidden />
        <p className="text-sm font-semibold">Notificaciones activas por WhatsApp y correo.</p>
      </div>
    </div>
  );
}

export function SupportPage() {
  const faqs = [
    ["¿Qué pasa si no recojo a tiempo?", "El equipo retira la bolsa al cerrar la ventana y soporte te contacta para resolverlo."],
    ["¿Puedo cambiar mis panes?", "Sí, hasta el viernes a las 10:00 PM antes de la producción semanal."],
    ["¿Cómo se asigna mi hub?", "Usamos tu dirección y capacidad disponible para sugerir el hub más cercano."],
    ["¿Hay pedidos extra?", "Sí, cuando entran antes del cutoff y existe capacidad de producción."]
  ];
  return (
    <main className="py-14">
      <Container className="max-w-3xl">
        <SectionTitle eyebrow="Soporte" title="Resuelve cualquier detalle sin perder tu pan." />
        <Accordion type="single" collapsible className="mt-8 rounded-lg border bg-card px-5">
          {faqs.map(([q, a]) => (
            <AccordionItem key={q} value={q}>
              <AccordionTrigger>{q}</AccordionTrigger>
              <AccordionContent>{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button className="mt-6" variant="secondary">
          <HelpCircle className="h-4 w-4" /> Contactar por WhatsApp
        </Button>
      </Container>
    </main>
  );
}

export function AuthPage({ mode }: { mode: "login" | "registro" }) {
  return (
    <main className="flex min-h-[calc(100vh-65px)] items-center py-12">
      <Container className="max-w-md">
        <Card>
          <CardContent className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-tahona-ink text-tahona-crust">
              <Sparkles className="h-5 w-5" aria-hidden />
            </div>
            <h1 className="mt-5 font-display text-4xl font-semibold">
              {mode === "login" ? "Entrar a Tahona" : "Crear cuenta"}
            </h1>
            <div className="mt-6 space-y-3">
              <Input placeholder="correo@ejemplo.com" />
              <Input type="password" placeholder="Contraseña" />
              <Button className="w-full">{mode === "login" ? "Entrar" : "Registrarme"}</Button>
            </div>
            <Button asChild variant="ghost" className="mt-3 w-full">
              <Link href={mode === "login" ? "/registro" : "/login"}>
                {mode === "login" ? "Crear cuenta nueva" : "Ya tengo cuenta"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
