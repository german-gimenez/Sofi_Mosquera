# Project State Log

> Bitácora corta de WIP, decisiones recientes y próximos pasos.
> Cada sesión que deje cambios sin terminar agrega una entrada arriba (más nuevo primero).
> Para snapshot automático, usar `/save-progress` desde OpenCode.

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
