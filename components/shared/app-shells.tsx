"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Box,
  ClipboardList,
  CreditCard,
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
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-tahona-ink text-lg font-black text-tahona-crust">
        T
      </span>
      {!compact ? (
        <span>
          <span className="block text-lg font-black leading-none tracking-normal">TAHONA</span>
          <span className="block font-display text-sm italic leading-none text-muted-foreground">
            donde se hace el pan
          </span>
        </span>
      ) : null}
    </Link>
  );
}

export function ClienteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-tahona-masa pb-20 md:pb-0">
      <header className="sticky top-0 z-40 border-b bg-tahona-masa/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <TahonaWordmark />
          <nav className="hidden items-center gap-1 md:flex">
            {customerNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted",
                  pathname === item.href && "bg-muted text-secondary"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/suscribirme"
              className="ml-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Suscribirme
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-card md:hidden">
        <div className="grid grid-cols-4">
          {customerNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold",
                  active ? "text-secondary" : "text-muted-foreground"
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
    <div className="min-h-screen bg-tahona-masa">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r bg-tahona-ink text-white lg:block">
        <div className="border-b border-white/10 p-5">
          <TahonaWordmark />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-tahona-crust">
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
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white",
                  active && "bg-white/12 text-white"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <header className="sticky top-0 z-20 border-b bg-tahona-masa/95 backdrop-blur lg:ml-72">
        <div className="flex items-center justify-between px-4 py-3 lg:px-8">
          <Link href={homeHref} className="font-display text-2xl font-semibold lg:hidden">
            {title}
          </Link>
          <div className="hidden text-sm text-muted-foreground lg:block">
            Demo ejecutiva conectada a datos mockeados
          </div>
          <div className="rounded-md border bg-card px-3 py-1.5 text-sm font-semibold">
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
