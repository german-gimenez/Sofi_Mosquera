import { createDb, projects, desc } from "@sofi/db";
import { HeroSlider } from "@/components/hero-slider";
import { ProjectGrid } from "@/components/project-grid";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const db = createDb();

  const allProjects = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.featured), desc(projects.publishedAt));

  const heroImages = allProjects
    .map((p) => p.coverUrl)
    .filter((url): url is string => Boolean(url))
    .slice(0, 6);

  return (
    <>
      <HeroSlider images={heroImages} />
      <ProjectGrid
        projects={allProjects.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          location: p.location,
          coverUrl: p.coverUrl,
        }))}
      />
    </>
  );
}
