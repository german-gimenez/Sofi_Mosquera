# CLAUDE.md — Sofia Mosquera

> **La fuente única de verdad de este proyecto es `AGENTS.md`** (raíz del repo).
> Claude Code, OpenCode y Cursor leen ese archivo. No dupliques contenido acá.

## Para Claude Code

1. **Al iniciar sesión:** leé `AGENTS.md` completo. Cubre stack, i18n, Brand DNA, schema, comandos y deploy.
2. **Reglas de UI fina:** revisar `.cursor/rules/*.mdc` (brand-dna, cloudinary, db-patterns).
3. **Estado WIP / decisiones recientes:** `docs/STATE.md`.
4. **Antes de tocar rutas:** leer `apps/web/src/i18n/routing.ts`.
5. **Antes de tocar DB:** leer `packages/db/src/schema.ts` y correr `npx tsx packages/db/src/schema.test.ts`.
6. **Antes de pushear:** correr `/audit` (OpenCode) o equivalente — todos los tests + audit estructural.

## Comandos slash de Claude Code (memoria napsix)

- `/init-memoria` — no usar acá, ya está inicializado.
- `/guardar-progreso` — actualiza `docs/STATE.md` con snapshot de la sesión.
- `/recuperar-contexto` — releer `AGENTS.md` + `docs/STATE.md` + última entrada de git log.

## Convivencia con OpenCode + Cursor

- Los tres agentes editan el mismo árbol. Hacé commits chicos y bien etiquetados.
- Si dejás WIP, anotalo en `docs/STATE.md`.
- Las cursor rules en `.cursor/rules/*.mdc` están listadas en `opencode.json > instructions`, así que OpenCode las respeta también.
