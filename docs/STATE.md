# Project State Log

> Bitácora corta de WIP, decisiones recientes y próximos pasos.
> Cada sesión que deje cambios sin terminar agrega una entrada arriba (más nuevo primero).
> Para snapshot automático, usar `/save-progress` desde OpenCode.

---

## 2026-05-05 — Cloudinary cleanup + namespace enforcement

**Hecho:**
- Reorganización completa del namespace `sofi-mosquera/` en Cloudinary (commit `b5bc047`):
  - 50 assets movidos a `_archive/` (6 proyectos legacy con `visible=false` + 2 artworks huérfanos `music`, `nacimiento-2`)
  - 12 DB rows reescritas (6 projects + 6 furniture cuyo placeholder apuntaba a proyectos archivados)
  - Cross-audit DB↔Cloudinary: 49/49 IN SYNC
  - 0 imágenes rotas verificadas en /es, /es/proyectos, /en/projects, /es/arte, /en/art, /es/muebles, /en/furniture
- Guardrails de namespace (commit `23454ca`):
  - `assertSofiPath()` + `isSofiPath()` + `SOFI_NAMESPACE` exportados desde `@sofi/ui`
  - `/api/cloudinary-sign` reescribe `folder`/`public_id` server-side antes de firmar
  - `upload-images.ts`, `upload-branding.ts` validan prefix antes de subir
  - 19 unit tests del helper + DB↔Cloudinary cross-audit corren en `pnpm test`
- Rename de las 8 covers de Emociones (commit `eb81d6c`): de `artworks/{slug}/cover` → `artworks/emociones/{slug}/cover`
- Tooling permanente:
  - `scripts/audit-cloudinary.ts` — inventario completo agrupado por carpeta, vuelca a `tmp-cloudinary-inventory.json`
  - `packages/db/audit-db-vs-cloudinary.ts` — cruza toda la DB con Cloudinary, autorefresca inventory si >24h
  - `packages/db/reorganize-cloudinary.ts` — script idempotente con `--dry-run` para futuras migraciones masivas

**Estructura final** (120 assets totales bajo `sofi-mosquera/`):
- `_archive/` 50 (legacy, no servido públicamente)
- `about/` 3 · `artworks/` 8 · `branding/` 4 · `projects/` 55

**Pendientes (no bloqueantes):**
- 4 obras con `cover_url=NULL` muestran fallback gris en `/arte → Otras obras`:
  - `expresionista-01`, `expresionista-02` (serie expresionista)
  - `serie-2026-01`, `serie-2026-02` (serie nueva 2026)
  - Las DB rows están listas. Cuando Sofía tenga las fotos, sube desde el admin (`<CloudinaryUpload>` defaultea al folder correcto y el sign endpoint enforce el namespace).
- Cambios de Cursor en paralelo (footer V4 multi-columna + páginas legales `/privacidad` + `/terminos` + iconos sociales) están en working dir sin commitear — los maneja Cursor en su próximo commit.
- 3 fallos cosméticos en `audit-v3-fixes.ts` (S2.02 Nav missing items, S2.04 Logo variant swap, S2.09 footer match string) son por el refactor V4 de Cursor, no por regresiones reales — Cursor debería actualizar el audit.

---

## 2026-05-04 — Setup OpenCode + commit i18n grande

**Hecho:**
- Importado el proyecto a OpenCode (German pasó de Cursor solo a Cursor + OpenCode).
- `AGENTS.md` reescrito como fuente única de verdad. Cubre stack, i18n con next-intl, schema con columnas `*_en`, Brand DNA, comandos, deploy.
- `opencode.json` creado con `instructions` que reusa `AGENTS.md`, `.cursor/rules/*.mdc` y `docs/STATE.md`.
- `.opencode/commands/` con: `/audit`, `/tests`, `/db-push`, `/i18n-check`, `/brand-audit`, `/deploy-prod`, `/deploy-preview`, `/save-progress`.
- `.gitignore` arreglado (estaba mezclando UTF-8 + UTF-16 al final, rompía `temp/` y `.env.prod`).
- `CLAUDE.md` reapuntado a `AGENTS.md`.
- Refactor i18n grande de Cursor (next-intl 4, `/[locale]/...`, slugs traducidos, schema con `*_en`, tabla `series`, API contact + newsletter, structured-data, locale-switcher, hero/manifesto/featured-series nuevos) — committeado junto en este commit.

**WIP / pendientes:**
- Verificar que el i18n no rompió URLs viejas (Vercel ya tenía deploys funcionando previo a la refactor — chequear redirects 301 después del deploy).
- Faltan obras y proyectos cargados en EN (las columnas `*_en` existen pero la mayoría de filas están en NULL → fallback a ES en runtime, OK por ahora).
- `temp/` tiene un `.skill` y caché de Lovable: revisar si el skill `3d-websites-claude-code.skill` se mueve a `.opencode/skills/` o se descarta.
- `assets/LOGOS/` agregado: ver si los logos ya están en Cloudinary o si hay que correr `scripts/upload-branding.ts`.

**Próximos pasos sugeridos:**
1. Después del deploy, verificar `https://sofimosquera.com` y `https://sofimosquera.com/en/projects` carguen OK.
2. Sembrar traducciones EN para 2-3 proyectos hero (Casa BF, Casa Laura) para que /en no se vea 100% en español.
3. Considerar mover `scripts/audit-build.ts` a tests con framework real (vitest) si crece.
4. Documentar en `AGENTS.md` cómo agregar una obra nueva (script vs admin UI).
