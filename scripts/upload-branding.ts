/**
 * Upload branding assets (logos) to Cloudinary.
 * Reads PNGs from assets/LOGOS/ and uploads to sofi-mosquera/branding/{variant}.
 *
 * Usage: pnpm exec tsx scripts/upload-branding.ts
 */
import { config } from "dotenv";
import { resolve } from "path";
import { existsSync, statSync } from "fs";
import { v2 as cloudinary } from "cloudinary";

config({ path: resolve(__dirname, "../.env.local") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ASSETS_ROOT = resolve(__dirname, "../assets/LOGOS");

interface LogoUpload {
  file: string;
  publicId: string;
  description: string;
}

const LOGOS: LogoUpload[] = [
  {
    file: "SM- DARK.png",
    publicId: "sofi-mosquera/branding/sm-dark",
    description: "SM symbol logo - dark variant (use on light bg)",
  },
  {
    file: "SM- WHITE.png",
    publicId: "sofi-mosquera/branding/sm-white",
    description: "SM symbol logo - white variant (use on dark bg)",
  },
  {
    file: "SOFIAMOSQUERA-DARK.png",
    publicId: "sofi-mosquera/branding/wordmark-dark",
    description: "Sofia Mosquera wordmark - dark variant",
  },
  {
    file: "SOFIAMOSQUERA-WHITE.png",
    publicId: "sofi-mosquera/branding/wordmark-white",
    description: "Sofia Mosquera wordmark - white variant",
  },
];

async function uploadLogo(logo: LogoUpload): Promise<void> {
  const filePath = resolve(ASSETS_ROOT, logo.file);
  if (!existsSync(filePath)) {
    console.error(`  [skip] ${logo.file} not found at ${filePath}`);
    return;
  }
  const sizeKb = Math.round(statSync(filePath).size / 1024);
  console.log(`  [upload] ${logo.file} (${sizeKb}KB) -> ${logo.publicId}`);

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: logo.publicId,
      overwrite: true,
      resource_type: "image",
      format: "png",
      context: `caption=${logo.description}`,
    });
    console.log(`    OK ${result.width}x${result.height} (v${result.version})`);
  } catch (err) {
    console.error(`    FAIL`, err);
  }
}

async function main() {
  console.log("Uploading branding assets to Cloudinary...\n");
  console.log(`Source: ${ASSETS_ROOT}`);
  console.log(`Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}\n`);

  for (const logo of LOGOS) {
    await uploadLogo(logo);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
