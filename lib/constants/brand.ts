export const tahonaBrand = {
  name: "Tahona",
  founded: "1957",
  sourceNotes: [
    "El sitio oficial comunica 'Desde 1957' y describe a Tahona como 'Donde se hace el pan'.",
    "La identidad visual pública mezcla tradición mexicana, fachada amarilla patrimonial, café cálido y lenguaje de pan artesanal.",
    "El sitio no expuso tokens CSS reutilizables; se usó una paleta premium conservadora derivada del brief y del carácter visual observado."
  ],
  palette: {
    ink: "#1F1A17",
    cacao: "#4B2E1F",
    terracotta: "#A0411F",
    crust: "#D4A574",
    maiz: "#E7C654",
    cream: "#F5EFE6",
    masa: "#FAFAF7",
    cantera: "#D9C8B4",
    nopal: "#5F7652",
    rose: "#F2D9DE"
  },
  typography: {
    display: "Cormorant Garamond / Georgia",
    body: "Inter / Manrope / system sans"
  },
  tone: [
    "tradición viva",
    "pan recién horneado",
    "oficio mexicano",
    "calidad auténtica",
    "experiencia cálida y precisa"
  ],
  groletPrinciplesForCatalog: [
    "fotografía protagonista a pantalla completa",
    "producto con nombre grande y descripción mínima",
    "transiciones suaves y mucho espacio en blanco",
    "sensación editorial de pieza única, aplicada solo al catálogo"
  ]
} as const;

export const appRoutes = {
  cliente: [
    ["/", "Landing pública"],
    ["/catalogo", "Catálogo premium"],
    ["/catalogo/hogaza-masa-madre", "Detalle de producto"],
    ["/como-funciona", "Cómo funciona"],
    ["/hubs", "Encuentra tu hub"],
    ["/hubs/hub-polanco", "Detalle de hub"],
    ["/suscribirme", "Onboarding: acceso"],
    ["/suscribirme/productos", "Onboarding: productos"],
    ["/suscribirme/horarios", "Onboarding: horarios"],
    ["/suscribirme/direccion", "Onboarding: dirección"],
    ["/suscribirme/pago", "Onboarding: pago"],
    ["/suscribirme/confirmacion", "Onboarding: confirmación"],
    ["/cuenta", "Mi cuenta"],
    ["/cuenta/suscripcion", "Mi suscripción"],
    ["/cuenta/suscripcion/editar", "Editar pedido semanal"],
    ["/cuenta/suscripcion/pausar", "Pausar suscripción"],
    ["/cuenta/entregas", "Mis entregas"],
    ["/cuenta/entrega/ent-20260615-01", "Entrega lista"],
    ["/cuenta/pagos", "Pagos"],
    ["/cuenta/perfil", "Perfil"],
    ["/soporte", "Soporte"],
    ["/login", "Login"],
    ["/registro", "Registro"]
  ],
  operador: [
    ["/operador", "Dashboard del día"],
    ["/operador/produccion", "Producción del día"],
    ["/operador/produccion/semanal", "Producción semanal"],
    ["/operador/carga", "Carga de casilleros"],
    ["/operador/casilleros", "Casilleros en tiempo real"],
    ["/operador/entregas/ent-20260615-01", "Marcar entrega individual"],
    ["/operador/suscripciones", "Suscripciones"],
    ["/operador/suscripciones/sub-cl-001", "Detalle de suscripción"],
    ["/operador/pedidos", "Pedidos del día"],
    ["/operador/pedidos/extra", "Pedidos extra"],
    ["/operador/cobros", "Cobros del día"],
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
