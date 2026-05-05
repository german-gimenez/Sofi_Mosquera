/**
 * Activate furniture pieces for the public catalog.
 * Sets is_catalog = true for all furniture that has a cover image.
 * Also shows full data for verification.
 *
 * Usage: npx tsx scripts/activate-furniture.ts
 *        npx tsx scripts/activate-furniture.ts --dry-run
 */
import { config } from "dotenv";
import { resolve } from "path";
import { neon } from "@neondatabase/serverless";

config({ path: resolve(__dirname, "../.env.local") });

const sql = neon(process.env.DATABASE_URL_UNPOOLED!);
const dryRun = process.argv.includes("--dry-run");

async function main() {
  console.log(dryRun ? "=== DRY RUN ===" : "=== ACTIVATING FURNITURE ===");

  // 1. Show current state
  const all = await sql`
    SELECT slug, title, is_catalog, cover_url, gallery, price_ars,
           description, dimensions, featured, position, published_at
    FROM furniture ORDER BY position, created_at
  `;

  console.log(`\nFound ${all.length} furniture rows:\n`);
  for (const row of all) {
    const galleryCount = Array.isArray(row.gallery) ? row.gallery.length : 0;
    console.log(`  ${row.is_catalog ? "✓" : "✗"} ${row.slug}`);
    console.log(`    title:       ${row.title}`);
    console.log(`    cover:       ${row.cover_url || "(none)"}`);
    console.log(`    gallery:     ${galleryCount} images`);
    console.log(`    price:       ${row.price_ars ? `$${row.price_ars.toLocaleString()}` : "(none)"}`);
    console.log(`    dimensions:  ${row.dimensions || "(none)"}`);
    console.log(`    featured:    ${row.featured}`);
    console.log(`    position:    ${row.position}`);
    console.log(`    published:   ${row.published_at || "(none)"}`);
    console.log("");
  }

  // 2. Identify pieces ready for catalog (have cover image)
  const ready = all.filter((r) => r.cover_url);
  const notReady = all.filter((r) => !r.cover_url);

  if (notReady.length > 0) {
    console.log(`\n⚠ ${notReady.length} pieces without cover image (skipping):`);
    for (const r of notReady) console.log(`  - ${r.slug}`);
  }

  console.log(`\n→ ${ready.length} pieces ready for catalog activation`);

  if (dryRun) {
    console.log("\nDry run — no changes made. Remove --dry-run to activate.");
    return;
  }

  // 3. Activate all pieces with covers
  const slugs = ready.map((r) => r.slug);
  const result = await sql`
    UPDATE furniture
    SET is_catalog = true,
        position = CASE
          WHEN featured = true THEN 0
          ELSE 10
        END,
        updated_at = NOW()
    WHERE slug = ANY(${slugs})
    RETURNING slug, is_catalog, position
  `;

  console.log(`\n✓ Activated ${result.length} pieces:`);
  for (const r of result) {
    console.log(`  ✓ ${r.slug} (is_catalog=${r.is_catalog}, position=${r.position})`);
  }

  // 4. Verify
  const verify = await sql`
    SELECT count(*) as total,
           count(*) FILTER (WHERE is_catalog = true) as catalog
    FROM furniture
  `;
  console.log(`\nVerification: ${verify[0].catalog}/${verify[0].total} pieces in public catalog`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
