"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  Bell,
  Box,
  Check,
  ChevronDown,
  ClipboardList,
  CreditCard,
  Home,
  LayoutDashboard,
  MapPin,
  Package,
  Settings,
  ShoppingBag,
  User,
  Users,
  Wheat,
  type LucideIcon
} from "lucide-react";
import { BottomTabBar } from "@/components/ui/bottom-tab-bar";
import { Button } from "@/components/ui/button";
import { useTahonaStore } from "@/lib/store/tahona-store";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const customerNav: NavItem[] = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/catalogo", label: "Catálogo", icon: Wheat },
  { href: "/hubs", label: "Hubs", icon: MapPin },
  { href: "/como-funciona", label: "Proceso", icon: ShoppingBag }
];

const operatorNav: NavItem[] = [
  { href: "/operador", label: "Hoy", icon: LayoutDashboard },
  { href: "/operador/produccion", label: "Producción", icon: Package },
  { href: "/operador/carga", label: "Carga", icon: Box },
  { href: "/operador/casilleros", label: "Casilleros", icon: Box },
  { href: "/operador/suscripciones", label: "Suscripciones", icon: Users },
  { href: "/operador/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/operador/cobros", label: "Cobros", icon: CreditCard },
  { href: "/operador/incidencias", label: "Incidencias", icon: Settings }
];

const dashboardNav: NavItem[] = [
  { href: "/dashboard", label: "Resumen", icon: BarChart3 },
  { href: "/dashboard/crecimiento", label: "Crecimiento", icon: BarChart3 },
  { href: "/dashboard/operacion", label: "Operación", icon: Package },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/productos", label: "Productos", icon: Wheat },
  { href: "/dashboard/hubs", label: "Hubs", icon: MapPin },
  { href: "/dashboard/proyecciones", label: "Proyecciones", icon: Settings }
];

function useCollapsedHeader(threshold = 48) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const update = () => setCollapsed(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);

  return collapsed;
}

function TahonaWordmark({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <Link href="/" className="group flex items-baseline gap-3" aria-label="Tahona inicio">
      {!compact ? (
        <span>
          <span className={cn("block font-serif text-2xl font-semibold leading-none tracking-[-0.02em]", inverse ? "text-white" : "text-[var(--ink)]")}>
            TAHONA
          </span>
          <span className="block text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">Desde 1957</span>
        </span>
      ) : (
        <span className={cn("font-serif text-2xl font-semibold leading-none tracking-[-0.02em]", inverse ? "text-white" : "text-[var(--ink)]")}>TAHONA</span>
      )}
    </Link>
  );
}

export function ClienteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const collapsed = useCollapsedHeader();
  const reduceMotion = useReducedMotion();

  const cart = useTahonaStore((state) => state.cart);
  const clientes = useTahonaStore((state) => state.clientes);
  const suscripciones = useTahonaStore((state) => state.suscripciones);
  const currentClientId = useTahonaStore((state) => state.currentClientId);

  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const cliente = clientes.find((c) => c.id === currentClientId);
  const suscripcion = suscripciones.find((s) => s.cliente_id === currentClientId);
  const isSubscriber = Boolean(suscripcion && suscripcion.estado !== "cancelada");

  return (
    <div className="storefront-shell min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      <header
        className={cn(
          "safe-top sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(251,248,243,.8)] backdrop-blur-[12px] transition-all duration-base",
          collapsed && "shadow-sm"
        )}
      >
        <div
          className={cn(
            "mx-auto flex h-16 max-w-[1240px] items-center gap-2 px-4 transition-all duration-base md:gap-sm md:px-6",
            collapsed && "h-[56px]"
          )}
        >
          {/* Marca — compacta en móvil y al colapsar */}
          <div className="shrink-0">
            <span className="lg:hidden">
              <TahonaWordmark compact />
            </span>
            <span className="hidden lg:block">
              <TahonaWordmark compact={collapsed} />
            </span>
          </div>

          {/* Selector de hub — el "¿dónde retiras?" siempre visible */}
          <div className="min-w-0 flex-1 lg:flex-none">
            <HubSwitcher />
          </div>

          {/* Navegación desktop */}
          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Navegación cliente">
            {customerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-[var(--ink-soft)] transition-colors hover:bg-[var(--paper-sunken)] hover:text-[var(--brand)]",
                  pathname === item.href && "bg-[var(--brand-tint)] text-[var(--brand)]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Acciones derecha */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Botón de bolsa que se adapta: vacío → Apartar; con items → Mi bolsa · N */}
            <Button asChild size="sm" className="hidden h-10 rounded-[12px] lg:inline-flex">
              <Link href="/suscribirme">
                <ShoppingBag className="mr-2 h-4 w-4" aria-hidden />
                {cartCount ? (
                  <>
                    Mi bolsa
                    <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 font-mono text-[11px] font-medium text-[var(--ink)] [font-variant-numeric:tabular-nums]">
                      {cartCount}
                    </span>
                  </>
                ) : (
                  "Apartar mi pan"
                )}
              </Link>
            </Button>

            {/* Notificaciones — solo suscriptores (algo cambia cada semana) */}
            {isSubscriber ? (
              <Button asChild size="icon" variant="outline" className="relative hidden lg:inline-flex" aria-label="Avisos">
                <Link href="/cuenta">
                  <Bell className="h-4 w-4" aria-hidden />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden />
                </Link>
              </Button>
            ) : null}

            {/* Cuenta — con saludo personalizado si hay suscripción */}
            {isSubscriber && cliente ? (
              <Button asChild variant="outline" className="h-10 gap-2 rounded-[12px] pl-2.5 pr-3">
                <Link href="/cuenta">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand)] font-mono text-[11px] font-semibold text-white">
                    {cliente.nombre.charAt(0)}
                  </span>
                  <span className="hidden text-sm font-semibold text-[var(--ink)] sm:inline">
                    Hola, {cliente.nombre}
                  </span>
                </Link>
              </Button>
            ) : (
              <Button asChild size="icon" variant="outline" aria-label="Cuenta">
                <Link href="/cuenta">
                  <User className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.992 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? {} : { opacity: 0, y: -8, scale: 0.996 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <ClienteFooter />

      <BottomTabBar
        items={[
          { href: "/", label: "Inicio", icon: Home },
          { href: "/catalogo", label: "Catálogo", icon: Wheat },
          { href: "/suscribirme", label: "Mi bolsa", icon: ShoppingBag, badge: cartCount || undefined },
          { href: "/cuenta", label: "Cuenta", icon: User }
        ]}
      />
    </div>
  );
}
function HubSwitcher() {
  const hubs = useTahonaStore((state) => state.hubs);
  const clientes = useTahonaStore((state) => state.clientes);
  const currentClientId = useTahonaStore((state) => state.currentClientId);

  const defaultHubId =
    clientes.find((c) => c.id === currentClientId)?.hub_asignado_id ?? hubs[0]?.id ?? "";

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(defaultHubId);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("tahona:hub") : null;
    if (stored && hubs.some((h) => h.id === stored)) {
      setSelectedId(stored);
    }
  }, [hubs]);

  const selected = hubs.find((h) => h.id === selectedId) ?? hubs[0];
  if (!selected) return null;

  const choose = (id: string) => {
    setSelectedId(id);
    if (typeof window !== "undefined") window.localStorage.setItem("tahona:hub", id);
    setOpen(false);
  };

  return (
    <div className="relative w-full lg:w-auto">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-[12px] border border-[var(--line)] bg-[var(--paper-raised)] px-3 py-2 text-left transition-colors hover:border-[var(--brand)] lg:w-auto"
      >
        <MapPin className="h-4 w-4 shrink-0 text-[var(--brand)]" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block text-[0.625rem] font-semibold uppercase leading-none tracking-[0.08em] text-[var(--ink-faint)]">
            Retiras en
          </span>
          <span className="block truncate text-sm font-semibold leading-tight text-[var(--ink)]">
            {selected.colonia}
          </span>
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-[var(--ink-soft)] transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open ? (
        <>
          {/* backdrop para cerrar al hacer clic fuera */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="listbox"
            aria-label="Hubs de retiro"
            className="absolute left-0 top-[calc(100%+8px)] z-50 w-[300px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[16px] border border-[var(--line)] bg-[var(--paper-raised)] shadow-editorial"
          >
            <p className="border-b border-[var(--line)] px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">
              Elige tu hub de retiro
            </p>
            <div className="p-2">
              {hubs.map((hub) => {
                const active = hub.id === selected.id;
                const ocupacion = Math.round((hub.casilleros_ocupados_actual / hub.casilleros_total) * 100);
                return (
                  <button
                    key={hub.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => choose(hub.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-[12px] px-3 py-2.5 text-left transition-colors hover:bg-[var(--paper-sunken)]",
                      active && "bg-[var(--brand-tint)]"
                    )}
                  >
                    <MapPin
                      className={cn("mt-0.5 h-4 w-4 shrink-0", active ? "text-[var(--brand)]" : "text-[var(--ink-faint)]")}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-[var(--ink)]">{hub.nombre}</span>
                      <span className="block truncate text-xs text-[var(--ink-soft)]">{hub.direccion}</span>
                      <span className="mt-0.5 block font-mono text-[0.6875rem] text-[var(--ink-faint)]">
                        {ocupacion}% ocupado
                      </span>
                    </span>
                    {active ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" aria-hidden /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
function ClienteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[var(--ink)] text-white">
      <div className="mx-auto grid max-w-7xl gap-lg px-sm py-xl md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] md:px-md">
        <div>
          <p className="font-serif text-3xl font-semibold leading-none tracking-[-0.02em]">TAHONA</p>
          <p className="mt-2 text-sm font-semibold text-secondary">Desde 1957.</p>
          <p className="mt-sm max-w-sm text-sm leading-6 text-white/68">
            Panadería mexicana con pedido semanal, hubs de retiro y casilleros inteligentes.
          </p>
          <p className="mt-md text-xs font-semibold uppercase text-white/45">Hecho en CDMX</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Cliente</p>
          <div className="mt-xs grid gap-2 text-sm text-white/68">
            <Link href="/">Inicio</Link>
            <Link href="/catalogo">Catálogo</Link>
            <Link href="/hubs">Hubs</Link>
            <Link href="/como-funciona">Proceso</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Hubs</p>
          <div className="mt-xs grid gap-2 text-sm text-white/68">
            <Link href="/hubs/hub-polanco">Polanco</Link>
            <Link href="/hubs/hub-condesa">Condesa</Link>
            <Link href="/hubs/hub-del-valle">Del Valle</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Accesos internos</p>
          <div className="mt-xs grid gap-2 text-sm text-white/55">
            <Link href="/operador">Operador</Link>
            <Link href="/dashboard">Dueños</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ToolShell({
  children,
  nav,
  title,
  homeHref
}: {
  children: React.ReactNode;
  nav: NavItem[];
  title: string;
  homeHref: string;
}) {
  const pathname = usePathname();
  const isDashboard = title.includes("Dashboard");
  const collapsed = useCollapsedHeader();
  const reduceMotion = useReducedMotion();

  return (
    <div className="panel-shell min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-[var(--line)] bg-[#111827] text-white lg:block">
        <div className="border-b border-white/10 bg-[var(--paper-raised)] p-5 text-[var(--ink)]">
          <TahonaWordmark />
          <p className="mt-4 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand)]">{title}</p>
        </div>
        <nav className="space-y-1 p-3" aria-label={title}>
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-[12px] px-3 font-sans text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white",
                  active && "bg-[var(--brand)] text-white"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
          <Link href="/" className="block rounded-[12px] border border-white/16 px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.08em] text-white/70 hover:bg-white/10">
            Ver tienda
          </Link>
        </div>
      </aside>
      <header
        className={cn(
          "safe-top sticky top-0 z-20 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--paper-raised)_92%,transparent)] backdrop-blur-xl transition-shadow duration-base lg:ml-72",
          collapsed && "shadow-sm"
        )}
      >
        <div className={cn("flex min-h-16 items-center justify-between px-sm transition-all duration-base lg:px-md", collapsed && "min-h-[52px]")}>
          <Link href={homeHref} className="text-h3 font-semibold text-foreground lg:hidden">
            {title}
          </Link>
          <div className="hidden text-sm font-semibold text-muted-foreground lg:block">
            {isDashboard ? "Vista ejecutiva de dirección" : "Panel operador"}
          </div>
          <div className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground">
            18 jun 2026
          </div>
        </div>
      </header>
      <nav className="sticky top-[calc(57px+env(safe-area-inset-top))] z-20 flex gap-2 overflow-x-auto border-b border-[var(--line)] bg-[var(--paper-raised)] px-sm py-2 lg:hidden">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-[12px] border border-[var(--line)] px-3 text-sm font-semibold",
                active ? "bg-[var(--brand)] text-white" : "bg-[var(--paper-raised)] text-[var(--ink-soft)]"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <main className="lg:ml-72">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
            exit={reduceMotion ? {} : { opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export function OperatorShell({ children }: { children: React.ReactNode }) {
  return (
    <ToolShell nav={operatorNav} title="Panel operador" homeHref="/operador">
      {children}
    </ToolShell>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <ToolShell nav={dashboardNav} title="Dashboard ejecutivo" homeHref="/dashboard">
      {children}
    </ToolShell>
  );
}
