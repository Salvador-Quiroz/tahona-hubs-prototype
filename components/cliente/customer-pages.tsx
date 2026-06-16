"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  Clock,
  CreditCard,
  Crown,
  Factory,
  HelpCircle,
  Home,
  LockKeyhole,
  MapPin,
  PackageCheck,
  Pause,
  QrCode,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TimerReset,
  Truck,
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
      <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-red">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-balance md:text-5xl">
        {title}
      </h2>
      {body ? <p className="mt-4 text-current/70 md:text-lg">{body}</p> : null}
    </div>
  );
}

function ProductCard({ product }: { product: Producto }) {
  return (
    <Link href={`/catalogo/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-tahona-coffee/15 bg-tahona-paper shadow-soft">
        <Image
          src={product.imagen_url}
          alt={product.nombre}
          fill
          sizes="(max-width: 768px) 90vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4 border-l-4 border-tahona-yellow pl-4">
        <div>
          <h3 className="font-display text-2xl font-semibold text-tahona-coffee">{product.nombre}</h3>
          <p className="mt-1 text-sm font-medium text-tahona-coffee/65">{product.descripcion_corta}</p>
        </div>
        <span className="rounded-full bg-tahona-pink px-3 py-1 text-sm font-black text-tahona-coffee">
          {formatCurrency(product.precio_mxn)}
        </span>
      </div>
    </Link>
  );
}

export function LandingPage() {
  const { productos, hubs } = useTahonaStore();
  const hero = productos[0];
  const morning = productos.slice(0, 4);
  const sweet = productos.filter((product) => product.categoria === "Dulce mexicano").slice(0, 3);

  return (
    <main className="bg-tahona-cream text-tahona-coffee">
      <section className="relative min-h-[88vh] overflow-hidden bg-tahona-coffee text-tahona-cream">
        <Image
          src={hero.imagen_url}
          alt="Pan artesanal recién horneado de Tahona"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.48]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(74,43,24,0.92),rgba(74,43,24,0.72)_44%,rgba(74,43,24,0.22))]" />
        <div className="absolute inset-x-0 top-0 h-3 bg-tahona-yellow" />
        <Container className="relative flex min-h-[88vh] max-w-7xl flex-col justify-center pb-16 pt-28">
          <div className="max-w-[22rem] md:max-w-3xl">
            <Badge className="bg-tahona-yellow text-tahona-coffee">Tahona desde 1957</Badge>
            <h1 className="mt-6 font-display text-7xl font-semibold leading-[0.9] text-balance md:text-9xl">
              Tahona
            </h1>
            <p className="mt-5 max-w-2xl text-3xl font-semibold leading-tight text-tahona-yellow md:text-4xl">
              Pan artesanal de la ciudad, apartado para tu semana.
            </p>
            <p className="mt-5 max-w-[21rem] text-base leading-7 text-tahona-cream/86 md:max-w-2xl md:text-lg md:leading-8">
              Hogazas, bolillos, conchas y hojaldres preparados por ventana de horno. Pan fresco,
              listo en hubs cercanos.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href="/suscribirme">
                  Apartar pan <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-tahona-cream/45 text-tahona-cream hover:bg-tahona-cream/10">
                <Link href="/catalogo">Ver vitrina</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-tahona-pink py-12">
        <Container className="max-w-7xl">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Horno diario", "Piezas preparadas por ventana para conservar textura, aroma y disponibilidad."],
              ["Bolsa apartada", "Tu selección queda reservada antes del corte semanal de producción."],
              ["Retiro cerca", "Hubs en Polanco, Condesa y Del Valle para pasar sin fila."]
            ].map(([title, body]) => (
              <div key={title} className="border-l-4 border-tahona-coffee bg-tahona-masa p-5">
                <h2 className="text-xl font-black">{title}</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-tahona-coffee/68">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle
              eyebrow="Panes de la semana"
              title="La vitrina que sí quieres encontrar al pasar por pan."
              body="Masa madre, baguettes, hojaldres y pan dulce mexicano seleccionados para tu bolsa semanal."
            />
            <Button asChild variant="outline">
              <Link href="/catalogo">Ver catálogo completo</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-7 md:grid-cols-4">
            {morning.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-tahona-coffee py-16 text-tahona-cream">
        <Container className="max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <SectionTitle
                eyebrow="Retiro Tahona"
                title="El pan queda reservado, cargado y listo para llevar."
                body="Compras como en una panadería, pero con horario, hub y casillero confirmados desde tu cuenta."
              />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  ["1", "Elige tus panes"],
                  ["2", "Selecciona días y horarios"],
                  ["3", "Confirmamos tu hub"],
                  ["4", "Abres tu casillero con QR"]
                ].map(([number, label]) => (
                  <div key={number} className="flex items-center gap-4 border border-tahona-yellow/25 bg-tahona-cream/8 p-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-tahona-yellow text-lg font-black text-tahona-coffee">
                      {number}
                    </span>
                    <span className="font-black">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <HubMap hubs={hubs} />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="grid gap-5 sm:grid-cols-3">
              {sweet.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div>
              <SectionTitle
                eyebrow="Tradición mexicana"
                title="Pan dulce con oficio, no antojos anónimos."
                body="Tahona conserva nombres, formas, aromas y sabores de panadería mexicana con una experiencia puntual para quien no quiere llegar tarde a la vitrina."
              />
              <Button asChild className="mt-7" size="lg">
                <Link href="/suscribirme/productos">Armar mi bolsa semanal</Link>
              </Button>
            </div>
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
  const [query, setQuery] = useState("");
  const categoryProducts = categoria === "Todos" ? productos : productos.filter((p) => p.categoria === categoria);
  const filtered = categoryProducts.filter((product) =>
    `${product.nombre} ${product.descripcion_corta} ${product.categoria}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );
  const heroProduct = filtered[0] ?? productos[0];
  const weeklyBase = productos.slice(0, 4);
  const weeklyTotal = weeklyBase.reduce((sum, product) => sum + product.precio_mxn, 0);

  return (
    <main className="bg-tahona-cream text-tahona-coffee">
      <section className="border-b border-tahona-coffee/15 bg-tahona-pink py-12">
        <Container className="max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-red">
                Vitrina semanal
              </p>
              <h1 className="mt-3 font-display text-6xl font-semibold leading-none text-balance md:text-7xl">
                Pan para apartar antes de que se termine.
              </h1>
              <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-tahona-coffee/68">
                Explora la vitrina, filtra por tipo de pieza y arma una bolsa semanal con precio,
                disponibilidad y selección visible en todo momento.
              </p>
            </div>
            <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-tahona-coffee/15 bg-tahona-paper shadow-editorial">
              <Image src={heroProduct.imagen_url} alt={heroProduct.nombre} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-tahona-coffee/90 to-transparent p-6 text-tahona-cream">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-yellow">
                  Recomendado
                </p>
                <h2 className="mt-2 font-display text-4xl font-semibold">{heroProduct.nombre}</h2>
                <p className="mt-2 max-w-lg text-sm text-tahona-cream/78">{heroProduct.descripcion_corta}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container className="max-w-7xl">
          <div className="mb-8 grid gap-4 rounded-lg border border-tahona-coffee/15 bg-tahona-masa p-4 shadow-soft lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-tahona-coffee/50" aria-hidden />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar concha, masa madre, baguette..."
                className="h-12 bg-tahona-cream pl-10 text-base font-semibold"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:max-w-[620px]">
              {categorias.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategoria(item)}
                  className={`h-11 whitespace-nowrap rounded-md border px-4 text-sm font-black transition-colors ${
                    categoria === item
                      ? "border-tahona-coffee bg-tahona-coffee text-tahona-yellow"
                      : "border-tahona-coffee/20 bg-tahona-cream text-tahona-coffee hover:bg-tahona-yellow"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5 flex flex-col justify-between gap-2 border-b border-tahona-coffee/15 pb-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-red">
                {categoria}
              </p>
              <h2 className="mt-1 text-2xl font-black">{filtered.length} piezas disponibles</h2>
            </div>
            <p className="text-sm font-semibold text-tahona-coffee/62">
              Corte semanal: viernes 10:00 PM · Primer retiro desde lunes 7:00 AM
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <aside className="h-fit rounded-lg border border-tahona-coffee/15 bg-tahona-masa p-5 shadow-soft lg:sticky lg:top-24">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-red">
                Bolsa sugerida
              </p>
              <h2 className="mt-3 text-3xl font-black">Base de la semana</h2>
              <p className="mt-3 text-sm font-medium leading-6 text-tahona-coffee/65">
                Un pedido completo combina pan de mesa, pan dulce y una pieza especial para compartir.
              </p>
              <div className="mt-5 space-y-3">
                {weeklyBase.map((product) => (
                  <div key={product.id} className="flex items-center justify-between border-b border-tahona-coffee/10 pb-3 text-sm">
                    <span className="font-semibold">{product.nombre}</span>
                    <span className="font-black">{formatCurrency(product.precio_mxn)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between rounded-md bg-tahona-coffee px-4 py-3 text-tahona-cream">
                <span className="text-sm font-black">Total estimado</span>
                <span className="text-xl font-black">{formatCurrency(weeklyTotal)}</span>
              </div>
              <Button asChild className="mt-6 w-full" size="lg">
                <Link href="/suscribirme/productos">Armar mi pedido</Link>
              </Button>
            </aside>
          </div>
        </Container>
      </section>
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
  const steps = [
    ["acceso", "Cuenta", User],
    ["productos", "Bolsa", ShoppingBag],
    ["horarios", "Horario", Clock],
    ["direccion", "Hub", MapPin],
    ["pago", "Pago", CreditCard],
    ["confirmacion", "Listo", Check]
  ] as const;
  const stepIndex = steps.findIndex(([key]) => key === step) + 1;
  const selectedItems = productos.filter((product) => (selected[product.id] ?? 0) > 0);
  const total = selectedItems.reduce((sum, product) => sum + product.precio_mxn * (selected[product.id] ?? 0), 0);
  const nextHref = {
    acceso: "/suscribirme/productos",
    productos: "/suscribirme/horarios",
    horarios: "/suscribirme/direccion",
    direccion: "/suscribirme/pago",
    pago: "/suscribirme/confirmacion",
    confirmacion: "/cuenta"
  }[step];
  return (
    <main className="bg-tahona-cream py-8 text-tahona-coffee">
      <Container className="max-w-7xl">
        <div className="mb-7 grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-red">
              Pedido semanal
            </p>
            <h1 className="mt-2 font-display text-5xl font-semibold leading-none md:text-6xl">
              Aparta tu pan con horario y hub confirmados.
            </h1>
          </div>
          <div className="rounded-lg border border-tahona-coffee/15 bg-tahona-masa p-4 shadow-soft">
            <div className="flex items-center justify-between text-sm font-black">
              <span>Paso {stepIndex} de {steps.length}</span>
              <span>{Math.round((stepIndex / steps.length) * 100)}%</span>
            </div>
            <ProgressBar value={(stepIndex / steps.length) * 100} className="mt-3" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_1fr_340px]">
          <aside className="h-fit rounded-lg border border-tahona-coffee/15 bg-tahona-masa p-3 shadow-soft lg:sticky lg:top-24">
            {steps.map(([key, label, Icon], index) => {
              const active = key === step;
              const done = index + 1 < stepIndex;
              return (
                <Link
                  key={key}
                  href={`/suscribirme${key === "acceso" ? "" : `/${key}`}`}
                  className={`mb-1 flex items-center gap-3 rounded-md px-3 py-3 text-sm font-black transition-colors last:mb-0 ${
                    active
                      ? "bg-tahona-coffee text-tahona-yellow"
                      : done
                        ? "bg-tahona-yellow text-tahona-coffee"
                        : "text-tahona-coffee/60 hover:bg-tahona-pink hover:text-tahona-coffee"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </Link>
              );
            })}
          </aside>

          <section className="min-w-0 rounded-lg border border-tahona-coffee/15 bg-tahona-cream p-4 shadow-soft md:p-6">
            {step === "acceso" ? <AccessStep /> : null}
            {step === "productos" ? (
              <ProductsStep productos={productos} selected={selected} setSelected={setSelected} />
            ) : null}
            {step === "horarios" ? <ScheduleStep /> : null}
            {step === "direccion" ? <AddressStep hubs={hubs} /> : null}
            {step === "pago" ? <PaymentStep /> : null}
            {step === "confirmacion" ? <ConfirmStep /> : null}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-tahona-coffee/15 pt-5 sm:flex-row sm:justify-between">
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
          </section>

          <aside className="h-fit rounded-lg bg-tahona-coffee p-5 text-tahona-cream shadow-editorial lg:sticky lg:top-24">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-yellow">
              Resumen vivo
            </p>
            <h2 className="mt-3 text-3xl font-black">Tu bolsa</h2>
            <div className="mt-5 space-y-3">
              {selectedItems.map((product) => (
                <div key={product.id} className="flex justify-between gap-4 border-b border-tahona-yellow/20 pb-3 text-sm">
                  <span>{selected[product.id]}x {product.nombre}</span>
                  <span className="font-black">{formatCurrency(product.precio_mxn * selected[product.id])}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between rounded-md bg-tahona-cream px-4 py-3 text-tahona-coffee">
              <span className="text-sm font-black">Semanal</span>
              <span className="text-xl font-black">{formatCurrency(total)}</span>
            </div>
            <div className="mt-5 space-y-2 text-sm text-tahona-cream/75">
              <p>Primer retiro: martes 16 jun, 7:00 AM.</p>
              <p>Hub sugerido: Condesa.</p>
              <p>Cambios abiertos hasta viernes 10:00 PM.</p>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}

function AccessStep() {
  return (
    <div>
      <SectionTitle
        eyebrow="Acceso"
        title="Guarda tus datos para que el retiro sea rápido."
        body="Usaremos tu correo y teléfono para confirmar pagos, cambios de bolsa y avisos de casillero listo."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Input placeholder="correo@ejemplo.com" />
        <Input placeholder="Teléfono" />
        <Button variant="secondary" className="md:col-span-2">
          Entrar con código
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
  const visible = productos.slice(0, 8);

  return (
    <div>
      <SectionTitle
        eyebrow="Bolsa semanal"
        title="Arma una selección que sí se sienta de panadería."
        body="Elige cantidades por pieza. Puedes mezclar pan de mesa, pan dulce y hojaldres para tus ventanas de retiro."
      />
      <div className="mt-8 grid gap-4">
        {visible.map((product) => {
          const qty = selected[product.id] ?? 0;
          return (
            <div key={product.id} className="grid min-h-[178px] grid-cols-[132px_minmax(0,1fr)] gap-4 rounded-lg border border-tahona-coffee/15 bg-tahona-masa p-3 shadow-soft">
              <div className="relative h-full min-h-[164px] overflow-hidden rounded-md bg-tahona-paper">
                <Image src={product.imagen_url} alt={product.nombre} fill sizes="132px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-tahona-red">
                      {product.categoria}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-semibold leading-tight text-tahona-coffee">
                      {product.nombre}
                    </h3>
                  </div>
                  <span className="shrink-0 font-black">{formatCurrency(product.precio_mxn)}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm font-medium text-tahona-coffee/62">
                  {product.descripcion_corta}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex overflow-hidden rounded-md border border-tahona-coffee/20 bg-tahona-cream">
                    <button
                      onClick={() => setSelected((prev) => ({ ...prev, [product.id]: Math.max(0, qty - 1) }))}
                      className="h-9 w-9 font-black hover:bg-tahona-pink"
                    >
                      -
                    </button>
                    <span className="flex h-9 w-10 items-center justify-center border-x border-tahona-coffee/20 font-black">
                      {qty}
                    </span>
                    <button
                      onClick={() => setSelected((prev) => ({ ...prev, [product.id]: Math.min(9, qty + 1) }))}
                      className="h-9 w-9 font-black hover:bg-tahona-yellow"
                    >
                      +
                    </button>
                  </div>
                  {qty > 0 ? <Badge className="bg-tahona-yellow text-tahona-coffee">En bolsa</Badge> : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function ScheduleStep() {
  const schedule = [
    ["7:00 AM", "Mañana", "Para desayuno y oficina", "lun · mie · vie"],
    ["1:30 PM", "Comida", "Para llevar pan fresco a casa", "mar · jue"],
    ["7:30 PM", "Noche", "Para recoger al volver", "vie · sab"]
  ];
  return (
    <div>
      <SectionTitle
        eyebrow="Ventanas de retiro"
        title="Elige cuando quieres encontrar tu bolsa lista."
        body="Cada ventana corresponde a una carga real de casilleros. Puedes combinar horarios segun tu rutina semanal."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {schedule.map(([slot, label, body, days], index) => (
          <label
            key={slot}
            className="group relative overflow-hidden rounded-lg border border-tahona-coffee/15 bg-tahona-masa p-5 shadow-soft transition-colors hover:bg-tahona-yellow"
          >
            <div className="flex items-center justify-between gap-4">
              <input type="checkbox" defaultChecked={index < 2} className="h-5 w-5 accent-tahona-coffee" />
              <Badge variant="outline">{days}</Badge>
            </div>
            <span className="mt-6 block font-display text-5xl font-semibold leading-none text-tahona-coffee">
              {slot}
            </span>
            <span className="mt-3 block text-lg font-black text-tahona-coffee">{label}</span>
            <span className="mt-2 block text-sm font-medium leading-6 text-tahona-coffee/64">{body}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
function AddressStep({ hubs }: { hubs: ReturnType<typeof useTahonaStore.getState>["hubs"] }) {
  const assigned = hubs.find((hub) => hub.id === "hub-condesa") ?? hubs[0];
  return (
    <div>
      <SectionTitle
        eyebrow="Hub asignado"
        title="Confirmamos el punto de retiro mas conveniente."
        body="La dirección no es decorativa: define capacidad, slot disponible y casillero probable para tu bolsa."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4 rounded-lg border border-tahona-coffee/15 bg-tahona-masa p-5 shadow-soft">
          <Input defaultValue="Amsterdam 214" aria-label="Calle y número" />
          <Input defaultValue="Condesa" aria-label="Colonia" />
          <Input defaultValue="06140" aria-label="Código postal" />
          <div className="rounded-lg bg-tahona-pink p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-tahona-red">Resultado</p>
            <h3 className="mt-2 text-2xl font-black text-tahona-coffee">{assigned.nombre}</h3>
            <p className="mt-1 text-sm font-medium text-tahona-coffee/65">{assigned.direccion}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-black">
              {assigned.slots_horarios.map((slot) => (
                <span key={slot} className="rounded-md bg-tahona-yellow px-2 py-2 text-tahona-coffee">{slot}</span>
              ))}
            </div>
          </div>
        </div>
        <HubMap hubs={hubs} activeHubId={assigned.id} compact />
      </div>
    </div>
  );
}
function PaymentStep() {
  return (
    <div>
      <SectionTitle
        eyebrow="Pago semanal"
        title="Confirma tu metodo de cobro y politica de cambios."
        body="El cobro se realiza por semana; puedes modificar tu bolsa antes del corte visible en tu cuenta."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4 rounded-lg border border-tahona-coffee/15 bg-tahona-masa p-5 shadow-soft">
          <Input defaultValue="4242 4242 4242 4242" aria-label="Número de tarjeta" />
          <div className="grid grid-cols-2 gap-3">
            <Input defaultValue="08/29" aria-label="Expiración" />
            <Input defaultValue="123" aria-label="CVC" />
          </div>
          <label className="flex items-start gap-3 rounded-md bg-tahona-pink p-4 text-sm font-semibold text-tahona-coffee/75">
            <input type="checkbox" defaultChecked className="mt-0.5 h-4 w-4 accent-tahona-coffee" />
            Acepto el cobro semanal, el corte de cambios y las reglas de reintento de pago.
          </label>
        </div>
        <Card className="overflow-hidden bg-tahona-coffee text-tahona-cream shadow-editorial">
          <CardContent className="p-6">
            <CreditCard className="h-7 w-7 text-tahona-yellow" aria-hidden />
            <p className="mt-8 text-sm font-black uppercase tracking-[0.16em] text-tahona-yellow">Tarjeta Tahona</p>
            <p className="mt-3 text-3xl font-black">•••• •••• •••• 4242</p>
            <div className="mt-8 space-y-3 text-sm text-tahona-cream/75">
              <div className="flex justify-between border-b border-tahona-yellow/20 pb-3"><span>Bolsa semanal</span><strong>$364 MXN</strong></div>
              <div className="flex justify-between border-b border-tahona-yellow/20 pb-3"><span>Primer retiro</span><strong>16 jun · 7:00 AM</strong></div>
              <div className="flex justify-between"><span>Hub</span><strong>Condesa</strong></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function ConfirmStep() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-tahona-yellow text-tahona-coffee shadow-soft">
        <Check className="h-8 w-8" aria-hidden />
      </div>
      <h1 className="mx-auto mt-6 max-w-2xl font-display text-6xl font-semibold leading-none text-tahona-coffee">
        Tu primera bolsa ya está apartada.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-lg font-medium leading-8 text-tahona-coffee/68">
        Martes 16 de junio, 7:00 AM, Hub Condesa. Te avisaremos cuando el casillero este cargado y listo para abrir con QR.
      </p>
      <div className="mx-auto mt-8 grid max-w-2xl gap-3 md:grid-cols-3">
        {["Hub Condesa", "Casillero asignado", "QR en mi cuenta"].map((item) => (
          <div key={item} className="rounded-lg border border-tahona-coffee/15 bg-tahona-masa p-4 text-sm font-black text-tahona-coffee">
            {item}
          </div>
        ))}
      </div>
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
  const pathname = usePathname();
  const items = [
    ["/cuenta", "Resumen", Home],
    ["/cuenta/suscripcion", "Bolsa", Wheat],
    ["/cuenta/entregas", "Retiros", PackageCheck],
    ["/cuenta/pagos", "Pagos", Wallet],
    ["/cuenta/perfil", "Perfil", User]
  ] as const;
  return (
    <nav className="rounded-lg border border-tahona-coffee/15 bg-tahona-masa p-2 shadow-soft lg:sticky lg:top-24">
      {items.map(([href, label, Icon]) => {
        const active = href === "/cuenta" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-black transition-colors ${
              active
                ? "bg-tahona-coffee text-tahona-yellow"
                : "text-tahona-coffee/68 hover:bg-tahona-yellow hover:text-tahona-coffee"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </Link>
        );
      })}
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
  const { productos, hubs } = useTahonaStore();
  const hub = hubs.find((item) => item.id === entrega.hub_id);
  const bag = subscription?.productos.slice(0, 4) ?? [];
  return (
    <div>
      <SectionTitle eyebrow={`Hola, ${clientName}`} title="Tu pan está en camino al hub." />
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden bg-tahona-coffee text-tahona-cream shadow-editorial">
          <CardContent className="grid gap-6 p-6 md:grid-cols-[1fr_220px] md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-yellow">Proximo retiro</p>
              <h3 className="mt-3 font-display text-5xl font-semibold leading-none">
                {shortDate(entrega.fecha)} · {entrega.slot}
              </h3>
              <p className="mt-4 text-lg font-semibold text-tahona-cream/78">
                {hub?.nombre ?? "Hub asignado"} · Casillero {entrega.casillero_id.slice(-2)}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="accent">
                  <Link href={`/cuenta/entrega/${entrega.id}`}>Abrir QR</Link>
                </Button>
                <Button asChild variant="outline" className="border-tahona-cream/35 text-tahona-cream hover:bg-tahona-cream/10">
                  <Link href="/cuenta/suscripcion/editar">Editar bolsa</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-lg bg-tahona-cream p-4 text-tahona-coffee">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-tahona-red">Estado</p>
              <p className="mt-3 text-3xl font-black capitalize">{entrega.estado}</p>
              <p className="mt-2 text-sm font-medium text-tahona-coffee/62">Te notificaremos cuando quede cargado.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-tahona-masa shadow-soft">
          <CardContent className="p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-red">Tu bolsa semanal</p>
            <div className="mt-5 space-y-3">
              {bag.map((item) => {
                const product = productos.find((entry) => entry.id === item.producto_id);
                return product ? (
                  <div key={item.producto_id} className="flex justify-between gap-4 border-b border-tahona-coffee/10 pb-3 text-sm">
                    <span className="font-semibold">{item.cantidad}x {product.nombre}</span>
                    <span className="font-black">{formatCurrency(product.precio_mxn * item.cantidad)}</span>
                  </div>
                ) : null;
              })}
            </div>
            <Button asChild className="mt-6 w-full" variant="outline">
              <Link href="/cuenta/suscripcion">Ver suscripción</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
function SubscriptionView({ subscription }: { subscription: ReturnType<typeof useTahonaStore.getState>["suscripciones"][number] }) {
  const { productos } = useTahonaStore();
  const total = subscription.productos.reduce((sum, item) => {
    const product = productos.find((entry) => entry.id === item.producto_id);
    return sum + (product?.precio_mxn ?? 0) * item.cantidad;
  }, 0);
  return (
    <div>
      <SectionTitle eyebrow="Mi bolsa" title="Tu seleccion semanal y ventanas activas." />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4 md:grid-cols-2">
          {subscription.productos.map((item) => {
            const product = productos.find((p) => p.id === item.producto_id);
            return product ? (
              <Card key={item.producto_id} className="overflow-hidden bg-tahona-masa shadow-soft">
                <CardContent className="grid grid-cols-[96px_1fr] gap-4 p-3">
                  <div className="relative h-28 overflow-hidden rounded-md bg-tahona-paper">
                    <Image src={product.imagen_url} alt={product.nombre} fill sizes="96px" className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold leading-tight text-tahona-coffee">{product.nombre}</h3>
                    <p className="mt-2 text-sm font-semibold text-tahona-coffee/62">{item.cantidad} pieza(s) por semana</p>
                    <p className="mt-3 font-black">{formatCurrency(product.precio_mxn * item.cantidad)}</p>
                  </div>
                </CardContent>
              </Card>
            ) : null;
          })}
        </div>
        <aside className="h-fit rounded-lg bg-tahona-coffee p-5 text-tahona-cream shadow-editorial">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-yellow">Resumen</p>
          <p className="mt-3 text-4xl font-black">{formatCurrency(total)}</p>
          <p className="mt-2 text-sm text-tahona-cream/65">cobro semanal estimado</p>
          <div className="mt-6 flex flex-col gap-3">
            <Button asChild variant="accent"><Link href="/cuenta/suscripcion/editar">Editar pedido</Link></Button>
            <Button asChild variant="outline" className="border-tahona-cream/35 text-tahona-cream hover:bg-tahona-cream/10"><Link href="/cuenta/suscripcion/pausar">Pausar suscripción</Link></Button>
          </div>
        </aside>
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
  const { hubs, productos } = useTahonaStore();
  const hub = hubs.find((item) => item.id === entrega.hub_id);
  return (
    <div>
      <SectionTitle eyebrow="Retiro activo" title="Tu casillero está listo para abrir." />
      <div className="mt-8 grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card className="bg-tahona-coffee text-tahona-cream shadow-editorial">
          <CardContent className="p-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-yellow">Codigo de apertura</p>
            <div className="mt-6 rounded-lg bg-tahona-cream p-4">
              <QrMock code={entrega.qr_code} />
            </div>
            <p className="mt-5 font-mono text-xs text-tahona-cream/70">{entrega.qr_code}</p>
            <Button className="mt-6 w-full" variant="accent">Mostrar al lector</Button>
          </CardContent>
        </Card>
        <div className="space-y-5">
          <Card className="bg-tahona-yellow text-tahona-coffee shadow-soft">
            <CardContent className="grid gap-5 p-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em]">Casillero asignado</p>
                <p className="mt-2 font-display text-7xl font-semibold leading-none">{entrega.casillero_id.slice(-2)}</p>
              </div>
              <div className="rounded-lg bg-tahona-coffee px-5 py-4 text-tahona-cream">
                <div className="flex items-center gap-2 text-sm font-black">
                  <TimerReset className="h-4 w-4" aria-hidden /> 2 h para recoger
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-tahona-masa shadow-soft">
            <CardContent className="p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-red">Hub</p>
              <h3 className="mt-2 text-3xl font-black text-tahona-coffee">{hub?.nombre ?? entrega.hub_id}</h3>
              <p className="mt-2 text-sm font-medium text-tahona-coffee/62">{hub?.direccion}</p>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {entrega.productos.map((item) => {
                  const product = productos.find((entry) => entry.id === item.producto_id);
                  return product ? (
                    <div key={item.producto_id} className="rounded-md border border-tahona-coffee/15 bg-tahona-cream p-3">
                      <p className="text-sm font-black">{item.cantidad}x {product.nombre}</p>
                    </div>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-3 md:grid-cols-3">
            {["Escanea el QR", "Retira tu bolsa", "Cierra el casillero"].map((step, index) => (
              <div key={step} className="rounded-lg border border-tahona-coffee/15 bg-tahona-pink p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-tahona-red">Paso {index + 1}</p>
                <p className="mt-2 font-black text-tahona-coffee">{step}</p>
              </div>
            ))}
          </div>
        </div>
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
  const { hubs } = useTahonaStore();
  const hub = hubs.find((item) => item.id === client.hub_asignado_id);
  return (
    <div>
      <SectionTitle
        eyebrow="Perfil"
        title="Datos para entregarte pan sin fricción."
        body="Aquí se controla lo que afecta el pedido: contacto, dirección, hub asignado, avisos y cobro semanal."
      />
      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="bg-tahona-masa shadow-soft">
          <CardContent className="p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-red">Datos personales</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Input defaultValue={`${client.nombre} ${client.apellido}`} aria-label="Nombre" />
              <Input defaultValue={client.telefono} aria-label="Teléfono" />
              <Input defaultValue={client.email} aria-label="Correo" className="md:col-span-2" />
              <Input defaultValue={`${client.direccion}, ${client.colonia}`} aria-label="Dirección" className="md:col-span-2" />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-md bg-tahona-cream p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-tahona-red">Hub</p>
                <p className="mt-2 font-black">{hub?.nombre ?? "Hub asignado"}</p>
              </div>
              <div className="rounded-md bg-tahona-cream p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-tahona-red">Cobro</p>
                <p className="mt-2 font-black">{client.metodo_pago_ultimo4}</p>
              </div>
              <div className="rounded-md bg-tahona-cream p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-tahona-red">Ticket</p>
                <p className="mt-2 font-black">{formatCurrency(client.ticket_promedio_semanal_mxn)}</p>
              </div>
            </div>
            <Button className="mt-6">Guardar cambios</Button>
          </CardContent>
        </Card>
        <div className="space-y-5">
          <Card className="bg-tahona-coffee text-tahona-cream shadow-editorial">
            <CardContent className="p-6">
              <ShieldCheck className="h-7 w-7 text-tahona-yellow" aria-hidden />
              <h3 className="mt-5 text-2xl font-black">Preferencias activas</h3>
              <div className="mt-5 space-y-3 text-sm">
                {["Aviso cuando el pan está cargado", "Recordatorio 30 min antes del cierre", "Recibo semanal por correo"].map((item) => (
                  <div key={item} className="flex items-center justify-between border-b border-tahona-yellow/20 pb-3">
                    <span>{item}</span>
                    <span className="rounded-full bg-tahona-yellow px-3 py-1 text-xs font-black text-tahona-coffee">ON</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-tahona-yellow text-tahona-coffee shadow-soft">
            <CardContent className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em]">Retiro principal</p>
              <h3 className="mt-3 text-2xl font-black">{hub?.nombre ?? client.hub_asignado_id}</h3>
              <p className="mt-2 text-sm font-semibold text-tahona-coffee/70">{hub?.direccion}</p>
              <Button asChild className="mt-5 w-full" variant="outline">
                <Link href="/hubs">Cambiar hub</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
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






