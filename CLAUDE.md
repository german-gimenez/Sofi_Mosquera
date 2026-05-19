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

## Cloudflare API (acceso disponible para OpenCode)

NapsixAI tiene un token de Cloudflare con scope account, expuesto como env var del usuario en Windows. OpenCode lo hereda automaticamente al iniciar sesion.

- `CLOUDFLARE_API_TOKEN` — token (account-scoped)
- `CLOUDFLARE_ACCOUNT_ID` — id de la cuenta `NapsixAI Account`

**Permisos verificados (2026-05-19):**

| Recurso | Acceso |
|---------|--------|
| 12 zonas DNS | Read/Edit/Delete records (`asea.com.ar`, `asea.org.ar`, `komuny.org`, `muscleworld.com.ar`, `napsix.ai`, `napsix.chat`, `napsix.com`, `napsix.one`, `padel365.app`, `suplement.app`, `vlozity.com`, `welocal.tur.ar`) |
| Workers | Read/Edit |
| Pages | Read/Edit |
| R2 | Read/Edit |
| KV | Read/Edit |
| D1 | Read/Edit |
| Zone settings | Read |

**Ejemplo de uso desde PowerShell:**

```powershell
$h = @{ Authorization = "Bearer $env:CLOUDFLARE_API_TOKEN" }
# Listar zonas
Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones?account.id=$env:CLOUDFLARE_ACCOUNT_ID&per_page=50" -Headers $h
# Listar DNS de una zona
Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones/<zone_id>/dns_records?per_page=100" -Headers $h
```

`wrangler` tambien hereda el token (Workers/Pages/D1 funcionan automaticamente).

**Reglas:**

- Nunca commitear el token (vive en env var del usuario, no en `.env`).
- El token NO verifica con `/user/tokens/verify` (account-scoped, sin user:read). Es esperado.
- Para limpiar/auditar DNS u operaciones destructivas, siempre re-listar antes del DELETE y confirmar con el usuario.
- El token tambien tiene acceso a la zona del repo actual si esta entre las 12 listadas arriba — usar siempre el nombre exacto del dominio al filtrar.
