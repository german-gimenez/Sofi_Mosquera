import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { createDb, artworks, series, eq, and, ne, desc, asc } from "@sofi/db";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  WhatsAppCTA,
  artworkMessage,
  cldArtwork,
  cldSrcSet,
} from "@sofi/ui";
import { ArtworkLightbox } from "@/components/artwork-lightbox";
import { ArtworkCard } from "@/components/artwork-card";
import {
  artworkVisualArtworkSchema,
  jsonLdScript,
} from "@/lib/structured-data";
import {
  pickLocale,
  formatPriceArs,
  formatPriceOrInquire,
} from "@/lib/i18n-helpers";
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
  const [artwork] = await db
    .select()
    .from(artworks)
    .where(eq(artworks.slug, slug))
    .limit(1);

  if (!artwork) return {};
  const lc = locale as Locale;
  const title = pickLocale(artwork.title, artwork.titleEn, lc);
  const technique = pickLocale(
    artwork.technique ?? null,
    artwork.techniqueEn ?? null,
    lc
  );
  const description =
    locale === "en"
      ? `${title} — ${technique ?? "Original artwork"} by Sofía Mosquera`
      : `${title} — ${technique ?? "Obra original"} de Sofía Mosquera`;
  return {
    title,
    description,
  };
}

export default async function ArtworkPage({ params }: Props) {
  const { slug, locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "arte" });
  const tCta = await getTranslations({ locale, namespace: "cta" });
  const lc = locale as Locale;

  const db = createDb();
  const [artwork] = await db
    .select()
    .from(artworks)
    .where(eq(artworks.slug, slug))
    .limit(1);

  if (!artwork) notFound();

  const [serieRow] = artwork.seriesSlug
    ? await db
        .select()
        .from(series)
        .where(eq(series.slug, artwork.seriesSlug))
        .limit(1)
    : [null];

  const related = artwork.seriesSlug
    ? await db
        .select()
        .from(artworks)
        .where(
          and(
            ne(artworks.slug, slug),
            eq(artworks.seriesSlug, artwork.seriesSlug)
          )
        )
        .orderBy(asc(artworks.position), desc(artworks.publishedAt))
        .limit(3)
    : [];

  const title = pickLocale(artwork.title, artwork.titleEn, lc);
  const technique = pickLocale(
    artwork.technique ?? null,
    artwork.techniqueEn ?? null,
    lc
  );
  const seriesTitle = serieRow
    ? pickLocale(serieRow.title, serieRow.titleEn ?? null, lc)
    : artwork.series ?? null;

  const isSold = artwork.status === "vendido";
  const isReserved = artwork.status === "reservado";

  const priceLabel = formatPriceOrInquire(
    artwork.priceArs,
    artwork.priceVisible !== false,
    lc,
    t("inquire")
  );
  const priceForCta =
    artwork.priceVisible !== false ? artwork.priceArs : null;

  const schema = artworkVisualArtworkSchema({
    title,
    slug: artwork.slug,
    technique,
    year: artwork.year,
    widthCm: artwork.widthCm,
    heightCm: artwork.heightCm,
    priceArs: artwork.priceArs,
    status: artwork.status,
    coverImageUrl: artwork.coverUrl ? cldArtwork(artwork.coverUrl) : null,
    locale: lc,
  });

  return (
    <div className="pt-28 md:pt-32 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(schema)}
      />
      <div className="max-w-6xl mx-auto px-6">
        <Link
          href="/arte"
          className="inline-block font-body text-sm text-brand-gris-nav border-b border-brand-gris-nav pb-0.5 hover:text-brand-negro hover:border-brand-negro transition-colors mb-10"
        >
          {t("back")}
        </Link>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Left: artwork image + context */}
          <div className="space-y-4">
            {artwork.coverUrl ? (
              <ArtworkLightbox
                publicId={artwork.coverUrl}
                title={title}
              />
            ) : (
              <div className="aspect-[3/4] bg-brand-crema overflow-hidden flex items-center justify-center">
                <span className="font-heading text-[15vw] text-brand-gris-border/30">
                  {title.charAt(0)}
                </span>
              </div>
            )}

            {artwork.contextUrl && (
              <div className="aspect-[16/10] bg-brand-crema overflow-hidden">
                <img
                  src={cldArtwork(artwork.contextUrl)}
                  srcSet={cldSrcSet(
                    artwork.contextUrl,
                    [480, 768, 1200, 1600],
                    { h: 1200, crop: "fill", g: "auto" }
                  )}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt={`${title} — ${t("inSpace")}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
          </div>

          {/* Right: details + CTA */}
          <div className="md:py-2 md:sticky md:top-32">
            {seriesTitle && (
              <span className="font-body text-[10px] tracking-[0.4em] uppercase text-brand-gris-nav block">
                {t("series")} · {seriesTitle}
              </span>
            )}
            <h1 className="font-heading text-4xl md:text-5xl text-brand-negro mt-2 leading-tight">
              {title}
            </h1>

            <div className="mt-6 flex items-baseline gap-4">
              {isSold ? (
                <span className="font-body text-[10px] tracking-[0.3em] uppercase bg-brand-negro text-brand-blanco-calido px-3 py-1.5">
                  {t("sold")}
                </span>
              ) : isReserved ? (
                <span className="font-body text-[10px] tracking-[0.3em] uppercase bg-brand-negro-suave text-brand-blanco-calido px-3 py-1.5">
                  {t("reserved")}
                </span>
              ) : (
                <p
                  className={`font-body text-2xl font-light tabular-nums ${
                    artwork.priceVisible === false || artwork.priceArs == null
                      ? "text-brand-gris-nav italic"
                      : "text-brand-negro"
                  }`}
                >
                  {priceLabel}
                </p>
              )}
            </div>

            <dl className="mt-8 divide-y divide-brand-crema">
              {technique && (
                <div className="flex justify-between gap-4 py-3">
                  <dt className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav">
                    {t("details.technique")}
                  </dt>
                  <dd className="font-body text-sm text-brand-negro text-right">
                    {technique}
                  </dd>
                </div>
              )}
              {artwork.widthCm && artwork.heightCm && (
                <div className="flex justify-between gap-4 py-3">
                  <dt className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav">
                    {t("details.dimensions")}
                  </dt>
                  <dd className="font-body text-sm text-brand-negro text-right">
                    {artwork.widthCm} × {artwork.heightCm} cm
                  </dd>
                </div>
              )}
              {artwork.year && (
                <div className="flex justify-between gap-4 py-3">
                  <dt className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav">
                    {t("details.year")}
                  </dt>
                  <dd className="font-body text-sm text-brand-negro text-right">
                    {artwork.year}
                  </dd>
                </div>
              )}
            </dl>

            {!isSold && (
              <div className="mt-10">
                <WhatsAppCTA
                  label={t("buyCTA")}
                  message={artworkMessage(
                    title,
                    {
                      series: seriesTitle ?? undefined,
                      widthCm: artwork.widthCm,
                      heightCm: artwork.heightCm,
                      technique: technique,
                      priceArs: priceForCta,
                    },
                    lc
                  )}
                  ariaLabel={`${tCta("whatsapp")} — ${title}`}
                  className="w-full justify-center"
                />
              </div>
            )}

            {/* Commerce details */}
            <div className="mt-10 p-5 bg-brand-crema space-y-2">
              <p className="font-body text-xs text-brand-negro-suave leading-relaxed">
                <strong className="font-medium">
                  {t("details.certificate")}:
                </strong>{" "}
                {t("certificateBody")}
              </p>
              <p className="font-body text-xs text-brand-negro-suave leading-relaxed">
                <strong className="font-medium">
                  {t("details.shipping")}:
                </strong>{" "}
                {t("shippingBody")}
              </p>
              <p className="font-body text-xs text-brand-negro-suave leading-relaxed">
                <strong className="font-medium">
                  {t("details.payment")}:
                </strong>{" "}
                {t("paymentBody")}
              </p>
            </div>
          </div>
        </div>

        {/* Related works */}
        {related.length > 0 && (
          <section className="mt-24 md:mt-32">
            <h2 className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav mb-8">
              {t("otrasObras")}
              {seriesTitle && ` · ${seriesTitle}`}
            </h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {related.map((a) => (
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
          </section>
        )}
      </div>
    </div>
  );
}
