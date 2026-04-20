# Sofia Mosquera — Project Guide

## Overview

sofimosquera.com — Turborepo monorepo for a designer's portfolio, art gallery, and furniture catalog.

**Owner**: Sofia Mosquera (Mendoza, Argentina)
**Dev**: German Gimenez / NapsixAI
**Repo**: github.com/german-gimenez/Sofi_Mosquera

## Architecture

- `apps/web` — Public Next.js 15 site (sofimosquera.com)
- `apps/admin` — Admin panel with Clerk auth (admin.sofimosquera.com)
- `packages/db` — Drizzle ORM + Neon Postgres (schema, seed)
- `packages/ui` — Shared components (Button, WhatsAppCTA, SectionReveal, Marquee)
- `packages/tokens` — Brand DNA design tokens
- `packages/config` — Shared TypeScript configs

## Brand DNA Rules (CRITICAL — never break these)

1. **Never use `#FFFFFF`** (pure white) — use `#F5F3EE` (blanco calido) for backgrounds
2. **Never use `#000000`** (pure black) — use `#111111` (negro base) for text
3. **Color palette is restricted to 5 values**: `#111111`, `#1A1A1A`, `#B5B0A8`, `#EAE7E0`, `#F5F3EE`
4. **Headings**: `font-heading` (Instrument Serif), weight 400, never bold
5. **Body text**: `font-body` (Jost), weight 200-400
6. **No saturated colors, no gradients on brand elements**
7. **Photography is the protagonist** — generous whitespace, editorial feel
8. **Vocabulary**: "interiorismo" not "decoración", "espacio" not "casa", never "barato"

## DB Schema

5 tables: `projects`, `artworks`, `furniture`, `inquiries`, `settings`
ORM: Drizzle with Neon serverless driver
Config: `packages/db/drizzle.config.ts`

## Key Patterns

- All DB pages use `export const dynamic = "force-dynamic"` to avoid build-time DB access
- Clerk auth in admin is conditional (`process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`)
- WhatsApp is the primary CTA channel: +54 9 261 545 6913
- Motion uses Framer Motion with `prefers-reduced-motion` checks
- Images should use `next/image` with `fill` + `sizes` for optimization

## Commands

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Start both apps |
| `pnpm build` | Production build |
| `pnpm --filter @sofi/db exec drizzle-kit push` | Push schema to Neon |
| `npx tsx scripts/upload-images.ts` | Upload images from `assets/` folder to Cloudinary |
| `npx tsx scripts/enrich-db.ts` | Enrich DB with prices, dimensions, new furniture |
| `npx tsx scripts/audit-build.ts` | Run structure audit (59 checks) |
| `npx tsx packages/db/src/schema.test.ts` | Schema validation tests |
| `npx tsx packages/tokens/src/tokens.test.ts` | Brand DNA tokens tests |

## Environment Variables

Required in `.env.local`:
- `DATABASE_URL` (Neon pooled) + `DATABASE_URL_UNPOOLED` (direct)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (exposed to client for URL building)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` (admin only, optional)

## Image Handling — Cloudinary

Images are stored in Cloudinary under the namespace `sofi-mosquera/`:
- `sofi-mosquera/projects/{slug}/01` ... `08` (project galleries)
- `sofi-mosquera/artworks/{slug}/cover` (one per artwork)
- `sofi-mosquera/about/sofia-01..03` (Sofia photos)

DB stores `public_id` (not URL). URLs are built with helper `cldUrl(publicId, opts)` or presets:

```ts
import { cldThumb, cldCard, cldHero, cldSquare, cldZoom, cldGallery, cldArtwork } from "@sofi/ui";

<img src={cldCard(project.coverUrl)} alt={...} />
```

Transformations (`f_auto,q_auto,c_fill,w_XXX,h_XXX,g_auto`) are applied on-the-fly via URL. No pre-generation needed.

For admin uploads via UI, use `<CloudinaryUpload>` component (`apps/admin/src/components/cloudinary-upload.tsx`) which uses signed requests via `/api/cloudinary-sign`.

## Testing

- `packages/db/src/schema.test.ts` — Schema column validation (33 checks)
- `packages/tokens/src/tokens.test.ts` — Brand DNA token validation (13 checks)
- `scripts/audit-build.ts` — Full structure + route + CSS audit (52 checks)

## Deploy

Vercel auto-deploys on push to `main`. Two projects:
- `sofi-mosquera` (web) — build: `npx turbo run build --filter=web`
- `sofi-mosquera-admin` (admin) — build: `npx turbo run build --filter=admin`
