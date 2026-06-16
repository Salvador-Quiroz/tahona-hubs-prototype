"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Box,
  ClipboardList,
  CreditCard,
  Crown,
  Home,
  LayoutDashboard,
  MapPin,
  Package,
  Settings,
  ShoppingBag,
  Users,
  Wheat
} from "lucide-react";
import { cn } from "@/lib/utils";

const customerNav = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/catalogo", label: "Catálogo", icon: Wheat },
  { href: "/hubs", label: "Hubs", icon: MapPin },
  { href: "/cuenta", label: "Cuenta", icon: ShoppingBag }
];

const operatorNav = [
  { href: "/operador", label: "Hoy", icon: LayoutDashboard },
  { href: "/operador/produccion", label: "Producción", icon: Package },
  { href: "/operador/carga", label: "Carga", icon: Box },
  { href: "/operador/casilleros", label: "Casilleros", icon: Box },
  { href: "/operador/suscripciones", label: "Suscripciones", icon: Users },
  { href: "/operador/pedidos", label: "Pedidos", icon: ClipboardList },
  { href: "/operador/cobros", label: "Cobros", icon: CreditCard },
  { href: "/operador/incidencias", label: "Incidencias", icon: Settings }
];

const dashboardNav = [
  { href: "/dashboard", label: "Resumen", icon: BarChart3 },
  { href: "/dashboard/crecimiento", label: "Crecimiento", icon: BarChart3 },
  { href: "/dashboard/operacion", label: "Operación", icon: Package },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/productos", label: "Productos", icon: Wheat },
  { href: "/dashboard/hubs", label: "Hubs", icon: MapPin },
  { href: "/dashboard/proyecciones", label: "Proyecciones", icon: Settings }
];

function TahonaWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Tahona inicio">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-tahona-coffee text-lg font-black text-tahona-yellow shadow-soft">
        T
      </span>
      {!compact ? (
        <span>
          <span className="block text-xl font-black leading-none tracking-normal text-tahona-coffee">
            TAHONA
          </span>
          <span className="block font-display text-sm italic leading-none text-tahona-coffee/70">
            boutique de pan
          </span>
        </span>
      ) : null}
    </Link>
  );
}

function RoleAccess({ compact = false }: { compact?: boolean }) {
  const roles = [
    { href: "/cuenta", label: compact ? "Cliente" : "App cliente", icon: ShoppingBag },
    { href: "/operador", label: compact ? "Operación" : "Panel operador", icon: LayoutDashboard },
    { href: "/dashboard", label: compact ? "Dirección" : "Dashboard dueños", icon: Crown }
  ];

  return (
    <>
      {roles.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              compact
                ? "flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold text-tahona-coffee/70"
                : "inline-flex items-center gap-2 rounded-md border border-tahona-coffee/20 bg-tahona-masa px-3 py-2 text-sm font-bold text-tahona-coffee transition-colors hover:bg-tahona-yellow"
            }
          >
            <Icon className={compact ? "h-5 w-5" : "h-4 w-4"} aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function ClienteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-tahona-cream pb-20 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-tahona-coffee/15 bg-tahona-pink/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <TahonaWordmark />
          <nav className="hidden items-center gap-1 xl:flex">
            {customerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-bold text-tahona-coffee/75 transition-colors hover:bg-tahona-masa",
                  pathname === item.href && "bg-tahona-masa text-tahona-coffee"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/suscribirme"
              className="ml-2 rounded-md bg-tahona-coffee px-4 py-2 text-sm font-bold text-tahona-yellow shadow-soft"
            >
              Suscribirme
            </Link>
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <RoleAccess />
          </div>
        </div>
      </header>
      {children}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-tahona-coffee/15 bg-tahona-pink md:hidden">
        <div className="grid grid-cols-4">
          {[
            customerNav[0],
            customerNav[1],
            { href: "/operador", label: "Operación", icon: LayoutDashboard },
            { href: "/dashboard", label: "Dueños", icon: Crown }
          ].map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold",
                  active ? "text-tahona-coffee" : "text-tahona-coffee/55"
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function ToolShell({
  children,
  nav,
  title,
  homeHref
}: {
  children: React.ReactNode;
  nav: typeof operatorNav;
  title: string;
  homeHref: string;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-tahona-cream">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-tahona-coffee/20 bg-tahona-coffee text-tahona-cream lg:block">
        <div className="border-b border-tahona-coffee/20 bg-tahona-pink p-5">
          <TahonaWordmark />
          <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-tahona-coffee/70">
            {title}
          </p>
        </div>
        <nav className="space-y-1 p-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-tahona-cream/75 transition-colors hover:bg-tahona-yellow/15 hover:text-tahona-yellow",
                  active && "bg-tahona-yellow text-tahona-coffee"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-tahona-yellow/20 p-4">
          <Link
            href="/"
            className="block rounded-md border border-tahona-yellow/25 px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-tahona-yellow"
          >
            Volver a demo
          </Link>
        </div>
      </aside>
      <header className="sticky top-0 z-20 border-b border-tahona-coffee/15 bg-tahona-pink/95 backdrop-blur lg:ml-72">
        <div className="flex items-center justify-between px-4 py-3 lg:px-8">
          <Link href={homeHref} className="font-display text-2xl font-semibold text-tahona-coffee lg:hidden">
            {title}
          </Link>
          <div className="hidden text-sm font-semibold text-tahona-coffee/70 lg:block">
            Prototipo conectado: cliente, operación y dirección
          </div>
          <div className="rounded-md border border-tahona-coffee/20 bg-tahona-masa px-3 py-1.5 text-sm font-semibold text-tahona-coffee">
            15 jun 2026
          </div>
        </div>
      </header>
      <main className="lg:ml-72">{children}</main>
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
