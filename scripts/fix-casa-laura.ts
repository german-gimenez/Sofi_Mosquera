import { config } from "dotenv";
import { resolve } from "path";
import { neon } from "@neondatabase/serverless";

config({ path: resolve(__dirname, "../.env.local") });

(async () => {
  const sql = neon(process.env.DATABASE_URL_UNPOOLED!);

  // Build gallery array from the 8 uploaded video public_ids
  const galleryIds: string[] = [];
  for (let i = 1; i <= 8; i++) {
    galleryIds.push(`video:sofi-mosquera/projects/casa-laura-y-lucas/${String(i).padStart(2, "0")}`);
  }

  const cover = galleryIds[0];
  const gallery = JSON.stringify(galleryIds);

  const result = await sql`
    UPDATE projects
    SET
      slug = 'casa-laura-y-lucas',
      title = 'Casa Laura y Lucas',
      cover_url = ${cover},
      gallery = ${gallery}::jsonb
    WHERE slug = 'produccion-casa-laura-y-lucas'
       OR slug = 'casa-laura-y-lucas'
    RETURNING slug, title, cover_url
  `;

  console.log("Updated:", result);
})();
