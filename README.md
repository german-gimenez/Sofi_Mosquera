# Sofia Mosquera — sofimosquera.com

Sitio web y panel de administración para **Sofia Mosquera** — estudio de interiorismo, arte original y muebles a medida en Mendoza, Argentina.

## Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: Next.js 15 (App Router, RSC, Tailwind CSS v4)
- **Database**: Neon Postgres + Drizzle ORM
- **Auth (admin)**: Clerk
- **Storage**: Vercel Blob
- **Deploy**: Vercel (auto-deploy desde GitHub)

## Estructura

```
apps/
  web/          → sitio público (sofimosquera.com)
  admin/        → panel de administración (admin.sofimosquera.com)
packages/
  db/           → Drizzle ORM schemas, migrations, seed
  ui/           → componentes compartidos (Button, WhatsAppCTA, SectionReveal, etc.)
  tokens/       → design tokens del Brand DNA (colores, tipografía, spacing)
  config/       → TypeScript configs compartidos
```

## Setup local

```bash
# Clonar
git clone https://github.com/german-gimenez/Sofi_Mosquera.git
cd Sofi_Mosquera

# Instalar dependencias
pnpm install

# Crear .env.local en la raíz (ver .env.example)
cp .env.example .env.local
# Editar con tus credenciales de Neon, Clerk, etc.

# Pushear schema a la base de datos
pnpm db:push

# Seed inicial (proyectos, obras, muebles de ejemplo)
pnpm db:seed

# Dev (ambas apps en paralelo)
pnpm dev
```

- Web: http://localhost:3000
- Admin: http://localhost:3001

## Cómo cargar contenido (para Sofi)

1. Ir a `admin.sofimosquera.com` e iniciar sesión
2. Usar los formularios para crear proyectos, obras o muebles
3. Las imágenes se suben directamente desde el panel
4. Al publicar, el contenido aparece automáticamente en el sitio

## Paleta de marca

| Color | Hex | Uso |
|-------|-----|-----|
| Negro Base | `#111111` | Textos, headers, logo |
| Negro Suave | `#1A1A1A` | Párrafos largos |
| Gris Nav | `#B5B0A8` | Navegación, labels |
| Crema | `#EAE7E0` | Fondos editoriales |
| Blanco Cálido | `#F5F3EE` | Fondo principal |

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Dev server (web + admin) |
| `pnpm build` | Build de producción |
| `pnpm db:push` | Push schema a Neon |
| `pnpm db:seed` | Seed con datos iniciales |
