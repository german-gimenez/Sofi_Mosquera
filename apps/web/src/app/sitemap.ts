import type { MetadataRoute } from "next";
import { createDb, projects, artworks, furniture } from "@sofi/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://sofimosquera.com";
  const db = createDb();

  const allProjects = await db.select({ slug: projects.slug }).from(projects);
  const allArtworks = await db.select({ slug: artworks.slug }).from(artworks);
  const allFurniture = await db.select({ slug: furniture.slug }).from(furniture);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/interiorismo`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/proyectos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/arte`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/muebles`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/asesoria`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contacto`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const projectPages = allProjects.map((p) => ({
    url: `${baseUrl}/proyectos/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const artworkPages = allArtworks.map((a) => ({
    url: `${baseUrl}/arte/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const furniturePages = allFurniture.map((f) => ({
    url: `${baseUrl}/muebles/${f.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...artworkPages, ...furniturePages];
}
