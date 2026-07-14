"use client";

import { create } from "zustand";
import { getMockData } from "@/lib/mock-data";
import type {
  Casillero,
  Cliente,
  Cobro,
  CobroEstado,
  Entrega,
  EntregaEstado,
  Hub,
  Incidencia,
  Producto,
  Suscripcion
} from "@/lib/mock-data";

type TahonaState = {
  productos: Producto[];
  hubs: Hub[];
  casilleros: Casillero[];
  clientes: Cliente[];
  suscripciones: Suscripcion[];
  entregas: Entrega[];
  cobros: Cobro[];
  incidencias: Incidencia[];
  currentClientId: string;
  selectedHubId: string | null;
  setSelectedHub: (id: string) => void;
  cart: Record<string, number>;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  setCartQuantity: (productId: string, quantity: number) => void;
  markDelivery: (id: string, estado: EntregaEstado) => void;
  loadLocker: (casilleroId: string, deliveryId: string) => void;
  pauseSubscription: (id: string, weeks: number) => void;
  reactivateSubscription: (id: string) => void;
  updateWeeklyOrder: (
    id: string,
    productos: Array<{ producto_id: string; cantidad: number }>
  ) => void;
  retryCharge: (id: string) => void;
  resolveIncident: (id: string) => void;
};

const data = getMockData();

function cobroAfterRetry(cobro: Cobro): Cobro {
  const nextEstado: CobroEstado = cobro.reintentos >= 2 ? "cobrado" : "pendiente";
  return {
    ...cobro,
    estado: nextEstado,
    reintentos: cobro.reintentos + 1
  };
}

export const useTahonaStore = create<TahonaState>((set) => ({
  ...data,
  currentClientId: "cl-001",
  selectedHubId: null,
  setSelectedHub: (id) => {
    try {
      window.localStorage.setItem("tahona:hub", id);
    } catch {}
    set({ selectedHubId: id });
  },
  cart: {},
  addToCart: (productId) =>
    set((state) => ({
      cart: {
        ...state.cart,
        [productId]: (state.cart[productId] ?? 0) + 1
      }
    })),
  removeFromCart: (productId) =>
    set((state) => {
      const nextQuantity = Math.max(0, (state.cart[productId] ?? 0) - 1);
      const nextCart = { ...state.cart };
      if (nextQuantity === 0) {
        delete nextCart[productId];
      } else {
        nextCart[productId] = nextQuantity;
      }
      return { cart: nextCart };
    }),
  setCartQuantity: (productId, quantity) =>
    set((state) => {
      const nextCart = { ...state.cart };
      if (quantity <= 0) {
        delete nextCart[productId];
      } else {
        nextCart[productId] = quantity;
      }
      return { cart: nextCart };
    }),
  markDelivery: (id, estado) =>
    set((state) => ({
      entregas: state.entregas.map((entrega) =>
        entrega.id === id ? { ...entrega, estado } : entrega
      ),
      casilleros:
        estado === "entregado"
          ? state.casilleros.map((casillero) =>
              casillero.pedido_actual === id
                ? { ...casillero, estado: "retirado", pedido_actual: null }
                : casillero
            )
          : state.casilleros
    })),
  // Operador de piso: carga el pedido en un casillero y lo deja listo para retiro.
  loadLocker: (casilleroId, deliveryId) =>
    set((state) => ({
      casilleros: state.casilleros.map((casillero) =>
        casillero.id === casilleroId
          ? { ...casillero, estado: "cargado", pedido_actual: deliveryId }
          : casillero
      ),
      entregas: state.entregas.map((entrega) =>
        entrega.id === deliveryId
          ? { ...entrega, estado: "listo", casillero_id: casilleroId }
          : entrega
      )
    })),
  pauseSubscription: (id, weeks) =>
    set((state) => ({
      suscripciones: state.suscripciones.map((suscripcion) =>
        suscripcion.id === id
          ? {
              ...suscripcion,
              estado: "pausada",
              historial_cambios: [
                {
                  fecha: "2026-06-15",
                  descripcion: `Pausa registrada por ${weeks} semana${weeks === 1 ? "" : "s"}.`
                },
                ...suscripcion.historial_cambios
              ]
            }
          : suscripcion
      )
    })),
  reactivateSubscription: (id) =>
    set((state) => ({
      suscripciones: state.suscripciones.map((suscripcion) =>
        suscripcion.id === id
          ? {
              ...suscripcion,
              estado: "activa",
              historial_cambios: [
                { fecha: "2026-06-15", descripcion: "Reactivación manual desde operación." },
                ...suscripcion.historial_cambios
              ]
            }
          : suscripcion
      )
    })),
  updateWeeklyOrder: (id, productos) =>
    set((state) => ({
      suscripciones: state.suscripciones.map((suscripcion) =>
        suscripcion.id === id
          ? {
              ...suscripcion,
              productos,
              historial_cambios: [
                { fecha: "2026-06-15", descripcion: "Pedido semanal actualizado." },
                ...suscripcion.historial_cambios
              ]
            }
          : suscripcion
      )
    })),
  retryCharge: (id) =>
    set((state) => ({
      cobros: state.cobros.map((cobro) => (cobro.id === id ? cobroAfterRetry(cobro) : cobro))
    })),
  resolveIncident: (id) =>
    set((state) => ({
      incidencias: state.incidencias.map((incidencia) =>
        incidencia.id === id ? { ...incidencia, estado: "resuelta" } : incidencia
      )
    }))
}));
