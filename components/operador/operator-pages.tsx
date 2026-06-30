"use client";
import { useState, useRef, useEffect, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Banknote,
  Boxes,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Download,
  MapPin,
  Package,
  RefreshCw,
  Settings,
  ShieldCheck,
  Timer,
  Users,
  ArrowRight, 
  Bell, 
  Clock, 
  QrCode,
  Wheat,
  Camera, 
  Bell, 
  CheckCircle2, 
  User, 
  Check, 
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Field } from "@/components/ui/field";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusPill } from "@/components/ui/status-pill";
import { Textarea } from "@/components/ui/textarea";
import { ProgressBar } from "@/components/shared/progress";
import { useTahonaStore } from "@/lib/store/tahona-store";
import type { Casillero, Cobro, Entrega, Hub, Incidencia, Producto, Suscripcion } from "@/lib/mock-data";
import { cn, formatCurrency, shortDate } from "@/lib/utils";

type OperatorView =
  | "hoy"
  | "produccion"
  | "produccion-semanal"
  | "carga"
  | "casilleros"
  | "entrega"
  | "suscripciones"
  | "suscripcion"
  | "pedidos"
  | "pedidos-extra"
  | "cobros"
  | "reintentos"
  | "conciliacion"
  | "catalogo"
  | "hubs"
  | "equipo"
  | "incidencias"
  | "configuracion";

const today = "2026-06-15";

export function OperatorPage({ view, id }: { view: OperatorView; id?: string }) {
  if (view === "hoy") return <TodayOperations />;
  if (view === "produccion" || view === "produccion-semanal") return <ProductionView weekly={view === "produccion-semanal"} />;
  if (view === "carga" || view === "casilleros") return <LockerView mode={view} />;
  if (view === "entrega") return <DeliveryDetail id={id} />;
  if (view === "suscripciones" || view === "suscripcion") return <SubscriptionsView id={id} />;
  if (view === "pedidos" || view === "pedidos-extra") return <OrdersView extra={view === "pedidos-extra"} />;
  if (view === "cobros" || view === "reintentos" || view === "conciliacion") return <MoneyView mode={view} />;
  if (view === "catalogo") return <CatalogAdmin />;
  if (view === "hubs") return <HubsAdmin />;
  if (view === "incidencias") return <IncidentsView />;
  return <SettingsView mode={view} />;
}

function PageShell({
  eyebrow,
  title,
  description,
  actions,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-transparent px-4 py-6 text-[var(--ink)] lg:px-6">
      <div className="mx-auto max-w-[1540px]">
        <header className="mb-6 rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] p-6 shadow-[var(--shadow-sm)] backdrop-blur">
          <div className="flex flex-col justify-between gap-md xl:flex-row xl:items-end">
            <div className="max-w-4xl">
              <div className="mb-4 h-0.5 w-8 bg-[var(--brand)]" />
              <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">{eyebrow}</p>
              <h1 className="mt-3 font-sans text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-[var(--ink)]">{title}</h1>
              <p className="mt-3 max-w-3xl font-sans text-sm leading-6 text-[var(--ink-soft)]">{description}</p>
            </div>
            <div className="flex flex-wrap gap-xs">
              {actions ?? (
                <>
                  <Button asChild variant="outline"><Link href="/operador/pedidos">Pedidos</Link></Button>
                  <Button asChild><Link href="/operador/carga">Abrir carga</Link></Button>
                </>
              )}
            </div>
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}

function useShiftClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);
  return now;
}

function clientName(clientes: ReturnType<typeof useTahonaStore.getState>["clientes"], id: string) {
  const client = clientes.find((item) => item.id === id);
  return client ? `${client.nombre} ${client.apellido}` : id;
}

function productName(productos: Producto[], id: string) {
  return productos.find((item) => item.id === id)?.nombre ?? id;
}

function hubName(hubs: Hub[], id: string) {
  return hubs.find((item) => item.id === id)?.nombre ?? id;
}

function entregaTotal(productos: Producto[], entrega: Entrega) {
  return entrega.productos.reduce((sum, item) => sum + (productos.find((product) => product.id === item.producto_id)?.precio_mxn ?? 0) * item.cantidad, 0);
}

function deliveryTone(status: Entrega["estado"]) {
  if (status === "incidencia" || status === "no_entregado") return "danger";
  if (status === "listo") return "warning";
  return "success";
}

function chargeTone(status: Cobro["estado"]) {
  if (status === "fallido") return "danger";
  if (status === "pendiente") return "warning";
  return "success";
}

function TodayOperations() {
  const { entregas, incidencias, cobros, casilleros, hubs, clientes, productos, markDelivery } = useTahonaStore();
  const now = useShiftClock();
  const [filter, setFilter] = useState<"todos" | "listo" | "incidencia">("todos");

  const todayDeliveries = entregas.filter((item) => item.fecha === today);
  const ready = todayDeliveries.filter((item) => item.estado === "listo").length;
  const delivered = todayDeliveries.filter((item) => item.estado === "entregado").length;
  const incidents = incidencias.filter((item) => item.estado !== "resuelta");
  const failedCharges = cobros.filter((item) => item.estado === "fallido");
  const failedAmount = failedCharges.reduce((sum, item) => sum + item.monto, 0);
  const occupied = casilleros.filter((item) => item.estado === "cargado" || item.estado === "incidencia").length;
  const totalLockers = hubs.reduce((sum, hub) => sum + hub.casilleros_total, 0);
  const progress = todayDeliveries.length ? Math.round((delivered / todayDeliveries.length) * 100) : 0;

  const queue = todayDeliveries
    .filter((d) => (filter === "todos" ? true : d.estado === filter))
    .sort((a, b) => {
      const rank = (e: Entrega["estado"]) => (e === "incidencia" ? 0 : e === "listo" ? 1 : e === "no_entregado" ? 2 : 3);
      return rank(a.estado) - rank(b.estado) || a.slot.localeCompare(b.slot);
    });

  const lockerOf = (id: string) => {
    const c = casilleros.find((x) => x.pedido_actual === id);
    return c ? `#${c.numero}` : "—";
  };

  const filters: Array<{ key: typeof filter; label: string; count: number }> = [
    { key: "todos", label: "Todos", count: todayDeliveries.length },
    { key: "listo", label: "Listos", count: ready },
    { key: "incidencia", label: "Incidencias", count: todayDeliveries.filter((d) => d.estado === "incidencia").length }
  ];

  return (
    <main className="min-h-screen bg-transparent px-4 py-6 text-[var(--ink)] lg:px-6">
      <div className="mx-auto max-w-[1540px]">
        {/* ── Barra de turno (live) ─────────────────────────────────────── */}
        <header className="mb-6 overflow-hidden rounded-[18px] border border-[var(--line)] bg-[#111827] text-white shadow-[var(--shadow-md)]">
          <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ok)] opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--ok)]" />
              </span>
              <div>
                <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white/60">Turno en vivo · Operación</p>
                <h1 className="mt-1 font-sans text-[1.75rem] font-semibold leading-none">
                  {now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </h1>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="font-mono text-2xl font-semibold [font-variant-numeric:tabular-nums]">{ready}</p>
                <p className="font-sans text-xs text-white/60">listos ahora</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-semibold text-[var(--accent)] [font-variant-numeric:tabular-nums]">{incidents.length}</p>
                <p className="font-sans text-xs text-white/60">incidencias</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-semibold [font-variant-numeric:tabular-nums]">{progress}%</p>
                <p className="font-sans text-xs text-white/60">del día completado</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                <Link href="/operador/incidencias"><Bell className="mr-1 h-4 w-4" aria-hidden /> Incidencias</Link>
              </Button>
              <Button asChild className="bg-[var(--brand)] hover:bg-[var(--brand-press)]">
                <Link href="/operador/carga"><QrCode className="mr-1 h-4 w-4" aria-hidden /> Abrir carga</Link>
              </Button>
            </div>
          </div>
          <div className="h-1.5 w-full bg-white/10">
            <div className="h-full bg-[var(--ok)] transition-all duration-base" style={{ width: `${progress}%` }} />
          </div>
        </header>

        <div className="grid gap-sm md:grid-cols-4">
          <KpiCard label="Pedidos de hoy" value={todayDeliveries.length} helper={`${delivered} entregados · ${ready} listos`} icon={ClipboardList} />
          <KpiCard label="Casilleros activos" value={occupied} helper={`${totalLockers - occupied} libres en red`} target={`${totalLockers}`} icon={Boxes} />
          <KpiCard label="Incidencias abiertas" value={incidents.length} delta={incidents.length > 0 ? "requiere acción" : "sin riesgo"} deltaTone={incidents.length > 0 ? "down" : "up"} icon={AlertTriangle} />
          <KpiCard label="Cobros fallidos" value={failedCharges.length} helper={`${formatCurrency(failedAmount)} bloquean acceso`} icon={CreditCard} />
        </div>

        <div className="mt-md grid gap-md xl:grid-cols-[1.35fr_0.65fr]">
          {/* ── Cola de retiros como tarjetas accionables ───────────────── */}
          <section className="rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] p-5 shadow-[var(--shadow-sm)]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-sans text-[1.125rem] font-semibold text-[var(--ink)]">Cola de retiros de hoy</h2>
              <div className="flex gap-1.5">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-sm font-medium transition-colors",
                      filter === f.key ? "bg-[var(--brand)] text-white" : "bg-[var(--paper-sunken)] text-[var(--ink-soft)] hover:text-[var(--ink)]"
                    )}
                  >
                    {f.label}
                    <span className={cn("font-mono text-xs", filter === f.key ? "text-white/80" : "text-[var(--ink-faint)]")}>{f.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {queue.slice(0, 16).map((d) => {
                const blocked = d.estado === "incidencia" || d.estado === "no_entregado";
                const done = d.estado === "entregado";
                return (
                  <div
                    key={d.id}
                    className={cn(
                      "flex flex-wrap items-center gap-3 rounded-[14px] border p-3.5 transition-colors",
                      blocked ? "border-[var(--danger)]/25 bg-[var(--danger-bg)]" : done ? "border-[var(--line)] bg-[var(--paper-sunken)] opacity-70" : "border-[var(--line)] bg-[var(--paper-raised)] hover:border-[var(--brand)]"
                    )}
                  >
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-[10px] bg-[var(--ink)] text-white">
                      <span className="font-mono text-[0.625rem] uppercase leading-none text-white/55">slot</span>
                      <span className="font-mono text-sm font-semibold leading-tight">{d.slot.split("-")[0] ?? d.slot}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-sans text-[0.9375rem] font-semibold text-[var(--ink)]">{clientName(clientes, d.cliente_id)}</p>
                      <p className="truncate font-sans text-[0.8125rem] text-[var(--ink-soft)]">
                        {hubName(hubs, d.hub_id)} · Casillero {lockerOf(d.id)} · {d.productos.reduce((s, p) => s + p.cantidad, 0)} piezas
                      </p>
                    </div>
                    <StatusPill tone={deliveryTone(d.estado)} label={d.estado.replaceAll("_", " ")} />
                    <div className="flex gap-1.5">
                      {d.estado === "listo" ? (
                        <>
                          <Button type="button" size="sm" onClick={() => markDelivery(d.id, "entregado")}>
                            <CheckCircle2 className="mr-1 h-4 w-4" aria-hidden /> Entregado
                          </Button>
                          <Button type="button" size="sm" variant="outline" onClick={() => markDelivery(d.id, "incidencia")}>
                            Incidencia
                          </Button>
                        </>
                      ) : (
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/operador/entregas/${d.id}`}>
                            Abrir <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
              {!queue.length ? (
                <p className="py-10 text-center font-sans text-sm text-[var(--ink-faint)]">No hay pedidos en este filtro.</p>
              ) : null}
            </div>
          </section>

          <RiskQueue incidents={incidents} charges={failedCharges} clientes={clientes} />
        </div>

        <HubCapacity hubs={hubs} casilleros={casilleros} />
      </div>
    </main>
  );
}
function RiskQueue({
  incidents,
  charges,
  clientes
}: {
  incidents: Incidencia[];
  charges: Cobro[];
  clientes: ReturnType<typeof useTahonaStore.getState>["clientes"];
}) {
  const resolveIncident = useTahonaStore((s) => s.resolveIncident);
  const retryCharge = useTahonaStore((s) => s.retryCharge);
  const empty = incidents.length === 0 && charges.length === 0;

  return (
    <section className="rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] p-5 shadow-[var(--shadow-sm)]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-sans text-[1.125rem] font-semibold text-[var(--ink)]">Prioridades</h2>
        {!empty ? (
          <span className="rounded-full bg-[var(--danger-bg)] px-2.5 py-1 font-mono text-xs font-semibold text-[var(--danger)]">
            {incidents.length + charges.length}
          </span>
        ) : null}
      </div>

      {empty ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <CheckCircle2 className="h-8 w-8 text-[var(--ok)]" aria-hidden />
          <p className="font-sans text-sm font-medium text-[var(--ink)]">Todo en orden</p>
          <p className="font-sans text-xs text-[var(--ink-soft)]">Sin incidencias ni cobros bloqueando retiros.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {incidents.slice(0, 5).map((incident) => (
            <div key={incident.id} className="rounded-[14px] border border-[var(--danger)]/20 bg-[var(--danger-bg)] p-3.5">
              <div className="flex items-center justify-between gap-2">
                <StatusPill tone="danger" label={incident.tipo.replaceAll("_", " ")} />
                <span className="font-mono text-xs text-[var(--ink-faint)]">{shortDate(incident.fecha)}</span>
              </div>
              <p className="mt-2 font-sans text-sm leading-5 text-[var(--ink)]">{incident.descripcion}</p>
              <p className="mt-1 font-sans text-xs text-[var(--ink-soft)]">{clientName(clientes, incident.cliente_id)}</p>
              <Button type="button" size="sm" variant="outline" className="mt-2.5 bg-[var(--paper-raised)]" onClick={() => resolveIncident(incident.id)}>
                <CheckCircle2 className="mr-1 h-4 w-4" aria-hidden /> Marcar resuelta
              </Button>
            </div>
          ))}
          {charges.slice(0, 3).map((charge) => (
            <div key={charge.id} className="rounded-[14px] border border-[var(--warn)]/30 bg-[var(--warn-bg)] p-3.5">
              <div className="flex items-center justify-between gap-2">
                <p className="font-sans text-sm font-semibold text-[var(--ink)]">Cobro fallido · {formatCurrency(charge.monto)}</p>
                <span className="font-mono text-xs text-[var(--ink-faint)]">{charge.reintentos} reint.</span>
              </div>
              <p className="mt-1 font-sans text-xs text-[var(--ink-soft)]">{clientName(clientes, charge.cliente_id)} · {charge.metodo}</p>
              <Button type="button" size="sm" variant="outline" className="mt-2.5 bg-[var(--paper-raised)]" onClick={() => retryCharge(charge.id)}>
                <RefreshCw className="mr-1 h-4 w-4" aria-hidden /> Reintentar cobro
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function HubCapacity({ hubs, casilleros }: { hubs: Hub[]; casilleros: Casillero[] }) {
  return (
    <div className="mt-md grid gap-sm md:grid-cols-3">
      {hubs.map((hub) => {
        const hubLockers = casilleros.filter((item) => item.hub_id === hub.id);
        const loaded = hubLockers.filter((item) => item.estado === "cargado").length;
        const issues = hubLockers.filter((item) => item.estado === "incidencia").length;
        const occupation = Math.round((loaded / hub.casilleros_total) * 100);
        const tone = occupation >= 85 ? "var(--danger)" : occupation >= 60 ? "var(--warn)" : "var(--ok)";
        return (
          <article key={hub.id} className="rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] p-5 shadow-[var(--shadow-sm)]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[var(--brand)]">{hub.colonia}</p>
                <h3 className="mt-1 font-sans text-[1.0625rem] font-semibold text-[var(--ink)]">{hub.nombre}</h3>
              </div>
              {issues > 0 ? <StatusPill tone="danger" label={`${issues} alerta${issues > 1 ? "s" : ""}`} /> : <StatusPill tone="success" label="estable" />}
            </div>
            <div className="mt-4">
              <div className="mb-2 flex justify-between font-sans text-xs text-[var(--ink-soft)]">
                <span>Casilleros cargados</span>
                <span className="font-mono font-medium text-[var(--ink)]">{loaded}/{hub.casilleros_total}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[var(--paper-sunken)]">
                <div className="h-full rounded-full transition-all duration-base" style={{ width: `${occupation}%`, background: tone }} />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[var(--line)] pt-3">
              <span className="font-sans text-xs text-[var(--ink-faint)]">{hub.clientes_activos} clientes activos</span>
              <Link href="/operador/casilleros" className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-[var(--brand)] hover:underline">
                Ver red <ArrowRight className="h-3 w-3" aria-hidden />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
function ProductionView({ weekly }: { weekly: boolean }) {
  const { entregas, productos, hubs } = useTahonaStore();
  const relevant = weekly ? entregas.slice(0, 126) : entregas.filter((item) => item.fecha === today);
  const rows = productos
    .map((product) => {
      const units = relevant
        .flatMap((delivery) => delivery.productos)
        .filter((item) => item.producto_id === product.id)
        .reduce((sum, item) => sum + item.cantidad, 0);
      return { product, units, revenue: units * product.precio_mxn, minutes: units * product.tiempo_horneado_min };
    })
    .filter((row) => row.units > 0)
    .sort((a, b) => b.units - a.units);

  const totalUnits = rows.reduce((sum, row) => sum + row.units, 0);
  const totalMinutes = rows.reduce((sum, row) => sum + row.minutes, 0);
  const maxUnits = Math.max(1, ...rows.map((r) => r.units));
  const [done, setDone] = useState<Record<string, boolean>>({});
  const completed = rows.filter((r) => done[r.product.id]).length;

  return (
    <PageShell
      eyebrow={weekly ? "Producción semanal" : "Producción diaria"}
      title={weekly ? "Plan de producción por demanda acumulada." : "Producción requerida para los pedidos de hoy."}
      description="Volumen por SKU, tiempo de horno y prioridad. Marca cada lote conforme sale del horno."
      actions={<Button variant="outline"><Download className="h-4 w-4" /> Exportar plan</Button>}
    >
      <div className="grid gap-sm md:grid-cols-4">
        <KpiCard label="SKUs en plan" value={rows.length} icon={Wheat} helper={`${completed} lotes completados`} />
        <KpiCard label="Unidades totales" value={totalUnits} icon={Package} helper={weekly ? "Semana móvil" : "Hoy"} />
        <KpiCard label="Tiempo de horno" value={Math.round(totalMinutes / 60)} formatter={(v) => `${v} h`} icon={Timer} helper="Estimado acumulado" />
        <KpiCard label="Hubs destino" value={hubs.length} icon={MapPin} helper="Carga distribuida" />
      </div>

      <section className="mt-md rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] p-5 shadow-[var(--shadow-sm)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-sans text-[1.125rem] font-semibold text-[var(--ink)]">Tablero de horneado</h2>
          <span className="font-mono text-sm text-[var(--ink-faint)]">{completed}/{rows.length} lotes</span>
        </div>
        <div className="space-y-2.5">
          {rows.map((row, i) => {
            const isDone = done[row.product.id];
            const share = Math.round((row.units / maxUnits) * 100);
            return (
              <div
                key={row.product.id}
                className={cn(
                  "flex flex-wrap items-center gap-4 rounded-[14px] border p-3.5 transition-colors",
                  isDone ? "border-[var(--ok)]/30 bg-[var(--ok-bg)]" : "border-[var(--line)] bg-[var(--paper-raised)]"
                )}
              >
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-sm font-semibold", i < 3 && !isDone ? "bg-[var(--brand)] text-white" : "bg-[var(--paper-sunken)] text-[var(--ink-soft)]")}>
                  {i + 1}
                </span>
                <div className="min-w-[160px] flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className={cn("font-sans text-[0.9375rem] font-semibold text-[var(--ink)]", isDone && "line-through opacity-60")}>{row.product.nombre}</p>
                    <span className="font-mono text-sm font-semibold text-[var(--ink)] [font-variant-numeric:tabular-nums]">{row.units} u</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--paper-sunken)]">
                    <div className="h-full rounded-full bg-[var(--brand)] transition-all duration-base" style={{ width: `${share}%` }} />
                  </div>
                  <div className="mt-1.5 flex gap-3 font-sans text-xs text-[var(--ink-soft)]">
                    <span>{row.product.categoria}</span>
                    <span className="flex items-center gap-1"><Timer className="h-3 w-3" aria-hidden /> {row.product.tiempo_horneado_min} min/lote</span>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant={isDone ? "outline" : "default"}
                  onClick={() => setDone((prev) => ({ ...prev, [row.product.id]: !prev[row.product.id] }))}
                >
                  {isDone ? "Deshacer" : <><CheckCircle2 className="mr-1 h-4 w-4" aria-hidden /> Listo</>}
                </Button>
              </div>
            );
          })}
          {!rows.length ? <p className="py-10 text-center font-sans text-sm text-[var(--ink-faint)]">Sin demanda para este periodo.</p> : null}
        </div>
      </section>
    </PageShell>
  );
}

function LockerView({ mode }: { mode: "carga" | "casilleros" }) {
  const { casilleros, hubs, entregas, clientes } = useTahonaStore();
  const active = casilleros.filter((item) => item.estado !== "vacio");
  const incidents = casilleros.filter((item) => item.estado === "incidencia");
  const loaded = casilleros.filter((item) => item.estado === "cargado");
  const pending = mode === "carga" ? entregas.filter((e) => e.estado === "listo").length : 0;

  const legend = [
    { label: "Cargado", cls: "bg-[var(--brand)] text-white" },
    { label: "Retirado", cls: "bg-[var(--ok)] text-white" },
    { label: "Incidencia", cls: "bg-[var(--danger)] text-white" },
    { label: "Vacío", cls: "bg-[var(--paper-sunken)] text-[var(--ink-faint)] border border-[var(--line)]" }
  ];

  const tileTone = (estado: Casillero["estado"]) =>
    estado === "incidencia"
      ? "bg-[var(--danger)] text-white"
      : estado === "cargado"
      ? "bg-[var(--brand)] text-white"
      : estado === "retirado"
      ? "bg-[var(--ok)] text-white"
      : "bg-[var(--paper-sunken)] text-[var(--ink-faint)] border border-[var(--line)]";

  return (
    <PageShell
      eyebrow={mode === "carga" ? "Carga de casilleros" : "Estado de red"}
      title={mode === "carga" ? "Asignación de pedidos a casilleros." : "Mapa operativo de casilleros."}
      description="Capacidad física por hub: cada locker tiene estado, pedido y acción. El color solo señala estado real."
      actions={
        mode === "carga" ? (
          <Button asChild><Link href="/operador/pedidos">Ver pedidos listos</Link></Button>
        ) : (
          <Button asChild variant="outline"><Link href="/operador/incidencias">Incidencias</Link></Button>
        )
      }
    >
      <div className="grid gap-sm md:grid-cols-4">
        {mode === "carga" ? <KpiCard label="Listos por cargar" value={pending} icon={Boxes} helper="Pedidos esperando casillero" /> : null}
        <KpiCard label="Casilleros cargados" value={loaded.length} icon={Boxes} helper="Con pan dentro ahora" />
        <KpiCard label="Activos" value={active.length} icon={Package} helper="Cargados, retirados o incidencia" />
        <KpiCard label="Incidencias" value={incidents.length} icon={AlertTriangle} delta={incidents.length ? "resolver" : "sin bloqueo"} deltaTone={incidents.length ? "down" : "up"} />
        {mode !== "carga" ? <KpiCard label="Hubs" value={hubs.length} icon={MapPin} helper="Red operativa" /> : null}
      </div>

      {/* Leyenda */}
      <div className="mt-md flex flex-wrap items-center gap-4 rounded-[14px] border border-[var(--line)] bg-[var(--paper-raised)] px-4 py-3">
        <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">Leyenda</span>
        {legend.map((l) => (
          <span key={l.label} className="flex items-center gap-2 font-sans text-sm text-[var(--ink-soft)]">
            <span className={cn("flex h-5 w-5 items-center justify-center rounded-[6px] text-[10px] font-semibold", l.cls)} aria-hidden />
            {l.label}
          </span>
        ))}
      </div>

      <div className="mt-md grid gap-md lg:grid-cols-3">
        {hubs.map((hub) => {
          const hubLockers = casilleros.filter((locker) => locker.hub_id === hub.id);
          const hubLoaded = hubLockers.filter((l) => l.estado === "cargado").length;
          return (
            <article key={hub.id} className="rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] p-5 shadow-[var(--shadow-sm)]">
              <div className="mb-4 flex items-start justify-between gap-2">
                <div>
                  <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[var(--brand)]">{hub.colonia}</p>
                  <h3 className="mt-1 font-sans text-[1.0625rem] font-semibold text-[var(--ink)]">{hub.nombre}</h3>
                </div>
                <span className="font-mono text-sm text-[var(--ink-faint)]">{hubLoaded}/{hub.casilleros_total}</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {hubLockers.map((locker) => {
                  const entrega = locker.pedido_actual ? entregas.find((item) => item.id === locker.pedido_actual) : null;
                  const initials = entrega ? clientName(clientes, entrega.cliente_id).split(" ").map((p) => p[0]).slice(0, 2).join("") : "";
                  return (
                    <Link
                      key={locker.id}
                      href={entrega ? `/operador/entregas/${entrega.id}` : "/operador/casilleros"}
                      className={cn(
                        "flex aspect-square flex-col items-center justify-center rounded-[10px] text-xs font-semibold transition-transform hover:scale-105",
                        tileTone(locker.estado)
                      )}
                      title={entrega ? `${clientName(clientes, entrega.cliente_id)} · ${locker.estado}` : `Casillero ${locker.numero} · ${locker.estado}`}
                    >
                      <span className="font-mono text-[0.9375rem] leading-none">{locker.numero}</span>
                      {initials ? <span className="mt-0.5 text-[9px] font-medium opacity-80">{initials}</span> : null}
                    </Link>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}

function OrdersView({ extra }: { extra: boolean }) {
  const { entregas, clientes, hubs, productos } = useTahonaStore();
  const [filter, setFilter] = useState<"todos" | Entrega["estado"]>("todos");

  const base = extra
    ? entregas.filter((item) => item.estado === "no_entregado" || item.estado === "incidencia").slice(0, 60)
    : entregas.filter((item) => item.fecha === today);

  const counts = {
    listo: base.filter((r) => r.estado === "listo").length,
    entregado: base.filter((r) => r.estado === "entregado").length,
    incidencia: base.filter((r) => r.estado === "incidencia" || r.estado === "no_entregado").length
  };
  const revenue = base.reduce((sum, row) => sum + entregaTotal(productos, row), 0);
  const rows = filter === "todos" ? base : base.filter((r) => r.estado === filter);

  const filters: Array<{ key: "todos" | Entrega["estado"]; label: string }> = [
    { key: "todos", label: `Todos · ${base.length}` },
    { key: "listo", label: `Listos · ${counts.listo}` },
    { key: "entregado", label: `Entregados · ${counts.entregado}` },
    { key: "incidencia", label: `Incidencias · ${counts.incidencia}` }
  ];

  const columns: Array<DataTableColumn<Entrega>> = [
    { key: "fecha", header: "Fecha", render: (row) => shortDate(row.fecha) },
    { key: "cliente", header: "Cliente", render: (row) => clientName(clientes, row.cliente_id) },
    { key: "hub", header: "Hub", render: (row) => hubName(hubs, row.hub_id) },
    { key: "pedido", header: "Pedido", render: (row) => row.productos.map((item) => `${item.cantidad}x ${productName(productos, item.producto_id)}`).join(", ") },
    { key: "total", header: "Total", align: "right", render: (row) => formatCurrency(entregaTotal(productos, row)) },
    { key: "estado", header: "Estado", render: (row) => <StatusPill tone={deliveryTone(row.estado)} label={row.estado.replaceAll("_", " ")} /> },
    { key: "accion", header: "", align: "right", render: (row) => <Button asChild size="sm" variant="outline"><Link href={`/operador/entrega/${row.id}`}>Abrir</Link></Button> }
  ];

  return (
    <PageShell
      eyebrow={extra ? "Pedidos extra" : "Pedidos"}
      title={extra ? "Pedidos fuera de flujo regular." : "Pedidos del día, trazables y accionables."}
      description="Cliente, hub, estado y monto en una sola lista. Filtra por estado para trabajar por lotes."
    >
      <div className="grid gap-sm md:grid-cols-4">
        <KpiCard label="Pedidos" value={base.length} icon={Package} helper={extra ? "Excepciones" : "Hoy"} />
        <KpiCard label="Listos para retiro" value={counts.listo} icon={CheckCircle2} deltaTone="up" />
        <KpiCard label="Entregados" value={counts.entregado} icon={Clock} />
        <KpiCard label="Monto del día" value={revenue} formatter={formatCurrency} icon={AlertTriangle} helper={`${counts.incidencia} con incidencia`} />
      </div>

      <Card className="mt-md shadow-sm">
        <CardHeader className="flex-row items-center justify-between gap-sm">
          <CardTitle>{extra ? "Excepciones" : "Pedidos de hoy"}</CardTitle>
          <div className="flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  "h-8 rounded-full px-3 font-sans text-xs font-semibold transition-colors",
                  filter === f.key ? "bg-[var(--brand)] text-white" : "bg-[var(--paper-sunken)] text-[var(--ink-soft)] hover:text-[var(--ink)]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            selectable
            emptyState={<p className="py-6 text-center font-sans text-sm text-[var(--ink-faint)]">Sin pedidos en este estado.</p>}
          />
        </CardContent>
      </Card>
    </PageShell>
  );
}

function DeliveryDetail({ id }: { id?: string }) {
  const { entregas, clientes, hubs, productos, markDelivery } = useTahonaStore();
  const entrega = entregas.find((item) => item.id === id) ?? entregas[0];
  const hub = hubs.find((item) => item.id === entrega.hub_id) ?? hubs[0];
  const cliente = clientes.find((c) => c.id === entrega.cliente_id);
  const locker = entrega.casillero_id.split("-").at(-1)?.replace(/^0/, "") ?? "1";
  const total = entrega.productos.reduce(
    (sum, item) => sum + (productos.find((p) => p.id === item.producto_id)?.precio_mxn ?? 0) * item.cantidad,
    0
  );
  const done = entrega.estado === "entregado";
  const blocked = entrega.estado === "incidencia" || entrega.estado === "no_entregado";

  const hero = blocked
    ? { bg: "border-[var(--danger)]/25 bg-[var(--danger-bg)]", color: "text-[var(--danger)]", icon: AlertTriangle, title: "Entrega con incidencia", sub: "Resuélvela para liberar el casillero." }
    : done
    ? { bg: "border-[var(--line)] bg-[var(--paper-sunken)]", color: "text-[var(--ink-soft)]", icon: CheckCircle2, title: "Entrega cerrada", sub: "El pedido fue retirado correctamente." }
    : entrega.estado === "listo"
    ? { bg: "border-[var(--ok)]/30 bg-[var(--ok-bg)]", color: "text-[var(--ok)]", icon: QrCode, title: `Listo para retirar · Casillero #${locker}`, sub: "Esperando al cliente. Marca entregado al confirmar el retiro." }
    : { bg: "border-[var(--brand)]/20 bg-[var(--brand-tint)]", color: "text-[var(--brand)]", icon: Package, title: "En preparación", sub: "Aún no cargado en casillero." };
  const HeroIcon = hero.icon;

  return (
    <PageShell
      eyebrow="Detalle de entrega"
      title={`Entrega ${entrega.id}`}
      description="Estado del pedido, casillero, cliente y acciones de piso para cerrar la entrega."
      actions={<Button asChild variant="outline"><Link href="/operador">Volver a hoy</Link></Button>}
    >
      <div className={cn("mb-md flex items-start gap-4 rounded-[18px] border p-5", hero.bg)}>
        <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--paper-raised)]", hero.color)}>
          <HeroIcon className="h-6 w-6" aria-hidden />
        </span>
        <div className="flex-1">
          <h2 className="font-sans text-[1.25rem] font-semibold text-[var(--ink)]">{hero.title}</h2>
          <p className="mt-1 font-sans text-sm text-[var(--ink-soft)]">{hero.sub}</p>
        </div>
        <div className="flex gap-2">
          {entrega.estado !== "entregado" ? (
            <Button type="button" onClick={() => markDelivery(entrega.id, "entregado")}>
              <CheckCircle2 className="mr-1 h-4 w-4" aria-hidden /> Marcar entregado
            </Button>
          ) : null}
          {!blocked ? (
            <Button type="button" variant="outline" onClick={() => markDelivery(entrega.id, "incidencia")}>
              Reportar incidencia
            </Button>
          ) : (
            <Button asChild variant="outline"><Link href="/operador/incidencias">Ver incidencias</Link></Button>
          )}
        </div>
      </div>

      <div className="grid gap-md lg:grid-cols-[400px_1fr]">
        {/* Pase operativo */}
        <article className="rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] p-5 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between">
            <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">Pase operativo</p>
            <StatusPill tone={deliveryTone(entrega.estado)} label={entrega.estado.replaceAll("_", " ")} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[12px] border border-[var(--line)] bg-[var(--paper-sunken)] p-3 text-center">
              <p className="font-sans text-xs text-[var(--ink-faint)]">Casillero</p>
              <p className="mt-1 font-mono text-[1.75rem] font-semibold text-[var(--ink)]">#{locker}</p>
            </div>
            <div className="rounded-[12px] border border-[var(--line)] bg-[var(--paper-sunken)] p-3 text-center">
              <p className="font-sans text-xs text-[var(--ink-faint)]">Ventana</p>
              <p className="mt-1 font-mono text-[1.0625rem] font-semibold text-[var(--ink)]">{entrega.slot}</p>
            </div>
          </div>
          <div className="mt-3 rounded-[12px] border border-dashed border-[var(--line)] bg-[var(--paper-sunken)] p-4 text-center">
            <p className="font-sans text-xs text-[var(--ink-faint)]">Código QR</p>
            <p className="mt-1 font-mono text-[1.25rem] font-semibold tracking-wider text-[var(--ink)]">{entrega.qr_code.slice(-12).toUpperCase()}</p>
          </div>
        </article>

        {/* Cliente + productos */}
        <div className="space-y-md">
          <article className="rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] p-5 shadow-[var(--shadow-sm)]">
            <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">Cliente</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand)] font-mono text-sm font-semibold text-white">
                {(cliente?.nombre?.[0] ?? "?") + (cliente?.apellido?.[0] ?? "")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-[0.9375rem] font-semibold text-[var(--ink)]">{clientName(clientes, entrega.cliente_id)}</p>
                <p className="font-sans text-sm text-[var(--ink-soft)]">{cliente?.telefono ?? ""}</p>
              </div>
              <span className="flex items-center gap-1.5 font-sans text-sm text-[var(--ink-soft)]">
                <MapPin className="h-4 w-4 text-[var(--brand)]" aria-hidden /> {hub.nombre}
              </span>
            </div>
          </article>

          <article className="rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] p-5 shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between">
              <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">Productos</p>
              <span className="font-mono text-sm font-semibold text-[var(--ink)]">{formatCurrency(total)}</span>
            </div>
            <div className="mt-3 space-y-1.5">
              {entrega.productos.map((item) => (
                <div key={item.producto_id} className="flex items-center justify-between rounded-[10px] border border-[var(--line)] px-3 py-2">
                  <span className="font-sans text-sm text-[var(--ink)]">
                    <span className="font-mono font-semibold text-[var(--brand)]">{item.cantidad}×</span> {productName(productos, item.producto_id)}
                  </span>
                  <span className="font-mono text-sm text-[var(--ink-soft)]">
                    {formatCurrency((productos.find((p) => p.id === item.producto_id)?.precio_mxn ?? 0) * item.cantidad)}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </PageShell>
  );
}
function SubscriptionsView({ id }: { id?: string }) {
  const { suscripciones, clientes, productos } = useTahonaStore();
  const selected = id ? suscripciones.find((item) => item.id === id || item.cliente_id === id) : null;
  if (selected) {
    return (
      <PageShell eyebrow="Suscripción" title={clientName(clientes, selected.cliente_id)} description="Configuración de pedido semanal, próximos slots e historial de cambios.">
        <SubscriptionCard subscription={selected} productos={productos} />
      </PageShell>
    );
  }
  const columns: Array<DataTableColumn<Suscripcion>> = [
    { key: "cliente", header: "Cliente", render: (row) => clientName(clientes, row.cliente_id) },
    { key: "estado", header: "Estado", render: (row) => <StatusPill tone={row.estado === "activa" ? "success" : row.estado === "pausada" ? "warning" : "danger"} label={row.estado} /> },
    { key: "productos", header: "Productos", render: (row) => row.productos.length },
    { key: "proxima", header: "Próxima", render: (row) => shortDate(row.proxima_entrega) },
    { key: "accion", header: "", align: "right", render: (row) => <Button asChild size="sm" variant="outline"><Link href={`/operador/suscripciones/${row.id}`}>Abrir</Link></Button> }
  ];
  return (
    <PageShell eyebrow="Suscripciones" title="Base recurrente bajo control." description="Clientes activos, pausas y cambios de bolsa semanal en una tabla operativa.">
      <Card className="shadow-sm"><CardHeader><CardTitle>Suscripciones</CardTitle></CardHeader><CardContent><DataTable rows={suscripciones.slice(0, 80)} columns={columns} getRowId={(row) => row.id} selectable /></CardContent></Card>
    </PageShell>
  );
}

function SubscriptionCard({ subscription, productos }: { subscription: Suscripcion; productos: Producto[] }) {
  const clientes = useTahonaStore((s) => s.clientes);
  const pauseSubscription = useTahonaStore((s) => s.pauseSubscription);
  const reactivateSubscription = useTahonaStore((s) => s.reactivateSubscription);
  const cliente = clientes.find((c) => c.id === subscription.cliente_id);
  const weeklyTotal = subscription.productos.reduce(
    (sum, item) => sum + (productos.find((p) => p.id === item.producto_id)?.precio_mxn ?? 0) * item.cantidad,
    0
  );
  const paused = subscription.estado === "pausada";

  return (
    <div className="grid gap-md lg:grid-cols-[1fr_360px]">
      <div className="space-y-md">
        <article className="rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] p-5 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand)] font-mono text-sm font-semibold text-white">
                {(cliente?.nombre?.[0] ?? "?") + (cliente?.apellido?.[0] ?? "")}
              </span>
              <div>
                <p className="font-sans text-[1.0625rem] font-semibold text-[var(--ink)]">{clientName(clientes, subscription.cliente_id)}</p>
                <p className="font-sans text-sm text-[var(--ink-soft)]">{cliente?.email ?? ""}</p>
              </div>
            </div>
            <StatusPill tone={subscription.estado === "activa" ? "success" : subscription.estado === "pausada" ? "warning" : "danger"} label={subscription.estado} />
          </div>
        </article>

        <article className="rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] p-5 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between">
            <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">Bolsa semanal</p>
            <span className="font-mono text-sm font-semibold text-[var(--ink)]">{formatCurrency(weeklyTotal)}</span>
          </div>
          <div className="mt-3 space-y-1.5">
            {subscription.productos.map((item) => (
              <div key={item.producto_id} className="flex items-center justify-between rounded-[10px] border border-[var(--line)] px-3 py-2">
                <span className="font-sans text-sm text-[var(--ink)]">
                  <span className="font-mono font-semibold text-[var(--brand)]">{item.cantidad}×</span> {productName(productos, item.producto_id)}
                </span>
                <span className="font-mono text-sm text-[var(--ink-soft)]">
                  {formatCurrency((productos.find((p) => p.id === item.producto_id)?.precio_mxn ?? 0) * item.cantidad)}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] p-5 shadow-[var(--shadow-sm)]">
          <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">Historial de cambios</p>
          <div className="mt-3 space-y-3">
            {subscription.historial_cambios.slice(0, 6).map((evento, i) => (
              <div key={i} className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--brand)]" aria-hidden />
                <div>
                  <p className="font-sans text-sm text-[var(--ink)]">{evento.descripcion}</p>
                  <p className="font-mono text-xs text-[var(--ink-faint)]">{shortDate(evento.fecha)}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <aside className="h-fit space-y-md lg:sticky lg:top-24">
        <article className="rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] p-5 shadow-[var(--shadow-sm)]">
          <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">Ventanas de retiro</p>
          <div className="mt-3 space-y-2">
            {subscription.slots_elegidos.map((slot) => (
              <div key={`${slot.dia}-${slot.slot}`} className="flex items-center gap-2 rounded-[10px] border border-[var(--line)] px-3 py-2">
                <CalendarDays className="h-4 w-4 text-[var(--brand)]" aria-hidden />
                <span className="font-sans text-sm capitalize text-[var(--ink)]">{slot.dia}</span>
                <span className="ml-auto font-mono text-sm text-[var(--ink-soft)]">{slot.slot}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-1.5 font-sans text-xs text-[var(--ink-faint)]">
            <Clock className="h-3.5 w-3.5" aria-hidden /> Próxima: {shortDate(subscription.proxima_entrega)}
          </p>
        </article>

        <article className="rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] p-5 shadow-[var(--shadow-sm)]">
          <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">Acciones</p>
          <div className="mt-3 space-y-2">
            {paused ? (
              <Button type="button" className="w-full" onClick={() => reactivateSubscription(subscription.id)}>
                <RefreshCw className="mr-1 h-4 w-4" aria-hidden /> Reactivar suscripción
              </Button>
            ) : (
              <Button type="button" variant="outline" className="w-full" onClick={() => pauseSubscription(subscription.id, 2)}>
                Pausar 2 semanas
              </Button>
            )}
            <Button asChild variant="outline" className="w-full">
              <Link href="/operador/suscripciones">Volver a la lista</Link>
            </Button>
          </div>
        </article>
      </aside>
    </div>
  );
}

function MoneyView({ mode }: { mode: "cobros" | "reintentos" | "conciliacion" }) {
  const { cobros, clientes, retryCharge } = useTahonaStore();
  const rows = mode === "reintentos" ? cobros.filter((item) => item.estado !== "cobrado") : cobros.slice(0, 120);
  const collected = cobros.filter((item) => item.estado === "cobrado").reduce((sum, item) => sum + item.monto, 0);
  const pending = cobros.filter((item) => item.estado !== "cobrado").reduce((sum, item) => sum + item.monto, 0);
  const failed = cobros.filter((item) => item.estado === "fallido");
  const collectRate = cobros.length ? Math.round((cobros.filter((c) => c.estado === "cobrado").length / cobros.length) * 100) : 0;

  const columns: Array<DataTableColumn<Cobro>> = [
    { key: "cliente", header: "Cliente", render: (row) => clientName(clientes, row.cliente_id) },
    { key: "fecha", header: "Fecha", render: (row) => shortDate(row.fecha) },
    { key: "metodo", header: "Método", render: (row) => row.metodo },
    { key: "monto", header: "Monto", align: "right", render: (row) => formatCurrency(row.monto) },
    { key: "estado", header: "Estado", render: (row) => <StatusPill tone={chargeTone(row.estado)} label={row.estado} /> },
    {
      key: "accion",
      header: "",
      align: "right",
      render: (row) =>
        row.estado === "fallido" ? (
          <Button size="sm" variant="outline" onClick={() => retryCharge(row.id)}>
            <RefreshCw className="h-4 w-4" /> Reintentar
          </Button>
        ) : null
    }
  ];

  return (
    <PageShell
      eyebrow="Cobros"
      title={mode === "conciliacion" ? "Conciliación de ingresos." : "Cobros, reintentos y riesgo de pago."}
      description="El dinero se lee con estado, reintento y monto pendiente. Resuelve los fallidos antes del corte."
    >
      <div className="grid gap-sm md:grid-cols-4">
        <KpiCard label="Cobrado" value={collected} formatter={formatCurrency} icon={Banknote} helper="Periodo actual" />
        <KpiCard label="Pendiente / riesgo" value={pending} formatter={formatCurrency} icon={AlertTriangle} delta={failed.length ? `${failed.length} fallidos` : "estable"} deltaTone={failed.length ? "down" : "up"} />
        <KpiCard label="Tasa de cobro" value={collectRate} formatter={(v) => `${v}%`} icon={CreditCard} />
        <KpiCard label="Transacciones" value={rows.length} icon={CreditCard} helper={mode === "reintentos" ? "En cola" : "Movimientos"} />
      </div>

      {/* Tira de acción: cobros fallidos */}
      {failed.length ? (
        <section className="mt-md rounded-[18px] border border-[var(--danger)]/25 bg-[var(--danger-bg)] p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[var(--danger)]" aria-hidden />
            <h2 className="font-sans text-[1.0625rem] font-semibold text-[var(--ink)]">Cobros fallidos que bloquean retiro</h2>
            <span className="rounded-full bg-[var(--paper-raised)] px-2.5 py-0.5 font-mono text-xs font-semibold text-[var(--danger)]">{failed.length}</span>
          </div>
          <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
            {failed.slice(0, 6).map((charge) => (
              <div key={charge.id} className="flex items-center gap-3 rounded-[14px] border border-[var(--line)] bg-[var(--paper-raised)] p-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-sm font-semibold text-[var(--ink)]">{clientName(clientes, charge.cliente_id)}</p>
                  <p className="font-sans text-xs text-[var(--ink-soft)]">{charge.metodo} · {charge.reintentos} reintentos</p>
                </div>
                <span className="font-mono text-sm font-semibold text-[var(--ink)]">{formatCurrency(charge.monto)}</span>
                <Button size="sm" variant="outline" className="bg-[var(--paper-raised)]" onClick={() => retryCharge(charge.id)}>
                  <RefreshCw className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <Card className="mt-md shadow-sm">
        <CardHeader><CardTitle>{mode === "reintentos" ? "Cola de reintentos" : "Movimientos"}</CardTitle></CardHeader>
        <CardContent><DataTable rows={rows} columns={columns} getRowId={(row) => row.id} selectable /></CardContent>
      </Card>
    </PageShell>
  );
}

function IncidentsView() {
  const { incidencias, clientes, hubs, resolveIncident } = useTahonaStore();
  const open = incidencias.filter((item) => item.estado !== "resuelta");
  const critical = open.filter((i) => i.estado === "abierta").length;
  const inProgress = open.filter((i) => i.estado === "en_proceso").length;

  const iconFor = (tipo: Incidencia["tipo"]) =>
    tipo === "casillero_cerrado" ? Boxes : tipo === "producto_dañado" ? Package : tipo === "cobro_fallido" ? CreditCard : tipo === "direccion_incorrecta" ? MapPin : Users;

  return (
    <PageShell
      eyebrow="Incidencias"
      title="Excepciones con dueño y acción."
      description="Cada caso afecta retiro, producto o cobro. Resuélvelos para no bloquear la experiencia del cliente."
      actions={<Button asChild variant="outline"><Link href="/operador">Volver a hoy</Link></Button>}
    >
      <div className="grid gap-sm md:grid-cols-3">
        <KpiCard label="Abiertas" value={critical} icon={AlertTriangle} delta={critical ? "atender ya" : "sin críticas"} deltaTone={critical ? "down" : "up"} />
        <KpiCard label="En proceso" value={inProgress} icon={Clock} helper="Con seguimiento" />
        <KpiCard label="Total activas" value={open.length} icon={Boxes} helper="Pendientes de cierre" />
      </div>

      <section className="mt-md">
        {open.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {open.map((incident) => {
              const Icon = iconFor(incident.tipo);
              const critical = incident.estado === "abierta";
              return (
                <article
                  key={incident.id}
                  className={cn(
                    "flex flex-col rounded-[16px] border bg-[var(--paper-raised)] p-4 shadow-[var(--shadow-sm)]",
                    critical ? "border-[var(--danger)]/30" : "border-[var(--warn)]/30"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn("flex h-9 w-9 items-center justify-center rounded-[10px]", critical ? "bg-[var(--danger-bg)] text-[var(--danger)]" : "bg-[var(--warn-bg)] text-[var(--warn)]")}>
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <StatusPill tone={critical ? "danger" : "warning"} label={incident.estado.replaceAll("_", " ")} />
                  </div>
                  <p className="mt-3 font-sans text-[0.9375rem] font-semibold capitalize text-[var(--ink)]">{incident.tipo.replaceAll("_", " ")}</p>
                  <p className="mt-1 flex-1 font-sans text-sm leading-5 text-[var(--ink-soft)]">{incident.descripcion}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-[var(--line)] pt-3 font-sans text-xs text-[var(--ink-faint)]">
                    <span>{clientName(clientes, incident.cliente_id)}</span>
                    <span>{hubName(hubs, incident.hub_id)}</span>
                  </div>
                  <Button type="button" size="sm" className="mt-3 w-full" onClick={() => resolveIncident(incident.id)}>
                    <CheckCircle2 className="mr-1 h-4 w-4" aria-hidden /> Marcar resuelta
                  </Button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] py-16 text-center shadow-[var(--shadow-sm)]">
            <CheckCircle2 className="h-10 w-10 text-[var(--ok)]" aria-hidden />
            <p className="font-sans text-[1.0625rem] font-semibold text-[var(--ink)]">Sin incidencias abiertas</p>
            <p className="font-sans text-sm text-[var(--ink-soft)]">Toda la red opera sin bloqueos.</p>
          </div>
        )}
      </section>
    </PageShell>
  );
}
function CatalogAdmin() {
  const { productos } = useTahonaStore();
  const columns: Array<DataTableColumn<Producto>> = [
    { key: "producto", header: "Producto", render: (row) => <div><p className="font-semibold">{row.nombre}</p><p className="text-xs text-muted-foreground">{row.categoria}</p></div> },
    { key: "precio", header: "Precio", align: "right", render: (row) => formatCurrency(row.precio_mxn) },
    { key: "tiempo", header: "Horno", align: "right", render: (row) => `${row.tiempo_horneado_min} min` },
    { key: "dias", header: "Disponibilidad", render: (row) => `${row.disponibilidad.length} días` }
  ];
  return <PageShell eyebrow="Catálogo operativo" title="SKUs, precios y disponibilidad." description="Administración sobria para mantener vitrina y producción alineadas."><Card className="shadow-sm"><CardContent className="p-md"><DataTable rows={productos} columns={columns} getRowId={(row) => row.id} /></CardContent></Card></PageShell>;
}

function HubsAdmin() {
  const { hubs } = useTahonaStore();
  return (
    <PageShell eyebrow="Hubs" title="Capacidad y responsables por hub." description="Lectura de red con ocupación, gerente y clientes activos.">
      <div className="grid gap-sm md:grid-cols-3">
        {hubs.map((hub) => <Card key={hub.id} className="shadow-sm"><CardContent className="p-md"><p className="text-caption font-semibold uppercase text-primary">{hub.colonia}</p><h3 className="mt-1 text-h3 font-semibold">{hub.nombre}</h3><p className="mt-2 text-sm text-muted-foreground">{hub.direccion}</p><div className="mt-sm"><ProgressBar value={(hub.casilleros_ocupados_actual / hub.casilleros_total) * 100} /></div><p className="mt-sm text-sm text-muted-foreground">{hub.gerente} · {hub.clientes_activos} clientes</p></CardContent></Card>)}
      </div>
    </PageShell>
  );
}

function SettingsView({ mode }: { mode: "equipo" | "configuracion" }) {
  return (
    <PageShell eyebrow={mode === "equipo" ? "Equipo" : "Configuración"} title={mode === "equipo" ? "Roles y turnos operativos." : "Parámetros de operación."} description="Pantalla administrativa sobria, enfocada en permisos, horarios y reglas de negocio.">
      <div className="grid gap-md lg:grid-cols-2">
        <Card className="shadow-sm"><CardHeader><CardTitle>{mode === "equipo" ? "Usuarios" : "Reglas"}</CardTitle></CardHeader><CardContent className="space-y-xs"><Field label="Responsable" defaultValue="Lucía Mijares" /><Field label="Turno activo" defaultValue="Matutino" /><Field label="Correo de alertas" defaultValue="operacion@tahona.mx" /></CardContent></Card>
        <Card className="shadow-sm"><CardHeader><CardTitle>Notas internas</CardTitle></CardHeader><CardContent><Textarea defaultValue="Mantener inventario de bolsas y revisar incidencias de casillero antes del cierre." /></CardContent></Card>
      </div>
    </PageShell>
  );
}
