---
description: Corre solo los unit tests (sin audit estructural)
agent: build
---

Tests rápidos del proyecto. Si alguno falla, reportalo:

1. Schema DB:
!`npx tsx packages/db/src/schema.test.ts`

2. Tokens (Brand DNA):
!`npx tsx packages/tokens/src/tokens.test.ts`

3. i18n helpers:
!`npx tsx apps/web/src/lib/i18n-helpers.test.ts`

4. Structured data:
!`npx tsx apps/web/src/lib/structured-data.test.ts`

5. WhatsApp messages (vitest, no tsx):
!`pnpm --filter @sofi/ui exec vitest run`

Resumen: cuántos pasan vs cuántos fallan.
