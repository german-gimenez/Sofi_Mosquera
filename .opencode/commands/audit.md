---
description: Corre todos los tests + audit estructural del proyecto
agent: build
---

Corré los siguientes tests en orden y reportá si pasan o fallan. Si alguno falla, mostrá la salida y proponé fix:

1. Tests de schema DB:
!`npx tsx packages/db/src/schema.test.ts`

2. Tests de tokens (Brand DNA):
!`npx tsx packages/tokens/src/tokens.test.ts`

3. Tests de helpers i18n:
!`npx tsx apps/web/src/lib/i18n-helpers.test.ts`

4. Tests de structured-data (JSON-LD):
!`npx tsx apps/web/src/lib/structured-data.test.ts`

5. Tests de mensajes de WhatsApp (vitest):
!`pnpm --filter @sofi/ui exec vitest run`

6. Audit estructural completo:
!`npx tsx scripts/audit-build.ts`

Si todo pasó: confirmá con un resumen breve de cuántos checks pasaron en total.
Si algo falló: mostrá el error exacto y sugerí dónde mirar.
