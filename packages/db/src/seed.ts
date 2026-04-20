import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { projects, artworks, furniture, settings } from "./schema";

async function seed() {
  const sql = neon(process.env.DATABASE_URL_UNPOOLED!);
  const db = drizzle(sql);

  console.log("Seeding database...");

  await db.insert(projects).values([
    {
      slug: "casa-susel",
      title: "Casa Susel",
      summary: "Proyecto integral de interiorismo residencial. Diseño de living, comedor y espacios de estar con materiales nobles y arte original.",
      category: "residencial",
      year: 2021,
      location: "Mendoza, Argentina",
      featured: true,
      publishedAt: new Date(),
    },
    {
      slug: "penthouse",
      title: "Penthouse",
      summary: "Diseño completo de penthouse con vista panorámica. Integración de muebles a medida y obras de arte en cada ambiente.",
      category: "residencial",
      year: 2023,
      location: "Mendoza, Argentina",
      featured: true,
      publishedAt: new Date(),
    },
    {
      slug: "bertona-ferreyra",
      title: "Bertona Ferreyra",
      summary: "Interiorismo residencial con foco en dormitorios y espacios de descanso. Renders 3D y ejecución integral.",
      category: "residencial",
      year: 2024,
      location: "Mendoza, Argentina",
      featured: true,
      publishedAt: new Date(),
    },
    {
      slug: "club-house-rincon-viamonte",
      title: "Club House Rincón Viamonte",
      summary: "Diseño de espacios comunes para desarrollo inmobiliario. Proyecto comercial con identidad visual coherente.",
      category: "comercial",
      year: 2024,
      location: "Mendoza, Argentina",
      featured: true,
      publishedAt: new Date(),
    },
    {
      slug: "andeluna",
      title: "Andeluna",
      summary: "Proyecto de interiorismo para bodega. Diseño de espacios que transmiten la esencia de la marca.",
      category: "comercial",
      year: 2023,
      location: "Valle de Uco, Mendoza",
      featured: false,
      publishedAt: new Date(),
    },
    {
      slug: "produccion-casa-laura-y-lucas",
      title: "Casa Laura y Lucas",
      summary: "Producción fotográfica y diseño integral de vivienda familiar con enfoque en calidez y funcionalidad.",
      category: "residencial",
      year: 2024,
      location: "Mendoza, Argentina",
      featured: false,
      publishedAt: new Date(),
    },
    {
      slug: "rosario-gonzalez",
      title: "Rosario González",
      summary: "Proyecto residencial personalizado. Cada ambiente refleja la esencia de quien lo habita.",
      category: "residencial",
      year: 2023,
      location: "Mendoza, Argentina",
      featured: false,
      publishedAt: new Date(),
    },
    {
      slug: "prod-fotos-estudio",
      title: "Estudio SM",
      summary: "Producción editorial en el estudio de Sofia Mosquera. Espacio propio diseñado como showroom y lugar de trabajo creativo.",
      category: "comercial",
      year: 2025,
      location: "Mendoza, Argentina",
      featured: false,
      publishedAt: new Date(),
    },
  ]);

  await db.insert(artworks).values([
    {
      slug: "el-rey",
      title: "El Rey",
      series: "Emociones",
      technique: "Acrílico sobre lienzo",
      status: "disponible",
      featured: true,
      publishedAt: new Date(),
    },
    {
      slug: "isla-gris",
      title: "Isla Gris",
      series: "Emociones",
      technique: "Acrílico sobre lienzo",
      status: "disponible",
      featured: true,
      publishedAt: new Date(),
    },
    {
      slug: "mountains",
      title: "Mountains",
      series: "Emociones",
      technique: "Acrílico sobre lienzo",
      status: "disponible",
      featured: true,
      publishedAt: new Date(),
    },
    {
      slug: "nacimiento",
      title: "Nacimiento",
      series: "Emociones",
      technique: "Técnica mixta",
      status: "disponible",
      featured: true,
      publishedAt: new Date(),
    },
    {
      slug: "muri",
      title: "Muri",
      series: "Emociones",
      technique: "Acrílico sobre lienzo",
      status: "disponible",
      featured: false,
      publishedAt: new Date(),
    },
    {
      slug: "musica",
      title: "Música",
      series: "Emociones",
      technique: "Acrílico sobre lienzo",
      status: "disponible",
      featured: false,
      publishedAt: new Date(),
    },
    {
      slug: "triptico-mapa",
      title: "Tríptico Mapa",
      series: "Emociones",
      technique: "Acrílico sobre lienzo",
      status: "vendido",
      featured: false,
      publishedAt: new Date(),
    },
    {
      slug: "intercambio",
      title: "Intercambio",
      series: "Emociones",
      technique: "Acrílico sobre lienzo",
      status: "disponible",
      featured: false,
      publishedAt: new Date(),
    },
  ]);

  await db.insert(furniture).values([
    {
      slug: "mueble-estar",
      title: "Mueble de Estar",
      description: "Mueble a medida para living, diseñado en madera natural con terminaciones premium.",
      materials: "Madera natural, herrajes de diseño",
      featured: true,
      publishedAt: new Date(),
    },
  ]);

  await db.insert(settings).values([
    {
      key: "hero",
      value: {
        tagline: "Espacios que reflejan tu esencia",
        subtitle: "Interiorismo · Arte · Muebles a medida",
        ctaText: "Conocé nuestros proyectos",
        ctaUrl: "/interiorismo",
      },
    },
    {
      key: "about",
      value: {
        heading: "Diseñamos espacios que reflejan la esencia de quién los habita",
        body: "Integrando interiorismo, arte y muebles a medida con excelencia en cada terminación. El mismo estudio que diseña tu living puede crear el cuadro que lo completa.",
        ctaText: "Coordiná tu primera asesoría",
      },
    },
    {
      key: "contact",
      value: {
        whatsapp: "+5492615456913",
        email: "info@sofimosquera.com",
        instagram: "@sofiamosquera.interiorismo",
        instagramArte: "@sofiamosquera.arte",
        location: "Mendoza, Argentina",
      },
    },
  ]);

  console.log("Seed completed!");
}

seed().catch(console.error);
