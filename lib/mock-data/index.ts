import { hubsBase } from "./hubs";
import { productos } from "./products";
import type {
  Casillero,
  CasilleroEstado,
  Cliente,
  ClienteEstado,
  Cobro,
  CobroEstado,
  DiaSemana,
  Entrega,
  EntregaEstado,
  Hub,
  Incidencia,
  IncidenciaEstado,
  IncidenciaTipo,
  Suscripcion,
  SuscripcionEstado
} from "./types";

export { productos } from "./products";
export type * from "./types";

const referenceDate = new Date("2026-06-15T12:00:00-06:00");
const today = "2026-06-15";
const dias: DiaSemana[] = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const slots = ["7:00 AM", "1:30 PM", "7:30 PM"];

const nombres = [
  "Mariana",
  "Diego",
  "Carolina",
  "Andrés",
  "Regina",
  "Santiago",
  "Valeria",
  "Emiliano",
  "Camila",
  "Leonardo",
  "Fernanda",
  "Mateo",
  "Sofía",
  "Rodrigo",
  "Paola",
  "Sebastián",
  "Renata",
  "Tomás",
  "Lucía",
  "Nicolás"
];
const apellidos = [
  "Soto",
  "Hernández",
  "Esquivel",
  "Vázquez",
  "Mijares",
  "Salcedo",
  "Obregón",
  "Alarcón",
  "Rangel",
  "Téllez",
  "Cárdenas",
  "Mendoza",
  "Zamora",
  "Pineda",
  "Luna",
  "Arteaga",
  "Villaseñor",
  "Robles",
  "Ibarra",
  "Aguirre"
];
const colonias = [
  "Polanco",
  "Anzures",
  "Granada",
  "Condesa",
  "Roma Norte",
  "Hipódromo",
  "Del Valle Centro",
  "Narvarte",
  "Nápoles",
  "Lindavista"
];

function isoDate(daysAgo: number) {
  const date = new Date(referenceDate);
  date.setDate(referenceDate.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function futureDate(daysAhead: number) {
  const date = new Date(referenceDate);
  date.setDate(referenceDate.getDate() + daysAhead);
  return date.toISOString().slice(0, 10);
}

function statusForClient(index: number): ClienteEstado {
  if (index < 160) return "activo";
  if (index < 185) return "pausado";
  return "cancelado";
}

export function getClientes(): Cliente[] {
  return Array.from({ length: 200 }, (_, rawIndex) => {
    const index = rawIndex + 1;
    const nombre = nombres[rawIndex % nombres.length];
    const apellido = apellidos[(rawIndex * 7) % apellidos.length];
    const colonia = colonias[(rawIndex * 5 + 2) % colonias.length];
    const hub = hubsBase[rawIndex % hubsBase.length];
    return {
      id: `cl-${String(index).padStart(3, "0")}`,
      nombre,
      apellido,
      email: `${nombre}.${apellido}.${index}@tahona.demo`
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
      telefono: `55 ${String(3200 + rawIndex).padStart(4, "0")} ${String(7800 + rawIndex).padStart(4, "0")}`,
      direccion: `Calle ${["Horacio", "Amsterdam", "Matías Romero", "Euler", "Zacatecas"][rawIndex % 5]} ${80 + rawIndex}`,
      colonia,
      hub_asignado_id: hub.id,
      fecha_alta: isoDate((rawIndex * 11) % 240),
      estado: statusForClient(rawIndex),
      metodo_pago_ultimo4: "•••• 4242",
      ticket_promedio_semanal_mxn: 180 + ((rawIndex * 37) % 541)
    };
  });
}

export function getHubs(): Hub[] {
  const clientes = getClientes();
  return hubsBase.map((hub) => ({
    ...hub,
    clientes_activos: clientes.filter(
      (cliente) => cliente.hub_asignado_id === hub.id && cliente.estado === "activo"
    ).length
  }));
}

export function getSuscripciones(): Suscripcion[] {
  return getClientes()
    .filter((cliente) => cliente.estado !== "cancelado")
    .map((cliente, index) => {
      const productoA = productos[index % productos.length];
      const productoB = productos[(index * 3 + 4) % productos.length];
      const productoC = productos[(index * 5 + 7) % productos.length];
      const estado: SuscripcionEstado = cliente.estado === "pausado" ? "pausada" : "activa";
      return {
        id: `sub-${cliente.id}`,
        cliente_id: cliente.id,
        productos: [
          { producto_id: productoA.id, cantidad: 1 + (index % 2) },
          { producto_id: productoB.id, cantidad: 1 },
          { producto_id: productoC.id, cantidad: index % 5 === 0 ? 2 : 1 }
        ],
        slots_elegidos: [
          { dia: dias[index % dias.length], slot: slots[index % slots.length] },
          { dia: dias[(index + 3) % dias.length], slot: slots[(index + 1) % slots.length] }
        ],
        frecuencia: "semanal",
        proxima_entrega: futureDate(1 + (index % 6)),
        estado,
        historial_cambios: [
          { fecha: cliente.fecha_alta, descripcion: "Suscripción creada desde la app cliente." },
          {
            fecha: isoDate((index * 3) % 45),
            descripcion:
              index % 4 === 0
                ? "Cliente actualizó productos del pedido semanal."
                : "Sistema confirmó ventana horaria semanal."
          }
        ]
      };
    });
}

function subscriptionProducts(clienteId: string) {
  const subscription = getSuscripciones().find((item) => item.cliente_id === clienteId);
  return subscription?.productos ?? [{ producto_id: productos[0].id, cantidad: 1 }];
}

export function getEntregas(): Entrega[] {
  const clientesActivos = getClientes().filter((cliente) => cliente.estado === "activo");
  const entregas: Entrega[] = [];
  for (let day = 0; day < 56; day += 1) {
    for (let order = 0; order < 18; order += 1) {
      const cliente = clientesActivos[(day * 19 + order * 7) % clientesActivos.length];
      const hubId = cliente.hub_asignado_id;
      const casilleroNumero = ((day * 18 + order) % 24) + 1;
      const score = (day * 18 + order * 13) % 100;
      const estado: EntregaEstado =
        day === 0 && order < 9
          ? "listo"
          : score < 92
            ? "entregado"
            : score < 97
              ? "no_entregado"
              : "incidencia";
      const id = `ent-${isoDate(day).replaceAll("-", "")}-${String(order + 1).padStart(2, "0")}`;
      entregas.push({
        id,
        cliente_id: cliente.id,
        hub_id: hubId,
        casillero_id: `${hubId}-locker-${String(casilleroNumero).padStart(2, "0")}`,
        slot: slots[order % slots.length],
        fecha: isoDate(day),
        productos: subscriptionProducts(cliente.id),
        estado,
        qr_code: `TAHONA-${id.toUpperCase()}`
      });
    }
  }
  return entregas;
}

export function getCasilleros(): Casillero[] {
  const todays = getEntregas().filter((entrega) => entrega.fecha === today);
  return hubsBase.flatMap((hub) =>
    Array.from({ length: 24 }, (_, index) => {
      const numero = index + 1;
      const id = `${hub.id}-locker-${String(numero).padStart(2, "0")}`;
      const entrega = todays.find((item) => item.casillero_id === id);
      const estadoByIndex: CasilleroEstado =
        index % 17 === 0
          ? "incidencia"
          : index % 5 === 0
            ? "retirado"
            : index < hub.casilleros_ocupados_actual
              ? "cargado"
              : "vacio";
      return {
        id,
        hub_id: hub.id,
        numero,
        estado: entrega?.estado === "listo" ? "cargado" : estadoByIndex,
        pedido_actual: entrega?.id ?? null
      };
    })
  );
}

export function getCobros(): Cobro[] {
  const clientesActivos = getClientes().filter((cliente) => cliente.estado === "activo");
  return clientesActivos.flatMap((cliente, index) => {
    const count = 4 + (index % 5);
    return Array.from({ length: count }, (_, chargeIndex) => {
      const score = (index * 17 + chargeIndex * 23) % 100;
      const estado: CobroEstado = score < 88 ? "cobrado" : score < 95 ? "pendiente" : "fallido";
      return {
        id: `cob-${cliente.id}-${String(chargeIndex + 1).padStart(2, "0")}`,
        cliente_id: cliente.id,
        monto: cliente.ticket_promedio_semanal_mxn + ((chargeIndex * 31) % 120),
        fecha: isoDate(chargeIndex * 7 + (index % 4)),
        estado,
        metodo: cliente.metodo_pago_ultimo4,
        reintentos: estado === "fallido" ? 2 : estado === "pendiente" ? 1 : 0
      };
    });
  });
}

const incidenciaTipos: IncidenciaTipo[] = [
  "casillero_cerrado",
  "cliente_no_recogio",
  "producto_dañado",
  "cobro_fallido",
  "direccion_incorrecta"
];
const incidenciaEstados: IncidenciaEstado[] = ["abierta", "en_proceso", "resuelta"];

export function getIncidencias(): Incidencia[] {
  const clientes = getClientes();
  return Array.from({ length: 34 }, (_, index) => {
    const cliente = clientes[(index * 11 + 5) % clientes.length];
    const tipo = incidenciaTipos[index % incidenciaTipos.length];
    return {
      id: `inc-${String(index + 1).padStart(3, "0")}`,
      tipo,
      descripcion:
        tipo === "casillero_cerrado"
          ? "El cliente reportó que el casillero no abrió al primer intento."
          : tipo === "cliente_no_recogio"
            ? "La entrega permaneció sin retiro después de la ventana asignada."
            : tipo === "producto_dañado"
              ? "La bolsa llegó con una pieza comprimida durante la carga."
              : tipo === "cobro_fallido"
                ? "La tarjeta requiere actualización antes del siguiente corte."
                : "La dirección capturada no coincide con el hub más cercano.",
      fecha: isoDate((index * 2) % 40),
      estado: incidenciaEstados[index % incidenciaEstados.length],
      cliente_id: cliente.id,
      hub_id: cliente.hub_asignado_id
    };
  });
}

export function getMockData() {
  const clientes = getClientes();
  const hubs = getHubs();
  const casilleros = getCasilleros();
  const suscripciones = getSuscripciones();
  const entregas = getEntregas();
  const cobros = getCobros();
  const incidencias = getIncidencias();
  return {
    productos,
    hubs,
    casilleros,
    clientes,
    suscripciones,
    entregas,
    cobros,
    incidencias
  };
}
