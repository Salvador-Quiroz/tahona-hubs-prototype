# Tahona Hubs Prototype

[![CI](https://github.com/Salvador-Quiroz/tahona-hubs-prototype/actions/workflows/ci.yml/badge.svg)](https://github.com/Salvador-Quiroz/tahona-hubs-prototype/actions/workflows/ci.yml)

Prototipo Next.js para una red de hubs de retiro de pan fresco de Tahona. Incluye app cliente PWA, panel operador y dashboard ejecutivo con datos mockeados coherentes entre vistas.

## Estado del proyecto

- App cliente con catálogo, onboarding, cuenta, entregas, pagos y soporte.
- Panel operador para producción, carga, casilleros, cobros, pedidos, incidencias y administración.
- Dashboard ejecutivo con vistas de crecimiento, operación, clientes, productos, hubs y proyecciones.
- Datos determinísticos en memoria para que las rutas y relaciones se mantengan consistentes.
- Verificación local activa con TypeScript, ESLint y build de producción.

## Stack

- Next.js 14 App Router
- TypeScript estricto
- Tailwind CSS
- Componentes estilo shadcn/ui en `components/ui`
- lucide-react
- Recharts
- framer-motion
- Zustand
- Datos mockeados determinísticos en `lib/mock-data`

## Primeros pasos

```bash
npm install
npm run dev
```

Servidor local: `http://localhost:3000`

Runtime recomendado: Node.js 20.

## Calidad

```bash
npm run ci
```

El comando anterior ejecuta:

```bash
npm run typecheck
npm run lint
npm run build
```

El repositorio incluye GitHub Actions en `.github/workflows/ci.yml` para ejecutar estas validaciones en pushes y pull requests.

## GitHub

- La guía de arranque está en `docs/github-setup.md`.
- La guía para contribuir está en `CONTRIBUTING.md`.
- El roadmap del prototipo está en `docs/product-roadmap.md`.
- Dependabot revisa dependencias npm y GitHub Actions cada semana.

## Estructura

- `app/(cliente)` rutas públicas y privadas del cliente.
- `app/(operador)/operador` herramienta interna de operación.
- `app/(dashboard)/dashboard` vistas ejecutivas.
- `components/cliente`, `components/operador`, `components/dashboard` experiencias por app.
- `components/shared` shells, métricas, mapa estilizado y badges.
- `lib/mock-data` productos, hubs, clientes, casilleros, suscripciones, entregas, cobros e incidencias.
- `lib/store/tahona-store.ts` estado global en memoria y acciones simuladas.
- `lib/constants/brand.ts` decisiones de marca y mapa de rutas.

## Decisiones de diseño

Tahona se trató como marca madre cálida y patrimonial: café profundo, terracota, crema, dorado pan tostado, maíz y nopal para señales operativas. El sitio oficial comunica "Desde 1957", ubicaciones reales como Montevideo 290 Lindavista y Eje Central con Belisario Domínguez, y lenguaje de tradición mexicana; no expone tokens CSS reutilizables, así que la paleta se documenta como fallback premium conservador.

La inspiración Cedric Grolet se aplica solo al catálogo y detalle de producto: fotografía protagonista, tipografía grande, producto como pieza editorial y transiciones suaves. Operador y dashboard usan interfaces más densas, sobrias y escaneables.

## Datos

El dataset se genera de forma determinística:

- 14 productos con imagen Unsplash, precio, ingredientes, disponibilidad y descripción.
- 3 hubs CDMX con 24 casilleros cada uno.
- 72 casilleros con estado actual.
- 200 clientes mexicanos ficticios: 160 activos, 25 pausados, 15 cancelados.
- 185 suscripciones activas o pausadas.
- 1,008 entregas de las últimas 8 semanas.
- Cobros históricos por cliente activo.
- 34 incidencias con estados y tipos variados.

Las relaciones se preservan por ID: clientes pertenecen a hubs, suscripciones pertenecen a clientes, entregas referencian cliente/hub/casillero y cobros referencian cliente.

## Rutas principales

### App Cliente

1. `/` - Landing pública
2. `/catalogo` - Catálogo premium
3. `/catalogo/hogaza-masa-madre` - Detalle de producto
4. `/como-funciona` - Cómo funciona
5. `/hubs` - Encuentra tu hub
6. `/hubs/hub-polanco` - Detalle de hub
7. `/suscribirme` - Onboarding acceso
8. `/suscribirme/productos` - Onboarding productos
9. `/suscribirme/horarios` - Onboarding horarios
10. `/suscribirme/direccion` - Onboarding dirección
11. `/suscribirme/pago` - Onboarding pago
12. `/suscribirme/confirmacion` - Confirmación
13. `/cuenta` - Resumen privado
14. `/cuenta/suscripcion` - Mi suscripción
15. `/cuenta/suscripcion/editar` - Editar pedido semanal
16. `/cuenta/suscripcion/pausar` - Pausar suscripción
17. `/cuenta/entregas` - Mis entregas
18. `/cuenta/entrega/ent-20260615-01` - Entrega lista con QR
19. `/cuenta/pagos` - Pagos
20. `/cuenta/perfil` - Perfil
21. `/soporte` - Soporte / FAQ
22. `/login` - Login
23. `/registro` - Registro

### Panel Operador

24. `/operador` - Dashboard del día
25. `/operador/produccion` - Producción del día
26. `/operador/produccion/semanal` - Producción semanal
27. `/operador/carga` - Carga de casilleros
28. `/operador/casilleros` - Estado de casilleros
29. `/operador/entregas/ent-20260615-01` - Marcar entrega individual
30. `/operador/suscripciones` - Suscripciones
31. `/operador/suscripciones/sub-cl-001` - Detalle de suscripción
32. `/operador/pedidos` - Pedidos del día
33. `/operador/pedidos/extra` - Pedidos extra
34. `/operador/cobros` - Cobros del día
35. `/operador/cobros/reintentos` - Reintentos de cobro
36. `/operador/cobros/conciliacion` - Conciliación
37. `/operador/catalogo` - Catálogo admin
38. `/operador/hubs` - Hubs admin
39. `/operador/equipo` - Equipo
40. `/operador/incidencias` - Incidencias
41. `/operador/configuracion` - Configuración

### Dashboard Ejecutivo

42. `/dashboard` - Resumen ejecutivo
43. `/dashboard/crecimiento` - Crecimiento
44. `/dashboard/operacion` - Operación
45. `/dashboard/clientes` - Clientes
46. `/dashboard/productos` - Productos
47. `/dashboard/hubs` - Hubs
48. `/dashboard/proyecciones` - Proyecciones

## Verificación local

Última verificación local:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

Las 48 rutas compilan correctamente en producción.
