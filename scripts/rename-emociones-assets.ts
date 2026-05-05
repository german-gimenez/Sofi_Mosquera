/**
 * Rename Cloudinary assets for Emociones series:
 *   sofi-mosquera/artworks/{slug}/cover  →  sofi-mosquera/artworks/emociones/{slug}/cover
 *
 * The seed V3 organizes artwork covers by series. The 8 Emociones covers were
 * uploaded under the flat path before the V3 schema migration. This script
 * moves them to match the cover_url stored in the DB.
 *
 * Idempotent: if target already exists or source missing, logs and continues.
 *
 * Usage: pnpm exec tsx scripts/rename-emociones-assets.ts [--dry-run]
 */
import { config } from "dotenv";
import { resolve } from "path";
import { v2 as cloudinary } from "cloudinary";

config({ path: resolve(__dirname, "../.env.local") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const SLUGS = [
  "el-rey",
  "isla-gris",
  "mountains",
  "nacimiento",
  "muri",
  "musica",
  "intercambio",
  "triptico-mapa",
];

const SERIES = "emociones";
const DRY_RUN = process.argv.includes("--dry-run");

interface RenameResult {
  slug: string;
  from: string;
  to: string;
  status: "renamed" | "already-at-target" | "source-missing" | "error";
  detail?: string;
}

async function exists(publicId: string): Promise<boolean> {
  try {
    await cloudinary.api.resource(publicId);
    return true;
  } catch (e) {
    const err = e as { error?: { http_code?: number }; http_code?: number };
    const code = err.error?.http_code ?? err.http_code;
    if (code === 404) return false;
    throw e;
  }
}

async function renameOne(slug: string): Promise<RenameResult> {
  const from = `sofi-mosquera/artworks/${slug}/cover`;
  const to = `sofi-mosquera/artworks/${SERIES}/${slug}/cover`;

  // 1. If target already there, nothing to do.
  if (await exists(to)) {
    return { slug, from, to, status: "already-at-target" };
  }

  // 2. If source missing, nothing to rename.
  if (!(await exists(from))) {
    return { slug, from, to, status: "source-missing" };
  }

  // 3. Rename. invalidate=true purges CDN cache so old URLs stop serving.
  if (DRY_RUN) {
    return { slug, from, to, status: "renamed", detail: "(dry-run)" };
  }
  try {
    await cloudinary.uploader.rename(from, to, {
      resource_type: "image",
      overwrite: false,
      invalidate: true,
    });
    return { slug, from, to, status: "renamed" };
  } catch (e) {
    return {
      slug,
      from,
      to,
      status: "error",
      detail: (e as Error).message,
    };
  }
}

async function main() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    console.error("✗ Cloudinary credentials missing in .env.local");
    process.exit(1);
  }

  console.log(
    `\n=== Renaming ${SLUGS.length} Emociones covers ${DRY_RUN ? "(DRY RUN)" : ""} ===\n`
  );

  const results: RenameResult[] = [];
  for (const slug of SLUGS) {
    const r = await renameOne(slug);
    results.push(r);
    const icon =
      r.status === "renamed"
        ? "✓"
        : r.status === "already-at-target"
          ? "○"
          : r.status === "source-missing"
            ? "—"
            : "✗";
    console.log(`  ${icon} ${slug.padEnd(15)} ${r.status}${r.detail ? "  " + r.detail : ""}`);
  }

  const renamed = results.filter((r) => r.status === "renamed").length;
  const already = results.filter((r) => r.status === "already-at-target").length;
  const missing = results.filter((r) => r.status === "source-missing").length;
  const errored = results.filter((r) => r.status === "error").length;

  console.log(
    `\nSummary: ${renamed} renamed · ${already} already at target · ${missing} source missing · ${errored} errored`
  );
  if (errored > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
