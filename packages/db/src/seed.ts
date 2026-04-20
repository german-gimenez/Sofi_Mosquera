import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../../../.env.local") });

async function seed() {
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL_UNPOOLED!);

  console.log("Seeding database...");

  await sql`INSERT INTO projects (slug, title, summary, category, year, location, featured, published_at, created_at, updated_at) VALUES
    ('casa-susel', 'Casa Susel', 'Proyecto integral de interiorismo residencial. Diseño de living, comedor y espacios de estar con materiales nobles y arte original.', 'residencial', 2021, 'Mendoza, Argentina', true, NOW(), NOW(), NOW()),
    ('penthouse', 'Penthouse', 'Diseño completo de penthouse con vista panorámica. Integración de muebles a medida y obras de arte en cada ambiente.', 'residencial', 2023, 'Mendoza, Argentina', true, NOW(), NOW(), NOW()),
    ('bertona-ferreyra', 'Bertona Ferreyra', 'Interiorismo residencial con foco en dormitorios y espacios de descanso. Renders 3D y ejecución integral.', 'residencial', 2024, 'Mendoza, Argentina', true, NOW(), NOW(), NOW()),
    ('club-house-rincon-viamonte', 'Club House Rincón Viamonte', 'Diseño de espacios comunes para desarrollo inmobiliario. Proyecto comercial con identidad visual coherente.', 'comercial', 2024, 'Mendoza, Argentina', true, NOW(), NOW(), NOW()),
    ('andeluna', 'Andeluna', 'Proyecto de interiorismo para bodega. Diseño de espacios que transmiten la esencia de la marca.', 'comercial', 2023, 'Valle de Uco, Mendoza', false, NOW(), NOW(), NOW()),
    ('produccion-casa-laura-y-lucas', 'Casa Laura y Lucas', 'Producción fotográfica y diseño integral de vivienda familiar con enfoque en calidez y funcionalidad.', 'residencial', 2024, 'Mendoza, Argentina', false, NOW(), NOW(), NOW()),
    ('rosario-gonzalez', 'Rosario González', 'Proyecto residencial personalizado. Cada ambiente refleja la esencia de quien lo habita.', 'residencial', 2023, 'Mendoza, Argentina', false, NOW(), NOW(), NOW()),
    ('prod-fotos-estudio', 'Estudio SM', 'Producción editorial en el estudio de Sofia Mosquera. Espacio propio diseñado como showroom y lugar de trabajo creativo.', 'comercial', 2025, 'Mendoza, Argentina', false, NOW(), NOW(), NOW())
  ON CONFLICT (slug) DO NOTHING`;

  console.log("Projects seeded");

  await sql`INSERT INTO artworks (slug, title, series, technique, status, featured, published_at, created_at, updated_at) VALUES
    ('el-rey', 'El Rey', 'Emociones', 'Acrílico sobre lienzo', 'disponible', true, NOW(), NOW(), NOW()),
    ('isla-gris', 'Isla Gris', 'Emociones', 'Acrílico sobre lienzo', 'disponible', true, NOW(), NOW(), NOW()),
    ('mountains', 'Mountains', 'Emociones', 'Acrílico sobre lienzo', 'disponible', true, NOW(), NOW(), NOW()),
    ('nacimiento', 'Nacimiento', 'Emociones', 'Técnica mixta', 'disponible', true, NOW(), NOW(), NOW()),
    ('muri', 'Muri', 'Emociones', 'Acrílico sobre lienzo', 'disponible', false, NOW(), NOW(), NOW()),
    ('musica', 'Música', 'Emociones', 'Acrílico sobre lienzo', 'disponible', false, NOW(), NOW(), NOW()),
    ('triptico-mapa', 'Tríptico Mapa', 'Emociones', 'Acrílico sobre lienzo', 'vendido', false, NOW(), NOW(), NOW()),
    ('intercambio', 'Intercambio', 'Emociones', 'Acrílico sobre lienzo', 'disponible', false, NOW(), NOW(), NOW())
  ON CONFLICT (slug) DO NOTHING`;

  console.log("Artworks seeded");

  await sql`INSERT INTO furniture (slug, title, description, materials, featured, published_at, created_at, updated_at) VALUES
    ('mueble-estar', 'Mueble de Estar', 'Mueble a medida para living, diseñado en madera natural con terminaciones premium.', 'Madera natural, herrajes de diseño', true, NOW(), NOW(), NOW())
  ON CONFLICT (slug) DO NOTHING`;

  console.log("Furniture seeded");

  await sql`INSERT INTO settings (key, value, updated_at) VALUES
    ('hero', '{"tagline":"Espacios que reflejan tu esencia","subtitle":"Interiorismo · Arte · Muebles a medida","ctaText":"Conocé nuestros proyectos","ctaUrl":"/interiorismo"}'::jsonb, NOW()),
    ('about', '{"heading":"Diseñamos espacios que reflejan la esencia de quién los habita","body":"Integrando interiorismo, arte y muebles a medida con excelencia en cada terminación.","ctaText":"Coordiná tu primera asesoría"}'::jsonb, NOW()),
    ('contact', '{"whatsapp":"+5492615456913","email":"info@sofimosquera.com","instagram":"@sofiamosquera.interiorismo","instagramArte":"@sofiamosquera.arte","location":"Mendoza, Argentina"}'::jsonb, NOW())
  ON CONFLICT (key) DO NOTHING`;

  console.log("Settings seeded");
  console.log("Seed completed!");
}

seed().catch(console.error);
