# Roadmap del Prototipo

Este roadmap organiza los siguientes pasos para convertir el prototipo en una base de producto más cercana a producción.

## 1. Fundamentos de producto

- Definir los roles principales: cliente, operador de hub, administrador y dirección.
- Priorizar los flujos críticos de suscripción, entrega, cobro y soporte.
- Convertir los datos mockeados en contratos de datos documentados antes de conectar backend.

## 2. App cliente

- Validar onboarding completo con selección de producto, horario, dirección y pago.
- Agregar estados vacíos, errores recuperables y confirmaciones claras.
- Preparar autenticación real, sesión persistente y recuperación de cuenta.

## 3. Operación de hubs

- Endurecer el flujo de producción diaria, carga de casilleros y marcado de entregas.
- Separar vistas de operación urgente de vistas administrativas.
- Agregar auditoría de acciones para entregas, cobros, incidencias y cambios de suscripción.

## 4. Dashboard ejecutivo

- Definir métricas fuente para crecimiento, churn, ocupación de hubs, producción y cobranza.
- Agregar filtros consistentes por rango de fecha, hub y producto.
- Preparar exportación de datos o reportes cuando los datos de backend estén disponibles.

## 5. Backend e integraciones

- Reemplazar `lib/mock-data` por una capa de acceso a datos.
- Agregar persistencia de usuarios, suscripciones, entregas, pagos e incidencias.
- Integrar proveedor de pagos, notificaciones y eventos operativos.

## 6. Calidad y despliegue

- Mantener `npm run ci` como gate mínimo para pull requests.
- Agregar pruebas de flujos críticos cuando el backend o acciones reales entren al proyecto.
- Proteger `main` en GitHub y mantener Vercel conectado a esa rama.
