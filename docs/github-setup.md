# Guía de Arranque en GitHub

Esta guía deja el proyecto listo para colaborar con pull requests y validaciones automáticas.

## Estado actual

- Repositorio remoto: `https://github.com/Salvador-Quiroz/tahona-hubs-prototype`
- Rama base: `main`
- Rama de preparación: `codex/github-readiness`
- Validación local: `npm run ci`
- Runtime: Node.js 20

## Crear el pull request inicial

Abre este enlace:

https://github.com/Salvador-Quiroz/tahona-hubs-prototype/pull/new/codex/github-readiness

Usa este resumen:

```md
## Resumen

- Corrige y reorganiza el README para GitHub.
- Agrega CI con typecheck, lint y build.
- Agrega plantillas de issue y pull request.
- Agrega metadatos de repositorio, `npm run ci`, guía de contribución y Dependabot.

## Validación

- `npm run ci`
```

## Recomendaciones del repositorio

En GitHub, revisa estas opciones cuando el PR inicial quede listo:

1. Activa branch protection en `main`.
2. Exige que el check `Typecheck, lint and build` pase antes de mezclar.
3. Usa pull requests para cambios importantes.
4. Mantén la rama `main` desplegable en Vercel.

## Flujo diario

```bash
git switch main
git pull
git switch -c nombre-de-rama
nvm use
npm install
npm run dev
npm run ci
```

Después del commit:

```bash
git push -u origin nombre-de-rama
```

Abre un PR y espera los checks de GitHub Actions.
