export const tahonaBrand = {
  name: "Tahona",
  founded: "1957",
  sourceNotes: [
    "La referencia visual aprobada usa azul intenso, blanco y amarillo como acento de 'Desde 1957'.",
    "La tienda publica debe ser grafica, editorial y apetecible; los paneles deben ser sobrios y de alta confianza.",
    "El azul de marca no debe dominar dashboards operativos: se usa para navegacion, foco, seleccion y algunos acentos."
  ],
  palette: {
    blue: "#2040D0",
    white: "#FFFFFF",
    yellow: "#FFCF5A",
    grid: "#7085E1",
    ink: "#101828",
    slate: "#344054",
    steel: "#667085",
    surface: "#F6F8FF",
    line: "#D6DDF5",
    success: "#147D64",
    danger: "#C2413B"
  },
  typography: {
    display: "Inter Black / Manrope",
    body: "Inter / Manrope / system sans"
  },
  tone: [
    "grafico y contundente",
    "pan fresco con oficio",
    "retail premium sin friccion",
    "operación vigilada",
    "confianza para inversionistas"
  ],
  designPrinciples: [
    "Cliente: fotografia, deseo, reticula azul y CTA claros.",
    "Pedido: resumen persistente, estados visibles, validacion y confianza.",
    "Operación: densidad, excepciones, SLA, trazabilidad y acción rápida.",
    "Dashboard: neutros dominantes, marca como acento, lectura ejecutiva."
  ]
} as const;

export const appRoutes = {
  cliente: [
    ["/", "Landing publica"],
    ["/catalogo", "Catálogo premium"],
    ["/catalogo/hogaza-masa-madre", "Detalle de producto"],
    ["/como-funciona", "Como funciona"],
    ["/hubs", "Encuentra tu hub"],
    ["/hubs/hub-polanco", "Detalle de hub"],
    ["/suscribirme", "Onboarding: acceso"],
    ["/suscribirme/productos", "Onboarding: productos"],
    ["/suscribirme/horarios", "Onboarding: horarios"],
    ["/suscribirme/direccion", "Onboarding: direccion"],
    ["/suscribirme/pago", "Onboarding: pago"],
    ["/suscribirme/confirmacion", "Onboarding: confirmacion"],
    ["/cuenta", "Mi cuenta"],
    ["/cuenta/suscripcion", "Mi suscripcion"],
    ["/cuenta/suscripcion/editar", "Editar pedido semanal"],
    ["/cuenta/suscripcion/pausar", "Pausar suscripcion"],
    ["/cuenta/entregas", "Mis entregas"],
    ["/cuenta/entrega/ent-20260615-01", "Entrega lista"],
    ["/cuenta/pagos", "Pagos"],
    ["/cuenta/perfil", "Perfil"],
    ["/soporte", "Soporte"],
    ["/login", "Login"],
    ["/registro", "Registro"]
  ],
  operador: [
    ["/operador", "Dashboard del dia"],
    ["/operador/produccion", "Producción del día"],
    ["/operador/produccion/semanal", "Producción semanal"],
    ["/operador/carga", "Carga de casilleros"],
    ["/operador/casilleros", "Casilleros en tiempo real"],
    ["/operador/entregas/ent-20260615-01", "Marcar entrega individual"],
    ["/operador/suscripciones", "Suscripciones"],
    ["/operador/suscripciones/sub-cl-001", "Detalle de suscripcion"],
    ["/operador/pedidos", "Pedidos del dia"],
    ["/operador/pedidos/extra", "Pedidos extra"],
    ["/operador/cobros", "Cobros del dia"],
    ["/operador/cobros/reintentos", "Reintentos de cobro"],
    ["/operador/cobros/conciliacion", "Conciliación"],
    ["/operador/catalogo", "Catálogo admin"],
    ["/operador/hubs", "Hubs admin"],
    ["/operador/equipo", "Equipo"],
    ["/operador/incidencias", "Incidencias"],
    ["/operador/configuracion", "Configuración"]
  ],
  dashboard: [
    ["/dashboard", "Resumen ejecutivo"],
    ["/dashboard/crecimiento", "Crecimiento"],
    ["/dashboard/operacion", "Operación"],
    ["/dashboard/clientes", "Clientes"],
    ["/dashboard/productos", "Productos"],
    ["/dashboard/hubs", "Hubs"],
    ["/dashboard/proyecciones", "Proyecciones"]
  ]
} as const;
