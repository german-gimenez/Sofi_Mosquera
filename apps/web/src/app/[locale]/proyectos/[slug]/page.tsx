import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { createDb, projects, eq, asc, desc, and } from "@sofi/db";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  WhatsAppCTA,
  projectMessage,
  cldCard,
  cldHero,
  cldSrcSet,
} from "@sofi/ui";
import { ProjectHero } from "@/components/project-hero";
import { GalleryLightbox } from "@/components/gallery-lightbox";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import {
  jsonLdScript,
  projectCreativeWorkSchema,
} from "@/lib/structured-data";
import { pickLocale } from "@/lib/i18n-helpers";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const db = createDb();
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);

  if (!project) return {};
  const lc = locale as Locale;
  const title = pickLocale(project.title, project.titleEn, lc);
  const summary = pickLocale(
    project.summary ?? null,
    project.summaryEn ?? null,
    lc
  );
  return {
    title,
    description: summary ?? undefined,
  };
}

function extractBeforeAfter(gallery: string[]): {
  before: string;
  after: string;
} | null {
  const beforeIdx = gallery.findIndex((id) => /(antes|before)/i.test(id));
  if (beforeIdx === -1) return null;
  const before = gallery[beforeIdx];
  const afterIdx = gallery.findIndex(
    (id, i) => i !== beforeIdx && !/(antes|before)/i.test(id)
  );
  if (afterIdx === -1) return null;
  return { before, after: gallery[afterIdx] };
}

export default async function ProjectPage({ params }: Props) {
  const { slug, locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "proyectos" });
  const tCta = await getTranslations({ locale, namespace: "cta" });
  const lc = locale as Locale;

  const db = createDb();
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.visible, true)))
    .limit(1);

  if (!project) notFound();

  // Circular sibling navigation by position then publishedAt
  const allVisible = await db
    .select({
      id: projects.id,
      slug: projects.slug,
      title: projects.title,
      titleEn: projects.titleEn,
      coverUrl: projects.coverUrl,
      position: projects.position,
    })
    .from(projects)
    .where(eq(projects.visible, true))
    .orderBy(asc(projects.position), desc(projects.publishedAt));

  const idx = allVisible.findIndex((p) => p.slug === project.slug);
  const next =
    allVisible.length > 0 ? allVisible[(idx + 1) % allVisible.length] : null;
  const isOnlyOne = allVisible.length <= 1 || !next || next.slug === project.slug;

  const gallery = (project.gallery as string[]) ?? [];
  const beforeAfter = extractBeforeAfter(gallery);
  const mainGallery = beforeAfter
    ? gallery.filter(
        (id) => id !== beforeAfter.before && id !== beforeAfter.after
      )
    : gallery;

  const title = pickLocale(project.title, project.titleEn, lc);
  const subtitle = pickLocale(
    project.subtitle ?? null,
    project.subtitleEn ?? null,
    lc
  );
  const intervention = pickLocale(
    project.intervention ?? null,
    project.interventionEn ?? null,
    lc
  );
  const concept = pickLocale(
    project.concept ?? null,
    project.conceptEn ?? null,
    lc
  );
  const description = pickLocale(
    project.description ?? null,
    project.descriptionEn ?? null,
    lc
  );
  const summary = pickLocale(
    project.summary ?? null,
    project.summaryEn ?? null,
    lc
  );
  const techData = project.technicalData as
    | { areaM2?: number; highlights?: string[] }
    | null;

  const schema = projectCreativeWorkSchema({
    title,
    slug: project.slug,
    summary,
    year: project.year,
    location: project.location,
    category: project.category,
    coverImageUrl: project.coverUrl ? cldHero(project.coverUrl) : null,
    locale: lc,
  });

  const nextTitle = next
    ? pickLocale(next.title, next.titleEn, lc)
    : null;

  return (
    <div className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(schema)}
      />
      <ProjectHero title={title} coverUrl={project.coverUrl ?? undefined} />

      <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-[100px]">
        <Link
          href="/proyectos"
          className="inline-block font-body text-sm text-brand-gris-nav border-b border-brand-gris-nav pb-0.5 hover:text-brand-negro hover:border-brand-negro transition-colors mb-12"
        >
          {t("back")}
        </Link>

        {subtitle && (
          <p className="font-body text-sm font-light tracking-[0.1em] uppercase text-brand-gris-nav mb-2">
            {subtitle}
          </p>
        )}
        <h1 className="font-heading text-4xl md:text-6xl text-brand-negro leading-[1.05]">
          {title}
        </h1>

        {/* Metadata 3 cols (V3 spec) */}
        <div className="grid grid-cols-3 gap-6 md:gap-10 mt-12 md:mt-16 pb-10 border-b border-brand-crema">
          {project.year && (
            <div>
              <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav">
                {t("year")}
              </span>
              <p className="font-body text-sm text-brand-negro mt-2">
                {project.year}
              </p>
            </div>
          )}
          {project.location && (
            <div>
              <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav">
                {t("location")}
              </span>
              <p className="font-body text-sm text-brand-negro mt-2">
                {project.location}
              </p>
            </div>
          )}
          {intervention && (
            <div>
              <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav">
                {t("intervention")}
              </span>
              <p className="font-body text-sm text-brand-negro mt-2">
                {intervention}
              </p>
            </div>
          )}
        </div>

        {description && (
          <div className="max-w-2xl mt-14">
            <p className="font-body font-light text-lg md:text-xl text-brand-negro-suave leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>
        )}

        {concept && (
          <div className="max-w-2xl mt-10">
            <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav block mb-3">
              {t("concept")}
            </span>
            <p className="font-body font-light text-base md:text-lg text-brand-negro-suave leading-relaxed whitespace-pre-line">
              {concept}
            </p>
          </div>
        )}

        {techData && (techData.areaM2 || (techData.highlights && techData.highlights.length > 0)) && (
          <div className="grid md:grid-cols-2 gap-8 mt-14 pt-10 border-t border-brand-crema">
            {techData.areaM2 && (
              <div>
                <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav block mb-3">
                  {t("area")}
                </span>
                <p className="font-heading text-3xl text-brand-negro">
                  {techData.areaM2} m²
                </p>
              </div>
            )}
            {techData.highlights && techData.highlights.length > 0 && (
              <div>
                <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav block mb-3">
                  {t("highlights")}
                </span>
                <ul className="space-y-1.5">
                  {techData.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="font-body font-light text-sm text-brand-negro"
                    >
                      — {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {beforeAfter && (
        <div className="max-w-6xl mx-auto px-6 pb-16 md:pb-[100px]">
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav block mb-6">
            {t("beforeAfter")}
          </span>
          <BeforeAfterSlider
            beforeId={beforeAfter.before}
            afterId={beforeAfter.after}
            alt={title}
          />
        </div>
      )}

      {mainGallery.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 pb-16 md:pb-[100px]">
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav block mb-8">
            {t("gallery")}
          </span>
          <GalleryLightbox publicIds={mainGallery} title={title} />
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 pb-20">
        <div className="text-center py-12 border-t border-b border-brand-crema">
          <p className="font-heading text-2xl md:text-3xl text-brand-negro mb-6">
            {t("ctaTitle")}
          </p>
          <WhatsAppCTA
            label={tCta("whatsapp")}
            message={projectMessage(title, lc)}
            ariaLabel={`WhatsApp ${title}`}
          />
        </div>
      </div>

      {/* Next project — circular */}
      {!isOnlyOne && next && (
        <section className="max-w-[1440px] mx-auto px-6 pb-24">
          <Link
            href={{
              pathname: "/proyectos/[slug]",
              params: { slug: next.slug },
            }}
            className="group block"
          >
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav block mb-6">
              {t("next")}
            </span>
            <div className="relative aspect-[16/9] md:aspect-[21/9] bg-brand-crema overflow-hidden">
              {next.coverUrl ? (
                <img
                  src={cldCard(next.coverUrl)}
                  srcSet={cldSrcSet(
                    next.coverUrl,
                    [768, 1200, 1920, 2560],
                    { h: 1080, crop: "fill", g: "auto" }
                  )}
                  sizes="100vw"
                  alt={nextTitle ?? next.slug}
                  className="w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-heading text-[10vw] text-brand-gris-border/30">
                    {(nextTitle ?? next.slug).charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-negro/55 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
                <h2 className="font-heading text-3xl md:text-5xl text-brand-blanco-calido leading-tight">
                  {nextTitle}
                </h2>
              </div>
            </div>
          </Link>
        </section>
      )}
    </div>
  );
}
