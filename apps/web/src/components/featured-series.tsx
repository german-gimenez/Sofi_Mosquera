import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cldArtwork, cldSrcSet } from "@sofi/ui";
import { pickLocale } from "@/lib/i18n-helpers";
import type { Locale } from "@/i18n/routing";

interface FeaturedSeriesProps {
  serie: {
    slug: string;
    title: string;
    titleEn?: string | null;
    description?: string | null;
    descriptionEn?: string | null;
    coverUrl?: string | null;
  };
  /** Hero image of one of the series' artworks (the visual hook). */
  heroImagePublicId: string | null;
  /** Number of available works in the series. */
  availableCount: number;
  totalCount: number;
}

/**
 * Featured series block on home — rotating monthly serie spotlight.
 *
 * Layout: 2-col on desktop. Image left + text right (or alternating).
 * CTA: "Explorar serie" → /arte (filtrado pendiente; jerarquía [serie] no implementada).
 */
export function FeaturedSeries({
  serie,
  heroImagePublicId,
  availableCount,
  totalCount,
}: FeaturedSeriesProps) {
  const t = useTranslations("home");
  const tArte = useTranslations("arte");
  const locale = useLocale() as Locale;

  const title = pickLocale(serie.title, serie.titleEn ?? null, locale);
  const description = pickLocale(
    serie.description ?? null,
    serie.descriptionEn ?? null,
    locale
  );

  return (
    <section
      className="max-w-[1440px] mx-auto px-6 py-16 md:py-24"
      aria-labelledby="featured-series-title"
    >
      <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Image */}
        <div className="aspect-[4/5] bg-brand-crema overflow-hidden order-2 md:order-1">
          {heroImagePublicId ? (
            <img
              src={cldArtwork(heroImagePublicId)}
              srcSet={cldSrcSet(heroImagePublicId, [480, 768, 1200, 1920], {
                h: 2400,
                crop: "fit",
              })}
              sizes="(max-width: 768px) 100vw, 50vw"
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-heading text-[10vw] text-brand-gris-border/30">
                {title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="order-1 md:order-2">
          <span className="font-body text-[10px] tracking-[0.4em] uppercase text-brand-gris-nav">
            {t("featuredSeriesEyebrow")}
          </span>
          <h2
            id="featured-series-title"
            className="font-heading text-4xl md:text-6xl text-brand-negro mt-4 leading-[1.05]"
          >
            {title}
          </h2>
          {description && (
            <p className="font-body font-light text-base md:text-lg text-brand-negro-suave mt-6 leading-relaxed max-w-md">
              {description}
            </p>
          )}
          <p className="font-body text-sm text-brand-gris-nav mt-6">
            {availableCount}/{totalCount} {tArte("obras")} ·{" "}
            <span className="text-brand-negro">
              {availableCount} {tArte("available").toLowerCase()}
            </span>
          </p>
          {/* La jerarquía /arte/[serie] todavía no está implementada — linkeamos a /arte con anchor a la serie. */}
          <Link
            href="/arte"
            className="inline-block mt-8 font-body text-sm font-medium tracking-[0.15em] uppercase text-brand-negro border-b border-brand-negro pb-1 hover:text-brand-gris-nav hover:border-brand-gris-nav transition-colors"
          >
            {t("featuredSeriesCTA")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
