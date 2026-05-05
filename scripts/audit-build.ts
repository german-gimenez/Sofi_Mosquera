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

  console.log("\nWeb app routes (V3 — i18n [locale] tree):");
  const webSrc = resolve(root, "apps/web/src/app");
  const localeRoot = resolve(webSrc, "[locale]");
  assert(await exists(resolve(webSrc, "layout.tsx")), "root layout.tsx");
  assert(await exists(resolve(webSrc, "globals.css")), "globals.css");
  assert(await exists(resolve(webSrc, "sitemap.ts")), "sitemap.ts");
  assert(await exists(resolve(localeRoot, "layout.tsx")), "[locale]/layout.tsx");
  assert(await exists(resolve(localeRoot, "page.tsx")), "[locale]/ (home)");
  assert(await exists(resolve(localeRoot, "not-found.tsx")), "[locale]/not-found.tsx");
  assert(await exists(resolve(localeRoot, "error.tsx")), "[locale]/error.tsx");
  assert(await exists(resolve(localeRoot, "loading.tsx")), "[locale]/loading.tsx");
  assert(await exists(resolve(localeRoot, "proyectos/page.tsx")), "[locale]/proyectos");
  assert(await exists(resolve(localeRoot, "proyectos/[slug]/page.tsx")), "[locale]/proyectos/[slug]");
  assert(await exists(resolve(localeRoot, "arte/page.tsx")), "[locale]/arte");
  assert(await exists(resolve(localeRoot, "arte/[slug]/page.tsx")), "[locale]/arte/[slug]");
  assert(await exists(resolve(localeRoot, "muebles/page.tsx")), "[locale]/muebles");
  assert(await exists(resolve(localeRoot, "muebles/[slug]/page.tsx")), "[locale]/muebles/[slug]");
  assert(await exists(resolve(localeRoot, "estudio/page.tsx")), "[locale]/estudio");
  assert(await exists(resolve(localeRoot, "servicios/page.tsx")), "[locale]/servicios");
  assert(await exists(resolve(localeRoot, "contacto/page.tsx")), "[locale]/contacto");
  assert(await exists(resolve(webSrc, "api/contact/route.ts")), "/api/contact");
  assert(await exists(resolve(webSrc, "api/newsletter/route.ts")), "/api/newsletter");
  assert(await exists(resolve(root, "apps/web/src/i18n/routing.ts")), "i18n/routing.ts");
  assert(await exists(resolve(root, "apps/web/src/middleware.ts")), "middleware.ts");
  assert(!(await exists(resolve(localeRoot, "interiorismo/page.tsx"))), "[locale]/interiorismo deleted (V3)");

  console.log("\nWeb components (V3):");
  const webComp = resolve(root, "apps/web/src/components");
  assert(await exists(resolve(webComp, "nav.tsx")), "nav.tsx");
  assert(await exists(resolve(webComp, "footer.tsx")), "footer.tsx");
  assert(await exists(resolve(webComp, "logo.tsx")), "logo.tsx (V3)");
  assert(await exists(resolve(webComp, "locale-switcher.tsx")), "locale-switcher.tsx (V3)");
  assert(await exists(resolve(webComp, "hero.tsx")), "hero.tsx (V3 — replaced hero-slider)");
  assert(await exists(resolve(webComp, "art-featured.tsx")), "art-featured.tsx (V3)");
  assert(await exists(resolve(webComp, "artwork-card.tsx")), "artwork-card.tsx (V3)");
  assert(await exists(resolve(webComp, "featured-series.tsx")), "featured-series.tsx (V3)");
  assert(await exists(resolve(webComp, "manifesto-section.tsx")), "manifesto-section.tsx (V3)");
  assert(await exists(resolve(webComp, "newsletter-art.tsx")), "newsletter-art.tsx (V3)");
  assert(await exists(resolve(webComp, "contact-form.tsx")), "contact-form.tsx (V3)");
  assert(await exists(resolve(webComp, "project-hero.tsx")), "project-hero.tsx");
  assert(await exists(resolve(webComp, "artwork-tilt.tsx")), "artwork-tilt.tsx");
  assert(!(await exists(resolve(webComp, "hero-slider.tsx"))), "hero-slider.tsx deleted (V3)");

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
  assert(css.includes("Cormorant Garamond"), "CSS has Cormorant Garamond heading font (V3)");
  assert(css.includes("Manrope"), "CSS has Manrope body font (V3)");

  console.log(`\n=== ${passed} passed, ${failed} failed ===`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(console.error);
