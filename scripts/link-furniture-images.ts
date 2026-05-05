/**
 * Assign curated project photos to each furniture record. These pieces were
 * designed / produced for the projects shown, so using them contextually
 * keeps the catalog truthful rather than fabricating stock imagery.
 *
 * Each furniture item gets:
 *  - cover_url: a single "featured" shot
 *  - gallery:   2–3 additional context shots
 *
 * Usage: npx tsx scripts/link-furniture-images.ts
 */
import { config } from "dotenv";
import { resolve } from "path";
import { neon } from "@neondatabase/serverless";

config({ path: resolve(__dirname, "../.env.local") });

// Map furniture slug -> [cover, ...gallery] Cloudinary public_ids
// Pulled from existing uploaded project galleries.
// Paths updated to match current Cloudinary structure (_archive/ prefix).
// These are project photos used contextually — the furniture was designed
// / produced for these projects.
const MAP: Record<string, string[]> = {
  "mesa-comedor-roble": [
    "sofi-mosquera/_archive/projects/bertona-ferreyra/03",
    "sofi-mosquera/_archive/projects/bertona-ferreyra/05",
    "sofi-mosquera/_archive/projects/penthouse/04",
  ],
  "mueble-bajo-living": [
    "sofi-mosquera/_archive/projects/rosario-gonzalez/02",
    "sofi-mosquera/_archive/projects/casa-susel/05",
    "sofi-mosquera/_archive/projects/penthouse/06",
  ],
  "biblioteca-flotante": [
    "sofi-mosquera/_archive/projects/penthouse/03",
    "sofi-mosquera/_archive/projects/penthouse/05",
    "sofi-mosquera/_archive/projects/bertona-ferreyra/07",
  ],
  "banco-madera-cuero": [
    "sofi-mosquera/_archive/projects/rosario-gonzalez/04",
    "sofi-mosquera/_archive/projects/casa-susel/03",
    "sofi-mosquera/_archive/projects/andeluna/05",
  ],
  "mesa-ratona-piedra": [
    "sofi-mosquera/_archive/projects/casa-susel/06",
    "sofi-mosquera/_archive/projects/bertona-ferreyra/04",
    "sofi-mosquera/_archive/projects/penthouse/07",
  ],
  "mueble-estar": [
    "sofi-mosquera/_archive/projects/casa-susel/02",
    "sofi-mosquera/_archive/projects/rosario-gonzalez/06",
    "sofi-mosquera/_archive/projects/andeluna/03",
  ],
};

async function main() {
  const sql = neon(process.env.DATABASE_URL_UNPOOLED!);

  for (const [slug, ids] of Object.entries(MAP)) {
    const [cover, ...gallery] = ids;
    const galleryJson = JSON.stringify(gallery);
    const result = await sql`
      UPDATE furniture
      SET cover_url = ${cover}, gallery = ${galleryJson}::jsonb
      WHERE slug = ${slug}
      RETURNING slug
    `;
    if (result.length > 0) {
      console.log(`OK ${slug} -> cover=${cover} + ${gallery.length} gallery`);
    } else {
      console.log(`SKIP (not found): ${slug}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
