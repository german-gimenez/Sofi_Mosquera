# Sofia Mosquera — Project Guide

> **Fuente única de verdad para agentes** (OpenCode, Cursor, Claude Code).
> OpenCode lee este archivo automáticamente. `.cursor/rules/*.mdc` lo complementa
> con scopes finos. `CLAUDE.md` apunta acá. Mantener este archivo es prioridad.

## Overview

sofimosquera.com — Turborepo monorepo para portfolio de interiorismo, galería de
arte y catálogo de muebles a medida. Sitio bilingüe (es/en) con next-intl.

- **Owner**: Sofía Mosquera (Mendoza, Argentina)
- **Dev**: German Gimenez / NapsixAI
- **Repo**: github.com/german-gimenez/Sofi_Mosquera
- **Web prod**: https://sofimosquera.com (Vercel — proyecto `sofi-mosquera`)
- **Admin prod**: admin.sofimosquera.com (Vercel — proyecto `sofi-mosquera-admin`)

## Stack

- Next.js 15 + React 19 + TypeScript 5
- Tailwind v4 (config en `globals.css`, no `tailwind.config.js`)
- next-intl 4 (i18n con rutas `/[locale]/...`)
- Drizzle ORM + Neon Postgres serverless (driver neon-http v1)
- Cloudinary para imágenes (transformaciones por URL)
- Framer Motion (con check de `prefers-reduced-motion`)
- Clerk (admin only, condicional)
- pnpm + Turborepo

## Architecture

| Path | Rol |
|------|-----|
| `apps/web` | Sitio público bilingüe (sofimosquera.com) |
| `apps/admin` | Panel admin con Clerk (admin.sofimosquera.com) |
| `packages/db` | Drizzle ORM + schema + seed (Neon) |
| `packages/ui` | Componentes compartidos (Button, WhatsAppCTA, SectionReveal, Marquee, helpers Cloudinary) |
| `packages/tokens` | Brand DNA design tokens |
| `packages/config` | Shared TS configs |

## Internationalization (i18n)

> ⚠️ **WIP**: la refactor i18n está en `main` desde el commit “feat: i18n + opencode setup”. Si volvés
> a tocar rutas, leé esto antes.

- Library: **next-intl 4**
- Locales: `es` (default), `en`. `localePrefix: "always"` → todas las URLs llevan locale.
- Routing config: `apps/web/src/i18n/routing.ts` (pathnames con traducción de slugs).
- Messages: `apps/web/messages/{es,en}.json`.
- Middleware: `apps/web/src/middleware.ts` — re-exporta `createMiddleware(routing)`.
- Layout raíz (`app/layout.tsx`) es un pass-through; el real está en `app/[locale]/layout.tsx`.
- DB schema tiene columnas `*_en` espejadas (titleEn, summaryEn, descriptionEn, etc.). Si falta inglés, fallback al español en runtime.
- API routes viven en `app/api/**` (NO bajo `[locale]`) — el matcher del middleware las excluye.
- Ruta legacy `/cuadros`, `/sobre`, `/asesoria` redirige permanente a `/es/...` (`next.config.ts`).

### Slugs traducidos (ejemplo)

| ES | EN |
|----|----|
| `/proyectos` | `/projects` |
| `/estudio` | `/studio` |
| `/servicios` | `/services` |
| `/muebles` | `/furniture` |
| `/arte` | `/art` |
| `/contacto` | `/contact` |

## Brand DNA Rules (CRITICAL — never break these)

1. **Never use `#FFFFFF`** (blanco puro) → usar `#F5F3EE` (blanco cálido) para fondos
2. **Never use `#000000`** (negro puro) → usar `#111111` (negro base) para texto
3. Paleta restringida a 5 valores: `#111111`, `#1A1A1A`, `#B5B0A8`, `#EAE7E0`, `#F5F3EE`
4. **Headings**: `font-heading` (Cormorant Garamond / Instrument Serif), weight 300-400, **nunca bold**
5. **Body**: `font-body` (Manrope / Jost), weights 200-400
6. Sin colores saturados, sin gradientes en elementos de marca
7. La fotografía es la protagonista — whitespace generoso, feel editorial
8. Vocabulario: "interiorismo" no "decoración", "espacio" no "casa", nunca "barato/oferta/económico"

## DB Schema (5 tablas + series)

- `projects` — interiorismo (con `*_en`, `technicalData`, `visible`, `position`)
- `artworks` — obras (con `seriesSlug`, `priceVisible`, `contextUrl`, `position`)
- `series` — agrupador de obras (slug PK, `*_en`, `position`)
- `furniture` — muebles (con `*_en`, `isCatalog`, `position`)
- `inquiries` — leads (form contacto + WhatsApp tracking, con `locale`)
- `settings` — key-value jsonb

ORM: Drizzle con `neon-http` driver v1. Helper: `createDb()` desde `@sofi/db`.

## Image Handling — Cloudinary

Namespace: `sofi-mosquera/`
- `sofi-mosquera/projects/{slug}/01..08`
- `sofi-mosquera/artworks/{slug}/cover` (+ context)
- `sofi-mosquera/about/sofia-01..03`

DB guarda `public_id`, NO URL completa. URLs se arman con helpers de `@sofi/ui`:

```ts
import { cldUrl, cldThumb, cldCard, cldHero, cldSquare, cldZoom, cldGallery, cldArtwork } from "@sofi/ui";
<img src={cldCard(project.coverUrl)} alt={...} />
```

`cldUrl()` acepta tanto public_id como URL completa (backward compat).
Cache busting global: parámetro `v20260421` en URL.

Para uploads desde admin UI: `<CloudinaryUpload>` (`apps/admin/src/components/cloudinary-upload.tsx`)
firmando con `/api/cloudinary-sign`.

## Key Patterns

- **Pages que tocan DB**: `export const dynamic = "force-dynamic"` (evita errores en build sin DATABASE_URL)
- **Clerk en admin**: condicional via `process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- **WhatsApp**: canal CTA primario. Tel `+5492615456913`. Mensajes pre-armados con voseo argentino → ver `packages/ui/src/lib/whatsapp-messages.ts`
- **Motion**: siempre Framer Motion + check `prefers-reduced-motion`
- **Images**: `next/image` con `fill` + `sizes`. Nunca `<img>` en producción salvo lightbox/galería custom
- **Forms**: validación con `zod`, honeypot `_hp` para anti-spam
- **A11y**: skip-link en layout, `aria-label` en CTAs, focus-visible en interactivos

## Commands

| Comando | Qué hace |
|---------|----------|
| `pnpm dev` | Levanta web + admin (turbo) |
| `pnpm build` | Build de producción |
| `pnpm --filter web build` | Build solo web |
| `pnpm --filter @sofi/db exec drizzle-kit push` | Sincroniza schema a Neon |
| `npx tsx scripts/upload-images.ts` | Upload bulk de `assets/` a Cloudinary |
| `npx tsx scripts/upload-branding.ts` | Sube logos a Cloudinary |
| `npx tsx scripts/migrate-lovable-assets.ts` | Migra assets desde export de Lovable |
| `npx tsx scripts/enrich-db.ts` | Enriquece DB (precios, dims, muebles nuevos) |
| `npx tsx scripts/audit-build.ts` | Audit estructural (~59 checks) |
| `npx tsx packages/db/src/schema.test.ts` | Validación columnas schema |
| `npx tsx packages/tokens/src/tokens.test.ts` | Validación tokens Brand DNA |
| `npx tsx apps/web/src/lib/i18n-helpers.test.ts` | Tests helpers i18n |
| `npx tsx apps/web/src/lib/structured-data.test.ts` | Tests JSON-LD |
| `vercel ls sofi-mosquera` | Listar deploys (necesita `vercel link` primero) |
| `vercel --prod` | Deploy producción del proyecto linkeado actual |

## Environment Variables

Requeridas en `.env.local` (web):
- `DATABASE_URL` (Neon **pooled**)
- `DATABASE_URL_UNPOOLED` (Neon directo, para drizzle-kit)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (cliente, para armar URLs)
- `NEXT_PUBLIC_SITE_URL` (default: https://sofimosquera.com)

Admin only (opcionales — sin estas, el admin corre sin auth):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

`.env.prod` está local solo (gitignored). Hay `.env.example` como template.

## Testing

Sin framework, scripts standalone con tsx:

- `packages/db/src/schema.test.ts` — 33 checks de columnas
- `packages/tokens/src/tokens.test.ts` — 13 checks Brand DNA
- `apps/web/src/lib/i18n-helpers.test.ts` — helpers de routing
- `apps/web/src/lib/structured-data.test.ts` — JSON-LD
- `packages/ui/src/lib/whatsapp-messages.test.ts` — mensajes WhatsApp (corre con `pnpm --filter @sofi/ui exec vitest run`)
- `scripts/audit-build.ts` — full structure audit

## Deploy

Vercel auto-deploy en push a `main`. Dos proyectos:

| Vercel project | Build command | Domain |
|----------------|---------------|--------|
| `sofi-mosquera` | `npx turbo run build --filter=web` | sofimosquera.com |
| `sofi-mosquera-admin` | `npx turbo run build --filter=admin` | admin.sofimosquera.com |

`.vercel/project.json` local linkea al proyecto **web** (`sofi-mosquera`).

## Agent guidelines (OpenCode / Cursor / Claude)

- **Idioma**: respondé al usuario en castellano rioplatense.
- **Antes de tocar rutas**: leer `apps/web/src/i18n/routing.ts`.
- **Antes de tocar DB**: leer `packages/db/src/schema.ts`. Push con drizzle-kit, no migraciones manuales.
- **Antes de tocar UI**: revisar Brand DNA de arriba. Sin excepción.
- **Antes de subir imágenes**: usar Cloudinary (`scripts/upload-images.ts` o `<CloudinaryUpload>`). No commitear binarios pesados.
- **Antes de pushear**: si tocaste schema, correr `pnpm --filter @sofi/db exec drizzle-kit push`.
- **Workflow Cursor ↔ OpenCode**: ambos editan el mismo árbol. Hacer commits chicos y bien etiquetados para evitar conflictos. Si dejás cambios WIP, anotalo en `docs/STATE.md`.
