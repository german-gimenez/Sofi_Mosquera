/**
 * FASE 1 — Full Cloudinary inventory.
 * Lists every asset in the cloud, groups by top-level folder, and flags
 * which ones belong to Sofi (sofi-mosquera/* or related), which to other
 * projects, and which are stranded at root.
 *
 * Usage: pnpm exec tsx scripts/audit-cloudinary.ts
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

interface Resource {
  public_id: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
  format: string;
  folder?: string;
  created_at: string;
}

const SOFI_HINTS = ["sofi", "mosquera", "casa-bf", "casa-laura", "andeluna", "el-rey", "isla-gris", "mountain", "nacimiento", "muri", "musica", "intercambio", "triptico", "vacherie", "club-house", "casa-sp", "directorio", "casa-rs", "bertona"];
const OTHER_PROJECTS = ["suplement-app", "suplementapp", "underfeet", "zapata-goma", "zapata_goma", "debug-test", "scans", "komuny", "napsix", "franquiday"];

function classify(publicId: string): "sofi" | "other-project" | "root-stray" | "ambiguous" {
  const lower = publicId.toLowerCase();
  if (lower.startsWith("sofi-mosquera/") || lower.startsWith("sofimosquera/")) {
    return "sofi";
  }
  for (const op of OTHER_PROJECTS) {
    if (lower.startsWith(op + "/") || lower === op) return "other-project";
  }
  if (!publicId.includes("/")) {
    // root level. heuristic: hint match → sofi, else ambiguous
    for (const h of SOFI_HINTS) {
      if (lower.includes(h)) return "root-stray";
    }
    return "ambiguous";
  }
  // first segment is some other folder
  const top = publicId.split("/")[0].toLowerCase();
  for (const h of SOFI_HINTS) {
    if (top.includes(h)) return "sofi";
  }
  return "ambiguous";
}

async function listAll(resourceType: "image" | "video" | "raw"): Promise<Resource[]> {
  const out: Resource[] = [];
  let nextCursor: string | undefined;
  do {
    const opts: Record<string, unknown> = {
      resource_type: resourceType,
      max_results: 500,
      type: "upload",
    };
    if (nextCursor) opts.next_cursor = nextCursor;
    const res = (await cloudinary.api.resources(opts)) as {
      resources: Resource[];
      next_cursor?: string;
    };
    out.push(...res.resources);
    nextCursor = res.next_cursor;
  } while (nextCursor);
  return out;
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

  console.log(`\n=== Cloudinary inventory for ${process.env.CLOUDINARY_CLOUD_NAME} ===\n`);

  const [images, videos] = await Promise.all([listAll("image"), listAll("video")]);
  const all = [...images, ...videos];
  console.log(`Total assets: ${all.length} (${images.length} images, ${videos.length} videos)\n`);

  const buckets: Record<string, Resource[]> = {
    sofi: [],
    "other-project": [],
    "root-stray": [],
    ambiguous: [],
  };

  for (const r of all) {
    buckets[classify(r.public_id)].push(r);
  }

  // Group sofi by sub-folder (top-level segment after sofi-mosquera/ or sofimosquera/)
  const sofiByFolder: Record<string, number> = {};
  const sofiBadFolderSamples: Record<string, string[]> = {};
  for (const r of buckets.sofi) {
    const segs = r.public_id.split("/");
    const root = segs[0];
    const sub = segs[1] ?? "(loose-in-root)";
    const key = `${root}/${sub}`;
    sofiByFolder[key] = (sofiByFolder[key] ?? 0) + 1;
    if (root === "sofimosquera") {
      sofiBadFolderSamples["sofimosquera"] ??= [];
      if (sofiBadFolderSamples["sofimosquera"].length < 10) {
        sofiBadFolderSamples["sofimosquera"].push(r.public_id);
      }
    }
  }

  console.log("--- Sofi assets (under sofi-mosquera/* or sofimosquera/*) ---");
  for (const [k, v] of Object.entries(sofiByFolder).sort()) {
    console.log(`  ${String(v).padStart(4)}  ${k}/`);
  }

  if (sofiBadFolderSamples["sofimosquera"]) {
    console.log("\n  ⚠️  Assets in sofimosquera/ (no hyphen) — need to be moved to sofi-mosquera/:");
    for (const p of sofiBadFolderSamples["sofimosquera"]) {
      console.log(`     - ${p}`);
    }
    if (sofiByFolder["sofimosquera/(loose-in-root)" as keyof typeof sofiByFolder]) {
      console.log(`     ... and more (${buckets.sofi.filter((r) => r.public_id.startsWith("sofimosquera/")).length} total)`);
    }
  }

  console.log("\n--- Other projects (DO NOT TOUCH) ---");
  const otherByFolder: Record<string, number> = {};
  for (const r of buckets["other-project"]) {
    const top = r.public_id.split("/")[0];
    otherByFolder[top] = (otherByFolder[top] ?? 0) + 1;
  }
  for (const [k, v] of Object.entries(otherByFolder).sort()) {
    console.log(`  ${String(v).padStart(4)}  ${k}/`);
  }

  console.log("\n--- Root-stray (heuristic match → likely Sofi, in root) ---");
  if (buckets["root-stray"].length === 0) {
    console.log("  (none)");
  } else {
    for (const r of buckets["root-stray"].slice(0, 30)) {
      const dim = r.width && r.height ? `${r.width}x${r.height}` : "";
      console.log(
        `  ${r.public_id.padEnd(60)}  ${r.format.padEnd(6)}  ${dim.padEnd(12)}  ${(r.bytes / 1024).toFixed(0)}KB`
      );
    }
    if (buckets["root-stray"].length > 30) {
      console.log(`  ... and ${buckets["root-stray"].length - 30} more`);
    }
  }

  console.log("\n--- Ambiguous (no folder, no Sofi hint — review manually) ---");
  if (buckets.ambiguous.length === 0) {
    console.log("  (none)");
  } else {
    for (const r of buckets.ambiguous.slice(0, 30)) {
      const dim = r.width && r.height ? `${r.width}x${r.height}` : "";
      console.log(
        `  ${r.public_id.padEnd(60)}  ${r.format.padEnd(6)}  ${dim.padEnd(12)}  ${(r.bytes / 1024).toFixed(0)}KB`
      );
    }
    if (buckets.ambiguous.length > 30) {
      console.log(`  ... and ${buckets.ambiguous.length - 30} more`);
    }
  }

  console.log("\n=== Summary ===");
  console.log(`  sofi (in folder):      ${buckets.sofi.length}`);
  console.log(`  other-project (skip):  ${buckets["other-project"].length}`);
  console.log(`  root-stray (move):     ${buckets["root-stray"].length}`);
  console.log(`  ambiguous (review):    ${buckets.ambiguous.length}`);

  // Persist full inventory for downstream scripts
  const fs = await import("fs");
  const out = {
    cloud: process.env.CLOUDINARY_CLOUD_NAME,
    generatedAt: new Date().toISOString(),
    totals: {
      all: all.length,
      images: images.length,
      videos: videos.length,
    },
    classified: {
      sofi: buckets.sofi.map((r) => r.public_id),
      otherProject: buckets["other-project"].map((r) => r.public_id),
      rootStray: buckets["root-stray"].map((r) => ({
        public_id: r.public_id,
        format: r.format,
        bytes: r.bytes,
        width: r.width,
        height: r.height,
      })),
      ambiguous: buckets.ambiguous.map((r) => ({
        public_id: r.public_id,
        format: r.format,
        bytes: r.bytes,
        width: r.width,
        height: r.height,
      })),
    },
  };
  fs.writeFileSync(
    resolve(__dirname, "../tmp-cloudinary-inventory.json"),
    JSON.stringify(out, null, 2)
  );
  console.log("\nWrote full inventory → tmp-cloudinary-inventory.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
