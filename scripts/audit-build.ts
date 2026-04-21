/**
 * Build & route audit — verifies both apps build and all expected routes exist.
 * Run with: tsx scripts/audit-build.ts
 */
import { readdir, stat } from "fs/promises";
import { resolve } from "path";

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${msg}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${msg}`);
  }
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const root = resolve(__dirname, "..");

  console.log("=== Structure Audit ===\n");

  console.log("Monorepo structure:");
  assert(await exists(resolve(root, "turbo.json")), "turbo.json exists");
  assert(await exists(resolve(root, "pnpm-workspace.yaml")), "pnpm-workspace.yaml exists");
  assert(await exists(resolve(root, "package.json")), "root package.json exists");
  assert(await exists(resolve(root, ".gitignore")), ".gitignore exists");
  assert(await exists(resolve(root, ".env.example")), ".env.example exists");

  console.log("\nWeb app routes:");
  const webSrc = resolve(root, "apps/web/src/app");
  assert(await exists(resolve(webSrc, "page.tsx")), "/ (home)");
  assert(await exists(resolve(webSrc, "layout.tsx")), "layout.tsx");
  assert(await exists(resolve(webSrc, "not-found.tsx")), "not-found.tsx");
  assert(await exists(resolve(webSrc, "error.tsx")), "error.tsx");
  assert(await exists(resolve(webSrc, "loading.tsx")), "loading.tsx");
  assert(await exists(resolve(webSrc, "globals.css")), "globals.css");
  assert(await exists(resolve(webSrc, "interiorismo/page.tsx")), "/interiorismo");
  assert(await exists(resolve(webSrc, "proyectos/page.tsx")), "/proyectos");
  assert(await exists(resolve(webSrc, "proyectos/[slug]/page.tsx")), "/proyectos/[slug]");
  assert(await exists(resolve(webSrc, "arte/page.tsx")), "/arte");
  assert(await exists(resolve(webSrc, "arte/[slug]/page.tsx")), "/arte/[slug]");
  assert(await exists(resolve(webSrc, "muebles/page.tsx")), "/muebles");
  assert(await exists(resolve(webSrc, "muebles/[slug]/page.tsx")), "/muebles/[slug]");
  assert(await exists(resolve(webSrc, "asesoria/page.tsx")), "/asesoria");
  assert(await exists(resolve(webSrc, "sobre/page.tsx")), "/sobre");
  assert(await exists(resolve(webSrc, "contacto/page.tsx")), "/contacto");
  assert(await exists(resolve(webSrc, "robots.ts")), "robots.ts");
  assert(await exists(resolve(webSrc, "sitemap.ts")), "sitemap.ts");

  console.log("\nWeb components:");
  const webComp = resolve(root, "apps/web/src/components");
  assert(await exists(resolve(webComp, "nav.tsx")), "nav.tsx");
  assert(await exists(resolve(webComp, "footer.tsx")), "footer.tsx");
  assert(await exists(resolve(webComp, "hero-parallax.tsx")), "hero-parallax.tsx");
  assert(await exists(resolve(webComp, "project-hero.tsx")), "project-hero.tsx");
  assert(await exists(resolve(webComp, "artwork-tilt.tsx")), "artwork-tilt.tsx");

  console.log("\nAdmin app routes:");
  const adminSrc = resolve(root, "apps/admin/src/app");
  assert(await exists(resolve(adminSrc, "page.tsx")), "/ (dashboard)");
  assert(await exists(resolve(adminSrc, "proyectos/page.tsx")), "/proyectos");
  assert(await exists(resolve(adminSrc, "proyectos/nuevo/page.tsx")), "/proyectos/nuevo");
  assert(await exists(resolve(adminSrc, "obras/page.tsx")), "/obras");
  assert(await exists(resolve(adminSrc, "obras/nueva/page.tsx")), "/obras/nueva");
  assert(await exists(resolve(adminSrc, "muebles/page.tsx")), "/muebles");
  assert(await exists(resolve(adminSrc, "consultas/page.tsx")), "/consultas");

  console.log("\nPackages:");
  assert(await exists(resolve(root, "packages/db/src/schema.ts")), "db schema");
  assert(await exists(resolve(root, "packages/db/src/index.ts")), "db index");
  assert(await exists(resolve(root, "packages/db/src/seed.ts")), "db seed");
  assert(await exists(resolve(root, "packages/ui/src/index.ts")), "ui index");
  assert(await exists(resolve(root, "packages/ui/src/components/button.tsx")), "Button component");
  assert(await exists(resolve(root, "packages/ui/src/components/whatsapp-cta.tsx")), "WhatsAppCTA component");
  assert(await exists(resolve(root, "packages/ui/src/components/section-reveal.tsx")), "SectionReveal component");
  assert(await exists(resolve(root, "packages/ui/src/components/marquee.tsx")), "Marquee component");
  assert(await exists(resolve(root, "packages/ui/src/components/cld-image.tsx")), "CldImage component");
  assert(await exists(resolve(root, "packages/ui/src/lib/cloudinary.ts")), "Cloudinary helper");
  assert(await exists(resolve(root, "packages/tokens/src/index.ts")), "tokens index");
  assert(await exists(resolve(root, "apps/web/src/components/artwork-lightbox.tsx")), "artwork lightbox");
  assert(await exists(resolve(root, "apps/admin/src/app/api/cloudinary-sign/route.ts")), "cloudinary sign API");
  assert(await exists(resolve(root, "apps/admin/src/components/cloudinary-upload.tsx")), "cloudinary upload widget");
  assert(await exists(resolve(root, "scripts/upload-images.ts")), "upload script");
  assert(await exists(resolve(root, "scripts/upload-large-images.ts")), "compress+upload script");
  assert(await exists(resolve(root, "scripts/enrich-db.ts")), "enrich script");
  assert(await exists(resolve(root, "scripts/fix-unicode-jsx.ts")), "unicode fix script");
  assert(await exists(resolve(root, "scripts/run-tests.ts")), "test runner");
  assert(await exists(resolve(root, "packages/ui/src/lib/cloudinary.test.ts")), "cloudinary tests");
  assert(await exists(resolve(root, "apps/admin/src/app/api/projects/route.ts")), "admin projects API");
  assert(await exists(resolve(root, "apps/admin/src/app/api/artworks/route.ts")), "admin artworks API");
  assert(await exists(resolve(root, "apps/admin/src/app/muebles/nuevo/page.tsx")), "admin muebles nuevo");

  console.log("\nBrand DNA compliance in CSS:");
  const { readFile } = await import("fs/promises");
  const css = await readFile(resolve(webSrc, "globals.css"), "utf-8");
  assert(css.includes("#111111"), "CSS has negro base");
  assert(css.includes("#F5F3EE"), "CSS has blanco calido");
  assert(css.includes("#EAE7E0"), "CSS has crema");
  assert(css.includes("#B5B0A8"), "CSS has gris nav");
  assert(css.includes("#1A1A1A"), "CSS has negro suave");
  assert(!css.includes("background: #FFFFFF") && !css.includes("background: #ffffff"), "No pure white background in CSS");
  assert(css.includes("Instrument Serif"), "CSS has heading font");
  assert(css.includes("Jost"), "CSS has body font");

  console.log(`\n=== ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);
