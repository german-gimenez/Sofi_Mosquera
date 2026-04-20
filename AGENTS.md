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
| `pnpm db:push` | Push schema to Neon |
| `pnpm db:seed` | Seed database |
| `npx tsx scripts/upload-images.ts` | Upload images to Vercel Blob |
| `npx tsx scripts/audit-build.ts` | Run structure audit |

## Environment Variables

Required in `.env.local`:
- `DATABASE_URL` (Neon pooled)
- `DATABASE_URL_UNPOOLED` (Neon direct, for migrations)
- `BLOB_READ_WRITE_TOKEN` (Vercel Blob, for image uploads)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` (admin only)

## Testing

- `packages/db/src/schema.test.ts` — Schema column validation (33 checks)
- `packages/tokens/src/tokens.test.ts` — Brand DNA token validation (13 checks)
- `scripts/audit-build.ts` — Full structure + route + CSS audit (52 checks)

## Deploy

Vercel auto-deploys on push to `main`. Two projects:
- `sofi-mosquera` (web) — build: `npx turbo run build --filter=web`
- `sofi-mosquera-admin` (admin) — build: `npx turbo run build --filter=admin`
