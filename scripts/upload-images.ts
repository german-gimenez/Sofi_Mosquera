/**
 * Bulk image uploader to Vercel Blob.
 * Catalogues and uploads project/artwork images, then updates DB records.
 *
 * Usage: BLOB_READ_WRITE_TOKEN=vercel_blob_... tsx scripts/upload-images.ts
 */
import { config } from "dotenv";
import { resolve, basename, extname } from "path";
import { readdir, readFile, stat } from "fs/promises";
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";

config({ path: resolve(__dirname, "../.env.local") });

const ASSETS_ROOT = resolve(__dirname, "../assets");

interface ImageMapping {
  folder: string;
  dbTable: "projects" | "artworks";
  slug: string;
  isCover?: boolean;
}

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function isImage(filename: string): boolean {
  return IMAGE_EXTENSIONS.has(extname(filename).toLowerCase());
}

const PROJECT_MAPPINGS: ImageMapping[] = [
  { folder: "PAG WEB/PORTFOLIO/CASA SUSEL", dbTable: "projects", slug: "casa-susel" },
  { folder: "PAG WEB/PORTFOLIO/PENTHOUSE", dbTable: "projects", slug: "penthouse" },
  { folder: "PAG WEB/PORTFOLIO/BERTONA FERREYRA", dbTable: "projects", slug: "bertona-ferreyra" },
  { folder: "PAG WEB/PORTFOLIO/CLUB HOUSE RINCON VIAMONTE", dbTable: "projects", slug: "club-house-rincon-viamonte" },
  { folder: "PAG WEB/PORTFOLIO/ANDELUNA", dbTable: "projects", slug: "andeluna" },
  { folder: "PAG WEB/PORTFOLIO/PRODUCCION CASA LAURA Y LUCAS", dbTable: "projects", slug: "produccion-casa-laura-y-lucas" },
  { folder: "PAG WEB/PORTFOLIO/ROSARIO GONZALEZ", dbTable: "projects", slug: "rosario-gonzalez" },
  { folder: "PAG WEB/PORTFOLIO/PROD FOTOS ESTUDIO", dbTable: "projects", slug: "prod-fotos-estudio" },
];

const ARTWORK_MAPPINGS: ImageMapping[] = [
  { folder: "CUADROS SOFI MOSQUERA/EL REY.JPG", dbTable: "artworks", slug: "el-rey", isCover: true },
  { folder: "CUADROS SOFI MOSQUERA/ISLA GRIS.png", dbTable: "artworks", slug: "isla-gris", isCover: true },
  { folder: "CUADROS SOFI MOSQUERA/MOUNTAINS.jpg", dbTable: "artworks", slug: "mountains", isCover: true },
  { folder: "CUADROS SOFI MOSQUERA/NACIMIENTO.jpg", dbTable: "artworks", slug: "nacimiento", isCover: true },
  { folder: "CUADROS SOFI MOSQUERA/MURI.jpg", dbTable: "artworks", slug: "muri", isCover: true },
  { folder: "CUADROS SOFI MOSQUERA/MUSICA.png", dbTable: "artworks", slug: "musica", isCover: true },
  { folder: "CUADROS SOFI MOSQUERA/INTERCAMBIO.jpg", dbTable: "artworks", slug: "intercambio", isCover: true },
];

async function uploadFile(filePath: string, blobPath: string): Promise<string> {
  const file = await readFile(filePath);
  const { url } = await put(blobPath, file, {
    access: "public",
    addRandomSuffix: false,
  });
  return url;
}

async function uploadProjectImages(): Promise<void> {
  const sql = neon(process.env.DATABASE_URL_UNPOOLED!);

  for (const mapping of PROJECT_MAPPINGS) {
    const folderPath = resolve(ASSETS_ROOT, mapping.folder);

    try {
      const dirStat = await stat(folderPath);
      if (!dirStat.isDirectory()) continue;
    } catch {
      console.log(`  Skip (not found): ${mapping.folder}`);
      continue;
    }

    const files = await readdir(folderPath);
    const images = files.filter(isImage).sort().slice(0, 8);

    if (images.length === 0) {
      console.log(`  Skip (no images): ${mapping.folder}`);
      continue;
    }

    console.log(`\nUploading ${mapping.slug} (${images.length} images)...`);

    const urls: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const ext = extname(img).toLowerCase();
      const blobPath = `projects/${mapping.slug}/${String(i + 1).padStart(2, "0")}${ext}`;
      const filePath = resolve(folderPath, img);

      try {
        const fileInfo = await stat(filePath);
        if (fileInfo.size > 10 * 1024 * 1024) {
          console.log(`  Skip (>10MB): ${img}`);
          continue;
        }

        const url = await uploadFile(filePath, blobPath);
        urls.push(url);
        console.log(`  ✓ ${img} -> ${blobPath}`);
      } catch (err: any) {
        console.log(`  ✗ ${img}: ${err.message}`);
      }
    }

    if (urls.length > 0) {
      const coverUrl = urls[0];
      const gallery = JSON.stringify(urls);
      await sql`UPDATE projects SET cover_url = ${coverUrl}, gallery = ${gallery}::jsonb WHERE slug = ${mapping.slug}`;
      console.log(`  DB updated: cover + ${urls.length} gallery images`);
    }
  }
}

async function uploadArtworkImages(): Promise<void> {
  const sql = neon(process.env.DATABASE_URL_UNPOOLED!);

  for (const mapping of ARTWORK_MAPPINGS) {
    const filePath = resolve(ASSETS_ROOT, mapping.folder);

    try {
      await stat(filePath);
    } catch {
      console.log(`  Skip (not found): ${mapping.folder}`);
      continue;
    }

    const ext = extname(filePath).toLowerCase();
    const blobPath = `artworks/${mapping.slug}/cover${ext}`;

    console.log(`Uploading artwork: ${mapping.slug}...`);

    try {
      const fileInfo = await stat(filePath);
      if (fileInfo.size > 10 * 1024 * 1024) {
        console.log(`  Skip (>10MB): ${mapping.folder}`);
        continue;
      }

      const url = await uploadFile(filePath, blobPath);
      await sql`UPDATE artworks SET cover_url = ${url} WHERE slug = ${mapping.slug}`;
      console.log(`  ✓ ${mapping.slug} -> ${url}`);
    } catch (err: any) {
      console.log(`  ✗ ${mapping.slug}: ${err.message}`);
    }
  }
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("ERROR: BLOB_READ_WRITE_TOKEN is required.");
    console.error("Get it from Vercel Dashboard > Storage > Blob > Connect > Token");
    process.exit(1);
  }

  console.log("=== Uploading Project Images ===");
  await uploadProjectImages();

  console.log("\n=== Uploading Artwork Images ===");
  await uploadArtworkImages();

  console.log("\n=== Done! ===");
}

main().catch(console.error);
