import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArtworkCard, type ArtworkCardData } from "./artwork-card";

interface ArtFeaturedProps {
  artworks: ArtworkCardData[];
}

/**
 * Home page art-commerce strip — high-priority art visibility.
 *
 * Desktop: 4-column grid.
 * Mobile: horizontal snap scroll (3 cards visible at once).
 *
 * Uses ArtworkCard with showPrice + showContextOnHover for commerce signals.
 * Position: directly below hero, above project grid (key business priority).
 */
export function ArtFeatured({ artworks }: ArtFeaturedProps) {
  const t = useTranslations("home");

  if (artworks.length === 0) return null;

  return (
    <section
      className="relative max-w-[1440px] mx-auto px-6 pt-16 md:pt-24 pb-16 md:pb-24"
      aria-labelledby="art-featured-title"
    >
      <div className="flex items-end justify-between gap-6 mb-10 md:mb-12">
        <div className="max-w-2xl">
          <span className="font-body text-[10px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
            {t("artFeaturedEyebrow")}
          </span>
          <h2
            id="art-featured-title"
            className="font-heading text-3xl md:text-5xl mt-3 text-brand-negro leading-[1.1]"
          >
            {t("artFeaturedTitle")}
          </h2>
          <p className="font-body font-light text-sm md:text-base text-brand-negro-suave mt-3 max-w-md">
            {t("artFeaturedSubtitle")}
          </p>
        </div>
        <Link
          href="/arte"
          className="hidden md:inline-block font-body text-sm font-light tracking-[0.1em] uppercase text-brand-negro border-b border-brand-negro pb-1 hover:text-brand-gris-nav hover:border-brand-gris-nav transition-colors whitespace-nowrap"
        >
          {t("artFeaturedCTA")} →
        </Link>
      </div>

      {/* Mobile: horizontal scroll, Desktop: 4-col grid */}
      <div className="md:hidden -mx-6 px-6 overflow-x-auto snap-x snap-mandatory scrollbar-thin">
        <ul className="flex gap-4 pb-4">
          {artworks.map((art, i) => (
            <li
              key={art.slug}
              className="flex-shrink-0 w-[68vw] max-w-[300px] snap-start"
            >
              <ArtworkCard artwork={art} priority={i === 0} />
            </li>
          ))}
        </ul>
      </div>

      <ul className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {artworks.map((art, i) => (
          <li key={art.slug}>
            <ArtworkCard artwork={art} priority={i === 0} />
          </li>
        ))}
      </ul>

      <div className="mt-10 md:hidden text-center">
        <Link
          href="/arte"
          className="inline-block font-body text-sm font-light tracking-[0.1em] uppercase text-brand-negro border-b border-brand-negro pb-1"
        >
          {t("artFeaturedCTA")} →
        </Link>
      </div>
    </section>
  );
}
