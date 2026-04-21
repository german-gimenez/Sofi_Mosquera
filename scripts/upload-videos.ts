/**
 * Upload short videos (e.g. WhatsApp .mp4) to Cloudinary as video assets.
 * Stores their public_ids in the DB gallery with a "video:" prefix so the
 * UI renders them as static JPG posters via Cloudinary's video→image pipeline.
 *
 * Usage: npx tsx scripts/upload-videos.ts
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

interface VideoProject {
  folder: string;
  slug: string;
  desired: number;
}

const VIDEO_PROJECTS: VideoProject[] = [
  {
    folder: "PAG WEB/PORTFOLIO/PRODUCCION CASA LAURA Y LUCAS",
    slug: "casa-laura-y-lucas",
    desired: 8,
  },
];

function pickEven<T>(arr: T[], n: number): T[] {
  if (arr.length <= n) return arr;
  const step = arr.length / n;
  const out: T[] = [];
  for (let i = 0; i < n; i++) out.push(arr[Math.floor(i * step)]);
  return out;
}

async function main() {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error("Missing CLOUDINARY_* in .env.local");
    process.exit(1);
  }
  const sql = neon(process.env.DATABASE_URL_UNPOOLED!);
  console.log(`Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME}\n`);

  for (const p of VIDEO_PROJECTS) {
    const folderPath = resolve(ASSETS_ROOT, p.folder);
    try {
      await stat(folderPath);
    } catch {
      console.log(`  SKIP (missing): ${p.slug}`);
      continue;
    }

    const allFiles = (await readdir(folderPath))
      .filter((f) => [".mp4", ".mov", ".webm"].includes(extname(f).toLowerCase()))
      .sort();

    const files = pickEven(allFiles, p.desired);
    if (!files.length) {
      console.log(`  SKIP (no videos): ${p.slug}`);
      continue;
    }

    console.log(`>> ${p.slug} (${files.length} videos)`);
    const galleryIds: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const src = resolve(folderPath, files[i]);
      const idx = String(i + 1).padStart(2, "0");
      const publicId = `${NAMESPACE}/projects/${p.slug}/${idx}`;

      try {
        const result = await cloudinary.uploader.upload(src, {
          public_id: publicId,
          overwrite: true,
          resource_type: "video",
          // Generate a good static poster proactively for faster first paint
          eager: [
            {
              format: "jpg",
              width: 2000,
              height: 1250,
              crop: "fill",
              gravity: "auto",
              quality: "auto:good",
              start_offset: "auto",
            },
          ],
          eager_async: false,
        });
        // Store with "video:" prefix so UI renders via /video/upload/ endpoint
        galleryIds.push(`video:${result.public_id}`);
        console.log(`   OK ${files[i]} -> video:${result.public_id}`);
      } catch (err) {
        console.log(`   ERR ${files[i]}: ${(err as Error).message}`);
      }
    }

    if (galleryIds.length > 0) {
      const cover = galleryIds[0];
      const gallery = JSON.stringify(galleryIds);
      await sql`UPDATE projects SET cover_url = ${cover}, gallery = ${gallery}::jsonb WHERE slug = ${p.slug}`;
      console.log(`   DB: cover + ${galleryIds.length} video posters\n`);
    }
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
