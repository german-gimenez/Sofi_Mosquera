import { config } from "dotenv";
import { resolve } from "path";
import { neon } from "@neondatabase/serverless";

config({ path: resolve(__dirname, "../.env.local") });

(async () => {
  const sql = neon(process.env.DATABASE_URL_UNPOOLED!);
  const rows = await sql`SELECT slug, title, cover_url, materials, featured FROM furniture ORDER BY created_at`;
  console.log(JSON.stringify(rows, null, 2));
})();
