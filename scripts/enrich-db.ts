/**
 * Enrich existing DB records with prices, dimensions, tags, and additional content.
 * Run after seed + image upload.
 */
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../.env.local") });
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL_UNPOOLED!);

async function slugify(text: string): Promise<string> {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function enrichArtworks() {
  console.log("Enriching artworks...");

  // From LISTA DE PRECIOS SM and Storytelling Brief data
  const updates = [
    { slug: "el-rey", technique: "Acrilico sobre lienzo", widthCm: 120, heightCm: 90, priceArs: 450000, year: 2024 },
    { slug: "isla-gris", technique: "Acrilico sobre lienzo", widthCm: 100, heightCm: 80, priceArs: 380000, year: 2024 },
    { slug: "mountains", technique: "Acrilico sobre lienzo", widthCm: 120, heightCm: 100, priceArs: 480000, year: 2024 },
    { slug: "nacimiento", technique: "Tecnica mixta sobre lienzo", widthCm: 110, heightCm: 90, priceArs: 420000, year: 2024 },
    { slug: "muri", technique: "Acrilico sobre lienzo", widthCm: 90, heightCm: 70, priceArs: 320000, year: 2023 },
    { slug: "musica", technique: "Acrilico sobre lienzo", widthCm: 100, heightCm: 80, priceArs: 380000, year: 2023 },
    { slug: "intercambio", technique: "Acrilico sobre lienzo", widthCm: 80, heightCm: 60, priceArs: 280000, year: 2023 },
    { slug: "triptico-mapa", technique: "Acrilico sobre lienzo (triptico)", widthCm: 180, heightCm: 90, priceArs: 650000, year: 2024 },
  ];

  for (const u of updates) {
    await sql`UPDATE artworks
      SET technique = ${u.technique},
          width_cm = ${u.widthCm},
          height_cm = ${u.heightCm},
          price_ars = ${u.priceArs},
          year = ${u.year}
      WHERE slug = ${u.slug}`;
    console.log(`  updated ${u.slug}`);
  }

  // Add more artworks from NUEVA LINEA 2026 and CUSDROS EXPRESIONISTAS
  const newArtworks = [
    { slug: "serie-2026-01", title: "Nueva Linea 2026 - I", series: "Nueva Linea 2026", technique: "Acrilico sobre lienzo", widthCm: 120, heightCm: 100, priceArs: 520000, year: 2026, status: "disponible", featured: true },
    { slug: "serie-2026-02", title: "Nueva Linea 2026 - II", series: "Nueva Linea 2026", technique: "Acrilico sobre lienzo", widthCm: 120, heightCm: 100, priceArs: 520000, year: 2026, status: "disponible", featured: true },
    { slug: "expresionista-01", title: "Expresionista I", series: "Expresionistas", technique: "Oleo sobre lienzo", widthCm: 100, heightCm: 80, priceArs: 420000, year: 2025, status: "disponible", featured: false },
    { slug: "expresionista-02", title: "Expresionista II", series: "Expresionistas", technique: "Oleo sobre lienzo", widthCm: 90, heightCm: 70, priceArs: 360000, year: 2025, status: "disponible", featured: false },
  ];

  for (const a of newArtworks) {
    await sql`INSERT INTO artworks (slug, title, series, technique, width_cm, height_cm, price_ars, year, status, featured, published_at, created_at, updated_at)
      VALUES (${a.slug}, ${a.title}, ${a.series}, ${a.technique}, ${a.widthCm}, ${a.heightCm}, ${a.priceArs}, ${a.year}, ${a.status}, ${a.featured}, NOW(), NOW(), NOW())
      ON CONFLICT (slug) DO NOTHING`;
    console.log(`  +added ${a.slug}`);
  }
}

async function enrichProjects() {
  console.log("\nEnriching projects...");

  const updates = [
    { slug: "casa-susel", tags: ["residencial", "living", "comedor", "materiales nobles"] },
    { slug: "penthouse", tags: ["residencial", "penthouse", "dormitorio", "vista panoramica"] },
    { slug: "bertona-ferreyra", tags: ["residencial", "dormitorio", "render 3D", "obra llave en mano"] },
    { slug: "club-house-rincon-viamonte", tags: ["comercial", "amenities", "club house", "desarrollo inmobiliario"] },
    { slug: "andeluna", tags: ["comercial", "bodega", "experiencia", "vinos"] },
    { slug: "produccion-casa-laura-y-lucas", tags: ["residencial", "vivienda familiar", "produccion editorial"] },
    { slug: "rosario-gonzalez", tags: ["residencial", "personalizado"] },
    { slug: "prod-fotos-estudio", tags: ["showroom", "estudio propio", "espacio creativo"] },
  ];

  for (const u of updates) {
    const tags = JSON.stringify(u.tags);
    await sql`UPDATE projects SET tags = ${tags}::jsonb WHERE slug = ${u.slug}`;
    console.log(`  updated ${u.slug}`);
  }
}

async function enrichFurniture() {
  console.log("\nAdding furniture...");

  const newFurniture = [
    {
      slug: "mesa-comedor-roble",
      title: "Mesa de Comedor Roble",
      description: "Mesa de comedor a medida en madera de roble macizo, con terminacion natural y patas de hierro forjado. Dimensiones y medidas personalizables segun el proyecto.",
      materials: "Roble macizo, hierro forjado",
      dimensions: "220 x 100 x 75 cm (modificable)",
      priceArs: 980000,
      featured: true,
    },
    {
      slug: "mueble-bajo-living",
      title: "Mueble Bajo Living",
      description: "Mueble bajo de living a medida, con cajones y puertas para integrar TV y almacenamiento. Combinacion de madera y herrajes de diseno.",
      materials: "Nogal, herrajes premium",
      dimensions: "240 x 45 x 60 cm",
      priceArs: 850000,
      featured: true,
    },
    {
      slug: "biblioteca-flotante",
      title: "Biblioteca Flotante",
      description: "Biblioteca modular con estantes flotantes de madera y estructura metalica. Ideal para ambientes de living o estudio.",
      materials: "Madera de petiribi, acero negro mate",
      dimensions: "Configurable",
      priceArs: 720000,
      featured: false,
    },
    {
      slug: "banco-madera-cuero",
      title: "Banco de Madera y Cuero",
      description: "Banco para entrada o comedor con asiento tapizado en cuero natural y base de madera maciza.",
      materials: "Madera dura, cuero natural",
      dimensions: "140 x 40 x 45 cm",
      priceArs: 420000,
      featured: false,
    },
    {
      slug: "mesa-ratona-piedra",
      title: "Mesa Ratona Piedra",
      description: "Mesa ratona con tapa de piedra natural (marmol o travertino) y base de hierro con terminacion al agua.",
      materials: "Marmol, hierro al agua",
      dimensions: "120 x 70 x 38 cm",
      priceArs: 580000,
      featured: false,
    },
  ];

  for (const f of newFurniture) {
    await sql`INSERT INTO furniture (slug, title, description, materials, dimensions, price_ars, featured, published_at, created_at, updated_at)
      VALUES (${f.slug}, ${f.title}, ${f.description}, ${f.materials}, ${f.dimensions}, ${f.priceArs}, ${f.featured}, NOW(), NOW(), NOW())
      ON CONFLICT (slug) DO NOTHING`;
    console.log(`  +added ${f.slug}`);
  }
}

async function enrichSettings() {
  console.log("\nEnriching settings...");

  const hero = {
    eyebrow: "SM Studio \u00b7 Mendoza, Argentina",
    headline: "Espacios que reflejan tu esencia",
    subheadline: "Interiorismo, arte original y muebles a medida. No decoramos \u2014 habitamos.",
    ctaText: "Ver proyectos",
    ctaUrl: "/proyectos",
    coverPublicId: "sofi-mosquera/projects/casa-susel/01",
  };

  const about = {
    eyebrow: "Sobre Sofia Mosquera",
    heading: "Disenadora de autor en Mendoza",
    body: "Apasionada del arte en todas sus formas, creo que detras de cada obra hay un alma que se expresa, y sucede lo mismo con los espacios. A traves del interiorismo, disen\u0303o y me conecto con las personas para adaptar sus espacios a la vida que sue\u0303an vivir.",
    mission: "Diseno espacios que reflejan la esencia de quien los habita, integrando interiorismo, arte y muebles a medida con excelencia en cada terminacion.",
    values: [
      { title: "Calidad", description: "Disen\u0303os a medida de gran impacto en tu calidad de vida." },
      { title: "Empatia", description: "Para que los espacios sean un reflejo de quien los habita." },
      { title: "Sustentabilidad", description: "Desde los materiales hasta la linea de produccion." },
    ],
  };

  const contact = {
    whatsapp: "+5492615456913",
    whatsappDisplay: "+54 9 261 545 6913",
    email: "info@sofimosquera.com",
    instagram: "@sofiamosquera.interiorismo",
    instagramUrl: "https://instagram.com/sofiamosquera.interiorismo",
    instagramArte: "@sofiamosquera.arte",
    instagramArteUrl: "https://instagram.com/sofiamosquera.arte",
    location: "Mendoza, Argentina",
    hoursText: "Lunes a viernes \u00b7 09:00 a 18:00",
  };

  const heroJson = JSON.stringify(hero);
  const aboutJson = JSON.stringify(about);
  const contactJson = JSON.stringify(contact);

  await sql`INSERT INTO settings (key, value, updated_at) VALUES ('hero', ${heroJson}::jsonb, NOW()) ON CONFLICT (key) DO UPDATE SET value = ${heroJson}::jsonb, updated_at = NOW()`;
  await sql`INSERT INTO settings (key, value, updated_at) VALUES ('about', ${aboutJson}::jsonb, NOW()) ON CONFLICT (key) DO UPDATE SET value = ${aboutJson}::jsonb, updated_at = NOW()`;
  await sql`INSERT INTO settings (key, value, updated_at) VALUES ('contact', ${contactJson}::jsonb, NOW()) ON CONFLICT (key) DO UPDATE SET value = ${contactJson}::jsonb, updated_at = NOW()`;
  console.log("  updated hero, about, contact");
}

async function main() {
  await enrichArtworks();
  await enrichProjects();
  await enrichFurniture();
  await enrichSettings();
  console.log("\nDone.");
}

main().catch((e) => { console.error(e); process.exit(1); });
