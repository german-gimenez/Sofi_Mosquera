/**
 * Seed V3 — Lovable-aligned art-commerce redesign.
 *
 * Strategy:
 * - Mark legacy 8 projects as visible=false (preserve admin access, hide publicly)
 * - Insert 6 Lovable projects (bc, casa-sp, club-house-rn, casa-bf, vacherie, andeluna)
 *   with bilingual fields, intervention, technical data, position
 * - Insert 4 series (emociones, loading, movimiento, solidez) with bilingual descriptions
 * - Re-seed artworks with seriesSlug FK + EN fields + Emociones prices from Lovable
 * - Insert featured_series setting → "emociones"
 * - Re-seed about_photos & contact settings
 *
 * Idempotent: uses ON CONFLICT … DO UPDATE … so it can run repeatedly.
 *
 * Run: pnpm --filter @sofi/db exec tsx src/seed.ts
 */
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "../../../.env.local") });

const LEGACY_PROJECT_SLUGS = [
  "casa-susel",
  "penthouse",
  "bertona-ferreyra",
  "club-house-rincon-viamonte",
  "produccion-casa-laura-y-lucas",
  "rosario-gonzalez",
  "prod-fotos-estudio",
  // "andeluna" exists in legacy too, but we keep its slug and update content below
];

async function seed() {
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(process.env.DATABASE_URL_UNPOOLED!);

  console.log("Seeding V3 database...");

  // 1. Hide legacy projects (visible=false) — keep their data for admin recovery.
  console.log("\n[1/6] Hiding legacy projects...");
  for (const slug of LEGACY_PROJECT_SLUGS) {
    await sql`UPDATE projects SET visible = false WHERE slug = ${slug}`;
  }
  console.log(`     ${LEGACY_PROJECT_SLUGS.length} legacy projects hidden`);

  // 2. Insert/update 6 Lovable projects.
  console.log("\n[2/6] Upserting 6 Lovable projects...");

  // BC — Departamento Edificio Grand Boulogne
  await sql`
    INSERT INTO projects (
      slug, title, title_en, subtitle, subtitle_en, summary, summary_en,
      intervention, intervention_en, description, description_en,
      category, year, location, cover_url,
      visible, position, featured, published_at, created_at, updated_at
    ) VALUES (
      'bc', 'Proyecto B.C', 'B.C Project',
      'Departamento llave en mano', 'Turnkey apartment',
      'Edificio Grand Boulogne, Mendoza. Departamento integral en planta baja con propuesta funcional y estética unificada.',
      'Grand Boulogne building, Mendoza. Full-scope ground-floor apartment with unified functional and aesthetic vision.',
      'Interiorismo y dirección integral', 'Interior design and full direction',
      'Diseño integral del departamento desde la propuesta funcional hasta la dirección de obra. Definición espacial, mobiliario a medida (biblioteca de cerezo, bancos, comedor) y curaduría de iluminación. Cada pieza fue pensada para dialogar con la luz natural del living-comedor y el ritmo cotidiano del cliente.',
      'End-to-end apartment design from functional brief to on-site direction. Spatial layout, custom furniture (cherry-wood library, benches, dining set) and curated lighting. Every piece was conceived to dialogue with the natural light of the living-dining room and the client''s daily rhythm.',
      'residencial', 2019, 'Mendoza, Argentina',
      'sofi-mosquera/projects/bc/cover',
      true, 1, true, NOW(), NOW(), NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      title_en = EXCLUDED.title_en,
      subtitle = EXCLUDED.subtitle,
      subtitle_en = EXCLUDED.subtitle_en,
      summary = EXCLUDED.summary,
      summary_en = EXCLUDED.summary_en,
      intervention = EXCLUDED.intervention,
      intervention_en = EXCLUDED.intervention_en,
      description = EXCLUDED.description,
      description_en = EXCLUDED.description_en,
      year = EXCLUDED.year,
      location = EXCLUDED.location,
      cover_url = EXCLUDED.cover_url,
      visible = true,
      position = 1,
      featured = true,
      updated_at = NOW()
  `;

  // CASA SP
  await sql`
    INSERT INTO projects (
      slug, title, title_en, subtitle, subtitle_en, summary, summary_en,
      intervention, intervention_en, description, description_en,
      category, year, location, cover_url,
      visible, position, featured, published_at, created_at, updated_at
    ) VALUES (
      'casa-sp', 'Casa SP', 'SP House',
      'Vivienda unifamiliar', 'Single-family residence',
      'Barrio La Delia, Mendoza. Interiorismo integral y rediseño espacial de una vivienda unifamiliar.',
      'La Delia neighborhood, Mendoza. Full interior design and spatial redesign of a single-family home.',
      'Interiorismo integral y rediseño espacial', 'Full interior design and spatial redesign',
      'Rediseño de la planta y la materialidad de cada ambiente. Proyecto de mobiliario a medida (panelados, bibliotecas, cabeceras), selección de iluminación y textiles. Foco en la calidez y la integración del living-comedor con el espacio exterior.',
      'Floor-plan and materiality redesign for every room. Custom furniture project (panelling, libraries, bed-heads), lighting and textile curation. Focus on warmth and the seamless integration of living-dining with outdoors.',
      'residencial', 2018, 'La Delia, Mendoza',
      'sofi-mosquera/projects/casa-sp/cover',
      true, 2, true, NOW(), NOW(), NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title, title_en = EXCLUDED.title_en,
      subtitle = EXCLUDED.subtitle, subtitle_en = EXCLUDED.subtitle_en,
      summary = EXCLUDED.summary, summary_en = EXCLUDED.summary_en,
      intervention = EXCLUDED.intervention, intervention_en = EXCLUDED.intervention_en,
      description = EXCLUDED.description, description_en = EXCLUDED.description_en,
      year = EXCLUDED.year, location = EXCLUDED.location,
      cover_url = EXCLUDED.cover_url,
      visible = true, position = 2, featured = true, updated_at = NOW()
  `;

  // CLUB HOUSE RN
  await sql`
    INSERT INTO projects (
      slug, title, title_en, subtitle, subtitle_en, summary, summary_en,
      intervention, intervention_en, description, description_en,
      category, year, location, cover_url,
      visible, position, featured, published_at, created_at, updated_at
    ) VALUES (
      'club-house-rn', 'Club House RN', 'RN Club House',
      'Espacio gastronómico y social', 'Hospitality and social space',
      'Mendoza. Diseño de espacio gastronómico y social con identidad propia.',
      'Mendoza. Hospitality and social-space design with a distinctive identity.',
      'Interiorismo comercial', 'Commercial interior design',
      'Proyecto de espacio gastronómico que integra comedor, salón y áreas de estar. Materiales nobles, mobiliario a medida y una paleta calma para soportar largos encuentros sociales.',
      'Hospitality project integrating dining, lounge and living areas. Honest materials, custom furniture and a calm palette to support long social gatherings.',
      'comercial', 2020, 'Mendoza, Argentina',
      'sofi-mosquera/projects/club-house-rn/cover',
      true, 3, true, NOW(), NOW(), NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title, title_en = EXCLUDED.title_en,
      subtitle = EXCLUDED.subtitle, subtitle_en = EXCLUDED.subtitle_en,
      summary = EXCLUDED.summary, summary_en = EXCLUDED.summary_en,
      intervention = EXCLUDED.intervention, intervention_en = EXCLUDED.intervention_en,
      description = EXCLUDED.description, description_en = EXCLUDED.description_en,
      year = EXCLUDED.year, location = EXCLUDED.location,
      cover_url = EXCLUDED.cover_url,
      visible = true, position = 3, featured = true, updated_at = NOW()
  `;

  // CASA BF
  await sql`
    INSERT INTO projects (
      slug, title, title_en, subtitle, subtitle_en, summary, summary_en,
      intervention, intervention_en, description, description_en,
      category, year, location, cover_url,
      visible, position, featured, published_at, created_at, updated_at
    ) VALUES (
      'casa-bf', 'Casa BF', 'BF House',
      'Vivienda unifamiliar', 'Single-family residence',
      'Mendoza. Vivienda unifamiliar con foco en calidez, luz y materialidad.',
      'Mendoza. Single-family residence focused on warmth, light and materiality.',
      'Interiorismo integral con dirección', 'Full interior design with direction',
      'Casa proyectada como una sola atmósfera continua. Living-comedor como corazón del hogar, dormitorios resueltos como refugios y baños tratados como pequeños spas. Mobiliario a medida en cada ambiente.',
      'Home conceived as a single continuous atmosphere. Living-dining as the heart of the home, bedrooms resolved as retreats and bathrooms treated as small spas. Custom furniture in every room.',
      'residencial', 2021, 'Mendoza, Argentina',
      'sofi-mosquera/projects/casa-bf/cover',
      true, 4, true, NOW(), NOW(), NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title, title_en = EXCLUDED.title_en,
      subtitle = EXCLUDED.subtitle, subtitle_en = EXCLUDED.subtitle_en,
      summary = EXCLUDED.summary, summary_en = EXCLUDED.summary_en,
      intervention = EXCLUDED.intervention, intervention_en = EXCLUDED.intervention_en,
      description = EXCLUDED.description, description_en = EXCLUDED.description_en,
      year = EXCLUDED.year, location = EXCLUDED.location,
      cover_url = EXCLUDED.cover_url,
      visible = true, position = 4, featured = true, updated_at = NOW()
  `;

  // VACHERIE — Dormitorio + estudio con altillo
  await sql`
    INSERT INTO projects (
      slug, title, title_en, subtitle, subtitle_en, summary, summary_en,
      intervention, intervention_en, description, description_en,
      category, year, location, cover_url,
      visible, position, featured, published_at, created_at, updated_at
    ) VALUES (
      'vacherie', 'Dormitorio La Vacherie', 'La Vacherie Bedroom',
      'Dormitorio con altillo y estudio', 'Bedroom with mezzanine and study',
      'Barrio La Vacherie, Mendoza. Dormitorio con altillo + estudio integrado.',
      'La Vacherie neighborhood, Mendoza. Bedroom with mezzanine + integrated study.',
      'Interiorismo y diseño de mobiliario', 'Interior design and furniture',
      'Solución espacial vertical para optimizar metros y separar funciones: dormitorio en planta baja, estudio en altillo. Estructura metálica blanca, biblioteca de madera natural y panel-TV integrado. Cada pieza pensada para no comprometer la luz cenital.',
      'Vertical spatial solution to optimise square meters and split functions: bedroom on the lower level, study on the mezzanine. White metal structure, natural-wood library and integrated TV panel. Every piece designed to preserve the zenithal light.',
      'residencial', 2022, 'La Vacherie, Mendoza',
      'sofi-mosquera/projects/vacherie/cover',
      true, 5, false, NOW(), NOW(), NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title, title_en = EXCLUDED.title_en,
      subtitle = EXCLUDED.subtitle, subtitle_en = EXCLUDED.subtitle_en,
      summary = EXCLUDED.summary, summary_en = EXCLUDED.summary_en,
      intervention = EXCLUDED.intervention, intervention_en = EXCLUDED.intervention_en,
      description = EXCLUDED.description, description_en = EXCLUDED.description_en,
      year = EXCLUDED.year, location = EXCLUDED.location,
      cover_url = EXCLUDED.cover_url,
      visible = true, position = 5, featured = false, updated_at = NOW()
  `;

  // ANDELUNA
  await sql`
    INSERT INTO projects (
      slug, title, title_en, subtitle, subtitle_en, summary, summary_en,
      intervention, intervention_en, description, description_en,
      category, year, location, cover_url,
      visible, position, featured, published_at, created_at, updated_at
    ) VALUES (
      'andeluna', 'Directorio Andeluna', 'Andeluna Boardroom',
      'Sala de directorio en bodega', 'Winery boardroom',
      'Bodega Andeluna, Valle de Uco. Sala de directorio con identidad de la marca.',
      'Andeluna Winery, Uco Valley. Boardroom space anchored in the brand''s identity.',
      'Interiorismo comercial', 'Commercial interior design',
      'Sala de directorio para uno de los referentes vitivinícolas del Valle de Uco. Estanterías y panelados en maderas locales, mesa central de granito y muros texturados. Iluminación calibrada para reuniones y catas privadas.',
      'Boardroom for one of the leading wineries of the Uco Valley. Shelving and panelling in local woods, central granite table and textured walls. Lighting calibrated for both meetings and private tastings.',
      'comercial', 2019, 'Valle de Uco, Mendoza',
      'sofi-mosquera/projects/andeluna/cover',
      true, 6, false, NOW(), NOW(), NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title, title_en = EXCLUDED.title_en,
      subtitle = EXCLUDED.subtitle, subtitle_en = EXCLUDED.subtitle_en,
      summary = EXCLUDED.summary, summary_en = EXCLUDED.summary_en,
      intervention = EXCLUDED.intervention, intervention_en = EXCLUDED.intervention_en,
      description = EXCLUDED.description, description_en = EXCLUDED.description_en,
      year = EXCLUDED.year, location = EXCLUDED.location,
      cover_url = EXCLUDED.cover_url,
      visible = true, position = 6, featured = false, updated_at = NOW()
  `;

  console.log("     6 Lovable projects upserted");

  // 3. Insert 4 series.
  console.log("\n[3/6] Upserting 4 series...");
  await sql`
    INSERT INTO series (slug, title, title_en, description, description_en, position, created_at, updated_at) VALUES
      ('emociones', 'Emociones', 'Emotions',
       'Cada lienzo de esta serie es una radiografía emocional. Un mapa de lo que se siente cuando no se puede decir con palabras.',
       'Each canvas in this series is an emotional X-ray. A map of what is felt when it cannot be said in words.',
       1, NOW(), NOW()),
      ('loading', 'Loading', 'Loading',
       'Estados de transición. Lo que está por venir, lo que se está formando. Una pausa entre lo que fue y lo que será.',
       'States of transition. What is to come, what is being formed. A pause between what was and what will be.',
       2, NOW(), NOW()),
      ('movimiento', 'Movimiento', 'Movement',
       'La materia en flujo. Líneas, derrames y trazos que capturan el gesto antes de que se quede quieto.',
       'Matter in flux. Lines, spills and brushstrokes that capture the gesture before it goes still.',
       3, NOW(), NOW()),
      ('solidez', 'Solidez', 'Solidity',
       'Lo que permanece. Geometría, peso y estructura: el cuerpo de las cosas cuando todo lo demás se mueve.',
       'What remains. Geometry, weight and structure: the body of things when everything else is moving.',
       4, NOW(), NOW())
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      title_en = EXCLUDED.title_en,
      description = EXCLUDED.description,
      description_en = EXCLUDED.description_en,
      position = EXCLUDED.position,
      updated_at = NOW()
  `;
  console.log("     4 series upserted");

  // 4. Upsert artworks with V3 fields (seriesSlug, EN, prices, status, position)
  console.log("\n[4/6] Upserting artworks (Emociones series with prices)...");

  const emocionesArtworks: Array<{
    slug: string;
    title: string;
    titleEn: string;
    technique: string;
    techniqueEn: string;
    widthCm: number | null;
    heightCm: number | null;
    priceArs: number | null;
    priceVisible: boolean;
    status: string;
    featured: boolean;
    position: number;
  }> = [
    {
      slug: "el-rey",
      title: "El Rey",
      titleEn: "The King",
      technique: "Acrílico sobre lienzo",
      techniqueEn: "Acrylic on canvas",
      widthCm: 120,
      heightCm: 150,
      priceArs: 300000,
      priceVisible: true,
      status: "disponible",
      featured: true,
      position: 1,
    },
    {
      slug: "isla-gris",
      title: "Isla Gris",
      titleEn: "Grey Island",
      technique: "Acrílico sobre lienzo",
      techniqueEn: "Acrylic on canvas",
      widthCm: 100,
      heightCm: 100,
      priceArs: 250000,
      priceVisible: true,
      status: "disponible",
      featured: true,
      position: 2,
    },
    {
      slug: "mountains",
      title: "Mountains",
      titleEn: "Mountains",
      technique: "Acrílico sobre lienzo",
      techniqueEn: "Acrylic on canvas",
      widthCm: 100,
      heightCm: 80,
      priceArs: 230000,
      priceVisible: true,
      status: "disponible",
      featured: true,
      position: 3,
    },
    {
      slug: "nacimiento",
      title: "Nacimiento",
      titleEn: "Birth",
      technique: "Técnica mixta",
      techniqueEn: "Mixed media",
      widthCm: 90,
      heightCm: 120,
      priceArs: 280000,
      priceVisible: true,
      status: "disponible",
      featured: true,
      position: 4,
    },
    {
      slug: "muri",
      title: "Muri",
      titleEn: "Muri",
      technique: "Acrílico sobre lienzo",
      techniqueEn: "Acrylic on canvas",
      widthCm: 80,
      heightCm: 100,
      priceArs: 220000,
      priceVisible: true,
      status: "disponible",
      featured: false,
      position: 5,
    },
    {
      slug: "musica",
      title: "Música",
      titleEn: "Music",
      technique: "Acrílico sobre lienzo",
      techniqueEn: "Acrylic on canvas",
      widthCm: 80,
      heightCm: 80,
      priceArs: 200000,
      priceVisible: true,
      status: "disponible",
      featured: false,
      position: 6,
    },
    {
      slug: "intercambio",
      title: "Intercambio",
      titleEn: "Exchange",
      technique: "Acrílico sobre lienzo",
      techniqueEn: "Acrylic on canvas",
      widthCm: 100,
      heightCm: 80,
      priceArs: 240000,
      priceVisible: true,
      status: "disponible",
      featured: false,
      position: 7,
    },
    {
      slug: "triptico-mapa",
      title: "Tríptico Mapa",
      titleEn: "Map Triptych",
      technique: "Acrílico sobre lienzo",
      techniqueEn: "Acrylic on canvas",
      widthCm: 200,
      heightCm: 80,
      priceArs: null,
      priceVisible: false,
      status: "vendido",
      featured: false,
      position: 8,
    },
  ];

  for (const a of emocionesArtworks) {
    const cover = `sofi-mosquera/artworks/emociones/${a.slug}/cover`;
    await sql`
      INSERT INTO artworks (
        slug, title, title_en, series, series_slug,
        technique, technique_en, width_cm, height_cm,
        price_ars, price_visible, status,
        cover_url, featured, position, published_at, created_at, updated_at
      ) VALUES (
        ${a.slug}, ${a.title}, ${a.titleEn}, 'Emociones', 'emociones',
        ${a.technique}, ${a.techniqueEn}, ${a.widthCm}, ${a.heightCm},
        ${a.priceArs}, ${a.priceVisible}, ${a.status},
        ${cover}, ${a.featured}, ${a.position}, NOW(), NOW(), NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        title_en = EXCLUDED.title_en,
        series = EXCLUDED.series,
        series_slug = EXCLUDED.series_slug,
        technique = EXCLUDED.technique,
        technique_en = EXCLUDED.technique_en,
        width_cm = EXCLUDED.width_cm,
        height_cm = EXCLUDED.height_cm,
        price_ars = EXCLUDED.price_ars,
        price_visible = EXCLUDED.price_visible,
        status = EXCLUDED.status,
        cover_url = EXCLUDED.cover_url,
        featured = EXCLUDED.featured,
        position = EXCLUDED.position,
        updated_at = NOW()
    `;
  }
  console.log(`     ${emocionesArtworks.length} Emociones artworks upserted`);

  // 5. Settings: featured_series + about_photos + contact
  console.log("\n[5/6] Upserting settings...");
  await sql`
    INSERT INTO settings (key, value, updated_at) VALUES
      ('featured_series', '"emociones"'::jsonb, NOW()),
      ('about_photos', '["sofi-mosquera/about/sofia-01"]'::jsonb, NOW()),
      ('contact', '{"whatsapp":"+5492615456913","email":"smosquera@sofimosquera.com","instagram":"@sofiamosquera.interiorismo","instagramArte":"@sofiamosquera.arte","location":"Chacras de Coria, Mendoza"}'::jsonb, NOW())
    ON CONFLICT (key) DO UPDATE SET
      value = EXCLUDED.value,
      updated_at = NOW()
  `;
  console.log("     featured_series → emociones · about_photos · contact");

  // 6. Sample furniture (placeholder; isCatalog=false until M-02)
  console.log("\n[6/6] Furniture placeholder...");
  await sql`
    UPDATE furniture SET is_catalog = false WHERE is_catalog IS NULL OR is_catalog = false
  `;
  console.log("     Furniture is_catalog gates pieces from public catalogue");

  console.log("\n✅ V3 Seed completed!");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
