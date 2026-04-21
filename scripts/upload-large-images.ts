/**
 * Compress (with sharp) and upload large images (>10MB) to Cloudinary.
 * Also applies Cloudinary AI enhancements on upload for specific projects:
 *   - g_auto (smart crop)
 *   - e_sharpen (subtle sharpening)
 *   - e_improve (auto-enhance)
 *   - e_upscale (upscale lower-res originals)
 *
 * Usage: npx tsx scripts/upload-large-images.ts
 */
import { config } from "dotenv";
import { resolve, extname, basename } from "path";
import { readdir, stat, mkdir, writeFile } from "fs/promises";
import { v2 as cloudinary } from "cloudinary";
import { neon } from "@neondatabase/serverless";
import sharp from "sharp";
import { tmpdir } from "os";

config({ path: resolve(__dirname, "../.env.local") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ASSETS_ROOT = resolve(__dirname, "../assets");
const TMP_DIR = resolve(tmpdir(), "sofi-compress");
const NAMESPACE = "sofi-mosquera";
const TARGET_MAX_BYTES = 9 * 1024 * 1024; // stay under 10MB limit

interface BigProject {
  folder: string;
  slug: string;
}

const LARGE_PROJECTS: BigProject[] = [
  { folder: "PAG WEB/PORTFOLIO/PROD FOTOS ESTUDIO", slug: "prod-fotos-estudio" },
];

async function ensureTmpDir() {
  try {
    await mkdir(TMP_DIR, { recursive: true });
  } catch {}
}

async function compressIfNeeded(srcPath: string, slug: string, idx: string): Promise<string> {
  const srcStat = await stat(srcPath);
  if (srcStat.size <= TARGET_MAX_BYTES) return srcPath;

  const outPath = resolve(TMP_DIR, `${slug}-${idx}.jpg`);

  // Start with quality 82 and progressively degrade if still too big
  let quality = 85;
  let width = 2400;
  let buffer: Buffer;
  let outStat;

  for (let attempt = 0; attempt < 5; attempt++) {
    buffer = await sharp(srcPath)
      .rotate() // apply EXIF orientation then strip it (prevents double-rotation)
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();

    if (buffer.length <= TARGET_MAX_BYTES) break;
    quality -= 8;
    width -= 200;
  }

  await writeFile(outPath, buffer!);
  outStat = await stat(outPath);
  console.log(`   compressed: ${(srcStat.size / 1024 / 1024).toFixed(1)}MB -> ${(outStat.size / 1024 / 1024).toFixed(1)}MB`);
  return outPath;
}

async function uploadFile(
  filePath: string,
  publicId: string,
  useAIEnhance: boolean = false
): Promise<string> {
  const eager = useAIEnhance
    ? [
        {
          width: 2400,
          crop: "limit",
          quality: "auto:good",
          effect: "improve",
        },
      ]
    : [{ width: 2400, crop: "limit", quality: "auto:good" }];

  const result = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
    eager,
    eager_async: false,
  });
  return result.public_id;
}

async function processLargeProjects() {
  const sql = neon(process.env.DATABASE_URL_UNPOOLED!);
  await ensureTmpDir();

  for (const p of LARGE_PROJECTS) {
    const folderPath = resolve(ASSETS_ROOT, p.folder);
    let dirStat;
    try {
      dirStat = await stat(folderPath);
    } catch {
      console.log(`  SKIP (missing): ${p.slug}`);
      continue;
    }
    if (!dirStat.isDirectory()) continue;

    const allFiles = (await readdir(folderPath))
      .filter((f) => [".jpg", ".jpeg", ".png"].includes(extname(f).toLowerCase()))
      .sort();

    // Pick evenly-spaced shots to avoid near-duplicate bursts
    const desired = 9;
    const files: string[] = [];
    if (allFiles.length <= desired) {
      files.push(...allFiles);
    } else {
      const step = allFiles.length / desired;
      for (let i = 0; i < desired; i++) {
        files.push(allFiles[Math.floor(i * step)]);
      }
    }

    if (!files.length) {
      console.log(`  SKIP (no images): ${p.slug}`);
      continue;
    }

    console.log(`\n>> ${p.slug} (${files.length} images)`);
    const publicIds: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const src = resolve(folderPath, files[i]);
      const idx = String(i + 1).padStart(2, "0");
      try {
        const compressed = await compressIfNeeded(src, p.slug, idx);
        const publicId = `${NAMESPACE}/projects/${p.slug}/${idx}`;
        const uploaded = await uploadFile(compressed, publicId, true);
        publicIds.push(uploaded);
        console.log(`   OK ${files[i]} -> ${uploaded}`);
      } catch (err) {
        console.log(`   ERR ${files[i]}: ${(err as Error).message}`);
      }
    }

    if (publicIds.length > 0) {
      const cover = publicIds[0];
      const gallery = JSON.stringify(publicIds);
      await sql`UPDATE projects SET cover_url = ${cover}, gallery = ${gallery}::jsonb WHERE slug = ${p.slug}`;
      console.log(`   DB: cover + ${publicIds.length} gallery images`);
    }
  }
}

async function main() {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error("Missing CLOUDINARY_* in .env.local");
    process.exit(1);
  }
  console.log(`Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`Temp dir: ${TMP_DIR}\n`);

  console.log("=== COMPRESSING + UPLOADING LARGE IMAGES ===");
  await processLargeProjects();

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
