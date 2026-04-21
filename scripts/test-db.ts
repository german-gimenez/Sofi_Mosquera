import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env.local") });

import { createDb, projects, desc } from "@sofi/db";

async function main() {
  console.log("Testing DB connection...");
  const db = createDb();
  const rows = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.publishedAt))
    .limit(3);
  console.log(`OK: ${rows.length} projects`);
  rows.forEach((p) => console.log(`  - ${p.slug}: ${p.title} (cover: ${p.coverUrl})`));
}

main().catch((e) => {
  console.error("FAIL:", e.message);
  process.exit(1);
});
