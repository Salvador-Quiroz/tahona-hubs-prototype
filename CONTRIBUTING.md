# Contribuir a Tahona Hubs Prototype

Este prototipo vive como una base de producto para explorar la experiencia de cliente, operación y dashboard ejecutivo de Tahona Hubs. La prioridad es mantener cambios pequeños, verificables y fáciles de revisar.

## Flujo recomendado

1. Crea una rama desde `main`.
2. Haz cambios acotados por tema.
3. Ejecuta `npm run ci`.
4. Abre un pull request hacia `main`.
5. Completa la plantilla de PR con resumen, validación y notas.

## Convenciones

- Mantén TypeScript estricto y evita desactivar reglas sin una razón clara.
- Reutiliza componentes de `components/ui` y patrones existentes antes de crear nuevos.
- Conserva los datos mockeados consistentes por ID entre cliente, operador y dashboard.
- Documenta rutas, estados o decisiones de producto cuando el cambio altere el flujo de uso.

## Validación local

```bash
npm install
npm run ci
```

`npm run ci` ejecuta typecheck, lint y build de producción.
