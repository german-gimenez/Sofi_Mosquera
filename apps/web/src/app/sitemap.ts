import type { MetadataRoute } from "next";
import { createDb, projects, artworks, furniture, eq } from "@sofi/db";
import { routing } from "@/i18n/routing";

export const dynamic = "force-dynamic";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sofimosquera.com";

interface RouteSpec {
  /** Path on each locale: { es: "/proyectos", en: "/projects" } */
  paths: Record<"es" | "en", string>;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}

const STATIC_ROUTES: RouteSpec[] = [
  {
    paths: { es: "/", en: "/" },
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    paths: { es: "/proyectos", en: "/projects" },
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    paths: { es: "/arte", en: "/art" },
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    paths: { es: "/muebles", en: "/furniture" },
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    paths: { es: "/estudio", en: "/studio" },
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    paths: { es: "/servicios", en: "/services" },
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    paths: { es: "/contacto", en: "/contact" },
    changeFrequency: "monthly",
    priority: 0.7,
  },
];

function altLanguagesFor(
  paths: Record<"es" | "en", string>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const lc of routing.locales) {
    out[lc] = `${SITE_URL}/${lc}${paths[lc] === "/" ? "" : paths[lc]}`;
  }
  return out;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = createDb();

  const [visibleProjects, allArtworks, catalogFurniture] = await Promise.all([
    db
      .select({ slug: projects.slug, updatedAt: projects.updatedAt })
      .from(projects)
      .where(eq(projects.visible, true)),
    db
      .select({ slug: artworks.slug, updatedAt: artworks.updatedAt })
      .from(artworks),
    db
      .select({ slug: furniture.slug, updatedAt: furniture.updatedAt })
      .from(furniture)
      .where(eq(furniture.isCatalog, true)),
  ]);

  const sitemap: MetadataRoute.Sitemap = [];

  // Static localized routes
  for (const r of STATIC_ROUTES) {
    for (const lc of routing.locales) {
      const path = r.paths[lc];
      const url = `${SITE_URL}/${lc}${path === "/" ? "" : path}`;
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: r.changeFrequency,
        priority: r.priority,
        alternates: {
          languages: altLanguagesFor(r.paths),
        },
      });
    }
  }

  // Dynamic project pages × 2 locales
  for (const p of visibleProjects) {
    for (const lc of routing.locales) {
      const path = lc === "en" ? "projects" : "proyectos";
      sitemap.push({
        url: `${SITE_URL}/${lc}/${path}/${p.slug}`,
        lastModified: p.updatedAt ?? new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: {
            es: `${SITE_URL}/es/proyectos/${p.slug}`,
            en: `${SITE_URL}/en/projects/${p.slug}`,
          },
        },
      });
    }
  }

  // Dynamic artwork pages × 2 locales
  for (const a of allArtworks) {
    for (const lc of routing.locales) {
      const path = lc === "en" ? "art" : "arte";
      sitemap.push({
        url: `${SITE_URL}/${lc}/${path}/${a.slug}`,
        lastModified: a.updatedAt ?? new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: {
            es: `${SITE_URL}/es/arte/${a.slug}`,
            en: `${SITE_URL}/en/art/${a.slug}`,
          },
        },
      });
    }
  }

  // Dynamic furniture pages × 2 locales
  for (const f of catalogFurniture) {
    for (const lc of routing.locales) {
      const path = lc === "en" ? "furniture" : "muebles";
      sitemap.push({
        url: `${SITE_URL}/${lc}/${path}/${f.slug}`,
        lastModified: f.updatedAt ?? new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: {
            es: `${SITE_URL}/es/muebles/${f.slug}`,
            en: `${SITE_URL}/en/furniture/${f.slug}`,
          },
        },
      });
    }
  }

  return sitemap;
}
