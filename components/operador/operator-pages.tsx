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
import type { Casillero, Entrega, Producto, Suscripcion } from "@/lib/mock-data";
import { formatCurrency, shortDate } from "@/lib/utils";

const today = "2026-06-15";

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
    <div className="px-4 py-8 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>
          <h1 className="mt-2 font-display text-5xl font-semibold leading-none">{title}</h1>
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
    <PageShell eyebrow="Operación" title="Dashboard del día">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Pedidos a producir" value={String(todayItems.length)} helper="Ventanas de hoy" icon={ClipboardList} tone="warm" />
        <MetricCard label="Entregados" value={String(delivered)} helper={`${pending} listos en casillero`} icon={CheckCircle2} tone="green" />
        <MetricCard label="Incidencias activas" value={String(activeIncidents)} helper="Prioridad operacional" icon={AlertTriangle} tone="gold" />
        <MetricCard label="Cobrado hoy" value={formatCurrency(todayRevenue)} helper="Corte automático" icon={Banknote} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Próximos slots</h2>
            <div className="mt-5 space-y-4">
              {["7:00 AM", "1:30 PM", "7:30 PM"].map((slot) => {
                const count = todayItems.filter((item) => item.slot === slot).length;
                return (
                  <div key={slot}>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>{slot}</span>
                      <span>{count} pedidos</span>
                    </div>
                    <ProgressBar value={(count / 18) * 100} className="mt-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">Alertas</h2>
            <div className="mt-4 space-y-3">
              {hubs.map((hub) => (
                <div key={hub.id} className="rounded-md border bg-background p-3">
                  <p className="font-semibold">{hub.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    {hub.casilleros_ocupados_actual}/{hub.casilleros_total} casilleros ocupados
                  </p>
                </div>
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
  const rows = useMemo(() => {
    return productos.map((producto) => {
      const byHub = hubs.map((hub) => {
        const total = todaysDeliveries(entregas)
          .filter((entrega) => entrega.hub_id === hub.id)
          .flatMap((entrega) => entrega.productos)
          .filter((item) => item.producto_id === producto.id)
          .reduce((sum, item) => sum + item.cantidad, 0);
        return { hub, total };
      });
      return { producto, byHub, total: byHub.reduce((sum, item) => sum + item.total, 0) };
    });
  }, [entregas, hubs, productos]);
  return (
    <PageShell eyebrow="Producción" title="Producción del día">
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b bg-muted/60 text-left">
              <tr>
                <th className="p-4">SKU</th>
                {hubs.map((hub) => (
                  <th key={hub.id} className="p-4">{hub.nombre}</th>
                ))}
                <th className="p-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.producto.id} className="border-b last:border-0">
                  <td className="p-4 font-semibold">{row.producto.nombre}</td>
                  {row.byHub.map((item) => (
                    <td key={item.hub.id} className="p-4">{item.total}</td>
                  ))}
                  <td className="p-4 font-bold">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      <Button className="mt-5" variant="secondary">
        <Download className="h-4 w-4" /> Exportar a impresora
      </Button>
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
  return (
    <PageShell eyebrow="Casilleros" title="Carga de casilleros">
      <div className="mb-5 flex flex-wrap gap-2">
        {hubs.map((hub) => (
          <Button key={hub.id} variant={hubId === hub.id ? "default" : "outline"} onClick={() => setHubId(hub.id)}>
            {hub.nombre}
          </Button>
        ))}
      </div>
      <LockerGrid lockers={hubLockers} entregas={entregas} clientes={clientes} productos={productos} showDetails />
    </PageShell>
  );
}

function LockerStatus() {
  const { hubs, casilleros, entregas, clientes, productos } = useTahonaStore();
  return (
    <PageShell eyebrow="Tiempo real" title="Estado de casilleros">
      <div className="space-y-8">
        {hubs.map((hub) => (
          <div key={hub.id}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{hub.nombre}</h2>
              <Badge variant="soft">{hub.casilleros_ocupados_actual}/24 ocupados</Badge>
            </div>
            <LockerGrid lockers={casilleros.filter((casillero) => casillero.hub_id === hub.id)} entregas={entregas} clientes={clientes} productos={productos} />
          </div>
        ))}
      </div>
    </PageShell>
  );
}

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
  const color = {
    vacio: "bg-muted",
    cargado: "bg-tahona-maiz",
    retirado: "bg-tahona-nopal text-white",
    incidencia: "bg-secondary text-white"
  };
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {lockers.map((locker) => {
        const entrega = entregas.find((item) => item.id === locker.pedido_actual);
        return (
          <Card key={locker.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className={`rounded-md px-3 py-2 text-sm font-bold ${color[locker.estado]}`}>
                  {locker.numero}
                </span>
                <StatusBadge status={locker.estado} />
              </div>
              {showDetails && entrega ? (
                <div className="mt-4 text-sm">
                  <p className="font-semibold">{clientName(clientes, entrega.cliente_id)}</p>
                  <p className="mt-1 text-muted-foreground">
                    {entrega.productos.map((item) => `${item.cantidad} ${productName(productos, item.producto_id)}`).join(", ")}
                  </p>
                  <Button asChild size="sm" className="mt-3">
                    <Link href={`/operador/entregas/${entrega.id}`}>Marcar</Link>
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
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
  const { entregas, clientes } = useTahonaStore();
  const todayItems = todaysDeliveries(entregas);
  return (
    <PageShell eyebrow="Pedidos" title="Pedidos del día">
      <div className="space-y-6">
        {["7:00 AM", "1:30 PM", "7:30 PM"].map((slot) => (
          <MiniHistory
            key={slot}
            title={slot}
            items={todayItems.filter((item) => item.slot === slot).map((item) => `${clientName(clientes, item.cliente_id)} · casillero ${item.casillero_id.slice(-2)} · ${item.estado}`)}
          />
        ))}
      </div>
    </PageShell>
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
