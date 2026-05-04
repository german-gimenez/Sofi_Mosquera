/**
 * Migrate assets from sofimosquera.lovable.app (Lovable preview) to Cloudinary.
 *
 * For each project + art series in Lovable:
 *   1. Fetch the page
 *   2. Extract image URLs (/assets/*-{hash}.{ext})
 *   3. Download
 *   4. Upload to Cloudinary with structured public_id
 *
 * Output:
 *   - sofi-mosquera/projects/{slug}/cover
 *   - sofi-mosquera/projects/{slug}/01..N
 *   - sofi-mosquera/artworks/{serie}/{obra-slug}/cover
 *   - sofi-mosquera/artworks/{serie}/{obra-slug}/context (if available)
 *
 * Usage: pnpm exec tsx scripts/migrate-lovable-assets.ts [--projects | --art | --all]
 *
 * Note: Lovable serves a SPA. The HTML may not include img tags after hydration.
 * For each page we attempt to parse meta og:image + img patterns. Pages with no
 * extractable assets are logged for manual handling.
 */
import { config } from "dotenv";
import { resolve } from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { v2 as cloudinary } from "cloudinary";

config({ path: resolve(__dirname, "../.env.local") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const LOVABLE_BASE = "https://sofimosquera.lovable.app";
const CACHE_DIR = resolve(__dirname, "../temp/lovable-cache");

interface ProjectMap {
  slug: string;
  newSlug: string; // same as slug for now, kept for future remapping
}

interface SeriesMap {
  slug: string;
  obras: string[]; // slug list
}

const PROJECTS: ProjectMap[] = [
  { slug: "bc", newSlug: "bc" },
  { slug: "casa-sp", newSlug: "casa-sp" },
  { slug: "club-house-rn", newSlug: "club-house-rn" },
  { slug: "casa-bf", newSlug: "casa-bf" },
  { slug: "vacherie", newSlug: "vacherie" },
  { slug: "andeluna", newSlug: "andeluna" },
];

const SERIES: SeriesMap[] = [
  {
    slug: "emociones",
    obras: [
      "emo-desolacion",
      "emo-tension",
      "emo-recordar",
      "emo-libertad",
      "emo-primavera",
      "emo-no-puedo-ver",
      "emo-juguemos",
    ],
  },
  // Other series obras populated when Sofía confirms slugs
  { slug: "loading", obras: [] },
  { slug: "movimiento", obras: [] },
  { slug: "solidez", obras: [] },
];

async function ensureCache() {
  if (!existsSync(CACHE_DIR)) {
    await mkdir(CACHE_DIR, { recursive: true });
  }
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; SofiMosqueraMigrator/1.0)",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

/** Extract image URLs from raw HTML. Looks for /assets/*.(jpg|png|webp|jpeg). */
function extractImageUrls(html: string, base: string): string[] {
  const urls = new Set<string>();
  const patterns = [
    /\/assets\/[\w\-.]+\.(?:jpg|jpeg|png|webp)/gi,
    /https:\/\/sofimosquera\.lovable\.app\/assets\/[\w\-.]+\.(?:jpg|jpeg|png|webp)/gi,
  ];
  for (const re of patterns) {
    const matches = html.matchAll(re);
    for (const m of matches) {
      const u = m[0].startsWith("http") ? m[0] : `${base}${m[0]}`;
      urls.add(u);
    }
  }
  return Array.from(urls);
}

async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} downloading ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return buf;
}

async function uploadBuffer(
  buf: Buffer,
  publicId: string
): Promise<{ ok: true; w: number; h: number; v: number } | { ok: false; err: string }> {
  return new Promise((resolveP) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      },
      (err, result) => {
        if (err || !result) {
          resolveP({ ok: false, err: err?.message ?? "no result" });
        } else {
          resolveP({
            ok: true,
            w: result.width,
            h: result.height,
            v: result.version,
          });
        }
      }
    );
    stream.end(buf);
  });
}

async function migrateProject(p: ProjectMap) {
  console.log(`\n[project] ${p.slug}`);
  const url = `${LOVABLE_BASE}/proyectos/${p.slug}`;
  let html: string;
  try {
    html = await fetchHtml(url);
  } catch (e) {
    console.error(`  fetch failed: ${(e as Error).message}`);
    return;
  }

  const imageUrls = extractImageUrls(html, LOVABLE_BASE);
  if (imageUrls.length === 0) {
    console.warn(`  no assets found in HTML — Lovable SPA may need rendered fetch`);
    return;
  }

  console.log(`  found ${imageUrls.length} images`);
  // First image = cover, rest = gallery
  for (let i = 0; i < imageUrls.length; i++) {
    const isCover = i === 0;
    const publicId = isCover
      ? `sofi-mosquera/projects/${p.newSlug}/cover`
      : `sofi-mosquera/projects/${p.newSlug}/${String(i).padStart(2, "0")}`;
    try {
      const buf = await downloadImage(imageUrls[i]);
      const result = await uploadBuffer(buf, publicId);
      if (result.ok) {
        console.log(`  [ok] ${publicId} (${result.w}x${result.h})`);
      } else {
        console.error(`  [fail] ${publicId}: ${result.err}`);
      }
    } catch (e) {
      console.error(`  [error] ${publicId}: ${(e as Error).message}`);
    }
  }
}

async function migrateSeries(s: SeriesMap) {
  console.log(`\n[series] ${s.slug}`);
  const url = `${LOVABLE_BASE}/arte/${s.slug}`;
  let html: string;
  try {
    html = await fetchHtml(url);
  } catch (e) {
    console.error(`  fetch failed: ${(e as Error).message}`);
    return;
  }
  const imageUrls = extractImageUrls(html, LOVABLE_BASE);
  console.log(`  found ${imageUrls.length} images at series level`);

  for (const obraSlug of s.obras) {
    const obraUrl = `${LOVABLE_BASE}/arte/${s.slug}/${obraSlug}`;
    let obraHtml: string;
    try {
      obraHtml = await fetchHtml(obraUrl);
    } catch (e) {
      console.error(`  [obra ${obraSlug}] fetch failed`);
      continue;
    }
    const obraImages = extractImageUrls(obraHtml, LOVABLE_BASE);
    if (obraImages.length === 0) {
      console.warn(`  [obra ${obraSlug}] no images`);
      continue;
    }
    console.log(`  [obra ${obraSlug}] ${obraImages.length} images`);
    for (let i = 0; i < Math.min(obraImages.length, 2); i++) {
      const variant = i === 0 ? "cover" : "context";
      const publicId = `sofi-mosquera/artworks/${s.slug}/${obraSlug}/${variant}`;
      try {
        const buf = await downloadImage(obraImages[i]);
        const result = await uploadBuffer(buf, publicId);
        if (result.ok) {
          console.log(`    [ok] ${variant}`);
        } else {
          console.error(`    [fail] ${variant}: ${result.err}`);
        }
      } catch (e) {
        console.error(`    [error] ${variant}: ${(e as Error).message}`);
      }
    }
  }
}

async function main() {
  await ensureCache();
  const arg = process.argv[2] ?? "--all";
  const doProjects = arg === "--all" || arg === "--projects";
  const doArt = arg === "--all" || arg === "--art";

  console.log(`Lovable assets migration to Cloudinary`);
  console.log(`Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`Mode: ${arg}`);

  if (doProjects) {
    for (const p of PROJECTS) {
      await migrateProject(p);
    }
  }
  if (doArt) {
    for (const s of SERIES) {
      await migrateSeries(s);
    }
  }
  console.log(`\nDone.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
