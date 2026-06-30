"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  AlertTriangle,
  Banknote,
  Boxes,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  TrendingUp,
  Users,
  Wheat
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { KpiCard } from "@/components/ui/kpi-card";
import { StatusPill } from "@/components/ui/status-pill";
import { HubMap } from "@/components/shared/hub-map";
import { ProgressBar } from "@/components/shared/progress";
import { useTahonaStore } from "@/lib/store/tahona-store";
import type { Cliente, Entrega, Hub, Incidencia, Producto } from "@/lib/mock-data";
import { formatCurrency, formatPercent, shortDate } from "@/lib/utils";

type DashboardView = "resumen" | "crecimiento" | "operacion" | "clientes" | "productos" | "hubs" | "proyecciones";

const BRAND = "var(--brand)";
const ACCENT = "var(--accent)";
const TEXT = "var(--text)";
const SUCCESS = "var(--success)";
const DANGER = "var(--danger)";
const GRID = "var(--border)";
const today = "2026-06-15";

export function ExecutiveDashboardPage({ view }: { view: DashboardView }) {
  if (view === "crecimiento") return <GrowthPage />;
  if (view === "operacion") return <OperationsPage />;
  if (view === "clientes") return <CustomersPage />;
  if (view === "productos") return <ProductsPage />;
  if (view === "hubs") return <HubsPage />;
  if (view === "proyecciones") return <ProjectionsPage />;
  return <SummaryPage />;
}

function PageShell({
  eyebrow,
  title,
  description,
  meta,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  const resolvedDescription =
    eyebrow === "Resumen ejecutivo"
      ? "Crecimiento, ingresos, retencion y operacion con contexto para decidir capacidad, riesgo y expansion."
      : description;

  return (
    <main className="min-h-screen bg-transparent px-4 py-6 text-[var(--ink)] lg:px-6">
      <div className="mx-auto max-w-[1540px]">
        <header className="mb-6 rounded-[18px] border border-[var(--line)] bg-[var(--paper-raised)] p-6 shadow-[var(--shadow-sm)] backdrop-blur">
          <div className="flex flex-col justify-between gap-md xl:flex-row xl:items-end">
            <div className="max-w-4xl">
              <div className="mb-4 h-0.5 w-8 bg-[var(--brand)]" />
              <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">{eyebrow}</p>
              <h1 className="mt-3 font-sans text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-[var(--ink)]">{title}</h1>
              <p className="mt-3 max-w-3xl font-sans text-sm leading-6 text-[var(--ink-soft)]">{resolvedDescription}</p>
            </div>
            <div className="grid min-w-[280px] grid-cols-2 gap-2">
              {meta ?? (
                <>
                  <Signal label="Corte" value="Jun 2026" />
                  <Signal label="Modelo" value="3 hubs" />
                  <Signal label="Frecuencia" value="Semanal" />
                  <Signal label="Estado" value="Piloto" />
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

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-[var(--line)] bg-[var(--paper-sunken)] px-3 py-2 shadow-[var(--shadow-sm)]">
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">{label}</p>
      <p className="mt-1 font-mono text-sm font-medium text-[var(--ink)] [font-variant-numeric:tabular-nums]">{value}</p>
    </div>
  );
}

function ChartCard({ title, eyebrow, action, children }: { title: string; eyebrow: string; action?: ReactNode; children: ReactNode }) {
  return (
    <Card className="min-w-0">
      <CardHeader className="flex-row items-start justify-between gap-sm">
        <div>
          <div className="mb-3 h-0.5 w-8 bg-[var(--brand)]" />
          <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-faint)]">{eyebrow}</p>
          <CardTitle className="mt-1">{title}</CardTitle>
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function useExecutiveMetrics() {
  const { clientes, cobros, entregas, hubs, incidencias } = useTahonaStore();
  const activeClients = clientes.filter((item) => item.estado === "activo").length;
  const retainedClients = clientes.filter((item) => item.estado !== "cancelado").length;
  const pausedClients = clientes.filter((item) => item.estado === "pausado").length;
  const collected = cobros.filter((item) => item.estado === "cobrado");
  const atRisk = cobros.filter((item) => item.estado !== "cobrado");
  const revenue = collected.reduce((sum, item) => sum + item.monto, 0);
  const riskRevenue = atRisk.reduce((sum, item) => sum + item.monto, 0);
  const todayDeliveries = entregas.filter((item) => item.fecha === today);
  const readyToday = todayDeliveries.filter((item) => item.estado === "listo").length;
  const delivered = entregas.filter((item) => item.estado === "entregado").length;
  const operationalRisk = incidencias.filter((item) => item.estado !== "resuelta").length;
  const retention = activeClients / retainedClients;
  const occupation = hubs.reduce((sum, hub) => sum + hub.casilleros_ocupados_actual / hub.casilleros_total, 0) / hubs.length;
  const onTime = entregas.filter((item) => item.estado === "entregado" || item.estado === "listo").length / entregas.length;
  return { activeClients, retainedClients, pausedClients, revenue, riskRevenue, todayDeliveries, readyToday, delivered, operationalRisk, retention, occupation, onTime };
}

function growthSeries() {
  return [
    { mes: "Nov", clientes: 48, ingresos: 82000, margen: 0.49, churn: 0.09 },
    { mes: "Dic", clientes: 67, ingresos: 116000, margen: 0.52, churn: 0.08 },
    { mes: "Ene", clientes: 92, ingresos: 154000, margen: 0.56, churn: 0.07 },
    { mes: "Feb", clientes: 118, ingresos: 198000, margen: 0.58, churn: 0.065 },
    { mes: "Mar", clientes: 137, ingresos: 234000, margen: 0.6, churn: 0.058 },
    { mes: "Abr", clientes: 151, ingresos: 264000, margen: 0.62, churn: 0.052 },
    { mes: "May", clientes: 160, ingresos: 292000, margen: 0.64, churn: 0.047 },
    { mes: "Jun", clientes: 160, ingresos: 306000, margen: 0.65, churn: 0.044 }
  ];
}

function retentionCohorts() {
  return [
    { cohort: "Ene", clientes: 32, retention: [1, 0.91, 0.86, 0.81, 0.78, 0.75] },
    { cohort: "Feb", clientes: 41, retention: [1, 0.93, 0.88, 0.84, 0.8, null] },
    { cohort: "Mar", clientes: 49, retention: [1, 0.94, 0.9, 0.86, null, null] },
    { cohort: "Abr", clientes: 56, retention: [1, 0.95, 0.91, null, null, null] },
    { cohort: "May", clientes: 64, retention: [1, 0.96, null, null, null, null] },
    { cohort: "Jun", clientes: 71, retention: [1, null, null, null, null, null] }
  ];
}

function projectionSeries() {
  return [
    { mes: "Jul", base: 180000, expansion: 244000, agresivo: 310000 },
    { mes: "Ago", base: 228000, expansion: 326000, agresivo: 438000 },
    { mes: "Sep", base: 286000, expansion: 421000, agresivo: 592000 },
    { mes: "Oct", base: 351000, expansion: 548000, agresivo: 782000 },
    { mes: "Nov", base: 420000, expansion: 689000, agresivo: 1010000 },
    { mes: "Dic", base: 498000, expansion: 852000, agresivo: 1290000 }
  ];
}

function RetentionHeatmap() {
  const months = ["M0", "M1", "M2", "M3", "M4", "M5"];
  const rows = retentionCohorts();

  return (
    <Card className="mt-md min-w-0 shadow-sm">
      <CardHeader className="flex-row items-start justify-between gap-sm">
        <div>
          <p className="eyebrow-mark text-caption font-semibold uppercase text-primary">Retencion</p>
          <CardTitle className="mt-1">Cohortes de suscripcion</CardTitle>
        </div>
        <Badge variant="outline">6 meses</Badge>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[660px]">
            <div className="grid grid-cols-[116px_repeat(6,minmax(64px,1fr))_92px] gap-1 text-xs font-semibold uppercase text-muted-foreground">
              <div>Cohorte</div>
              {months.map((month) => (
                <div key={month} className="text-center">{month}</div>
              ))}
              <div className="text-right">Clientes</div>
            </div>
            <div className="mt-2 space-y-1">
              {rows.map((row) => (
                <div key={row.cohort} className="grid grid-cols-[116px_repeat(6,minmax(64px,1fr))_92px] gap-1">
                  <div className="flex h-10 items-center rounded-md bg-surface-2 px-3 text-sm font-semibold">{row.cohort}</div>
                  {row.retention.map((value, index) => {
                    const active = typeof value === "number";
                    const intensity = active ? Math.max(12, Math.round(value * 58)) : 0;
                    const style = {
                      background: active
                        ? `color-mix(in srgb, var(--brand) ${intensity}%, var(--surface-2))`
                        : "color-mix(in srgb, var(--surface-2) 72%, transparent)",
                      color: active && value > 0.88 ? "white" : "var(--text)"
                    } satisfies CSSProperties;

                    return (
                      <div
                        key={`${row.cohort}-${months[index]}`}
                        className="flex h-10 items-center justify-center rounded-md border border-border font-mono text-sm font-semibold"
                        style={style}
                      >
                        {active ? `${Math.round(value * 100)}%` : "-"}
                      </div>
                    );
                  })}
                  <div className="flex h-10 items-center justify-end rounded-md bg-surface-2 px-3 font-mono text-sm font-semibold">{row.clientes}</div>
                </div>
              ))}
            </div>
            <div className="mt-sm flex flex-wrap items-center justify-between gap-xs text-xs text-muted-foreground">
              <span>Lectura: M0 es alta, M1-M3 muestran recurrencia real y M4-M5 presionan el playbook de retencion.</span>
              <span className="font-mono">Meta M3 &gt; 85%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function metricTooltip(value: unknown, name: unknown) {
  const metric = String(name).toLowerCase();
  if (metric.includes("ingreso")) return formatCurrency(Number(value));
  if (metric.includes("margen") || metric.includes("churn")) return formatPercent(Number(value));
  return String(value);
}

function SummaryPage() {
  const metrics = useExecutiveMetrics();
  const { incidencias, cobros, clientes, hubs } = useTahonaStore();
  const series = growthSeries();
  const lastMonth = series[series.length - 1];
  const prevMonth = series[series.length - 2];
  const momRevenue = prevMonth ? (lastMonth.ingresos - prevMonth.ingresos) / prevMonth.ingresos : 0;

  const openIncidents = incidencias.filter((item) => item.estado !== "resuelta");
  const failedCharges = cobros.filter((item) => item.estado !== "cobrado");

  const riskRows = [
    ...openIncidents.slice(0, 5).map((item) => ({ type: "Incidencia", owner: hubName(hubs, item.hub_id), amount: "—", status: item.estado, date: item.fecha })),
    ...failedCharges.slice(0, 5).map((item) => ({ type: "Cobro", owner: clientName(clientes, item.cliente_id), amount: formatCurrency(item.monto), status: item.estado, date: item.fecha }))
  ];
  const columns: Array<DataTableColumn<(typeof riskRows)[number]>> = [
    { key: "type", header: "Riesgo", render: (row) => row.type },
    { key: "owner", header: "Dueño", render: (row) => row.owner },
    { key: "amount", header: "Monto", align: "right", render: (row) => row.amount },
    { key: "status", header: "Estado", render: (row) => <StatusPill tone={row.status.includes("fallido") || row.status.includes("abierta") ? "danger" : "warning"} label={row.status.replaceAll("_", " ")} /> },
    { key: "date", header: "Fecha", render: (row) => shortDate(row.date) }
  ];

  return (
    <PageShell
      eyebrow="Resumen ejecutivo"
      title="Recurrencia, capacidad y riesgo en una sola lectura."
      description="Vista para dirección: crecimiento, ingresos, retención y operación se leen con contexto."
    >
      {/* ── Hero de mando ─────────────────────────────────────────────── */}
      <section className="overflow-hidden rounded-[20px] border border-[var(--line)] bg-[#111827] text-white shadow-[var(--shadow-md)]">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_1.2fr] lg:p-8">
          <div className="flex flex-col justify-between gap-6">
            <div>
              <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white/55">Ingreso recurrente (MRR)</p>
              <p className="mt-3 font-mono text-[clamp(2.5rem,5vw,3.75rem)] font-semibold leading-none">{formatCurrency(metrics.revenue)}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--ok)]/15 px-2.5 py-1 font-sans text-sm font-semibold text-[var(--ok)]">
                  <TrendingUp className="h-4 w-4" aria-hidden /> +{Math.round(momRevenue * 1000) / 10}% MoM
                </span>
                <span className="font-sans text-sm text-white/55">Margen bruto {Math.round(lastMonth.margen * 100)}%</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-5">
              <div>
                <p className="font-mono text-2xl font-semibold [font-variant-numeric:tabular-nums]">{metrics.activeClients}</p>
                <p className="font-sans text-xs text-white/55">clientes activos</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-semibold [font-variant-numeric:tabular-nums]">{Math.round(metrics.retention * 100)}%</p>
                <p className="font-sans text-xs text-white/55">retención</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-semibold text-[var(--accent)] [font-variant-numeric:tabular-nums]">{formatCurrency(metrics.riskRevenue)}</p>
                <p className="font-sans text-xs text-white/55">en riesgo</p>
              </div>
            </div>
          </div>
          <div className="min-w-0 rounded-[16px] bg-white/[0.04] p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-white/50">Ingresos · 8 meses</p>
              <span className="font-mono text-xs text-white/40">Nov — Jun</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="execMrr" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="mes" tick={{ fill: "rgba(255,255,255,.4)", fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1f2937", border: "none", borderRadius: 12, color: "#fff" }}
                  formatter={(value: unknown) => [formatCurrency(Number(value)), "Ingresos"]}
                />
                <Area dataKey="ingresos" stroke="var(--accent)" strokeWidth={3} fill="url(#execMrr)" animationDuration={520} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ── KPIs ──────────────────────────────────────────────────────── */}
      <div className="mt-md grid gap-sm md:grid-cols-4">
        <KpiCard label="Clientes activos" value={metrics.activeClients} helper={`${metrics.pausedClients} pausados`} target="200 piloto" icon={Users} delta="+6.0%" deltaTone="up" />
        <KpiCard label="Retención" value={metrics.retention} formatter={formatPercent} helper="Activos / no cancelados" icon={TrendingUp} target=">85%" />
        <KpiCard label="Ocupación de red" value={metrics.occupation} formatter={formatPercent} helper="Casilleros usados" icon={Boxes} />
        <KpiCard label="Riesgo operativo" value={metrics.operationalRisk} helper={`${formatCurrency(metrics.riskRevenue)} en cobros`} icon={AlertTriangle} delta={metrics.operationalRisk ? "vigilar" : "estable"} deltaTone={metrics.operationalRisk ? "down" : "up"} />
      </div>

      {/* ── Crecimiento + Riesgos ─────────────────────────────────────── */}
      <div className="mt-md grid items-start gap-md xl:grid-cols-[minmax(560px,1.15fr)_minmax(420px,0.85fr)]">
        <ChartCard eyebrow="Crecimiento" title="Ingresos, clientes y margen bruto" action={<Badge variant="info">8 meses</Badge>}>
          <ResponsiveContainer width="100%" height={330}>
            <ComposedChart data={series}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="mes" tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tickFormatter={(value) => `${Math.round(Number(value) * 100)}%`} />
              <Tooltip formatter={metricTooltip} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: 12 }} />
              <Bar yAxisId="left" dataKey="ingresos" name="Ingresos" fill={BRAND} radius={[6, 6, 0, 0]} animationDuration={480} />
              <Line yAxisId="left" type="monotone" dataKey="clientes" name="Clientes" stroke={TEXT} strokeWidth={3} dot={false} animationDuration={480} />
              <Line yAxisId="right" type="monotone" dataKey="margen" name="Margen bruto" stroke={SUCCESS} strokeWidth={3} dot={false} animationDuration={480} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="min-w-0 shadow-sm">
          <CardHeader className="flex-row items-center justify-between gap-sm">
            <CardTitle>Riesgos que bloquean escala</CardTitle>
            <span className="rounded-full bg-[var(--danger-bg)] px-2.5 py-1 font-mono text-xs font-semibold text-[var(--danger)]">
              {openIncidents.length + failedCharges.length}
            </span>
          </CardHeader>
          <CardContent>
            <DataTable rows={riskRows} columns={columns} getRowId={(row) => `${row.type}-${row.owner}-${row.date}`} />
          </CardContent>
        </Card>
      </div>

      <RetentionHeatmap />
    </PageShell>
  );
}
function GrowthPage() {
  const data = growthSeries();
  return (
    <PageShell eyebrow="Crecimiento" title="Adquisición, ingresos y churn con señales comparables." description="El objetivo es demostrar repetición y calidad de ingreso, no solo volumen bruto.">
      <div className="grid gap-sm md:grid-cols-3">
        <KpiCard label="Crecimiento clientes" value={2.33} formatter={(value) => `${Math.round(value * 100)}%`} icon={Users} helper="Nov-Jun" />
        <KpiCard label="Margen bruto" value={0.65} formatter={formatPercent} icon={TrendingUp} target=">60%" delta="+16 pp" deltaTone="up" />
        <KpiCard label="Churn mensual" value={0.044} formatter={formatPercent} icon={ShieldCheck} target="<5%" delta="mejora" deltaTone="up" />
      </div>
      <ChartCard eyebrow="Serie mensual" title="Clientes, ingresos y churn" action={<Badge variant="outline">Sin pie charts</Badge>}>
        <ResponsiveContainer width="100%" height={360}>
          <ComposedChart data={data}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="mes" tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${Math.round(Number(value) * 100)}%`} tickLine={false} axisLine={false} />
            <Tooltip formatter={metricTooltip} />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: 12 }} />
            <Area yAxisId="left" dataKey="clientes" name="Clientes" fill={BRAND} stroke={BRAND} fillOpacity={0.14} animationDuration={480} />
            <Bar yAxisId="left" dataKey="ingresos" name="Ingresos" fill={ACCENT} radius={[6, 6, 0, 0]} animationDuration={480} />
            <Line yAxisId="right" dataKey="churn" name="Churn" stroke={DANGER} strokeWidth={3} dot={false} animationDuration={480} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>
    </PageShell>
  );
}

function OperationsPage() {
  const { entregas, incidencias, hubs, casilleros } = useTahonaStore();
  const todayDeliveries = entregas.filter((item) => item.fecha === today);
  const onTime = entregas.filter((item) => item.estado === "entregado" || item.estado === "listo").length / entregas.length;
  const openIncidents = incidencias.filter((item) => item.estado !== "resuelta");
  const columns: Array<DataTableColumn<Incidencia>> = [
    { key: "tipo", header: "Tipo", render: (row) => row.tipo.replaceAll("_", " ") },
    { key: "hub", header: "Hub", render: (row) => hubName(hubs, row.hub_id) },
    { key: "fecha", header: "Fecha", render: (row) => shortDate(row.fecha) },
    { key: "estado", header: "Estado", render: (row) => <StatusPill tone={row.estado === "abierta" ? "danger" : "warning"} label={row.estado.replaceAll("_", " ")} /> }
  ];
  return (
    <PageShell eyebrow="Operación" title="Capacidad, entregas y excepciones de red." description="Dirección necesita saber si la operación puede escalar antes de vender más.">
      <div className="grid gap-sm md:grid-cols-4">
        <KpiCard label="Entregas hoy" value={todayDeliveries.length} icon={Package} helper="Pedidos programados" />
        <KpiCard label="On-time proxy" value={onTime} formatter={formatPercent} icon={ShieldCheck} target=">94%" />
        <KpiCard label="Ocupación" value={hubs.reduce((sum, hub) => sum + hub.casilleros_ocupados_actual / hub.casilleros_total, 0) / hubs.length} formatter={formatPercent} icon={Boxes} />
        <KpiCard label="Incidencias abiertas" value={openIncidents.length} icon={AlertTriangle} />
      </div>
      <div className="mt-md grid gap-md xl:grid-cols-[0.9fr_1.1fr]">
        <HubCapacityTable hubs={hubs} />
        <Card className="shadow-sm"><CardHeader><CardTitle>Incidencias abiertas</CardTitle></CardHeader><CardContent><DataTable rows={openIncidents} columns={columns} getRowId={(row) => row.id} /></CardContent></Card>
      </div>
    </PageShell>
  );
}

function CustomersPage() {
  const { clientes, cobros } = useTahonaStore();
  const columns: Array<DataTableColumn<Cliente>> = [
    { key: "cliente", header: "Cliente", render: (row) => <div><p className="font-semibold">{row.nombre} {row.apellido}</p><p className="text-xs text-muted-foreground">{row.email}</p></div> },
    { key: "estado", header: "Estado", render: (row) => <StatusPill tone={row.estado === "activo" ? "success" : row.estado === "pausado" ? "warning" : "danger"} label={row.estado} /> },
    { key: "colonia", header: "Colonia", render: (row) => row.colonia },
    { key: "ticket", header: "Ticket", align: "right", render: (row) => formatCurrency(row.ticket_promedio_semanal_mxn) }
  ];
  const arpu = clientes.filter((item) => item.estado === "activo").reduce((sum, item) => sum + item.ticket_promedio_semanal_mxn, 0) / clientes.filter((item) => item.estado === "activo").length;
  return (
    <PageShell eyebrow="Clientes" title="Base recurrente, ticket y estados de cuenta." description="La tabla permite revisar la calidad de base: activos, pausados, ticket promedio y zona.">
      <div className="grid gap-sm md:grid-cols-3">
        <KpiCard label="Activos" value={clientes.filter((item) => item.estado === "activo").length} icon={Users} />
        <KpiCard label="ARPU semanal" value={arpu} formatter={formatCurrency} icon={Banknote} />
        <KpiCard label="Cobros registrados" value={cobros.length} icon={CreditCard} />
      </div>
      <Card className="mt-md shadow-sm"><CardHeader><CardTitle>Clientes</CardTitle></CardHeader><CardContent><DataTable rows={clientes.slice(0, 90)} columns={columns} getRowId={(row) => row.id} selectable /></CardContent></Card>
    </PageShell>
  );
}

function ProductsPage() {
  const { productos, entregas } = useTahonaStore();
  const rows = productos.map((product) => {
    const units = entregas.flatMap((delivery) => delivery.productos).filter((item) => item.producto_id === product.id).reduce((sum, item) => sum + item.cantidad, 0);
    return { product, units, revenue: units * product.precio_mxn };
  }).sort((a, b) => b.revenue - a.revenue);
  const columns: Array<DataTableColumn<(typeof rows)[number]>> = [
    { key: "product", header: "Producto", render: (row) => <div><p className="font-semibold">{row.product.nombre}</p><p className="text-xs text-muted-foreground">{row.product.categoria}</p></div> },
    { key: "units", header: "Unidades", align: "right", render: (row) => row.units },
    { key: "revenue", header: "Ingreso", align: "right", render: (row) => formatCurrency(row.revenue) },
    { key: "price", header: "Precio", align: "right", render: (row) => formatCurrency(row.product.precio_mxn) }
  ];
  return (
    <PageShell eyebrow="Productos" title="Mix de venta por SKU y contribución." description="La decisión de producción y catálogo necesita ranking por unidades e ingresos.">
      <div className="grid gap-md xl:grid-cols-[0.9fr_1.1fr]">
        <ChartCard eyebrow="Top 8" title="Ingresos por producto">
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={rows.slice(0, 8)} layout="vertical">
              <CartesianGrid stroke={GRID} horizontal={false} />
              <XAxis type="number" tickFormatter={(value) => `$${Number(value) / 1000}k`} />
              <YAxis type="category" dataKey={(row) => row.product.nombre.slice(0, 18)} width={140} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="revenue" fill={BRAND} radius={[0, 6, 6, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <Card className="shadow-sm"><CardHeader><CardTitle>Ranking SKU</CardTitle></CardHeader><CardContent><DataTable rows={rows} columns={columns} getRowId={(row) => row.product.id} /></CardContent></Card>
      </div>
    </PageShell>
  );
}

function HubsPage() {
  const { hubs, casilleros } = useTahonaStore();
  return (
    <PageShell eyebrow="Hubs" title="Capacidad territorial y ocupación de red." description="Expansión responsable: ver clientes activos, casilleros y presión por hub.">
      <div className="grid gap-md xl:grid-cols-[1fr_0.95fr]">
        <HubMap hubs={hubs} />
        <HubCapacityTable hubs={hubs} />
      </div>
      <div className="mt-md grid gap-sm md:grid-cols-3">
        {hubs.map((hub) => {
          const issues = casilleros.filter((item) => item.hub_id === hub.id && item.estado === "incidencia").length;
          return <Card key={hub.id} className="shadow-sm"><CardContent className="p-md"><p className="text-caption font-semibold uppercase text-primary">{hub.colonia}</p><h3 className="mt-1 text-h3 font-semibold">{hub.nombre}</h3><p className="mt-2 text-sm text-muted-foreground">{hub.gerente} · {hub.clientes_activos} clientes</p><div className="mt-sm"><ProgressBar value={(hub.casilleros_ocupados_actual / hub.casilleros_total) * 100} /></div><div className="mt-sm">{issues ? <StatusPill tone="danger" label={`${issues} incidencias`} /> : <StatusPill tone="success" label="estable" />}</div></CardContent></Card>;
        })}
      </div>
    </PageShell>
  );
}

function ProjectionsPage() {
  const scenarios = [
    { scenario: "Base", hubs: 3, clientes: 230, revenue: 498000, setupCost: 0, risk: "Bajo" },
    { scenario: "Expansión CDMX", hubs: 6, clientes: 410, revenue: 852000, setupCost: 620000, risk: "Medio" },
    { scenario: "Agresivo", hubs: 10, clientes: 680, revenue: 1290000, setupCost: 1450000, risk: "Alto" }
  ];
  const columns: Array<DataTableColumn<(typeof scenarios)[number]>> = [
    { key: "scenario", header: "Escenario", render: (row) => row.scenario },
    { key: "hubs", header: "Hubs", align: "right", render: (row) => row.hubs },
    { key: "clientes", header: "Clientes", align: "right", render: (row) => row.clientes },
    { key: "revenue", header: "Ingreso mensual", align: "right", render: (row) => formatCurrency(row.revenue) },
    { key: "setupCost", header: "Costo apertura", align: "right", render: (row) => formatCurrency(row.setupCost) },
    { key: "risk", header: "Riesgo", render: (row) => <StatusPill tone={row.risk === "Alto" ? "danger" : row.risk === "Medio" ? "warning" : "success"} label={row.risk} /> }
  ];
  return (
    <PageShell eyebrow="Proyecciones" title="Escenarios de expansión con ingresos, costos y riesgo." description="Dirección puede ver qué cambia al abrir hubs: clientes, ingreso, costo de apertura y complejidad operativa.">
      <div className="grid gap-md xl:grid-cols-[1.05fr_0.95fr]">
        <ChartCard eyebrow="Forecast" title="Ingreso mensual por escenario">
          <ResponsiveContainer width="100%" height={360}>
            <AreaChart data={projectionSeries()}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="mes" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Area dataKey="base" stroke={TEXT} fill={TEXT} fillOpacity={0.08} isAnimationActive={false} />
              <Area dataKey="expansion" stroke={BRAND} fill={BRAND} fillOpacity={0.12} isAnimationActive={false} />
              <Area dataKey="agresivo" stroke={ACCENT} fill={ACCENT} fillOpacity={0.22} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <Card className="shadow-sm"><CardHeader><CardTitle>Escenarios</CardTitle></CardHeader><CardContent><DataTable rows={scenarios} columns={columns} getRowId={(row) => row.scenario} /></CardContent></Card>
      </div>
    </PageShell>
  );
}

function HubCapacityTable({ hubs }: { hubs: Hub[] }) {
  const columns: Array<DataTableColumn<Hub>> = [
    { key: "hub", header: "Hub", render: (row) => <div><p className="font-semibold">{row.nombre}</p><p className="text-xs text-muted-foreground">{row.colonia}</p></div> },
    { key: "clientes", header: "Clientes", align: "right", render: (row) => row.clientes_activos },
    { key: "lockers", header: "Casilleros", align: "right", render: (row) => `${row.casilleros_ocupados_actual}/${row.casilleros_total}` },
    { key: "ocupacion", header: "Ocupación", render: (row) => <div className="min-w-40"><ProgressBar value={(row.casilleros_ocupados_actual / row.casilleros_total) * 100} /></div> },
    { key: "estado", header: "Estado", render: (row) => <StatusPill tone={row.casilleros_ocupados_actual / row.casilleros_total > 0.88 ? "warning" : "success"} label={row.casilleros_ocupados_actual / row.casilleros_total > 0.88 ? "presión" : "estable"} /> }
  ];
  return <Card className="shadow-sm"><CardHeader><CardTitle>Capacidad por hub</CardTitle></CardHeader><CardContent><DataTable rows={hubs} columns={columns} getRowId={(row) => row.id} /></CardContent></Card>;
}

function clientName(clientes: Cliente[], id: string) {
  const client = clientes.find((item) => item.id === id);
  return client ? `${client.nombre} ${client.apellido}` : id;
}

function hubName(hubs: Hub[], id: string) {
  return hubs.find((item) => item.id === id)?.nombre ?? id;
}
