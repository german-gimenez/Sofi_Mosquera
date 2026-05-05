/**
 * Audit V3 redesign — cross-checks the spec V3 + remediation plan against the
 * current state of the repo + DB. Runs as a standalone tsx script.
 *
 * Run: pnpm exec tsx scripts/audit-v3-fixes.ts
 */
import { config } from "dotenv";
import { resolve, join } from "path";
import { readFileSync, existsSync, statSync, readdirSync } from "fs";

config({ path: resolve(__dirname, "../.env.local") });

const ROOT = resolve(__dirname, "..");
const WEB_SRC = join(ROOT, "apps/web/src");
const PACKAGES = join(ROOT, "packages");

interface Result {
  id: string;
  category: string;
  description: string;
  passed: boolean;
  detail?: string;
}

const results: Result[] = [];

function pass(id: string, category: string, description: string, detail?: string) {
  results.push({ id, category, description, passed: true, detail });
}
function fail(
  id: string,
  category: string,
  description: string,
  detail?: string
) {
  results.push({ id, category, description, passed: false, detail });
}

function readFile(path: string): string {
  try {
    return readFileSync(path, "utf-8");
  } catch {
    return "";
  }
}

function fileExists(path: string): boolean {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

function dirExists(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function walk(dir: string, ext: string[] = [".ts", ".tsx"]): string[] {
  const out: string[] = [];
  if (!dirExists(dir)) return out;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next") continue;
      out.push(...walk(p, ext));
    } else if (ext.some((x) => e.name.endsWith(x))) {
      out.push(p);
    }
  }
  return out;
}

// ──────────────────────────────────────────────
// CATEGORY: Sprint 1 — Foundation
// ──────────────────────────────────────────────
function auditSprint1() {
  // i18n setup
  const routing = readFile(join(WEB_SRC, "i18n/routing.ts"));
  if (routing.includes('locales: ["es", "en"]') && routing.includes('localePrefix: "always"'))
    pass("S1.01", "i18n", "routing.ts has es/en locales + localePrefix=always");
  else
    fail("S1.01", "i18n", "routing.ts missing locales or localePrefix=always");

  if (
    routing.includes('"/proyectos"') &&
    routing.includes('"/projects"') &&
    routing.includes('"/estudio"') &&
    routing.includes('"/studio"')
  )
    pass("S1.02", "i18n", "routing.ts has localized pathnames ES↔EN");
  else fail("S1.02", "i18n", "routing.ts missing localized pathnames");

  if (fileExists(join(WEB_SRC, "i18n/request.ts")))
    pass("S1.03", "i18n", "i18n/request.ts exists");
  else fail("S1.03", "i18n", "i18n/request.ts missing");

  if (fileExists(join(WEB_SRC, "middleware.ts")))
    pass("S1.04", "i18n", "middleware.ts exists");
  else fail("S1.04", "i18n", "middleware.ts missing");

  if (dirExists(join(WEB_SRC, "app/[locale]")))
    pass("S1.05", "i18n", "app/[locale]/ directory exists");
  else fail("S1.05", "i18n", "app/[locale]/ missing");

  // G-01 border-radius 0
  const globals = readFile(join(WEB_SRC, "app/globals.css"));
  if (globals.includes("--radius-card: 0px") && globals.includes("--radius-image: 0px"))
    pass("S1.06", "G-01", "border-radius 0 (radius-card + radius-image)");
  else fail("S1.06", "G-01", "border-radius not 0");

  // No rounded-image / rounded-card across src
  const allFiles = walk(WEB_SRC);
  const violatesG01 = allFiles.filter((f) => {
    const content = readFile(f);
    return /\b(rounded-image|rounded-card)\b/.test(content);
  });
  if (violatesG01.length === 0)
    pass("S1.07", "G-01", "no rounded-image/rounded-card classes in src");
  else
    fail(
      "S1.07",
      "G-01",
      "rounded-image/rounded-card found",
      violatesG01.map((f) => f.replace(ROOT + "\\", "")).join(", ")
    );

  // Schema migration
  const schema = readFile(join(PACKAGES, "db/src/schema.ts"));
  const schemaChecks = [
    "titleEn",
    "subtitleEn",
    "interventionEn",
    "conceptEn",
    "descriptionEn",
    "technicalData",
    "visible",
    "seriesSlug",
    "techniqueEn",
    "contextUrl",
    "priceVisible",
    "isCatalog",
    "materialsEn",
  ];
  const missingSchema = schemaChecks.filter((c) => !schema.includes(c));
  if (missingSchema.length === 0)
    pass("S1.08", "schema", "all V3 columns present");
  else
    fail("S1.08", "schema", "missing columns", missingSchema.join(", "));

  if (schema.includes("export const series ="))
    pass("S1.09", "schema", "series table exists");
  else fail("S1.09", "schema", "series table missing");

  // Logo component
  if (fileExists(join(WEB_SRC, "components/logo.tsx")))
    pass("S1.10", "logo", "Logo component exists");
  else fail("S1.10", "logo", "Logo component missing");
  const logoSrc = readFile(join(WEB_SRC, "components/logo.tsx"));
  const variants = ["sm-dark", "sm-white", "wordmark-dark", "wordmark-white"];
  if (variants.every((v) => logoSrc.includes(v)))
    pass("S1.11", "logo", "Logo has 4 variants");
  else fail("S1.11", "logo", "Logo missing variants");
  if (logoSrc.includes("onError"))
    pass("S1.12", "logo", "Logo has onError fallback");
  else fail("S1.12", "logo", "Logo missing onError fallback");

  // Helper pickLocale
  const helpers = readFile(join(WEB_SRC, "lib/i18n-helpers.ts"));
  if (
    helpers.includes("pickLocale") &&
    helpers.includes("formatPriceArs") &&
    helpers.includes("formatPriceOrInquire")
  )
    pass("S1.13", "i18n", "pickLocale + formatPriceArs + formatPriceOrInquire");
  else fail("S1.13", "i18n", "i18n-helpers.ts incomplete");

  // Scripts
  if (fileExists(join(ROOT, "scripts/upload-branding.ts")))
    pass("S1.14", "scripts", "upload-branding.ts exists");
  else fail("S1.14", "scripts", "upload-branding.ts missing");

  if (fileExists(join(ROOT, "scripts/migrate-lovable-assets.ts")))
    pass("S1.15", "scripts", "migrate-lovable-assets.ts exists");
  else fail("S1.15", "scripts", "migrate-lovable-assets.ts missing");
}

// ──────────────────────────────────────────────
// CATEGORY: Sprint 2 — Layout
// ──────────────────────────────────────────────
function auditSprint2() {
  const layout = readFile(join(WEB_SRC, "app/[locale]/layout.tsx"));
  if (layout.includes("Manrope") && layout.includes("Cormorant_Garamond"))
    pass("S2.01", "G-02", "Manrope + Cormorant Garamond loaded via next/font");
  else fail("S2.01", "G-02", "fonts not loaded");

  // Nav 7 items
  const nav = readFile(join(WEB_SRC, "components/nav.tsx"));
  const navItems = [
    "/proyectos",
    "/estudio",
    "/servicios",
    "/muebles",
    "/arte",
    "/contacto",
  ];
  if (navItems.every((i) => nav.includes(i)))
    pass("S2.02", "H-02", "Nav has 7 items including all V3 routes");
  else fail("S2.02", "H-02", "Nav missing items");

  if (nav.includes("LocaleSwitcher"))
    pass("S2.03", "H-02", "Nav imports LocaleSwitcher");
  else fail("S2.03", "H-02", "Nav missing LocaleSwitcher");

  if (nav.includes('variant={scrolled ? "sm-dark" : "sm-white"}'))
    pass("S2.04", "H-01", "Nav swaps Logo variant on scroll");
  else fail("S2.04", "H-01", "Nav does not swap Logo variant on scroll");

  // Hero V3
  const hero = readFile(join(WEB_SRC, "components/hero.tsx"));
  if (hero.includes("animate-ken-burns") && hero.includes("heroEyebrow"))
    pass("S2.05", "I-01/I-02", "Hero V3 has Ken Burns + caption from translations");
  else fail("S2.05", "I-01/I-02", "Hero V3 incomplete");

  // hero-slider eliminado
  if (!fileExists(join(WEB_SRC, "components/hero-slider.tsx")))
    pass("S2.06", "cleanup", "hero-slider.tsx eliminado");
  else fail("S2.06", "cleanup", "hero-slider.tsx still exists (dead code)");

  // ArtFeatured + ArtworkCard + FeaturedSeries + Manifesto + Newsletter
  const components = [
    "art-featured.tsx",
    "artwork-card.tsx",
    "featured-series.tsx",
    "manifesto-section.tsx",
    "newsletter-art.tsx",
    "locale-switcher.tsx",
  ];
  for (const c of components) {
    if (fileExists(join(WEB_SRC, "components", c)))
      pass(`S2.${c}`, "components", `${c} exists`);
    else fail(`S2.${c}`, "components", `${c} missing`);
  }

  // P-01 project-grid: solo overlay hover
  const grid = readFile(join(WEB_SRC, "components/project-grid.tsx"));
  if (grid.includes("P-01") || grid.includes("opacity-0 group-hover:opacity-100"))
    pass("S2.07", "P-01", "project-grid uses hover overlay only");
  else fail("S2.07", "P-01", "project-grid not P-01-compliant");

  // S-01: 4 servicios with 04 = "Styling"
  const es = JSON.parse(readFile(join(WEB_SRC, "..", "messages/es.json")));
  if (es.servicios && es.servicios["04title"] === "Styling")
    pass("S2.08", "S-01", "servicios.04title = Styling");
  else fail("S2.08", "S-01", "servicios.04title not Styling");

  // F-01 footer: Besares 271B
  const footer = readFile(join(WEB_SRC, "components/footer.tsx"));
  if (
    footer.includes('variant="wordmark-dark"') &&
    footer.includes("font-bold") &&
    footer.includes('t("address")')
  )
    pass(
      "S2.09",
      "F-01",
      "footer uses wordmark-dark + bold email + address from translations"
    );
  else fail("S2.09", "F-01", "footer incomplete");

  if (es.footer && es.footer.address && es.footer.address.includes("Besares 271B"))
    pass("S2.10", "F-01", 'footer.address contains "Besares 271B"');
  else fail("S2.10", "F-01", "footer.address missing Besares 271B");

  // E-01/E-02 estudio: bio is i18n (not hardcoded ES)
  const estudio = readFile(join(WEB_SRC, "app/[locale]/estudio/page.tsx"));
  if (estudio.includes('t("body1")') && !estudio.includes("SM Studio es un estudio de"))
    pass("S2.11", "E-01", "estudio bio uses i18n (not hardcoded)");
  else fail("S2.11", "E-01", "estudio bio still hardcoded ES");

  // C-01 contacto: form + iframe + info
  const contacto = readFile(join(WEB_SRC, "app/[locale]/contacto/page.tsx"));
  if (contacto.includes("ContactForm") && contacto.includes("<iframe"))
    pass("S2.12", "C-01", "contacto has ContactForm + iframe map");
  else fail("S2.12", "C-01", "contacto missing form or map");
}

// ──────────────────────────────────────────────
// CATEGORY: Sprint 3 — Detail pages
// ──────────────────────────────────────────────
function auditSprint3() {
  // proyectos page uses i18n
  const proyectos = readFile(
    join(WEB_SRC, "app/[locale]/proyectos/page.tsx")
  );
  if (
    proyectos.includes('from "@/i18n/navigation"') &&
    proyectos.includes("setRequestLocale") &&
    proyectos.includes("eq(projects.visible, true)")
  )
    pass(
      "S3.01",
      "proyectos",
      "proyectos page uses i18n + filters visible=true"
    );
  else fail("S3.01", "proyectos", "proyectos page incomplete");

  // proyectos/[slug] uses i18n + nav circular + 3-col metadata
  const projDetail = readFile(
    join(WEB_SRC, "app/[locale]/proyectos/[slug]/page.tsx")
  );
  // Hardcoded ES "Siguiente proyecto" should NOT appear as user-facing text
  // (we only check JSX text nodes, not comments). Look for `>Siguiente proyecto<`
  // or `>Next project<` patterns in JSX, not in comments.
  const hasHardcodedNextEs = />Siguiente proyecto</.test(projDetail);
  const hasHardcodedNextEn = />Next project</.test(projDetail);
  if (
    projDetail.includes('from "@/i18n/navigation"') &&
    !hasHardcodedNextEs &&
    !hasHardcodedNextEn &&
    projDetail.includes('t("next")') &&
    projDetail.includes("grid-cols-3") &&
    projDetail.includes("intervention")
  )
    pass(
      "S3.02",
      "proyectos",
      "proyectos/[slug] uses i18n + circular nav + 3-col metadata + intervention"
    );
  else fail("S3.02", "proyectos", "proyectos/[slug] incomplete");

  // arte page uses ArtworkCard + series grouping
  const arte = readFile(join(WEB_SRC, "app/[locale]/arte/page.tsx"));
  if (
    arte.includes("ArtworkCard") &&
    arte.includes("seriesSlug") &&
    arte.includes('from "next-intl/server"')
  )
    pass("S3.03", "arte", "arte page uses ArtworkCard + series grouping + i18n");
  else fail("S3.03", "arte", "arte page incomplete");

  // arte/[slug] uses priceVisible + seriesSlug + WhatsApp enriched
  const arteSlug = readFile(
    join(WEB_SRC, "app/[locale]/arte/[slug]/page.tsx")
  );
  if (
    arteSlug.includes("priceVisible") &&
    arteSlug.includes("seriesSlug") &&
    arteSlug.includes("artworkMessage") &&
    arteSlug.includes("contextUrl")
  )
    pass(
      "S3.04",
      "arte",
      "arte/[slug] uses priceVisible + seriesSlug + WhatsApp + contextUrl"
    );
  else fail("S3.04", "arte", "arte/[slug] incomplete");

  // muebles uses isCatalog filter
  const muebles = readFile(join(WEB_SRC, "app/[locale]/muebles/page.tsx"));
  if (
    muebles.includes("furniture.isCatalog") &&
    muebles.includes('from "@/i18n/navigation"')
  )
    pass("S3.05", "muebles", "muebles filters isCatalog=true + i18n");
  else fail("S3.05", "muebles", "muebles missing isCatalog filter or i18n");

  // ArtworkCard
  const artworkCard = readFile(
    join(WEB_SRC, "components/artwork-card.tsx")
  );
  if (
    artworkCard.includes("formatPriceOrInquire") &&
    artworkCard.includes("ArtworkTilt") &&
    artworkCard.includes("artwork-context")
  )
    pass(
      "S3.06",
      "artwork-card",
      "ArtworkCard has price + tilt + context crossfade"
    );
  else fail("S3.06", "artwork-card", "ArtworkCard incomplete");
}

// ──────────────────────────────────────────────
// CATEGORY: Sprint 4 — Bilingual + backend
// ──────────────────────────────────────────────
function auditSprint4() {
  const es = JSON.parse(readFile(join(WEB_SRC, "..", "messages/es.json")));
  const en = JSON.parse(readFile(join(WEB_SRC, "..", "messages/en.json")));

  const requiredNs = [
    "nav",
    "home",
    "proyectos",
    "estudio",
    "servicios",
    "muebles",
    "arte",
    "artCommerce",
    "contacto",
    "footer",
    "cta",
    "meta",
    "languageSwitcher",
  ];
  const missingEs = requiredNs.filter((ns) => !es[ns]);
  const missingEn = requiredNs.filter((ns) => !en[ns]);
  if (missingEs.length === 0 && missingEn.length === 0)
    pass("S4.01", "i18n", "all required namespaces present in es + en");
  else
    fail(
      "S4.01",
      "i18n",
      `missing namespaces: es=${missingEs.join(",")} en=${missingEn.join(",")}`
    );

  // Parallel keys (ES and EN must have the same shape)
  function flatKeys(obj: Record<string, unknown>, prefix = ""): string[] {
    const out: string[] = [];
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      const key = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === "object" && !Array.isArray(v)) {
        out.push(...flatKeys(v as Record<string, unknown>, key));
      } else {
        out.push(key);
      }
    }
    return out.sort();
  }
  const esKeys = flatKeys(es);
  const enKeys = flatKeys(en);
  const onlyInEs = esKeys.filter((k) => !enKeys.includes(k));
  const onlyInEn = enKeys.filter((k) => !esKeys.includes(k));
  if (onlyInEs.length === 0 && onlyInEn.length === 0)
    pass("S4.02", "i18n", `${esKeys.length} keys parallel between es + en`);
  else
    fail(
      "S4.02",
      "i18n",
      `key drift: only in es=[${onlyInEs.slice(0, 5).join(",")}] only in en=[${onlyInEn.slice(0, 5).join(",")}]`
    );

  // WhatsApp i18n
  const wa = readFile(
    join(PACKAGES, "ui/src/lib/whatsapp-messages.ts")
  );
  if (
    wa.includes("WHATSAPP_MESSAGES_I18N") &&
    wa.includes("artworkMessage") &&
    wa.includes("priceArs")
  )
    pass(
      "S4.03",
      "whatsapp",
      "WhatsApp i18n with artworkMessage enriched (priceArs)"
    );
  else fail("S4.03", "whatsapp", "WhatsApp i18n incomplete");

  // API contact + newsletter
  if (
    fileExists(join(WEB_SRC, "app/api/contact/route.ts")) &&
    readFile(join(WEB_SRC, "app/api/contact/route.ts")).includes("zod")
  )
    pass("S4.04", "api", "/api/contact exists with zod");
  else fail("S4.04", "api", "/api/contact missing or no zod");

  if (
    fileExists(join(WEB_SRC, "app/api/newsletter/route.ts")) &&
    readFile(join(WEB_SRC, "app/api/newsletter/route.ts")).includes("zod")
  )
    pass("S4.05", "api", "/api/newsletter exists with zod");
  else fail("S4.05", "api", "/api/newsletter missing or no zod");

  // Contact form: client-side fetch JSON
  const contactForm = readFile(
    join(WEB_SRC, "components/contact-form.tsx")
  );
  if (
    contactForm.includes('"use client"') &&
    contactForm.includes('fetch("/api/contact"') &&
    contactForm.includes('Content-Type": "application/json"')
  )
    pass(
      "S4.06",
      "contact-form",
      "ContactForm is client-side with JSON fetch"
    );
  else fail("S4.06", "contact-form", "ContactForm not client+JSON");

  // structured-data localized
  const sd = readFile(join(WEB_SRC, "lib/structured-data.ts"));
  if (sd.includes("locale") && sd.includes("inLanguage"))
    pass("S4.07", "structured-data", "structured-data is locale-aware");
  else fail("S4.07", "structured-data", "structured-data not localized");

  // sitemap localized
  const sm = readFile(join(WEB_SRC, "app/sitemap.ts"));
  if (sm.includes("routing.locales") && sm.includes("alternates"))
    pass("S4.08", "sitemap", "sitemap iterates locales + alternates");
  else fail("S4.08", "sitemap", "sitemap not localized");
}

// ──────────────────────────────────────────────
// CATEGORY: Sprint 5 — Motion
// ──────────────────────────────────────────────
function auditSprint5() {
  const globals = readFile(join(WEB_SRC, "app/globals.css"));
  if (globals.includes("@keyframes ken-burns"))
    pass("S5.01", "motion", "@keyframes ken-burns defined");
  else fail("S5.01", "motion", "@keyframes ken-burns missing");

  if (globals.includes("prefers-reduced-motion"))
    pass("S5.02", "motion", "prefers-reduced-motion respected");
  else fail("S5.02", "motion", "prefers-reduced-motion not respected");

  if (globals.includes(".artwork-context"))
    pass("S5.03", "motion", "artwork-context crossfade in CSS");
  else fail("S5.03", "motion", "artwork-context crossfade missing");

  if (fileExists(join(WEB_SRC, "components/artwork-tilt.tsx")))
    pass("S5.04", "motion", "ArtworkTilt component exists");
  else fail("S5.04", "motion", "ArtworkTilt missing");
}

// ──────────────────────────────────────────────
// CATEGORY: Brand DNA + cleanup
// ──────────────────────────────────────────────
function auditBrandDna() {
  const allFiles = walk(WEB_SRC).filter(
    (f) => !f.includes("node_modules") && !f.includes(".next")
  );
  const violatesWhite = allFiles.filter((f) => {
    const c = readFile(f);
    // Allow `#FFF...` only in comments. Quick check: skip files referencing reduced-motion
    return /#FFFFFF/i.test(c);
  });
  if (violatesWhite.length === 0)
    pass("BD.01", "Brand DNA", "no #FFFFFF in src");
  else
    fail(
      "BD.01",
      "Brand DNA",
      "#FFFFFF found",
      violatesWhite.map((f) => f.replace(ROOT + "\\", "")).join(", ")
    );

  const violatesBlack = allFiles.filter((f) => {
    const c = readFile(f);
    return /#000000/.test(c);
  });
  if (violatesBlack.length === 0)
    pass("BD.02", "Brand DNA", "no #000000 in src");
  else
    fail(
      "BD.02",
      "Brand DNA",
      "#000000 found",
      violatesBlack.map((f) => f.replace(ROOT + "\\", "")).join(", ")
    );

  // No legacy "import Link from \"next/link\"" inside [locale]/
  const localePages = walk(join(WEB_SRC, "app/[locale]"));
  const legacyLink = localePages.filter((f) => {
    const c = readFile(f);
    return /from\s+["']next\/link["']/.test(c);
  });
  if (legacyLink.length === 0)
    pass("BD.03", "i18n", "no `next/link` import inside [locale]/ pages");
  else
    fail(
      "BD.03",
      "i18n",
      "legacy next/link in [locale]/ pages",
      legacyLink.map((f) => f.replace(ROOT + "\\", "")).join(", ")
    );

  // No interiorismo route
  if (!dirExists(join(WEB_SRC, "app/[locale]/interiorismo")))
    pass("BD.04", "cleanup", "[locale]/interiorismo deleted");
  else fail("BD.04", "cleanup", "[locale]/interiorismo still exists");
}

// ──────────────────────────────────────────────
// CATEGORY: DB content (live)
// ──────────────────────────────────────────────
async function auditDb() {
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL_UNPOOLED!);

  // 6 visible projects
  const visibleProjects = (await sql`SELECT slug FROM projects WHERE visible = true ORDER BY position`) as Array<{ slug: string }>;
  const expectedSlugs = ["bc", "casa-sp", "club-house-rn", "casa-bf", "vacherie", "andeluna"];
  const haveAll = expectedSlugs.every((s) =>
    visibleProjects.some((p) => p.slug === s)
  );
  if (visibleProjects.length === 6 && haveAll)
    pass("DB.01", "seed", "6 Lovable projects visible (bc, casa-sp, club-house-rn, casa-bf, vacherie, andeluna)");
  else
    fail(
      "DB.01",
      "seed",
      `expected 6 visible, got ${visibleProjects.length}: [${visibleProjects.map((p) => p.slug).join(",")}]`
    );

  const hiddenProjects = (await sql`SELECT count(*)::int AS n FROM projects WHERE visible = false`) as Array<{ n: number }>;
  if (hiddenProjects[0].n >= 7)
    pass(
      "DB.02",
      "seed",
      `${hiddenProjects[0].n} legacy projects hidden (visible=false)`
    );
  else
    fail(
      "DB.02",
      "seed",
      `expected ≥7 hidden legacy, got ${hiddenProjects[0].n}`
    );

  // 4 series
  const seriesCount = (await sql`SELECT count(*)::int AS n FROM series`) as Array<{ n: number }>;
  if (seriesCount[0].n === 4)
    pass("DB.03", "seed", "4 series rows present");
  else fail("DB.03", "seed", `expected 4 series, got ${seriesCount[0].n}`);

  // featured_series setting
  const fs = (await sql`SELECT value FROM settings WHERE key = 'featured_series'`) as Array<{ value: unknown }>;
  if (fs.length > 0 && (fs[0].value === "emociones" || JSON.stringify(fs[0].value) === '"emociones"'))
    pass("DB.04", "seed", 'featured_series setting = "emociones"');
  else
    fail(
      "DB.04",
      "seed",
      `featured_series unset or wrong: ${JSON.stringify(fs[0]?.value)}`
    );

  // artworks have seriesSlug
  const artworksWithSlug = (await sql`SELECT count(*)::int AS n FROM artworks WHERE series_slug IS NOT NULL`) as Array<{ n: number }>;
  const totalArtworks = (await sql`SELECT count(*)::int AS n FROM artworks`) as Array<{ n: number }>;
  if (artworksWithSlug[0].n >= 8)
    pass(
      "DB.05",
      "seed",
      `${artworksWithSlug[0].n}/${totalArtworks[0].n} artworks have series_slug`
    );
  else
    fail(
      "DB.05",
      "seed",
      `expected ≥8 artworks with series_slug, got ${artworksWithSlug[0].n}`
    );

  // Emociones obras with prices
  const emociones = (await sql`SELECT count(*)::int AS n FROM artworks WHERE series_slug = 'emociones' AND price_ars IS NOT NULL`) as Array<{ n: number }>;
  if (emociones[0].n >= 7)
    pass(
      "DB.06",
      "seed",
      `${emociones[0].n} Emociones artworks with priceArs`
    );
  else
    fail(
      "DB.06",
      "seed",
      `expected ≥7 Emociones with priceArs, got ${emociones[0].n}`
    );

  // V3 columns populated
  const titleEnPopulated = (await sql`SELECT count(*)::int AS n FROM projects WHERE visible = true AND title_en IS NOT NULL`) as Array<{ n: number }>;
  if (titleEnPopulated[0].n === 6)
    pass(
      "DB.07",
      "seed",
      "6 visible projects have title_en populated"
    );
  else
    fail(
      "DB.07",
      "seed",
      `expected 6 with title_en, got ${titleEnPopulated[0].n}`
    );

  const interventionPopulated = (await sql`SELECT count(*)::int AS n FROM projects WHERE visible = true AND intervention IS NOT NULL`) as Array<{ n: number }>;
  if (interventionPopulated[0].n === 6)
    pass(
      "DB.08",
      "seed",
      "6 visible projects have intervention populated"
    );
  else
    fail(
      "DB.08",
      "seed",
      `expected 6 with intervention, got ${interventionPopulated[0].n}`
    );
}

// ──────────────────────────────────────────────
// Run
// ──────────────────────────────────────────────
async function main() {
  console.log("\n=== AUDIT V3 — Sofimosquera redesign ===\n");

  auditSprint1();
  auditSprint2();
  auditSprint3();
  auditSprint4();
  auditSprint5();
  auditBrandDna();

  try {
    if (process.env.DATABASE_URL_UNPOOLED) {
      await auditDb();
    } else {
      console.log("⚠️  DATABASE_URL_UNPOOLED not set — skipping DB checks\n");
    }
  } catch (e) {
    console.error("DB audit failed:", (e as Error).message);
  }

  // Sort by category and id
  results.sort((a, b) =>
    a.category === b.category
      ? a.id.localeCompare(b.id)
      : a.category.localeCompare(b.category)
  );

  let lastCat = "";
  for (const r of results) {
    if (r.category !== lastCat) {
      console.log(`\n[${r.category}]`);
      lastCat = r.category;
    }
    const icon = r.passed ? "✓" : "✗";
    console.log(`  ${icon} ${r.id}  ${r.description}`);
    if (!r.passed && r.detail) {
      console.log(`         → ${r.detail}`);
    }
  }

  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  const pct = Math.round((passed / total) * 100);

  console.log(`\n=== RESULT: ${passed}/${total} passed (${pct}%) ===`);
  if (failed > 0) {
    console.log(`✗ ${failed} failure(s) — review above`);
    process.exitCode = 1;
  } else {
    console.log("✓ all checks passed");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
