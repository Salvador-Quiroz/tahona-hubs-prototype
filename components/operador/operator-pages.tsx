"use client";

import type { ReactNode } from "react";
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
  Wheat
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
  const { entregas, incidencias, cobros, casilleros, hubs, clientes, productos } = useTahonaStore();
  const todayDeliveries = entregas.filter((item) => item.fecha === today);
  const ready = todayDeliveries.filter((item) => item.estado === "listo").length;
  const incidents = incidencias.filter((item) => item.estado !== "resuelta");
  const failedCharges = cobros.filter((item) => item.estado === "fallido");
  const failedAmount = failedCharges.reduce((sum, item) => sum + item.monto, 0);
  const occupied = casilleros.filter((item) => item.estado === "cargado" || item.estado === "incidencia").length;
  const totalLockers = hubs.reduce((sum, hub) => sum + hub.casilleros_total, 0);

  const columns: Array<DataTableColumn<Entrega>> = [
    { key: "slot", header: "Slot", render: (row) => <span className="font-mono font-semibold">{row.slot}</span> },
    { key: "cliente", header: "Cliente", render: (row) => clientName(clientes, row.cliente_id) },
    { key: "hub", header: "Hub", render: (row) => hubName(hubs, row.hub_id) },
    { key: "productos", header: "Pedido", render: (row) => row.productos.map((item) => `${item.cantidad}x ${productName(productos, item.producto_id)}`).join(", ") },
    { key: "estado", header: "Estado", render: (row) => <StatusPill tone={deliveryTone(row.estado)} label={row.estado.replaceAll("_", " ")} /> },
    { key: "accion", header: "", align: "right", render: (row) => <Button asChild size="sm" variant="outline"><Link href={`/operador/entregas/${row.id}`}>Abrir</Link></Button> }
  ];

  return (
    <PageShell
      eyebrow="Operación diaria"
      title="Control de retiros, carga y excepciones."
      description="Vista de piso para saber qué mover ahora: pedidos listos, casilleros ocupados, incidencias y cobros que bloquean experiencia."
    >
      <div className="grid gap-sm md:grid-cols-4">
        <KpiCard label="Pedidos de hoy" value={todayDeliveries.length} helper={`${ready} listos para retirar`} icon={ClipboardList} />
        <KpiCard label="Casilleros activos" value={occupied} helper={`${totalLockers - occupied} disponibles en red`} target={`${totalLockers} totales`} icon={Boxes} />
        <KpiCard label="Incidencias abiertas" value={incidents.length} delta={incidents.length > 0 ? "requiere acción" : "sin riesgo"} deltaTone={incidents.length > 0 ? "down" : "up"} icon={AlertTriangle} />
        <KpiCard label="Cobros fallidos" value={failedCharges.length} helper={`${formatCurrency(failedAmount)} bloquean acceso`} icon={CreditCard} />
      </div>
      <div className="mt-md grid gap-md xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="shadow-sm">
          <CardHeader><CardTitle>Cola de retiros de hoy</CardTitle></CardHeader>
          <CardContent><DataTable rows={todayDeliveries.slice(0, 14)} columns={columns} getRowId={(row) => row.id} /></CardContent>
        </Card>
        <RiskQueue incidents={incidents} charges={failedCharges} />
      </div>
      <HubCapacity hubs={hubs} casilleros={casilleros} />
    </PageShell>
  );
}

function RiskQueue({ incidents, charges }: { incidents: Incidencia[]; charges: Cobro[] }) {
  return (
    <Card className="shadow-sm">
      <CardHeader><CardTitle>Prioridades</CardTitle></CardHeader>
      <CardContent className="space-y-xs">
        {incidents.slice(0, 5).map((incident) => (
          <div key={incident.id} className="rounded-md border border-danger/20 bg-danger-bg p-sm">
            <div className="flex items-center justify-between gap-sm"><StatusPill tone="danger" label={incident.estado.replaceAll("_", " ")} /><span className="text-xs text-muted-foreground">{shortDate(incident.fecha)}</span></div>
            <p className="mt-2 text-sm leading-6">{incident.descripcion}</p>
            <Button asChild size="sm" variant="outline" className="mt-sm bg-card"><Link href="/operador/incidencias">Resolver</Link></Button>
          </div>
        ))}
        {charges.slice(0, 2).map((charge) => (
          <div key={charge.id} className="rounded-md border border-warning/30 bg-warning-bg p-sm">
            <p className="text-sm font-semibold">Cobro fallido · {formatCurrency(charge.monto)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{charge.reintentos} reintentos · {shortDate(charge.fecha)}</p>
          </div>
        ))}
      </CardContent>
    </Card>
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
        return (
          <Card key={hub.id} className="">
            <CardContent className="p-md">
              <div className="flex items-start justify-between gap-sm">
                <div><p className="text-caption font-semibold uppercase text-primary">{hub.colonia}</p><h3 className="mt-1 text-h3 font-semibold">{hub.nombre}</h3></div>
                {issues > 0 ? <StatusPill tone="danger" label={`${issues} alerta`} /> : <StatusPill tone="success" label="estable" />}
              </div>
              <div className="mt-sm"><div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>Cargados</span><span>{loaded}/{hub.casilleros_total}</span></div><ProgressBar value={occupation} /></div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ProductionView({ weekly }: { weekly: boolean }) {
  const { entregas, productos, hubs } = useTahonaStore();
  const relevant = weekly ? entregas.slice(0, 126) : entregas.filter((item) => item.fecha === today);
  const rows = productos.map((product) => {
    const units = relevant.flatMap((delivery) => delivery.productos).filter((item) => item.producto_id === product.id).reduce((sum, item) => sum + item.cantidad, 0);
    return { product, units, revenue: units * product.precio_mxn };
  }).filter((row) => row.units > 0).sort((a, b) => b.units - a.units);
  const columns: Array<DataTableColumn<(typeof rows)[number]>> = [
    { key: "sku", header: "Producto", render: (row) => <div><p className="font-semibold">{row.product.nombre}</p><p className="text-xs text-muted-foreground">{row.product.categoria}</p></div> },
    { key: "units", header: "Unidades", align: "right", render: (row) => row.units },
    { key: "revenue", header: "Venta", align: "right", render: (row) => formatCurrency(row.revenue) },
    { key: "time", header: "Horneado", align: "right", render: (row) => `${row.product.tiempo_horneado_min} min` }
  ];

  return (
    <PageShell
      eyebrow={weekly ? "Producción semanal" : "Producción diaria"}
      title={weekly ? "Plan de producción por demanda acumulada." : "Producción requerida para los pedidos de hoy."}
      description="La cocina necesita volumen, tiempo y prioridad, no tarjetas decorativas. Esta vista ordena demanda por SKU y capacidad."
      actions={<Button variant="outline"><Download className="h-4 w-4" /> Exportar plan</Button>}
    >
      <div className="grid gap-sm md:grid-cols-3">
        <KpiCard label="SKUs activos" value={rows.length} icon={Wheat} helper="Con demanda confirmada" />
        <KpiCard label="Unidades" value={rows.reduce((sum, row) => sum + row.units, 0)} icon={Package} helper={weekly ? "Semana móvil" : "Hoy"} />
        <KpiCard label="Hubs destino" value={hubs.length} icon={MapPin} helper="Carga distribuida" />
      </div>
      <Card className="mt-md shadow-sm"><CardHeader><CardTitle>Plan por SKU</CardTitle></CardHeader><CardContent><DataTable rows={rows} columns={columns} getRowId={(row) => row.product.id} /></CardContent></Card>
    </PageShell>
  );
}

function LockerView({ mode }: { mode: "carga" | "casilleros" }) {
  const { casilleros, hubs, entregas, clientes } = useTahonaStore();
  const active = casilleros.filter((item) => item.estado !== "vacio");
  const incidents = casilleros.filter((item) => item.estado === "incidencia");
  return (
    <PageShell
      eyebrow={mode === "carga" ? "Carga de casilleros" : "Estado de red"}
      title={mode === "carga" ? "Asignación de pedidos a casilleros." : "Mapa operativo de casilleros."}
      description="Vista de capacidad física: cada locker tiene estado, pedido y acción. El color solo señala riesgo."
      actions={<Button asChild><Link href="/operador/pedidos">Ver pedidos</Link></Button>}
    >
      <div className="grid gap-sm md:grid-cols-3">
        <KpiCard label="Casilleros activos" value={active.length} icon={Boxes} helper="Cargados, retirados o en incidencia" />
        <KpiCard label="Incidencias" value={incidents.length} icon={AlertTriangle} delta={incidents.length ? "resolver" : "sin bloqueo"} deltaTone={incidents.length ? "down" : "up"} />
        <KpiCard label="Hubs" value={hubs.length} icon={MapPin} helper="Red operativa" />
      </div>
      <div className="mt-md grid gap-md lg:grid-cols-3">
        {hubs.map((hub) => {
          const hubLockers = casilleros.filter((locker) => locker.hub_id === hub.id);
          return (
            <Card key={hub.id} className="shadow-sm">
              <CardHeader><CardTitle>{hub.nombre}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-2">
                  {hubLockers.map((locker) => {
                    const entrega = locker.pedido_actual ? entregas.find((item) => item.id === locker.pedido_actual) : null;
                    const tone = locker.estado === "incidencia" ? "bg-danger text-white" : locker.estado === "cargado" ? "bg-primary text-white" : locker.estado === "retirado" ? "bg-success text-white" : "bg-muted text-muted-foreground";
                    return (
                      <Link key={locker.id} href={entrega ? `/operador/entregas/${entrega.id}` : "/operador/casilleros"} className={cn("flex aspect-square items-center justify-center rounded-md text-xs font-semibold", tone)} title={entrega ? clientName(clientes, entrega.cliente_id) : locker.estado}>
                        {locker.numero}
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}

function OrdersView({ extra }: { extra: boolean }) {
  const { entregas, clientes, hubs, productos } = useTahonaStore();
  const rows = extra ? entregas.filter((item) => item.estado === "no_entregado" || item.estado === "incidencia").slice(0, 30) : entregas.filter((item) => item.fecha === today);
  const columns: Array<DataTableColumn<Entrega>> = [
    { key: "fecha", header: "Fecha", render: (row) => shortDate(row.fecha) },
    { key: "cliente", header: "Cliente", render: (row) => clientName(clientes, row.cliente_id) },
    { key: "hub", header: "Hub", render: (row) => hubName(hubs, row.hub_id) },
    { key: "pedido", header: "Pedido", render: (row) => row.productos.map((item) => `${item.cantidad}x ${productName(productos, item.producto_id)}`).join(", ") },
    { key: "total", header: "Total", align: "right", render: (row) => formatCurrency(entregaTotal(productos, row)) },
    { key: "estado", header: "Estado", render: (row) => <StatusPill tone={deliveryTone(row.estado)} label={row.estado.replaceAll("_", " ")} /> }
  ];
  return (
    <PageShell eyebrow={extra ? "Pedidos extra" : "Pedidos"} title={extra ? "Pedidos fuera de flujo regular." : "Pedidos programados y trazables."} description="Listado operativo con cliente, hub, estado y monto para resolver sin cambiar de contexto.">
      <Card className="shadow-sm"><CardHeader><CardTitle>{extra ? "Excepciones" : "Pedidos de hoy"}</CardTitle></CardHeader><CardContent><DataTable rows={rows} columns={columns} getRowId={(row) => row.id} selectable /></CardContent></Card>
    </PageShell>
  );
}

function DeliveryDetail({ id }: { id?: string }) {
  const { entregas, clientes, hubs, productos, markDelivery } = useTahonaStore();
  const entrega = entregas.find((item) => item.id === id) ?? entregas[0];
  const hub = hubs.find((item) => item.id === entrega.hub_id) ?? hubs[0];
  return (
    <PageShell eyebrow="Detalle de entrega" title={`Entrega ${entrega.id}`} description="Estado de pedido, casillero, cliente y acciones de piso para cerrar la entrega.">
      <div className="grid gap-md lg:grid-cols-[420px_1fr]">
        <Card className="shadow-sm"><CardHeader><CardTitle>Pase operativo</CardTitle></CardHeader><CardContent className="space-y-sm"><StatusPill tone={deliveryTone(entrega.estado)} label={entrega.estado.replaceAll("_", " ")} /><p className="text-sm text-muted-foreground">{clientName(clientes, entrega.cliente_id)} · {hub.nombre} · {entrega.slot}</p><p className="font-mono text-h2 font-semibold">{entrega.qr_code.slice(-12)}</p><div className="flex gap-xs"><Button onClick={() => markDelivery(entrega.id, "entregado")}>Marcar entregado</Button><Button variant="outline" onClick={() => markDelivery(entrega.id, "incidencia")}>Incidencia</Button></div></CardContent></Card>
        <Card className="shadow-sm"><CardHeader><CardTitle>Productos</CardTitle></CardHeader><CardContent className="grid gap-xs">{entrega.productos.map((item) => <div key={item.producto_id} className="flex justify-between rounded-md border border-border p-sm"><span>{item.cantidad}x {productName(productos, item.producto_id)}</span><span className="font-mono">{formatCurrency((productos.find((product) => product.id === item.producto_id)?.precio_mxn ?? 0) * item.cantidad)}</span></div>)}</CardContent></Card>
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
  return (
    <Card className="max-w-4xl shadow-sm">
      <CardHeader><CardTitle>Bolsa y ventanas</CardTitle></CardHeader>
      <CardContent className="grid gap-md md:grid-cols-2">
        <div className="space-y-xs">{subscription.productos.map((item) => <div key={item.producto_id} className="flex justify-between rounded-md border border-border p-sm"><span>{item.cantidad}x {productName(productos, item.producto_id)}</span><span className="font-mono">{formatCurrency((productos.find((product) => product.id === item.producto_id)?.precio_mxn ?? 0) * item.cantidad)}</span></div>)}</div>
        <div className="space-y-xs">{subscription.slots_elegidos.map((slot) => <StatusPill key={`${slot.dia}-${slot.slot}`} tone="info" label={`${slot.dia} · ${slot.slot}`} />)}<StatusPill tone={subscription.estado === "activa" ? "success" : "warning"} label={subscription.estado} /></div>
      </CardContent>
    </Card>
  );
}

function MoneyView({ mode }: { mode: "cobros" | "reintentos" | "conciliacion" }) {
  const { cobros, clientes, retryCharge } = useTahonaStore();
  const rows = mode === "reintentos" ? cobros.filter((item) => item.estado !== "cobrado") : cobros.slice(0, 120);
  const collected = cobros.filter((item) => item.estado === "cobrado").reduce((sum, item) => sum + item.monto, 0);
  const pending = cobros.filter((item) => item.estado !== "cobrado").reduce((sum, item) => sum + item.monto, 0);
  const columns: Array<DataTableColumn<Cobro>> = [
    { key: "cliente", header: "Cliente", render: (row) => clientName(clientes, row.cliente_id) },
    { key: "fecha", header: "Fecha", render: (row) => shortDate(row.fecha) },
    { key: "metodo", header: "Método", render: (row) => row.metodo },
    { key: "monto", header: "Monto", align: "right", render: (row) => formatCurrency(row.monto) },
    { key: "estado", header: "Estado", render: (row) => <StatusPill tone={chargeTone(row.estado)} label={row.estado} /> },
    { key: "accion", header: "", align: "right", render: (row) => row.estado === "fallido" ? <Button size="sm" variant="outline" onClick={() => retryCharge(row.id)}><RefreshCw className="h-4 w-4" /> Reintentar</Button> : null }
  ];
  return (
    <PageShell eyebrow="Cobros" title={mode === "conciliacion" ? "Conciliación de ingresos." : "Cobros, reintentos y riesgo de pago."} description="El dinero debe leerse con estado, reintento y monto pendiente. Sin adornos.">
      <div className="grid gap-sm md:grid-cols-3">
        <KpiCard label="Cobrado" value={collected} formatter={formatCurrency} icon={Banknote} />
        <KpiCard label="Pendiente/riesgo" value={pending} formatter={formatCurrency} icon={AlertTriangle} />
        <KpiCard label="Transacciones" value={rows.length} icon={CreditCard} />
      </div>
      <Card className="mt-md shadow-sm"><CardHeader><CardTitle>{mode === "reintentos" ? "Cola de reintentos" : "Movimientos"}</CardTitle></CardHeader><CardContent><DataTable rows={rows} columns={columns} getRowId={(row) => row.id} selectable /></CardContent></Card>
    </PageShell>
  );
}

function IncidentsView() {
  const { incidencias, clientes, hubs, resolveIncident } = useTahonaStore();
  const rows = incidencias.filter((item) => item.estado !== "resuelta");
  const columns: Array<DataTableColumn<Incidencia>> = [
    { key: "tipo", header: "Tipo", render: (row) => row.tipo.replaceAll("_", " ") },
    { key: "cliente", header: "Cliente", render: (row) => clientName(clientes, row.cliente_id) },
    { key: "hub", header: "Hub", render: (row) => hubName(hubs, row.hub_id) },
    { key: "estado", header: "Estado", render: (row) => <StatusPill tone={row.estado === "abierta" ? "danger" : "warning"} label={row.estado.replaceAll("_", " ")} /> },
    { key: "accion", header: "", align: "right", render: (row) => <Button size="sm" variant="outline" onClick={() => resolveIncident(row.id)}>Resolver</Button> }
  ];
  return (
    <PageShell eyebrow="Incidencias" title="Excepciones con dueño y acción." description="La vista prioriza casos que afectan retiro, producto o cobro. Cada fila debe poder cerrarse.">
      <Card className="shadow-sm"><CardHeader><CardTitle>Abiertas</CardTitle></CardHeader><CardContent><DataTable rows={rows} columns={columns} getRowId={(row) => row.id} /></CardContent></Card>
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
