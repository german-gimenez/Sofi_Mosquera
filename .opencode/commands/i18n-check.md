---
description: Audita el estado de la i18n (rutas + messages + columnas _en)
agent: build
---

Verificá la coherencia del setup i18n de Sofia Mosquera:

1. Listar rutas configuradas:
@apps/web/src/i18n/routing.ts

2. Diffear mensajes ES vs EN — ¿faltan keys?
!`pnpm dlx json-diff apps/web/messages/es.json apps/web/messages/en.json 2>&1 | Out-String`

3. Columnas `_en` en schema:
!`Select-String -Path packages\db\src\schema.ts -Pattern '_en' | Select-Object -ExpandProperty Line`

4. Pages bajo `[locale]`:
!`Get-ChildItem -Path apps\web\src\app -Recurse -Filter "page.tsx" | ForEach-Object { $_.FullName.Replace((Get-Location).Path, '') }`

5. ¿Hay rutas legacy fuera de `[locale]` que deban redirigir?
!`Get-ChildItem -Path apps\web\src\app -Directory | Where-Object { $_.Name -notmatch '^\[' -and $_.Name -ne 'api' } | Select-Object -ExpandProperty Name`

Reportá:
- Si hay keys ES sin contraparte EN (o viceversa)
- Si alguna columna del schema tiene texto user-facing pero no tiene `_en`
- Si hay rutas top-level sin redirect en `next.config.ts`
