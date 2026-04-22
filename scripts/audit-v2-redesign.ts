/**
 * v2 Visual-First redesign audit.
 *
 * Cross-checks the implementation against the PR brief acceptance criteria.
 * Run with: tsx scripts/audit-v2-redesign.ts
 *
 * Exit code: 0 if all checks pass, 1 if any fail.
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "..");

let passed = 0;
let failed = 0;
const failures: string[] = [];

function assert(condition: boolean, msg: string) {
  if (condition) {
    passed++;
    console.log(`  \u2713 ${msg}`);
  } else {
    failed++;
    failures.push(msg);
    console.error(`  \u2717 FAIL: ${msg}`);
  }
}

function read(relPath: string): string {
  return readFileSync(resolve(ROOT, relPath), "utf8");
}

function exists(relPath: string): boolean {
  return existsSync(resolve(ROOT, relPath));
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

// ---- M1 · Hero slider -----------------------------------------------------
console.log("\nM1 \u00b7 Hero slider");
{
  const hero = "apps/web/src/components/hero-slider.tsx";
  assert(exists(hero), "hero-slider.tsx exists");
  const src = read(hero);
  assert(src.includes("h-screen"), "uses 100vh (h-screen)");
  assert(
    src.includes("intervalMs = 7000") || src.includes("7000"),
    "autoplay interval is 7000ms"
  );
  assert(
    src.includes("onMouseEnter") && src.includes("setPaused(true)"),
    "pauses on hover"
  );
  assert(
    src.includes("prefers-reduced-motion"),
    "respects prefers-reduced-motion"
  );
  assert(
    src.includes("Interiorismo \u00b7 Arte \u00b7 Muebles a medida"),
    'tagline "Interiorismo \u00b7 Arte \u00b7 Muebles a medida" present'
  );
  assert(
    src.includes("aria-roledescription=\"carousel\""),
    "carousel a11y role set"
  );
  assert(
    src.includes('loading={i === 0 ? "eager" : "lazy"}'),
    "first slide is eager-loaded for LCP"
  );
  assert(
    src.includes("fetchPriority={i === 0 ? \"high\""),
    "first slide has fetchPriority=high"
  );
  assert(
    src.includes("min-[376px]:block"),
    "tagline hidden on viewports < 375px (min-[376px])"
  );
}

// ---- M2 + M5 · Home stripped of copy --------------------------------------
console.log("\nM2+M5 \u00b7 Home stripped of copy");
{
  const home = "apps/web/src/app/page.tsx";
  assert(exists(home), "home page.tsx exists");
  const src = read(home);
  assert(src.includes("HeroSlider"), "home renders HeroSlider");
  assert(src.includes("ProjectGrid"), "home renders ProjectGrid");
  assert(!src.includes("Marquee"), "home does NOT render Marquee");
  assert(
    !src.includes("Lo que hacemos"),
    'home does NOT contain "Lo que hacemos"'
  );
  assert(
    !src.includes("Lo que nos hace"),
    'home does NOT contain "Lo que nos hace unicos"'
  );
  assert(
    !src.includes("Proyectos destacados"),
    'home does NOT contain "Proyectos destacados"'
  );
  assert(
    !src.includes("Arte disponible"),
    'home does NOT contain "Arte disponible"'
  );
  assert(
    !src.includes("HeroParallax"),
    "home does NOT import old HeroParallax"
  );
  // Total narrative copy in source ~ should be minimal. Count words in string literals:
  const literals = src.match(/"[^"]{2,}"/g) ?? [];
  const narrative = literals
    .map((s) => s.slice(1, -1))
    // drop obvious code tokens
    .filter(
      (s) =>
        !s.startsWith("/") &&
        !s.startsWith("@") &&
        !s.includes("force-dynamic") &&
        !/^[a-zA-Z_]+$/.test(s)
    )
    .join(" ");
  assert(
    wordCount(narrative) < 15,
    `narrative copy in home source < 15 words (got ${wordCount(narrative)})`
  );
}

// ---- M3 · Masonry grid ---------------------------------------------------
console.log("\nM3 \u00b7 Masonry project grid");
{
  const grid = "apps/web/src/components/project-grid.tsx";
  assert(exists(grid), "project-grid.tsx exists");
  const src = read(grid);
  assert(
    src.includes("columns-1 md:columns-2 lg:columns-3"),
    "responsive columns 1/2/3"
  );
  assert(src.includes("gap-4"), "gap is 16px (gap-4)");
  assert(
    src.includes("scale-[1.03]"),
    "hover zoom is 1.03"
  );
  assert(
    src.includes("duration-[400ms]") && src.includes("cubic-bezier(0.4,0,0.2,1)"),
    "400ms cubic-bezier transition"
  );
  assert(src.includes("break-inside-avoid"), "masonry break-inside avoid");
  assert(src.includes("max-w-[1440px]"), "container max 1440px");
  assert(src.includes("py-16 md:py-[120px]"), "vertical padding 64/120px");
  assert(src.includes("loading=\"lazy\""), "images lazy loaded");
  assert(!src.includes("Ver todos"), "no 'Ver todos' button");
}

// ---- M4 · Navigation -----------------------------------------------------
console.log("\nM4 \u00b7 Navigation");
{
  const nav = "apps/web/src/components/nav.tsx";
  const src = read(nav);
  const navLinksMatch = src.match(
    /NAV_LINKS\s*=\s*\[([\s\S]*?)\] as const/
  );
  assert(!!navLinksMatch, "NAV_LINKS constant exported");
  const labels = Array.from(
    (navLinksMatch?.[1] ?? "").matchAll(/label:\s*"([^"]+)"/g)
  ).map((m) => m[1]);
  assert(
    JSON.stringify(labels) ===
      JSON.stringify(["PROYECTOS", "ARTE", "MUEBLES", "STUDIO", "CONTACTO"]),
    "nav has exactly 5 labels in order"
  );
  assert(!labels.includes("INICIO"), "nav does NOT include Inicio");
  assert(!labels.includes("ASESOR\u00cdA"), "nav does NOT include Asesoria");
  assert(!labels.includes("SOBRE"), "nav does NOT include Sobre");
  assert(
    src.includes("backdrop-blur-md"),
    "nav blurs on scroll (backdrop-blur-md)"
  );
  assert(src.includes("bg-transparent"), "nav transparent at top");
  assert(src.includes("nav-underline"), "nav uses underline-from-center class");
  assert(
    src.includes("WhatsAppIcon") && src.includes("buildWhatsAppUrl"),
    "nav has WhatsApp link (icon + buildWhatsAppUrl)"
  );
  assert(
    src.includes("md:hidden"),
    "mobile hamburger drawer present"
  );
  assert(src.includes("font-body") && src.includes("tracking-[0.1em]"), "nav typography: font-body + tracking 0.1em");
  assert(src.includes("uppercase"), "nav labels uppercase");
}

// ---- M6 · Catalog pages ---------------------------------------------------
console.log("\nM6 \u00b7 Arte + Muebles grids");
{
  const arte = read("apps/web/src/app/arte/page.tsx");
  const muebles = read("apps/web/src/app/muebles/page.tsx");
  assert(
    !arte.includes("Cada pieza nace de la misma"),
    "arte page does NOT include old intro paragraph"
  );
  assert(
    !muebles.includes("Piezas di\u00f1adas y fabricadas para cada"),
    "muebles page does NOT include old intro paragraph"
  );
  assert(
    arte.includes("columns-1 md:columns-2 lg:columns-3"),
    "arte uses same masonry layout"
  );
  assert(
    muebles.includes("columns-1 md:columns-2 lg:columns-3"),
    "muebles uses same masonry layout"
  );
  assert(
    !muebles.includes("toLocaleString(\"es-AR\")"),
    "muebles listing does NOT show price (only in detail)"
  );
}

// ---- M7 · Project detail ---------------------------------------------------
console.log("\nM7 \u00b7 Project detail");
{
  const detail = read("apps/web/src/app/proyectos/[slug]/page.tsx");
  assert(detail.includes("GalleryLightbox"), "detail uses GalleryLightbox");
  assert(detail.includes("BeforeAfterSlider"), "detail imports BeforeAfterSlider");
  assert(detail.includes("capWords"), "detail caps summary to max words");
  assert(detail.includes("80"), "detail uses 80-word cap");
  assert(detail.includes("projectMessage"), "detail uses projectMessage() for WA");
  assert(detail.includes("Materiales y arte"), "materials section renders chips");
  assert(
    detail.includes("projectCreativeWorkSchema"),
    "detail emits CreativeWork JSON-LD"
  );

  const lightbox = read("apps/web/src/components/gallery-lightbox.tsx");
  assert(lightbox.includes('e.key === "Escape"'), "lightbox handles ESC");
  assert(lightbox.includes('e.key === "ArrowLeft"'), "lightbox handles \u2190");
  assert(lightbox.includes('e.key === "ArrowRight"'), "lightbox handles \u2192");
  assert(lightbox.includes("onTouchStart"), "lightbox handles touch swipe");
  assert(lightbox.includes('role="dialog"'), "lightbox has dialog role");
  assert(lightbox.includes('aria-modal="true"'), "lightbox has aria-modal");

  const ba = read("apps/web/src/components/before-after-slider.tsx");
  assert(ba.includes("onPointerDown"), "before/after handles pointer");
  assert(ba.includes('type="range"'), "before/after has keyboard range input");
  assert(ba.includes("touch-none"), "before/after disables page scroll on drag");
}

// ---- M8 · /studio ---------------------------------------------------------
console.log("\nM8 \u00b7 /studio");
{
  const studio = "apps/web/src/app/studio/page.tsx";
  assert(exists(studio), "/studio page exists");
  const src = read(studio);
  assert(src.includes("Filosof\u00eda"), "studio has Filosofia section");
  assert(
    src.includes('id="proceso"'),
    "studio has #proceso anchor (for /asesoria redirect)"
  );
  assert(src.includes("Proceso"), "studio has Proceso section");
  assert(
    src.includes("Mendoza") && src.includes("Santiago"),
    "studio mentions Mendoza + Santiago"
  );
  assert(
    src.includes("Primera asesor\u00eda"),
    "studio final CTA: Primera asesoria"
  );

  // Philosophy paragraphs: each < 60 words
  const philosophyMatch = src.match(/const philosophy = \[([\s\S]*?)\];/);
  if (philosophyMatch) {
    const bodies = Array.from(
      philosophyMatch[1].matchAll(/body:\s*\n?\s*"([^"]+)"/g)
    ).map((m) => m[1]);
    assert(bodies.length >= 3, `philosophy has \u2265 3 items (got ${bodies.length})`);
    for (const [i, body] of bodies.entries()) {
      const w = wordCount(body);
      assert(w <= 60, `philosophy[${i}] \u2264 60 words (got ${w})`);
    }
  } else {
    assert(false, "philosophy const is extractable");
  }
}

// ---- Routing ---------------------------------------------------------------
console.log("\nRouting / redirects");
{
  const cfg = read("apps/web/next.config.ts");
  assert(
    cfg.includes('source: "/sobre"') && cfg.includes('destination: "/studio"'),
    "/sobre \u2192 /studio redirect"
  );
  assert(
    cfg.includes('source: "/asesoria"') &&
      cfg.includes('destination: "/studio#proceso"'),
    "/asesoria \u2192 /studio#proceso redirect"
  );
  assert(
    !exists("apps/web/src/app/sobre/page.tsx"),
    "/sobre/page.tsx deleted"
  );
  assert(
    !exists("apps/web/src/app/asesoria/page.tsx"),
    "/asesoria/page.tsx deleted"
  );
  assert(
    !exists("apps/web/src/components/hero-parallax.tsx"),
    "old hero-parallax.tsx deleted"
  );
}

// ---- Structured data -------------------------------------------------------
console.log("\nStructured data (JSON-LD)");
{
  assert(
    exists("apps/web/src/lib/structured-data.ts"),
    "structured-data.ts exists"
  );
  const layout = read("apps/web/src/app/layout.tsx");
  assert(
    layout.includes("organizationSchema") &&
      layout.includes("localBusinessSchema"),
    "root layout injects Organization + LocalBusiness JSON-LD"
  );
  assert(
    layout.includes('type="application/ld+json"'),
    "root layout uses application/ld+json script"
  );
  const art = read("apps/web/src/app/arte/[slug]/page.tsx");
  assert(
    art.includes("artworkVisualArtworkSchema"),
    "artwork detail emits VisualArtwork JSON-LD"
  );
}

// ---- Transversal: Brand DNA ------------------------------------------------
console.log("\nTransversal \u00b7 Brand DNA palette (no #FFFFFF/#000000)");
{
  // Scan all web app source files and UI components for pure #FFFFFF / #000000
  // (except in the palette rule file and in comments describing what's forbidden).
  const files: string[] = [];
  function walk(dir: string) {
    const { readdirSync } = require("node:fs");
    for (const entry of readdirSync(resolve(ROOT, dir), { withFileTypes: true })) {
      const rel = `${dir}/${entry.name}`;
      if (entry.isDirectory()) {
        if (
          entry.name === "node_modules" ||
          entry.name === ".next" ||
          entry.name === "dist"
        )
          continue;
        walk(rel);
      } else if (
        /\.(tsx?|css)$/.test(entry.name) &&
        !entry.name.endsWith(".test.ts") &&
        !entry.name.endsWith(".test.tsx")
      ) {
        files.push(rel);
      }
    }
  }
  walk("apps/web/src");
  walk("packages/ui/src");

  const forbiddenWhite = /#FFFFFF\b/i;
  const forbiddenBlack = /#000000\b/;

  let whiteHits = 0;
  let blackHits = 0;
  for (const f of files) {
    const text = read(f);
    if (forbiddenWhite.test(text)) {
      whiteHits++;
      console.error(`    pure #FFFFFF in ${f}`);
    }
    if (forbiddenBlack.test(text)) {
      blackHits++;
      console.error(`    pure #000000 in ${f}`);
    }
  }
  assert(whiteHits === 0, "no pure #FFFFFF in app/UI source");
  assert(blackHits === 0, "no pure #000000 in app/UI source");
}

// ---- Transversal: vocabulary -----------------------------------------------
console.log("\nTransversal \u00b7 Brand vocabulary");
{
  const webSrc = "apps/web/src";
  const { readdirSync } = require("node:fs");
  const files: string[] = [];
  function walk(dir: string) {
    for (const entry of readdirSync(resolve(ROOT, dir), { withFileTypes: true })) {
      const rel = `${dir}/${entry.name}`;
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".next") continue;
        walk(rel);
      } else if (/\.(tsx?)$/.test(entry.name) && !entry.name.endsWith(".test.ts")) {
        files.push(rel);
      }
    }
  }
  walk(webSrc);

  let decoracionHits = 0;
  let baratoHits = 0;
  for (const f of files) {
    const text = read(f).toLowerCase();
    if (/\bdecoraci[oó]n\b/.test(text)) {
      decoracionHits++;
      console.error(`    forbidden 'decoraci\u00f3n' in ${f}`);
    }
    if (/\bbarato\b/.test(text) || /\becon[oó]mico\b/.test(text)) {
      baratoHits++;
      console.error(`    forbidden 'barato/economico' in ${f}`);
    }
  }
  assert(decoracionHits === 0, "brand vocab: no 'decoracion'");
  assert(baratoHits === 0, "brand vocab: no 'barato' / 'economico'");
}

// ---- Summary ---------------------------------------------------------------
console.log(`\n\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error("\nFailures:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
process.exit(0);
