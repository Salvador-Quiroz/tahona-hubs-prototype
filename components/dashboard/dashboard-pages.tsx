"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Banknote, MapPin, Package, TrendingUp, Users, Wheat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { HubMap } from "@/components/shared/hub-map";
import { MetricCard } from "@/components/shared/metric-card";
import { ProgressBar } from "@/components/shared/progress";
import { useTahonaStore } from "@/lib/store/tahona-store";
import { formatCurrency, formatPercent } from "@/lib/utils";

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
      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{eyebrow}</p>
        <h1 className="mt-2 font-display text-5xl font-semibold leading-none text-balance">{title}</h1>
      </div>
      {children}
    </div>
  );
}

const chartColors = ["#A0411F", "#D4A574", "#5F7652", "#4B2E1F", "#E7C654"];

export function ExecutiveDashboardPage({
  view
}: {
  view:
    | "resumen"
    | "crecimiento"
    | "operacion"
    | "clientes"
    | "productos"
    | "hubs"
    | "proyecciones";
}) {
  if (view === "crecimiento") return <GrowthPage />;
  if (view === "operacion") return <OperationsPage />;
  if (view === "clientes") return <CustomersPage />;
  if (view === "productos") return <ProductsPage />;
  if (view === "hubs") return <HubsPage />;
  if (view === "proyecciones") return <ProjectionsPage />;
  return <SummaryPage />;
}

function useExecutiveMetrics() {
  const { clientes, cobros, entregas, hubs } = useTahonaStore();
  return useMemo(() => {
    const activeClients = clientes.filter((item) => item.estado === "activo").length;
    const monthRevenue = cobros
      .filter((item) => item.estado === "cobrado")
      .slice(0, 160)
      .reduce((sum, item) => sum + item.monto, 0);
    const delivered = entregas.filter((item) => item.estado === "entregado").length;
    const retention = activeClients / clientes.filter((item) => item.estado !== "cancelado").length;
    const avgOccupation =
      hubs.reduce((sum, hub) => sum + hub.casilleros_ocupados_actual / hub.casilleros_total, 0) /
      hubs.length;
    return { activeClients, monthRevenue, delivered, retention, avgOccupation };
  }, [clientes, cobros, entregas, hubs]);
}

function growthData() {
  return [
    { mes: "Nov", clientes: 48, ingresos: 82000, churn: 0.09 },
    { mes: "Dic", clientes: 67, ingresos: 116000, churn: 0.08 },
    { mes: "Ene", clientes: 92, ingresos: 154000, churn: 0.07 },
    { mes: "Feb", clientes: 118, ingresos: 198000, churn: 0.065 },
    { mes: "Mar", clientes: 137, ingresos: 234000, churn: 0.058 },
    { mes: "Abr", clientes: 151, ingresos: 264000, churn: 0.052 },
    { mes: "May", clientes: 160, ingresos: 292000, churn: 0.047 },
    { mes: "Jun", clientes: 160, ingresos: 306000, churn: 0.044 }
  ];
}

function SummaryPage() {
  const { activeClients, monthRevenue, delivered, retention, avgOccupation } = useExecutiveMetrics();
  const data = growthData();
  return (
    <PageShell eyebrow="Resumen ejecutivo" title="Tahona Hubs: panadería con recurrencia, datos y operación escalable.">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Clientes activos" value={String(activeClients)} helper="+17% vs marzo" icon={Users} tone="warm" />
        <MetricCard label="Ingresos del mes" value={formatCurrency(monthRevenue)} helper="Cobros recurrentes" icon={Banknote} />
        <MetricCard label="Retención semanal" value={formatPercent(retention)} helper="Base activa/retained" icon={TrendingUp} tone="green" />
        <MetricCard label="Ocupación promedio" value={formatPercent(avgOccupation)} helper={`${delivered} entregas históricas`} icon={Package} tone="gold" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="Clientes activos">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D9C8B4" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="clientes" stroke="#A0411F" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Ingresos mensuales">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D9C8B4" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="ingresos" fill="#D4A574" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </PageShell>
  );
}

function GrowthPage() {
  const data = growthData();
  const mrr = data[data.length - 1].ingresos;
  return (
    <PageShell eyebrow="Crecimiento" title="Base recurrente y MRR con churn controlado.">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="MRR estimado" value={formatCurrency(mrr)} icon={TrendingUp} />
        <MetricCard label="Churn rate" value={formatPercent(data[data.length - 1].churn)} icon={Users} tone="gold" />
        <MetricCard label="Crecimiento 8 meses" value="+233%" icon={Banknote} tone="green" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Clientes">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="clientes" stroke="#A0411F" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Ingresos">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data}>
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="ingresos" fill="#5F7652" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </PageShell>
  );
}

function OperationsPage() {
  const { hubs, incidencias } = useTahonaStore();
  const incidentData = Object.entries(
    incidencias.reduce<Record<string, number>>((acc, item) => {
      acc[item.tipo] = (acc[item.tipo] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: name.replaceAll("_", " "), value }));
  return (
    <PageShell eyebrow="Operación" title="Capacidad, eficiencia y causas de fricción.">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <ChartCard title="Ocupación por hub y slot">
          <div className="grid gap-3">
            {hubs.map((hub, hubIndex) => (
              <div key={hub.id} className="grid grid-cols-[130px_repeat(3,1fr)] items-center gap-2">
                <span className="text-sm font-semibold">{hub.nombre.replace("Hub ", "")}</span>
                {hub.slots_horarios.map((slot, index) => {
                  const value = 56 + hubIndex * 11 + index * 7;
                  return (
                    <div key={slot} className="rounded-md p-3 text-center text-sm font-semibold text-white" style={{ backgroundColor: `rgba(160,65,31,${value / 100})` }}>
                      {value}%
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Incidencias por categoría">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={incidentData} innerRadius={70} outerRadius={110} dataKey="value">
                {incidentData.map((_, index) => (
                  <Cell key={index} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {hubs.map((hub) => (
          <Card key={hub.id}>
            <CardContent className="p-5">
              <h3 className="text-xl font-semibold">{hub.nombre}</h3>
              <ProgressBar value={(hub.casilleros_ocupados_actual / hub.casilleros_total) * 100} className="mt-5" />
              <p className="mt-3 text-sm text-muted-foreground">Eficiencia producción estimada: 94%</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

function CustomersPage() {
  const { clientes, hubs } = useTahonaStore();
  const byHub = hubs.map((hub) => ({
    name: hub.nombre.replace("Hub ", ""),
    value: clientes.filter((item) => item.hub_asignado_id === hub.id && item.estado === "activo").length
  }));
  return (
    <PageShell eyebrow="Clientes" title="Cohortes, ticket y distribución por zona.">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <ChartCard title="Retención por cohorte">
          <div className="space-y-3">
            {["Nov", "Dic", "Ene", "Feb", "Mar", "Abr"].map((month, row) => (
              <div key={month} className="grid grid-cols-[60px_repeat(6,1fr)] items-center gap-2">
                <span className="text-sm font-semibold">{month}</span>
                {Array.from({ length: 6 }, (_, col) => {
                  const value = 96 - row * 3 - col * 4;
                  return (
                    <div key={col} className="rounded-md bg-tahona-nopal p-2 text-center text-xs font-semibold text-white" style={{ opacity: value / 100 }}>
                      {value}%
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Distribución por hub">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byHub}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#A0411F" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <MetricCard label="Ticket promedio" value={formatCurrency(424)} icon={Banknote} />
        <MetricCard label="Frecuencia semanal" value="2.3 entregas" icon={Package} tone="gold" />
        <MetricCard label="Segmento top" value="Familias urbanas" icon={Users} tone="green" />
      </div>
    </PageShell>
  );
}

function ProductsPage() {
  const { productos, entregas, incidencias } = useTahonaStore();
  const top = productos.slice(0, 8).map((product, index) => ({
    name: product.nombre.split(" ").slice(0, 2).join(" "),
    ingreso: product.precio_mxn * (42 - index * 3),
    unidades: 42 - index * 3
  }));
  return (
    <PageShell eyebrow="Productos" title="Rotación, ingreso por SKU e incidencias.">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ChartCard title="Ingreso por SKU">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={top}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="ingreso" fill="#D4A574" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <Card>
          <CardContent className="p-5">
            <h2 className="text-xl font-semibold">Lecturas clave</h2>
            <div className="mt-5 space-y-4">
              <Insight label="Top seller" value={productos[0].nombre} />
              <Insight label="Menor rotación" value={productos[12].nombre} />
              <Insight label="Entregas medidas" value={String(entregas.length)} />
              <Insight label="Incidencias producto" value={String(incidencias.filter((item) => item.tipo === "producto_dañado").length)} />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

function HubsPage() {
  const { hubs } = useTahonaStore();
  return (
    <PageShell eyebrow="Hubs" title="Desempeño territorial de la red inicial.">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <HubMap hubs={hubs} />
        <div className="space-y-4">
          {hubs.map((hub) => (
            <Card key={hub.id}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{hub.nombre}</h2>
                  <Badge variant="secondary">{hub.clientes_activos} activos</Badge>
                </div>
                <ProgressBar value={(hub.casilleros_ocupados_actual / hub.casilleros_total) * 100} className="mt-5" />
                <p className="mt-3 text-sm text-muted-foreground">{hub.direccion}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function ProjectionsPage() {
  const [newHubs, setNewHubs] = useState(4);
  const [clientsPerHub, setClientsPerHub] = useState(90);
  const [ticket, setTicket] = useState(430);
  const weeklyRevenue = newHubs * clientsPerHub * ticket;
  const monthlyRevenue = weeklyRevenue * 4.33;
  return (
    <PageShell eyebrow="Proyecciones" title="Modelo simple para abrir nuevos hubs.">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardContent className="space-y-6 p-6">
            <Slider label="Nuevos hubs" value={newHubs} min={1} max={18} onChange={setNewHubs} />
            <Slider label="Clientes por hub" value={clientsPerHub} min={40} max={180} onChange={setClientsPerHub} />
            <Slider label="Ticket semanal" value={ticket} min={220} max={720} onChange={setTicket} prefix="$" />
          </CardContent>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          <MetricCard label="Ingreso semanal proyectado" value={formatCurrency(weeklyRevenue)} icon={Banknote} />
          <MetricCard label="Ingreso mensual proyectado" value={formatCurrency(monthlyRevenue)} icon={TrendingUp} tone="green" />
          <MetricCard label="Clientes nuevos" value={String(newHubs * clientsPerHub)} icon={Users} tone="warm" />
          <MetricCard label="Casilleros requeridos" value={String(newHubs * 24)} icon={MapPin} tone="gold" />
        </div>
      </div>
    </PageShell>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-5">
        <h2 className="mb-5 text-xl font-semibold">{title}</h2>
        {children}
      </CardContent>
    </Card>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  prefix,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  prefix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex justify-between text-sm font-semibold">
        <span>{label}</span>
        <span>{prefix}{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-tahona-terracotta"
      />
    </label>
  );
}
