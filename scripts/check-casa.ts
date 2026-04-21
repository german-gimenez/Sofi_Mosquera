import { config } from "dotenv";
import { resolve } from "path";
import { neon } from "@neondatabase/serverless";

config({ path: resolve(__dirname, "../.env.local") });

(async () => {
  const sql = neon(process.env.DATABASE_URL_UNPOOLED!);
  const rows = await sql`SELECT slug, title, published_at, cover_url FROM projects ORDER BY slug`;
  for (const r of rows) {
    console.log(`${r.published_at ? "PUB" : "DRAFT"}  ${r.slug.padEnd(30)} cover=${r.cover_url ?? "NULL"}`);
  }
})();
