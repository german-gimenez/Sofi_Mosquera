---
description: Sincroniza el schema Drizzle a Neon (DATABASE_URL_UNPOOLED)
agent: build
---

> ⚠️ Esta operación toca la base de datos de producción si `.env.local` apunta a prod.
> Confirmá con el usuario antes de ejecutar si hay cambios destructivos.

Mostrá primero los cambios actuales en `packages/db/src/schema.ts`:
!`git diff packages/db/src/schema.ts`

Si todo se ve OK, ejecutá:
!`pnpm --filter @sofi/db exec drizzle-kit push`

Si drizzle pregunta por `DROP COLUMN` o renombres, **frená** y avisá al usuario.

Después correr el test de schema para confirmar:
!`npx tsx packages/db/src/schema.test.ts`
