import type { Hub } from "./types";

const hubImg = (id: string) =>
  `https://images.unsplash.com/${id}?q=82&w=1800&auto=format&fit=crop`;

export const hubsBase: Omit<Hub, "clientes_activos">[] = [
  {
    id: "hub-polanco",
    slug: "hub-polanco",
    nombre: "Hub Polanco",
    direccion: "Av. Presidente Masaryk 360, Polanco",
    colonia: "Polanco",
    coordenadas: { lat: 19.4337, lng: -99.1962 },
    casilleros_total: 24,
    casilleros_ocupados_actual: 18,
    slots_horarios: ["7:00 AM", "1:30 PM", "7:30 PM"],
    imagen_exterior: hubImg("photo-1555396273-367ea4eb4db5"),
    horario_operacion: "Lunes a domingo, 6:30 AM - 9:30 PM",
    gerente: "Lucía Mijares"
  },
  {
    id: "hub-condesa",
    slug: "hub-condesa",
    nombre: "Hub Condesa",
    direccion: "Av. Tamaulipas 92, Condesa",
    colonia: "Condesa",
    coordenadas: { lat: 19.4116, lng: -99.1712 },
    casilleros_total: 24,
    casilleros_ocupados_actual: 22,
    slots_horarios: ["7:00 AM", "1:30 PM", "7:30 PM"],
    imagen_exterior: hubImg("photo-1517248135467-4c7edcad34c4"),
    horario_operacion: "Lunes a domingo, 6:30 AM - 9:30 PM",
    gerente: "Rodrigo Salcedo"
  },
  {
    id: "hub-del-valle",
    slug: "hub-del-valle",
    nombre: "Hub Del Valle",
    direccion: "Insurgentes Sur 1018, Del Valle Centro",
    colonia: "Del Valle Centro",
    coordenadas: { lat: 19.3833, lng: -99.1748 },
    casilleros_total: 24,
    casilleros_ocupados_actual: 13,
    slots_horarios: ["7:00 AM", "1:30 PM", "7:30 PM"],
    imagen_exterior: hubImg("photo-1521017432531-fbd92d768814"),
    horario_operacion: "Lunes a domingo, 6:30 AM - 9:30 PM",
    gerente: "Mariana Obregón"
  }
];
