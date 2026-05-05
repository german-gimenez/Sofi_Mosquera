import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { createDb, artworks, series, asc, desc } from "@sofi/db";
import { routing } from "@/i18n/routing";
import { ArtworkCard } from "@/components/artwork-card";
import { pickLocale } from "@/lib/i18n-helpers";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "arte" });
  return {
    title: t("title"),
    description: t("intro"),
  };
}

export default async function ArtePage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "arte" });
  const lc = locale as Locale;

  const db = createDb();
  const [allArtworks, allSeries] = await Promise.all([
    db
      .select()
      .from(artworks)
      .orderBy(asc(artworks.position), desc(artworks.publishedAt)),
    db.select().from(series).orderBy(asc(series.position)),
  ]);

  const totalCount = allArtworks.length;
  const availableCount = allArtworks.filter(
    (a) => a.status === "disponible"
  ).length;
  const seriesCount = allSeries.length;

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <section className="max-w-[1100px] mx-auto px-6 mb-12 md:mb-16">
        <span className="font-body text-[10px] font-medium tracking-[0.4em] uppercase text-brand-gris-nav">
          {t("eyebrow")}
        </span>
        <h1 className="font-heading text-5xl md:text-7xl text-brand-negro mt-4 leading-[1.05]">
          {t("title")}
        </h1>
        <p className="font-body font-light text-base md:text-lg text-brand-negro-suave mt-6 max-w-2xl leading-relaxed">
          {t("intro")}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mt-10 md:mt-14 max-w-md">
          <div>
            <p className="font-heading text-3xl md:text-4xl text-brand-negro tabular-nums">
              {totalCount}
            </p>
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav">
              {t("obras")}
            </span>
          </div>
          <div>
            <p className="font-heading text-3xl md:text-4xl text-brand-negro tabular-nums">
              {availableCount}
            </p>
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav">
              {t("availableCount")}
            </span>
          </div>
          <div>
            <p className="font-heading text-3xl md:text-4xl text-brand-negro tabular-nums">
              {seriesCount}
            </p>
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav">
              {t("series")}
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-6 pb-12">
        {totalCount === 0 ? (
          <p className="font-body text-brand-gris-nav text-center py-20">
            {t("empty")}
          </p>
        ) : (
          <>
            {/* Per series listing */}
            {allSeries.map((s) => {
              const seriesArtworks = allArtworks.filter(
                (a) => a.seriesSlug === s.slug
              );
              if (seriesArtworks.length === 0) return null;
              const sTitle = pickLocale(s.title, s.titleEn ?? null, lc);
              const sDescription = pickLocale(
                s.description ?? null,
                s.descriptionEn ?? null,
                lc
              );
              const sAvailable = seriesArtworks.filter(
                (a) => a.status === "disponible"
              ).length;
              return (
                <div key={s.slug} className="mb-20 md:mb-28" id={s.slug}>
                  <header className="flex items-end justify-between gap-6 mb-8 md:mb-10">
                    <div className="max-w-2xl">
                      <span className="font-body text-[10px] tracking-[0.4em] uppercase text-brand-gris-nav block">
                        {t("series")}
                      </span>
                      <h2 className="font-heading text-3xl md:text-5xl text-brand-negro mt-2 leading-tight">
                        {sTitle}
                      </h2>
                      {sDescription && (
                        <p className="font-body font-light text-sm md:text-base text-brand-negro-suave mt-3 max-w-md">
                          {sDescription}
                        </p>
                      )}
                    </div>
                    <span className="font-body text-xs text-brand-gris-nav whitespace-nowrap">
                      {sAvailable}/{seriesArtworks.length}{" "}
                      {t("available").toLowerCase()}
                    </span>
                  </header>

                  <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {seriesArtworks.map((a, i) => (
                      <li key={a.slug}>
                        <ArtworkCard
                          artwork={{
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
                          }}
                          priority={i === 0}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* Orphan artworks (no seriesSlug or unmatched series) */}
            {(() => {
              const orphans = allArtworks.filter(
                (a) =>
                  !a.seriesSlug ||
                  !allSeries.some((s) => s.slug === a.seriesSlug)
              );
              if (orphans.length === 0) return null;
              return (
                <div className="mb-12">
                  <header className="mb-8">
                    <h2 className="font-heading text-3xl md:text-5xl text-brand-negro leading-tight">
                      {t("otherWorks")}
                    </h2>
                  </header>
                  <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {orphans.map((a) => (
                      <li key={a.slug}>
                        <ArtworkCard
                          artwork={{
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
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </>
        )}
      </section>
    </div>
  );
}
