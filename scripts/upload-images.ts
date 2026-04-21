/**
 * Bulk image uploader to Cloudinary.
 * Catalogues and uploads project/artwork/about images to folder `sofi-mosquera/`,
 * then updates DB records (projects.cover_url + gallery, artworks.cover_url, settings).
 *
 * Usage: pnpm --filter web... exec tsx scripts/upload-images.ts
 *   (runs from repo root; reads .env.local automatically)
 */
import { config } from "dotenv";
import { resolve, extname } from "path";
import { readdir, stat } from "fs/promises";
import { v2 as cloudinary } from "cloudinary";
import { neon } from "@neondatabase/serverless";

config({ path: resolve(__dirname, "../.env.local") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ASSETS_ROOT = resolve(__dirname, "../assets");
const NAMESPACE = "sofi-mosquera";
const MAX_FILE_MB = 20;
const MAX_IMAGES_PER_PROJECT = 8;

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic"]);
const isImage = (f: string) => IMAGE_EXT.has(extname(f).toLowerCase());

interface ProjectMap {
  folder: string;
  slug: string;
}

interface ArtworkMap {
  file: string;
  slug: string;
}

const PROJECTS: ProjectMap[] = [
  { folder: "PAG WEB/PORTFOLIO/CASA SUSEL", slug: "casa-susel" },
  { folder: "PAG WEB/PORTFOLIO/PENTHOUSE", slug: "penthouse" },
  { folder: "PAG WEB/PORTFOLIO/BERTONA FERREYRA", slug: "bertona-ferreyra" },
  { folder: "PAG WEB/PORTFOLIO/CLUB HOUSE RINCON VIAMONTE", slug: "club-house-rincon-viamonte" },
  { folder: "PAG WEB/PORTFOLIO/ANDELUNA", slug: "andeluna" },
  { folder: "PAG WEB/PORTFOLIO/PRODUCCION CASA LAURA Y LUCAS", slug: "produccion-casa-laura-y-lucas" },
  { folder: "PAG WEB/PORTFOLIO/ROSARIO GONZALEZ", slug: "rosario-gonzalez" },
  { folder: "PAG WEB/PORTFOLIO/PROD FOTOS ESTUDIO", slug: "prod-fotos-estudio" },
];

const ARTWORKS: ArtworkMap[] = [
  { file: "CUADROS SOFI MOSQUERA/EL REY.JPG", slug: "el-rey" },
  { file: "CUADROS SOFI MOSQUERA/ISLA GRIS.png", slug: "isla-gris" },
  { file: "CUADROS SOFI MOSQUERA/MOUNTAINS.jpg", slug: "mountains" },
  { file: "CUADROS SOFI MOSQUERA/NACIMIENTO.jpg", slug: "nacimiento" },
  { file: "CUADROS SOFI MOSQUERA/MURI.jpg", slug: "muri" },
  { file: "CUADROS SOFI MOSQUERA/MUSICA.png", slug: "musica" },
  { file: "CUADROS SOFI MOSQUERA/INTERCAMBIO.jpg", slug: "intercambio" },
  { file: "CUADROS SOFI MOSQUERA/Tríptico Mapa.jpg", slug: "triptico-mapa" },
];

async function uploadFile(filePath: string, publicId: string): Promise<string> {
  const result = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
    eager: [{ width: 2400, crop: "limit", quality: "auto:good" }],
    eager_async: false,
  });
  return result.public_id;
}

async function uploadProjects() {
  const sql = neon(process.env.DATABASE_URL_UNPOOLED!);

  for (const p of PROJECTS) {
    const folderPath = resolve(ASSETS_ROOT, p.folder);

    let dirStat;
    try {
      dirStat = await stat(folderPath);
    } catch {
      console.log(`  SKIP (missing): ${p.slug}`);
      continue;
    }
    if (!dirStat.isDirectory()) continue;

    const files = (await readdir(folderPath))
      .filter(isImage)
      .sort()
      .slice(0, MAX_IMAGES_PER_PROJECT);

    if (!files.length) {
      console.log(`  SKIP (no images): ${p.slug}`);
      continue;
    }

    console.log(`\n>> Uploading ${p.slug} (${files.length} images)`);
    const publicIds: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const img = files[i];
      const filePath = resolve(folderPath, img);
      const fInfo = await stat(filePath);
      if (fInfo.size > MAX_FILE_MB * 1024 * 1024) {
        console.log(`   skip big file: ${img}`);
        continue;
      }
      const idx = String(i + 1).padStart(2, "0");
      const publicId = `${NAMESPACE}/projects/${p.slug}/${idx}`;
      try {
        const uploaded = await uploadFile(filePath, publicId);
        publicIds.push(uploaded);
        console.log(`   OK  ${img} -> ${uploaded}`);
      } catch (err) {
        console.log(`   ERR ${img}: ${(err as Error).message}`);
      }
    }

    if (publicIds.length > 0) {
      const cover = publicIds[0];
      const gallery = JSON.stringify(publicIds);
      await sql`UPDATE projects SET cover_url = ${cover}, gallery = ${gallery}::jsonb WHERE slug = ${p.slug}`;
      console.log(`   DB: cover + ${publicIds.length} gallery`);
    }
  }
}

async function uploadArtworks() {
  const sql = neon(process.env.DATABASE_URL_UNPOOLED!);

  for (const a of ARTWORKS) {
    const filePath = resolve(ASSETS_ROOT, a.file);
    try {
      await stat(filePath);
    } catch {
      console.log(`  SKIP (missing): ${a.slug}`);
      continue;
    }

    const fInfo = await stat(filePath);
    if (fInfo.size > MAX_FILE_MB * 1024 * 1024) {
      console.log(`  SKIP big: ${a.slug}`);
      continue;
    }

    const publicId = `${NAMESPACE}/artworks/${a.slug}/cover`;
    console.log(`\n>> ${a.slug}`);
    try {
      const uploaded = await uploadFile(filePath, publicId);
      await sql`UPDATE artworks SET cover_url = ${uploaded} WHERE slug = ${a.slug}`;
      console.log(`   OK -> ${uploaded}`);
    } catch (err) {
      console.log(`   ERR: ${(err as Error).message}`);
    }
  }
}

async function uploadAbout() {
  const folderPath = resolve(ASSETS_ROOT, "CUADROS SOFI MOSQUERA/YO PINTANDO");
  try {
    await stat(folderPath);
  } catch {
    console.log("  SKIP about folder");
    return;
  }

  const files = (await readdir(folderPath))
    .filter(isImage)
    .sort()
    .slice(0, 3);

  if (!files.length) return;

  console.log("\n>> About images");
  const publicIds: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const filePath = resolve(folderPath, files[i]);
    const fInfo = await stat(filePath);
    if (fInfo.size > MAX_FILE_MB * 1024 * 1024) continue;
    const publicId = `${NAMESPACE}/about/sofia-${String(i + 1).padStart(2, "0")}`;
    try {
      const uploaded = await uploadFile(filePath, publicId);
      publicIds.push(uploaded);
      console.log(`   OK ${files[i]} -> ${uploaded}`);
    } catch (err) {
      console.log(`   ERR ${files[i]}: ${(err as Error).message}`);
    }
  }

  if (publicIds.length > 0) {
    const sql = neon(process.env.DATABASE_URL_UNPOOLED!);
    const photos = JSON.stringify(publicIds);
    await sql`INSERT INTO settings (key, value, updated_at) VALUES ('about_photos', ${photos}::jsonb, NOW()) ON CONFLICT (key) DO UPDATE SET value = ${photos}::jsonb, updated_at = NOW()`;
    console.log(`   DB: ${publicIds.length} photos saved to settings.about_photos`);
  }
}

async function main() {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error("Missing CLOUDINARY_CLOUD_NAME in .env.local");
    process.exit(1);
  }
  if (!process.env.DATABASE_URL_UNPOOLED) {
    console.error("Missing DATABASE_URL_UNPOOLED in .env.local");
    process.exit(1);
  }

  console.log(`Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`Namespace: ${NAMESPACE}/\n`);

  console.log("=== PROJECTS ===");
  await uploadProjects();

  console.log("\n=== ARTWORKS ===");
  await uploadArtworks();

  console.log("\n=== ABOUT ===");
  await uploadAbout();

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
