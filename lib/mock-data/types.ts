export type DiaSemana =
  | "lunes"
  | "martes"
  | "miércoles"
  | "jueves"
  | "viernes"
  | "sábado"
  | "domingo";

export type ProductoCategoria =
  | "Masa madre"
  | "Dulce mexicano"
  | "Baguettes y rústicos"
  | "Hojaldres"
  | "Especiales";

export type Producto = {
  id: string;
  slug: string;
  nombre: string;
  categoria: ProductoCategoria;
  descripcion_corta: string;
  descripcion_premium: string;
  ingredientes: string[];
  precio_mxn: number;
  tiempo_horneado_min: number;
  calorias?: number;
  imagen_url: string;
  disponibilidad: DiaSemana[];
};

export type Hub = {
  id: string;
  slug: string;
  nombre: string;
  direccion: string;
  colonia: string;
  coordenadas: { lat: number; lng: number };
  casilleros_total: number;
  casilleros_ocupados_actual: number;
  slots_horarios: string[];
  imagen_exterior: string;
  horario_operacion: string;
  gerente: string;
  clientes_activos: number;
};

export type CasilleroEstado = "vacio" | "cargado" | "retirado" | "incidencia";

export type Casillero = {
  id: string;
  hub_id: string;
  numero: number;
  estado: CasilleroEstado;
  pedido_actual: string | null;
};

export type ClienteEstado = "activo" | "pausado" | "cancelado";

export type Cliente = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  colonia: string;
  hub_asignado_id: string;
  fecha_alta: string;
  estado: ClienteEstado;
  metodo_pago_ultimo4: string;
  ticket_promedio_semanal_mxn: number;
};

export type SuscripcionEstado = "activa" | "pausada" | "cancelada";

export type Suscripcion = {
  id: string;
  cliente_id: string;
  productos: Array<{ producto_id: string; cantidad: number }>;
  slots_elegidos: Array<{ dia: DiaSemana; slot: string }>;
  frecuencia: "semanal";
  proxima_entrega: string;
  estado: SuscripcionEstado;
  historial_cambios: Array<{ fecha: string; descripcion: string }>;
};

export type EntregaEstado = "entregado" | "no_entregado" | "incidencia" | "listo";

export type Entrega = {
  id: string;
  cliente_id: string;
  hub_id: string;
  casillero_id: string;
  slot: string;
  fecha: string;
  productos: Array<{ producto_id: string; cantidad: number }>;
  estado: EntregaEstado;
  qr_code: string;
};

export type CobroEstado = "cobrado" | "pendiente" | "fallido";

export type Cobro = {
  id: string;
  cliente_id: string;
  monto: number;
  fecha: string;
  estado: CobroEstado;
  metodo: string;
  reintentos: number;
};

export type IncidenciaTipo =
  | "casillero_cerrado"
  | "cliente_no_recogio"
  | "producto_dañado"
  | "cobro_fallido"
  | "direccion_incorrecta";

export type IncidenciaEstado = "abierta" | "en_proceso" | "resuelta";

export type Incidencia = {
  id: string;
  tipo: IncidenciaTipo;
  descripcion: string;
  fecha: string;
  estado: IncidenciaEstado;
  cliente_id: string;
  hub_id: string;
};
