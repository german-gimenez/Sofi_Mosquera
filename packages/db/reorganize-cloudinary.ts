/**
 * One-shot reorganization of the sofi-mosquera/ namespace:
 *
 *   1. Legacy/hidden projects → sofi-mosquera/_archive/projects/{slug}/...
 *   2. Orphan artworks (no DB row, no series) → sofi-mosquera/_archive/artworks/{slug}/...
 *
 * For each rename, also rewrites the corresponding cover_url, context_url
 * and gallery[] fields in the DB so the admin/web app keeps resolving
 * references after the move.
 *
 * Idempotent: if the source no longer exists OR the target already exists,
 * the asset is skipped. Run with --dry-run first.
 *
 * Usage:
 *   npx tsx scripts/reorganize-cloudinary.ts --dry-run
 *   npx tsx scripts/reorganize-cloudinary.ts
 */
import { config } from "dotenv";
import { resolve } from "path";
import { v2 as cloudinary } from "cloudinary";

config({ path: resolve(__dirname, "../../.env.local") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const NS = "sofi-mosquera";
const DRY_RUN = process.argv.includes("--dry-run");

// ──────────────────────────────────────────────
// 1. Plan: which legacy project slugs to archive
// ──────────────────────────────────────────────
const LEGACY_PROJECT_SLUGS = [
  "bertona-ferreyra",
  "casa-susel",
  "club-house-rincon-viamonte",
  "penthouse",
  "prod-fotos-estudio",
  "rosario-gonzalez",
];

// 2. Orphan artworks: folders in Cloudinary that don't match any DB row.
// Detected via diff at runtime; this list is just the expected set.
const ORPHAN_ARTWORK_SLUGS = ["music", "nacimiento-2"];

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
interface MoveOp {
  from: string;
  to: string;
  resourceType: "image" | "video";
}

interface DbUpdate {
  table: "projects" | "artworks";
  slug: string;
  fromPath: string;
  toPath: string;
}

interface AssetEntry { public_id: string; resource_type: "image" | "video" }

let _allAssets: AssetEntry[] | null = null;
async function loadAllAssetsOnce(): Promise<AssetEntry[]> {
  if (_allAssets) return _allAssets;
  const out: AssetEntry[] = [];
  for (const rt of ["image", "video"] as const) {
    let nextCursor: string | undefined;
    do {
      const opts: Record<string, unknown> = {
        resource_type: rt,
        type: "upload",
        prefix: NS + "/", // only fetch our namespace
        max_results: 500,
      };
      if (nextCursor) opts.next_cursor = nextCursor;
      const res = (await cloudinary.api.resources(opts)) as {
        resources: { public_id: string }[];
        next_cursor?: string;
      };
      for (const r of res.resources) out.push({ public_id: r.public_id, resource_type: rt });
      nextCursor = res.next_cursor;
    } while (nextCursor);
  }
  _allAssets = out;
  console.log(`  (loaded ${out.length} assets under ${NS}/ in one batch)`);
  return out;
}

async function listAssetsUnder(prefix: string): Promise<AssetEntry[]> {
  const all = await loadAllAssetsOnce();
  return all.filter((a) => a.public_id.startsWith(prefix));
}

async function publicIdSet(): Promise<Map<string, "image" | "video">> {
  const all = await loadAllAssetsOnce();
  const m = new Map<string, "image" | "video">();
  for (const a of all) m.set(a.public_id, a.resource_type);
  return m;
}

async function safeRename(
  op: MoveOp,
  index: Map<string, "image" | "video">
): Promise<"renamed" | "skipped-source-missing" | "skipped-target-exists" | "error"> {
  if (!index.has(op.from)) return "skipped-source-missing";
  if (index.has(op.to)) return "skipped-target-exists";
  if (DRY_RUN) {
    // Update local index so subsequent ops see the move
    index.delete(op.from);
    index.set(op.to, op.resourceType);
    return "renamed";
  }
  try {
    await cloudinary.uploader.rename(op.from, op.to, {
      resource_type: op.resourceType,
      overwrite: false,
      invalidate: true,
    });
    index.delete(op.from);
    index.set(op.to, op.resourceType);
    return "renamed";
  } catch {
    return "error";
  }
}

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────
async function main() {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET ||
    !process.env.DATABASE_URL_UNPOOLED
  ) {
    console.error("✗ Cloudinary or DB credentials missing in .env.local");
    process.exit(1);
  }

  console.log(`\n=== Cloudinary reorganization ${DRY_RUN ? "(DRY RUN)" : ""} ===\n`);

  // ─── 1. Build the list of move ops ───
  const ops: MoveOp[] = [];
  const dbUpdates: DbUpdate[] = [];

  // 1a. Legacy projects → _archive/projects/
  for (const slug of LEGACY_PROJECT_SLUGS) {
    const fromPrefix = `${NS}/projects/${slug}/`;
    const assets = await listAssetsUnder(fromPrefix);
    for (const a of assets) {
      const tail = a.public_id.slice(fromPrefix.length);
      ops.push({
        from: a.public_id,
        to: `${NS}/_archive/projects/${slug}/${tail}`,
        resourceType: a.resource_type,
      });
    }
    if (assets.length === 0) {
      console.log(`  (no assets under ${fromPrefix} — nothing to archive for ${slug})`);
    }
    dbUpdates.push({
      table: "projects",
      slug,
      fromPath: `${NS}/projects/${slug}/`,
      toPath: `${NS}/_archive/projects/${slug}/`,
    });
  }

  // 1b. Orphan artworks → _archive/artworks/
  for (const slug of ORPHAN_ARTWORK_SLUGS) {
    const fromPrefix = `${NS}/artworks/${slug}/`;
    const assets = await listAssetsUnder(fromPrefix);
    for (const a of assets) {
      const tail = a.public_id.slice(fromPrefix.length);
      ops.push({
        from: a.public_id,
        to: `${NS}/_archive/artworks/${slug}/${tail}`,
        resourceType: a.resource_type,
      });
    }
    if (assets.length === 0) {
      console.log(`  (no assets under ${fromPrefix} — nothing to archive for ${slug})`);
    }
    // No DB update — these aren't referenced anywhere
  }

  console.log(`\nPlanned: ${ops.length} asset moves + ${dbUpdates.length} DB path rewrites\n`);

  // ─── 2. Execute moves ───
  const idx = await publicIdSet();
  const stats = { renamed: 0, "skipped-source-missing": 0, "skipped-target-exists": 0, error: 0 };
  for (const op of ops) {
    const r = await safeRename(op, idx);
    stats[r]++;
    const icon =
      r === "renamed" ? "✓" : r === "error" ? "✗" : r === "skipped-source-missing" ? "—" : "○";
    console.log(`  ${icon} ${op.from}`);
    console.log(`      → ${op.to}  [${r}]`);
  }
  console.log("\nMove summary:");
  for (const [k, v] of Object.entries(stats)) console.log(`  ${k}: ${v}`);

  if (stats.error > 0) {
    console.error("\n✗ Cloudinary moves errored — aborting before DB rewrite.");
    process.exit(1);
  }

  // ─── 3. Rewrite DB ───
  console.log("\n=== DB path rewrites ===\n");
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL_UNPOOLED);

  // Generic rewrite that handles any of the configured fromPath prefixes
  // plus the optional `video:` prefix used in the DB.
  const allFromPaths = dbUpdates.map((u) => u.fromPath);
  const pathMap = new Map(dbUpdates.map((u) => [u.fromPath, u.toPath]));
  const rewrite = (val: string | null): string | null => {
    if (!val) return val;
    for (const from of allFromPaths) {
      if (val.startsWith(from)) return val.replace(from, pathMap.get(from)!);
      if (val.startsWith(`video:${from}`))
        return val.replace(`video:${from}`, `video:${pathMap.get(from)!}`);
    }
    return val;
  };

  for (const u of dbUpdates) {
    if (u.table === "projects") {
      const rows = (await sql`
        SELECT slug, cover_url, gallery FROM projects WHERE slug = ${u.slug}
      `) as Array<{ slug: string; cover_url: string | null; gallery: string[] | null }>;
      if (rows.length === 0) {
        console.log(`  — projects.${u.slug}: not in DB (skip)`);
        continue;
      }
      const row = rows[0];
      const newCover = rewrite(row.cover_url);
      const newGallery = (row.gallery ?? []).map((g) => rewrite(g) as string);
      const changed =
        newCover !== row.cover_url || JSON.stringify(newGallery) !== JSON.stringify(row.gallery ?? []);
      if (!changed) {
        console.log(`  — projects.${u.slug}: nothing to rewrite`);
        continue;
      }
      console.log(`  ✓ projects.${u.slug}: cover_url + ${newGallery.length} gallery items`);
      if (!DRY_RUN) {
        await sql`
          UPDATE projects
             SET cover_url = ${newCover},
                 gallery = ${JSON.stringify(newGallery)}::jsonb,
                 updated_at = now()
           WHERE slug = ${u.slug}
        `;
      }
    }
  }

  // Furniture catalog often references project images as placeholders. Rewrite
  // any furniture row whose cover_url or gallery contains a path that just
  // moved to _archive/.
  console.log("\n--- Furniture rows that reference archived projects ---");
  const furniture = (await sql`
    SELECT slug, cover_url, gallery FROM furniture
  `) as Array<{ slug: string; cover_url: string | null; gallery: string[] | null }>;

  for (const f of furniture) {
    const newCover = rewrite(f.cover_url);
    const newGallery = (f.gallery ?? []).map((g) => rewrite(g) as string);
    const changed =
      newCover !== f.cover_url ||
      JSON.stringify(newGallery) !== JSON.stringify(f.gallery ?? []);
    if (!changed) continue;
    const galleryRewrites = (f.gallery ?? []).filter(
      (g, i) => g !== newGallery[i]
    ).length;
    console.log(
      `  ✓ furniture.${f.slug}: ${
        newCover !== f.cover_url ? "cover_url" : "—"
      } + ${galleryRewrites} gallery items`
    );
    if (!DRY_RUN) {
      await sql`
        UPDATE furniture
           SET cover_url = ${newCover},
               gallery = ${JSON.stringify(newGallery)}::jsonb,
               updated_at = now()
         WHERE slug = ${f.slug}
      `;
    }
  }

  // Same scan for artworks (paranoia: in case any artwork referenced an
  // archived path) and series.
  for (const tbl of ["artworks", "series"] as const) {
    if (tbl === "artworks") {
      const rows = (await sql`
        SELECT slug, cover_url, context_url, gallery FROM artworks
      `) as Array<{
        slug: string;
        cover_url: string | null;
        context_url: string | null;
        gallery: string[] | null;
      }>;
      for (const a of rows) {
        const newCover = rewrite(a.cover_url);
        const newContext = rewrite(a.context_url);
        const newGallery = (a.gallery ?? []).map((g) => rewrite(g) as string);
        const changed =
          newCover !== a.cover_url ||
          newContext !== a.context_url ||
          JSON.stringify(newGallery) !== JSON.stringify(a.gallery ?? []);
        if (!changed) continue;
        console.log(`  ✓ artworks.${a.slug}: rewritten`);
        if (!DRY_RUN) {
          await sql`
            UPDATE artworks
               SET cover_url = ${newCover},
                   context_url = ${newContext},
                   gallery = ${JSON.stringify(newGallery)}::jsonb,
                   updated_at = now()
             WHERE slug = ${a.slug}
          `;
        }
      }
    } else {
      const rows = (await sql`
        SELECT slug, cover_url FROM series
      `) as Array<{ slug: string; cover_url: string | null }>;
      for (const s of rows) {
        const newCover = rewrite(s.cover_url);
        if (newCover === s.cover_url) continue;
        console.log(`  ✓ series.${s.slug}: cover_url rewritten`);
        if (!DRY_RUN) {
          await sql`
            UPDATE series SET cover_url = ${newCover}, updated_at = now() WHERE slug = ${s.slug}
          `;
        }
      }
    }
  }

  console.log(`\n=== Done ${DRY_RUN ? "(DRY RUN — nothing applied)" : ""} ===\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
