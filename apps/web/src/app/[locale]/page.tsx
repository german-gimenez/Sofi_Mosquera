import { createDb, projects, artworks, series, settings, desc, eq } from "@sofi/db";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Hero } from "@/components/hero";
import { ArtFeatured } from "@/components/art-featured";
import { ProjectGrid } from "@/components/project-grid";
import { FeaturedSeries } from "@/components/featured-series";
import { ManifestoSection } from "@/components/manifesto-section";
import { NewsletterArt } from "@/components/newsletter-art";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const db = createDb();

  const [allProjects, featuredArtworks, allSeries, featuredSeriesSetting] = await Promise.all([
    db.select().from(projects)
      .where(eq(projects.visible, true))
      .orderBy(desc(projects.featured), desc(projects.publishedAt)),
    db.select().from(artworks)
      .where(eq(artworks.featured, true))
      .orderBy(desc(artworks.publishedAt))
      .limit(4),
    db.select().from(series).orderBy(series.position),
    db.select().from(settings).where(eq(settings.key, "featured_series")).limit(1),
  ]);

  const heroImage = allProjects[0]?.coverUrl ?? null;

  // Featured series: use setting, fallback to first series
  const fsSlug = (featuredSeriesSetting[0]?.value as string) ?? allSeries[0]?.slug ?? null;
  const featuredSerie = allSeries.find((s) => s.slug === fsSlug) ?? allSeries[0] ?? null;

  let serieArtworks: typeof featuredArtworks = [];
  let serieAvailable = 0;
  let serieTotal = 0;
  let serieHeroImage: string | null = null;

  if (featuredSerie) {
    const sa = await db.select().from(artworks)
      .where(eq(artworks.seriesSlug, featuredSerie.slug))
      .orderBy(desc(artworks.featured), desc(artworks.publishedAt));
    serieArtworks = sa;
    serieTotal = sa.length;
    serieAvailable = sa.filter((a) => a.status === "disponible").length;
    serieHeroImage = sa[0]?.coverUrl ?? featuredSerie.coverUrl ?? null;
  }

  return (
    <>
      <Hero coverPublicId={heroImage} />

      <ArtFeatured
        artworks={featuredArtworks.map((a) => ({
          slug: a.slug,
          seriesSlug: a.seriesSlug,
          title: a.title,
          titleEn: a.titleEn,
          technique: a.technique,
          techniqueEn: a.techniqueEn,
          widthCm: a.widthCm,
          heightCm: a.heightCm,
          priceArs: a.priceArs,
          priceVisible: a.priceVisible,
          status: a.status,
          coverUrl: a.coverUrl,
          contextUrl: a.contextUrl,
        }))}
      />

      <ProjectGrid
        projects={allProjects.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          titleEn: p.titleEn,
          subtitle: p.subtitle,
          subtitleEn: p.subtitleEn,
          year: p.year,
          location: p.location,
          coverUrl: p.coverUrl,
        }))}
      />

      {featuredSerie && (
        <FeaturedSeries
          serie={{
            slug: featuredSerie.slug,
            title: featuredSerie.title,
            titleEn: featuredSerie.titleEn,
            description: featuredSerie.description,
            descriptionEn: featuredSerie.descriptionEn,
            coverUrl: featuredSerie.coverUrl,
          }}
          heroImagePublicId={serieHeroImage}
          availableCount={serieAvailable}
          totalCount={serieTotal}
        />
      )}

      <ManifestoSection />
      <NewsletterArt />
    </>
  );
}
