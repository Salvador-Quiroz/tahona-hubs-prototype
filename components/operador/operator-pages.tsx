"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Banknote,
  Box,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Download,
  Package,
  RefreshCw,
  Search,
  Settings,
  Users,
  Wheat
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MetricCard } from "@/components/shared/metric-card";
import { ProgressBar } from "@/components/shared/progress";
import { StatusBadge } from "@/components/shared/status-badge";
import { useTahonaStore } from "@/lib/store/tahona-store";
import type { Casillero, CasilleroEstado, Entrega, Producto, Suscripcion } from "@/lib/mock-data";
import { formatCurrency, shortDate } from "@/lib/utils";

const today = "2026-06-15";
const operatorSlots = ["7:00 AM", "1:30 PM", "7:30 PM"];

function PageShell({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="brand-paper px-4 py-8 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 border-b-4 border-tahona-coffee pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-red">{eyebrow}</p>
          <h1 className="mt-2 font-display text-5xl font-semibold leading-none text-tahona-coffee">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold text-tahona-coffee/62">
            Vista de piso para coordinar producción, carga, retiros, cobros e incidencias
            con trazabilidad por hub.
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

function productName(productos: Producto[], id: string) {
  return productos.find((product) => product.id === id)?.nombre ?? "Producto";
}

function clientName(clientes: ReturnType<typeof useTahonaStore.getState>["clientes"], id: string) {
  const client = clientes.find((item) => item.id === id);
  return client ? `${client.nombre} ${client.apellido}` : "Cliente";
}

function todaysDeliveries(entregas: Entrega[]) {
  return entregas.filter((entrega) => entrega.fecha === today);
}

export function OperatorPage({
  view,
  id
}: {
  view:
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
  id?: string;
}) {
  const store = useTahonaStore();
  if (view === "hoy") return <TodayDashboard />;
  if (view === "produccion") return <ProductionToday />;
  if (view === "produccion-semanal") return <WeeklyProduction />;
  if (view === "carga") return <LockerLoading />;
  if (view === "casilleros") return <LockerStatus />;
  if (view === "entrega") return <DeliveryDetail id={id ?? store.entregas[0].id} />;
  if (view === "suscripciones") return <SubscriptionsTable />;
  if (view === "suscripcion") return <SubscriptionDetail id={id ?? "sub-cl-001"} />;
  if (view === "pedidos") return <OrdersToday />;
  if (view === "pedidos-extra") return <ExtraOrders />;
  if (view === "cobros") return <ChargesToday />;
  if (view === "reintentos") return <RetryCharges />;
  if (view === "conciliacion") return <Reconciliation />;
  if (view === "catalogo") return <CatalogAdmin />;
  if (view === "hubs") return <HubsAdmin />;
  if (view === "equipo") return <TeamAdmin />;
  if (view === "incidencias") return <Incidents />;
  return <BusinessSettings />;
}

function TodayDashboard() {
  const { entregas, incidencias, cobros, hubs } = useTahonaStore();
  const todayItems = todaysDeliveries(entregas);
  const delivered = todayItems.filter((item) => item.estado === "entregado").length;
  const pending = todayItems.filter((item) => item.estado === "listo").length;
  const activeIncidents = incidencias.filter((item) => item.estado !== "resuelta").length;
  const todayRevenue = cobros
    .filter((item) => item.fecha === today && item.estado === "cobrado")
    .reduce((sum, item) => sum + item.monto, 0);

  return (
    <PageShell eyebrow="Operación" title="Sala de control del día">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Pedidos programados" value={String(todayItems.length)} helper="3 ventanas de retiro" icon={ClipboardList} tone="warm" />
        <MetricCard label="Listos para retirar" value={String(pending)} helper={`${delivered} ya entregados`} icon={CheckCircle2} tone="green" />
        <MetricCard label="Incidencias abiertas" value={String(activeIncidents)} helper="Resolver antes de 24 h" icon={AlertTriangle} tone="gold" />
        <MetricCard label="Cobrado hoy" value={formatCurrency(todayRevenue)} helper="Corte automático" icon={Banknote} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden border-tahona-coffee/20 bg-tahona-masa shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-red">
                  Ritmo de entrega
                </p>
                <h2 className="mt-2 text-2xl font-black text-tahona-coffee">Slots activos</h2>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/operador/pedidos">Ver pedidos</Link>
              </Button>
            </div>
            <div className="mt-6 space-y-4">
              {operatorSlots.map((slot) => {
                const count = todayItems.filter((item) => item.slot === slot).length;
                const ready = todayItems.filter((item) => item.slot === slot && item.estado === "listo").length;
                return (
                  <div key={slot} className="rounded-lg border border-tahona-coffee/15 bg-tahona-cream p-4">
                    <div className="flex items-center justify-between gap-4 text-sm font-black text-tahona-coffee">
                      <span className="text-xl">{slot}</span>
                      <span>{count} pedidos · {ready} listos</span>
                    </div>
                    <ProgressBar value={(count / 18) * 100} className="mt-3" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card className="border-tahona-coffee/20 bg-tahona-coffee text-tahona-cream shadow-editorial">
          <CardContent className="p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-yellow">
              Prioridad de piso
            </p>
            <h2 className="mt-2 text-2xl font-black">Carga por hub</h2>
            <div className="mt-5 space-y-3">
              {hubs.map((hub) => (
                <Link
                  key={hub.id}
                  href="/operador/carga"
                  className="block rounded-md border border-tahona-yellow/25 bg-tahona-cream/8 p-4 transition-colors hover:bg-tahona-yellow hover:text-tahona-coffee"
                >
                  <p className="font-black">{hub.nombre}</p>
                  <p className="mt-1 text-sm opacity-75">
                    {hub.casilleros_ocupados_actual}/{hub.casilleros_total} casilleros ocupados
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
function ProductionToday() {
  const { entregas, productos, hubs } = useTahonaStore();
  const todayItems = todaysDeliveries(entregas);
  const rows = useMemo(() => {
    return productos.map((producto) => {
      const slotTotals = hubs.flatMap((hub) =>
        operatorSlots.map((slot) => {
          const total = todayItems
            .filter((entrega) => entrega.hub_id === hub.id && entrega.slot === slot)
            .flatMap((entrega) => entrega.productos)
            .filter((item) => item.producto_id === producto.id)
            .reduce((sum, item) => sum + item.cantidad, 0);
          return { key: `${hub.id}-${slot}`, hub, slot, total };
        })
      );
      return { producto, slotTotals, total: slotTotals.reduce((sum, item) => sum + item.total, 0) };
    });
  }, [hubs, productos, todayItems]);
  const totalPieces = rows.reduce((sum, row) => sum + row.total, 0);

  return (
    <PageShell eyebrow="Producción" title="Matriz de producción del día">
      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-stretch">
        <Card className="bg-tahona-yellow text-tahona-coffee">
          <CardContent className="p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em]">Piezas totales</p>
            <p className="mt-3 text-4xl font-black">{totalPieces}</p>
          </CardContent>
        </Card>
        <Card className="bg-tahona-pink text-tahona-coffee">
          <CardContent className="p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em]">SKU activos</p>
            <p className="mt-3 text-4xl font-black">{rows.filter((row) => row.total > 0).length}</p>
          </CardContent>
        </Card>
        <Button className="h-full min-h-24 px-6" variant="secondary">
          <Download className="h-4 w-4" /> Exportar hoja de horno
        </Button>
      </div>
      <Card className="overflow-hidden border-tahona-coffee/20 bg-tahona-masa shadow-soft">
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[1180px] text-sm">
            <thead className="border-b border-tahona-coffee/15 bg-tahona-coffee text-left text-tahona-cream">
              <tr>
                <th className="sticky left-0 z-10 bg-tahona-coffee p-4">SKU</th>
                {hubs.flatMap((hub) =>
                  operatorSlots.map((slot) => (
                    <th key={`${hub.id}-${slot}`} className="p-4">
                      <span className="block font-black">{hub.nombre.replace("Hub ", "")}</span>
                      <span className="text-xs opacity-70">{slot}</span>
                    </th>
                  ))
                )}
                <th className="p-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.producto.id} className="border-b border-tahona-coffee/10 last:border-0">
                  <td className="sticky left-0 bg-tahona-masa p-4 font-black text-tahona-coffee">
                    {row.producto.nombre}
                  </td>
                  {row.slotTotals.map((item) => (
                    <td key={item.key} className="p-4">
                      <span className={item.total > 0 ? "font-black text-tahona-coffee" : "text-tahona-coffee/30"}>
                        {item.total}
                      </span>
                    </td>
                  ))}
                  <td className="p-4 text-lg font-black text-tahona-red">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </PageShell>
  );
}

function WeeklyProduction() {
  const data = [
    ["Lun", 184],
    ["Mar", 212],
    ["Mié", 198],
    ["Jue", 225],
    ["Vie", 264],
    ["Sáb", 318],
    ["Dom", 276]
  ] as const;
  return (
    <PageShell eyebrow="Planeación" title="Producción semanal">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Tendencia por día</h2>
            <div className="mt-8 flex h-72 items-end gap-4">
              {data.map(([day, value]) => (
                <div key={day} className="flex flex-1 flex-col items-center gap-3">
                  <div className="w-full rounded-t-md bg-secondary" style={{ height: `${(value / 340) * 100}%` }} />
                  <span className="text-sm font-semibold">{day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Notas de planeación</h2>
            <div className="mt-5 space-y-3 text-sm text-muted-foreground">
              <p>Viernes y sábado concentran demanda de hojaldres y pan dulce.</p>
              <p>Polanco requiere 12% más baguette que Del Valle en la ventana de 7:30 PM.</p>
              <p>Recomendación: producir 6% de colchón solo en bolillo y telera.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

function LockerLoading() {
  const { hubs, casilleros, entregas, clientes, productos } = useTahonaStore();
  const [hubId, setHubId] = useState(hubs[0].id);
  const hubLockers = casilleros.filter((casillero) => casillero.hub_id === hubId);
  const hub = hubs.find((item) => item.id === hubId) ?? hubs[0];
  const queue = todaysDeliveries(entregas).filter((entrega) => entrega.hub_id === hubId);
  const loaded = hubLockers.filter((locker) => locker.estado === "cargado").length;
  const incidents = hubLockers.filter((locker) => locker.estado === "incidencia").length;
  const occupied = hubLockers.filter((locker) => locker.estado !== "vacio").length;
  return (
    <PageShell eyebrow="Casilleros" title="Carga de casilleros">
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {hubs.map((item) => {
          const active = hubId === item.id;
          const hubItems = casilleros.filter((locker) => locker.hub_id === item.id);
          const hubOccupied = hubItems.filter((locker) => locker.estado !== "vacio").length;
          return (
            <button
              key={item.id}
              onClick={() => setHubId(item.id)}
              className={`rounded-lg border p-4 text-left shadow-soft transition-colors ${
                active
                  ? "border-tahona-coffee bg-tahona-coffee text-tahona-yellow"
                  : "border-tahona-coffee/15 bg-tahona-masa text-tahona-coffee hover:bg-tahona-yellow"
              }`}
            >
              <p className="text-xs font-black uppercase tracking-[0.16em] opacity-70">Hub</p>
              <h2 className="mt-2 text-2xl font-black">{item.nombre.replace("Hub ", "")}</h2>
              <p className="mt-2 text-sm font-semibold opacity-75">{hubOccupied}/{item.casilleros_total} casilleros con actividad</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <MetricCard label="Ocupación" value={`${occupied}/${hub.casilleros_total}`} helper={hub.nombre} icon={Box} tone="gold" />
            <MetricCard label="Cargados" value={String(loaded)} helper="Listos para retiro" icon={CheckCircle2} tone="green" />
            <MetricCard label="Incidencias" value={String(incidents)} helper="Requieren revisión" icon={AlertTriangle} tone="warm" />
          </div>
          <LockerGrid lockers={hubLockers} entregas={entregas} clientes={clientes} productos={productos} showDetails />
        </div>

        <aside className="h-fit rounded-lg bg-tahona-coffee p-5 text-tahona-cream shadow-editorial xl:sticky xl:top-24">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-yellow">Cola de carga</p>
          <h2 className="mt-3 text-3xl font-black">{queue.length} pedidos</h2>
          <div className="mt-5 space-y-3">
            {queue.slice(0, 8).map((entrega) => (
              <Link
                key={entrega.id}
                href={`/operador/entregas/${entrega.id}`}
                className="block rounded-md border border-tahona-yellow/20 bg-tahona-cream/8 p-4 transition-colors hover:bg-tahona-yellow hover:text-tahona-coffee"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black">{clientName(clientes, entrega.cliente_id)}</p>
                    <p className="mt-1 text-xs font-semibold opacity-75">{entrega.slot} · Casillero {entrega.casillero_id.slice(-2)}</p>
                  </div>
                  <StatusBadge status={entrega.estado} />
                </div>
                <p className="mt-3 line-clamp-2 text-sm opacity-75">
                  {entrega.productos.map((item) => `${item.cantidad}x ${productName(productos, item.producto_id)}`).join(", ")}
                </p>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

function LockerStatus() {
  const { hubs, casilleros, entregas, clientes, productos } = useTahonaStore();
  return (
    <PageShell eyebrow="Tiempo real" title="Estado de casilleros">
      <div className="mb-6 grid gap-3 md:grid-cols-4">
        {[
          ["Vacío", "Disponible para siguiente carga", "bg-tahona-cream"],
          ["Cargado", "Listo para retiro", "bg-tahona-yellow"],
          ["Retirado", "Bolsa entregada", "bg-tahona-nopal text-white"],
          ["Incidencia", "Requiere operador", "bg-tahona-red text-white"]
        ].map(([label, helper, className]) => (
          <div key={label} className="rounded-lg border border-tahona-coffee/15 bg-tahona-masa p-4">
            <span className={`inline-flex h-8 w-8 rounded-md border border-tahona-coffee/15 ${className}`} />
            <p className="mt-3 font-black text-tahona-coffee">{label}</p>
            <p className="mt-1 text-xs font-semibold text-tahona-coffee/60">{helper}</p>
          </div>
        ))}
      </div>
      <div className="space-y-8">
        {hubs.map((hub) => (
          <section key={hub.id} className="rounded-lg border border-tahona-coffee/15 bg-tahona-masa p-4 shadow-soft">
            <div className="mb-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-red">Red de retiro</p>
                <h2 className="mt-1 text-2xl font-black text-tahona-coffee">{hub.nombre}</h2>
              </div>
              <div className="min-w-[220px] rounded-md bg-tahona-cream p-3">
                <div className="flex justify-between text-sm font-black text-tahona-coffee">
                  <span>Ocupación</span>
                  <span>{hub.casilleros_ocupados_actual}/{hub.casilleros_total}</span>
                </div>
                <ProgressBar value={(hub.casilleros_ocupados_actual / hub.casilleros_total) * 100} className="mt-2" />
              </div>
            </div>
            <LockerGrid lockers={casilleros.filter((casillero) => casillero.hub_id === hub.id)} entregas={entregas} clientes={clientes} productos={productos} />
          </section>
        ))}
      </div>
    </PageShell>
  );
}

const lockerStateClass: Record<CasilleroEstado, string> = {
  vacio: "border-tahona-coffee/15 bg-tahona-cream text-tahona-coffee/45",
  cargado: "border-tahona-coffee/20 bg-tahona-yellow text-tahona-coffee",
  retirado: "border-tahona-nopal bg-tahona-nopal text-white",
  incidencia: "border-tahona-red bg-tahona-red text-white"
};

const lockerStateLabel: Record<CasilleroEstado, string> = {
  vacio: "Vacío",
  cargado: "Cargado",
  retirado: "Retirado",
  incidencia: "Incidencia"
};

function LockerGrid({
  lockers,
  entregas,
  clientes,
  productos,
  showDetails = false
}: {
  lockers: Casillero[];
  entregas: Entrega[];
  clientes: ReturnType<typeof useTahonaStore.getState>["clientes"];
  productos: Producto[];
  showDetails?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6">
      {lockers.map((locker) => {
        const entrega = entregas.find((item) => item.id === locker.pedido_actual);
        return (
          <div
            key={locker.id}
            className={`min-h-[150px] rounded-lg border p-3 shadow-soft ${lockerStateClass[locker.estado]}`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-display text-4xl font-semibold leading-none">
                {String(locker.numero).padStart(2, "0")}
              </span>
              <span className="rounded-full bg-white/70 px-2 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-tahona-coffee">
                {lockerStateLabel[locker.estado]}
              </span>
            </div>
            {entrega ? (
              <div className="mt-5 text-sm">
                <p className="font-black leading-tight">{clientName(clientes, entrega.cliente_id)}</p>
                <p className="mt-1 font-semibold opacity-75">{entrega.slot}</p>
                {showDetails ? (
                  <>
                    <p className="mt-3 line-clamp-2 text-xs font-semibold opacity-75">
                      {entrega.productos.map((item) => `${item.cantidad} ${productName(productos, item.producto_id)}`).join(", ")}
                    </p>
                    <Button asChild size="sm" className="mt-3 w-full">
                      <Link href={`/operador/entregas/${entrega.id}`}>Actualizar</Link>
                    </Button>
                  </>
                ) : null}
              </div>
            ) : (
              <p className="mt-6 text-sm font-semibold opacity-70">
                {locker.estado === "vacio"
                  ? "Disponible"
                  : locker.estado === "cargado"
                    ? "Carga en validación"
                    : locker.estado === "retirado"
                      ? "Liberado por retiro"
                      : "Revisión de cerradura"}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DeliveryDetail({ id }: { id: string }) {
  const { entregas, clientes, productos, markDelivery } = useTahonaStore();
  const entrega = entregas.find((item) => item.id === id) ?? entregas[0];
  return (
    <PageShell eyebrow="Entrega individual" title={entrega.id}>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Cliente</p>
              <h2 className="mt-1 text-3xl font-semibold">{clientName(clientes, entrega.cliente_id)}</h2>
              <p className="mt-3 text-muted-foreground">{shortDate(entrega.fecha)} · {entrega.slot} · casillero {entrega.casillero_id.slice(-2)}</p>
            </div>
            <StatusBadge status={entrega.estado} />
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {entrega.productos.map((item) => (
              <div key={item.producto_id} className="rounded-md border bg-background p-3">
                <p className="font-semibold">{productName(productos, item.producto_id)}</p>
                <p className="text-sm text-muted-foreground">Cantidad {item.cantidad}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => markDelivery(entrega.id, "entregado")}>Entregado</Button>
            <Button variant="outline" onClick={() => markDelivery(entrega.id, "no_entregado")}>No entregado</Button>
            <Button variant="secondary" onClick={() => markDelivery(entrega.id, "incidencia")}>Incidencia</Button>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}

function SubscriptionsTable() {
  const { suscripciones, clientes, hubs } = useTahonaStore();
  const [query, setQuery] = useState("");
  const visible = suscripciones
    .filter((subscription) => clientName(clientes, subscription.cliente_id).toLowerCase().includes(query.toLowerCase()))
    .slice(0, 18);
  return (
    <PageShell eyebrow="Clientes" title="Suscripciones">
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px_160px]">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cliente" />
        <select className="rounded-md border bg-background px-3 text-sm">
          <option>Todos los hubs</option>
          {hubs.map((hub) => <option key={hub.id}>{hub.nombre}</option>)}
        </select>
        <Button variant="outline"><Search className="h-4 w-4" /> Filtrar</Button>
      </div>
      <SimpleTable
        headers={["Cliente", "Estado", "Próxima entrega", "Acciones"]}
        rows={visible.map((subscription) => [
          clientName(clientes, subscription.cliente_id),
          <StatusBadge key="s" status={subscription.estado} />,
          shortDate(subscription.proxima_entrega),
          <Button key="b" asChild size="sm" variant="outline"><Link href={`/operador/suscripciones/${subscription.id}`}>Abrir</Link></Button>
        ])}
      />
    </PageShell>
  );
}

function SubscriptionDetail({ id }: { id: string }) {
  const { suscripciones, clientes, entregas, cobros, productos, pauseSubscription, reactivateSubscription } = useTahonaStore();
  const subscription = suscripciones.find((item) => item.id === id) ?? suscripciones[0];
  const client = clientes.find((item) => item.id === subscription.cliente_id) ?? clientes[0];
  return (
    <PageShell eyebrow="Ficha de cliente" title={`${client.nombre} ${client.apellido}`}>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardContent className="p-6">
            <StatusBadge status={subscription.estado} />
            <p className="mt-5 text-sm text-muted-foreground">{client.email}</p>
            <p className="mt-1 text-sm text-muted-foreground">{client.telefono}</p>
            <p className="mt-1 text-sm text-muted-foreground">{client.direccion}, {client.colonia}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => pauseSubscription(subscription.id, 2)}>Pausar</Button>
              <Button size="sm" variant="outline" onClick={() => reactivateSubscription(subscription.id)}>Reactivar</Button>
              <Button size="sm" variant="secondary">Contactar</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Pedido semanal</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {subscription.productos.map((item) => (
                <div key={item.producto_id} className="rounded-md border bg-background p-3">
                  <p className="font-semibold">{productName(productos, item.producto_id)}</p>
                  <p className="text-sm text-muted-foreground">Cantidad {item.cantidad}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <MiniHistory title="Entregas" items={entregas.filter((item) => item.cliente_id === client.id).slice(0, 5).map((item) => `${shortDate(item.fecha)} · ${item.estado}`)} />
        <MiniHistory title="Pagos" items={cobros.filter((item) => item.cliente_id === client.id).slice(0, 5).map((item) => `${shortDate(item.fecha)} · ${formatCurrency(item.monto)} · ${item.estado}`)} />
      </div>
    </PageShell>
  );
}

function OrdersToday() {
  const { entregas, clientes, productos, hubs } = useTahonaStore();
  const todayItems = todaysDeliveries(entregas);
  const totalProducts = todayItems
    .flatMap((item) => item.productos)
    .reduce((sum, item) => sum + item.cantidad, 0);
  return (
    <PageShell eyebrow="Pedidos" title="Pedidos del día">
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="bg-tahona-coffee text-tahona-cream shadow-editorial">
          <CardContent className="p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-tahona-yellow">
              Cola de hoy
            </p>
            <p className="mt-3 text-4xl font-black">{todayItems.length}</p>
            <p className="mt-1 text-sm opacity-75">pedidos asignados a casillero</p>
          </CardContent>
        </Card>
        <Card className="bg-tahona-yellow text-tahona-coffee">
          <CardContent className="p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em]">Piezas a empacar</p>
            <p className="mt-3 text-4xl font-black">{totalProducts}</p>
            <p className="mt-1 text-sm font-semibold opacity-75">sumadas desde suscripciones</p>
          </CardContent>
        </Card>
        <Card className="bg-tahona-pink text-tahona-coffee">
          <CardContent className="p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em]">Hubs activos</p>
            <p className="mt-3 text-4xl font-black">{hubs.length}</p>
            <p className="mt-1 text-sm font-semibold opacity-75">Polanco, Condesa y Del Valle</p>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        {["7:00 AM", "1:30 PM", "7:30 PM"].map((slot) => (
          <OrderSlot
            key={slot}
            slot={slot}
            items={todayItems.filter((item) => item.slot === slot)}
            clientes={clientes}
            productos={productos}
            hubs={hubs}
          />
        ))}
      </div>
    </PageShell>
  );
}

function OrderSlot({
  slot,
  items,
  clientes,
  productos,
  hubs
}: {
  slot: string;
  items: Entrega[];
  clientes: ReturnType<typeof useTahonaStore.getState>["clientes"];
  productos: Producto[];
  hubs: ReturnType<typeof useTahonaStore.getState>["hubs"];
}) {
  return (
    <Card className="overflow-hidden border-tahona-coffee/20 bg-tahona-masa shadow-soft">
      <CardContent className="p-0">
        <div className="flex flex-col justify-between gap-3 border-b border-tahona-coffee/15 bg-tahona-pink px-5 py-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-tahona-red">
              Ventana de retiro
            </p>
            <h2 className="mt-1 text-2xl font-black text-tahona-coffee">{slot}</h2>
          </div>
          <Badge className="bg-tahona-coffee text-tahona-yellow">{items.length} pedidos</Badge>
        </div>
        <div className="divide-y divide-tahona-coffee/10">
          {items.map((item, index) => {
            const hub = hubs.find((entry) => entry.id === item.hub_id);
            return (
              <div key={item.id} className="grid gap-4 px-5 py-4 lg:grid-cols-[72px_1.1fr_1fr_0.9fr_auto] lg:items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-tahona-coffee text-lg font-black text-tahona-yellow">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <p className="font-black text-tahona-coffee">{clientName(clientes, item.cliente_id)}</p>
                  <p className="text-sm font-semibold text-tahona-coffee/60">{hub?.nombre ?? item.hub_id}</p>
                </div>
                <div className="text-sm font-medium text-tahona-coffee/72">
                  {item.productos
                    .map((product) => `${product.cantidad}x ${productName(productos, product.producto_id)}`)
                    .join(", ")}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">Casillero {item.casillero_id.slice(-2)}</Badge>
                  <StatusBadge status={item.estado} />
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/operador/entregas/${item.id}`}>Actualizar</Link>
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ExtraOrders() {
  const rows = [
    ["extra-001", "Regina Mijares", "Hub Condesa", "Croissant x2", "Antes de cutoff"],
    ["extra-002", "Tomás Robles", "Hub Polanco", "Baguette x1", "Capacidad confirmada"],
    ["extra-003", "Lucía Aguirre", "Hub Del Valle", "Focaccia x1", "Pago pendiente"]
  ];
  return (
    <PageShell eyebrow="Pedidos" title="Pedidos extra">
      <SimpleTable headers={["ID", "Cliente", "Hub", "Producto", "Estado"]} rows={rows} />
    </PageShell>
  );
}

function ChargesToday() {
  const { cobros } = useTahonaStore();
  const dayCharges = cobros.filter((item) => item.fecha === today || item.fecha === "2026-06-14");
  const total = dayCharges.reduce((sum, item) => sum + item.monto, 0);
  return (
    <PageShell eyebrow="Cobros" title="Cobros del día">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Total procesado" value={formatCurrency(total)} icon={CreditCard} />
        <MetricCard label="Pendientes" value={String(dayCharges.filter((item) => item.estado === "pendiente").length)} icon={RefreshCw} tone="gold" />
        <MetricCard label="Fallidos" value={String(dayCharges.filter((item) => item.estado === "fallido").length)} icon={AlertTriangle} tone="warm" />
      </div>
      <div className="mt-6 grid gap-3">
        {dayCharges.slice(0, 12).map((cobro) => (
          <div key={cobro.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
            <div>
              <p className="font-semibold">{formatCurrency(cobro.monto)}</p>
              <p className="text-sm text-muted-foreground">{cobro.metodo}</p>
            </div>
            <StatusBadge status={cobro.estado} />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function RetryCharges() {
  const { cobros, clientes, retryCharge } = useTahonaStore();
  const retryQueue = cobros.filter((item) => item.estado !== "cobrado").slice(0, 20);
  return (
    <PageShell eyebrow="Cobros" title="Reintentos de cobro">
      <div className="space-y-3">
        {retryQueue.map((cobro) => (
          <div key={cobro.id} className="flex flex-col justify-between gap-3 rounded-lg border bg-card p-4 md:flex-row md:items-center">
            <div>
              <p className="font-semibold">{clientName(clientes, cobro.cliente_id)} · {formatCurrency(cobro.monto)}</p>
              <p className="text-sm text-muted-foreground">{cobro.reintentos} reintento(s)</p>
            </div>
            <Button size="sm" onClick={() => retryCharge(cobro.id)}>Reintentar</Button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function Reconciliation() {
  const rows = [
    ["Lote 07:00", formatCurrency(18420), formatCurrency(18420), "Cuadrado"],
    ["Lote 13:30", formatCurrency(21680), formatCurrency(21440), "Diferencia $240"],
    ["Lote 19:30", formatCurrency(19890), formatCurrency(19890), "Cuadrado"]
  ];
  return (
    <PageShell eyebrow="Cobros" title="Conciliación">
      <SimpleTable headers={["Lote", "Tahona", "Procesador", "Estado"]} rows={rows} />
    </PageShell>
  );
}

function CatalogAdmin() {
  const { productos } = useTahonaStore();
  return (
    <PageShell eyebrow="Admin" title="Catálogo">
      <div className="mb-5 flex justify-end">
        <Button><Wheat className="h-4 w-4" /> Crear producto</Button>
      </div>
      <SimpleTable
        headers={["Producto", "Categoría", "Precio", "Disponibilidad", "Acciones"]}
        rows={productos.map((product) => [
          product.nombre,
          product.categoria,
          formatCurrency(product.precio_mxn),
          product.disponibilidad.slice(0, 3).join(", "),
          <Button key="edit" size="sm" variant="outline">Editar</Button>
        ])}
      />
    </PageShell>
  );
}

function HubsAdmin() {
  const { hubs } = useTahonaStore();
  return (
    <PageShell eyebrow="Admin" title="Hubs y casilleros">
      <div className="grid gap-5 md:grid-cols-3">
        {hubs.map((hub) => (
          <Card key={hub.id}>
            <CardContent className="p-5">
              <h2 className="text-xl font-semibold">{hub.nombre}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{hub.direccion}</p>
              <ProgressBar value={(hub.casilleros_ocupados_actual / hub.casilleros_total) * 100} className="mt-5" />
              <p className="mt-3 text-sm font-semibold">{hub.casilleros_ocupados_actual}/{hub.casilleros_total} casilleros ocupados</p>
              <Button className="mt-5 w-full" variant="outline">Editar hub</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

function TeamAdmin() {
  const rows = [
    ["Lucía Mijares", "Gerente de hub", "Polanco", "Activo"],
    ["Rodrigo Salcedo", "Gerente de hub", "Condesa", "Activo"],
    ["Mariana Obregón", "Gerente de hub", "Del Valle", "Activo"],
    ["Claudia Rangel", "Admin", "Operación", "Activo"]
  ];
  return (
    <PageShell eyebrow="Admin" title="Equipo">
      <div className="mb-5 flex justify-end">
        <Button><Users className="h-4 w-4" /> Invitar usuario</Button>
      </div>
      <SimpleTable headers={["Nombre", "Rol", "Base", "Estado"]} rows={rows} />
    </PageShell>
  );
}

function Incidents() {
  const { incidencias, clientes, resolveIncident } = useTahonaStore();
  return (
    <PageShell eyebrow="Operación" title="Incidencias">
      <div className="space-y-3">
        {incidencias.slice(0, 24).map((incidencia) => (
          <Card key={incidencia.id}>
            <CardContent className="flex flex-col justify-between gap-4 p-4 md:flex-row md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{incidencia.tipo.replaceAll("_", " ")}</Badge>
                  <StatusBadge status={incidencia.estado} />
                </div>
                <p className="mt-2 font-semibold">{clientName(clientes, incidencia.cliente_id)}</p>
                <p className="text-sm text-muted-foreground">{incidencia.descripcion}</p>
              </div>
              <Button size="sm" onClick={() => resolveIncident(incidencia.id)}>Resolver</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

function BusinessSettings() {
  const settings = [
    ["Cutoff diario", "22:00"],
    ["Pedido extra mínimo", "$120 MXN"],
    ["Granularidad de cambios", "Semanal"],
    ["Corte de cobro", "Lunes 06:00"],
    ["Reintentos", "3 intentos / 48 horas"],
    ["Incidencias", "Resolver antes de 24 horas"]
  ];
  return (
    <PageShell eyebrow="Admin" title="Configuración del negocio">
      <div className="grid gap-4 md:grid-cols-2">
        {settings.map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-5">
              <p className="text-sm font-semibold text-muted-foreground">{label}</p>
              <Input defaultValue={value} className="mt-3" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Textarea className="mt-5" defaultValue="Política de incidencias: contacto inmediato al cliente, registro de causa raíz y compensación cuando aplique." />
      <Button className="mt-5"><Settings className="h-4 w-4" /> Guardar parámetros</Button>
    </PageShell>
  );
}

function MiniHistory({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardContent className="p-5">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="mt-4 space-y-2">
          {items.map((item, index) => (
            <div key={`${item}-${index}`} className="rounded-md border bg-background p-3 text-sm">
              {item}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: Array<Array<React.ReactNode>> }) {
  return (
    <Card>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b bg-muted/60 text-left">
            <tr>
              {headers.map((header) => (
                <th key={header} className="p-4 font-semibold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b last:border-0">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="p-4">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

