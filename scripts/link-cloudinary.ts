/**
 * Link existing Cloudinary public_ids to DB rows (by convention).
 * No re-upload — just update cover_url + gallery fields.
 */
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env.local") });
import { neon } from "@neondatabase/serverless";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const sql = neon(process.env.DATABASE_URL_UNPOOLED!);
const NS = "sofi-mosquera";

interface Resource { public_id: string }

async function listCloudinaryFolder(prefix: string, max: number = 500): Promise<string[]> {
  const result = await cloudinary.api.resources({
    type: "upload",
    prefix,
    max_results: max,
    resource_type: "image",
  });
  return (result.resources as Resource[]).map((r) => r.public_id).sort();
}

async function main() {
  console.log("Linking projects...");

  const projectSlugs = [
    "casa-susel", "penthouse", "bertona-ferreyra", "club-house-rincon-viamonte",
    "andeluna", "produccion-casa-laura-y-lucas", "rosario-gonzalez", "prod-fotos-estudio",
  ];

  for (const slug of projectSlugs) {
    const ids = await listCloudinaryFolder(`${NS}/projects/${slug}/`);
    if (ids.length === 0) {
      console.log(`  SKIP ${slug}: no images found`);
      continue;
    }
    const cover = ids[0];
    const gallery = JSON.stringify(ids);
    await sql`UPDATE projects SET cover_url = ${cover}, gallery = ${gallery}::jsonb WHERE slug = ${slug}`;
    console.log(`  ${slug}: cover + ${ids.length} gallery`);
  }

  console.log("\nLinking artworks...");
  const artworkSlugs = [
    "el-rey", "isla-gris", "mountains", "nacimiento", "muri",
    "musica", "intercambio", "triptico-mapa",
  ];

  for (const slug of artworkSlugs) {
    const ids = await listCloudinaryFolder(`${NS}/artworks/${slug}/`);
    if (ids.length === 0) {
      console.log(`  SKIP ${slug}`);
      continue;
    }
    const cover = ids.find((id) => id.endsWith("/cover")) ?? ids[0];
    await sql`UPDATE artworks SET cover_url = ${cover} WHERE slug = ${slug}`;
    console.log(`  ${slug}: ${cover}`);
  }

  console.log("\nLinking about photos...");
  const aboutIds = await listCloudinaryFolder(`${NS}/about/`);
  if (aboutIds.length > 0) {
    const jsonIds = JSON.stringify(aboutIds);
    await sql`INSERT INTO settings (key, value, updated_at) VALUES ('about_photos', ${jsonIds}::jsonb, NOW())
      ON CONFLICT (key) DO UPDATE SET value = ${jsonIds}::jsonb, updated_at = NOW()`;
    console.log(`  about_photos: ${aboutIds.length} photos`);
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
