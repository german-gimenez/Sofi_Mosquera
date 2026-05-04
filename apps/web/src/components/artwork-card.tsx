"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cldArtwork, cldSrcSet, cn } from "@sofi/ui";
import { ArtworkTilt } from "./artwork-tilt";
import { formatPriceOrInquire } from "@/lib/i18n-helpers";
import type { Locale } from "@/i18n/routing";

export interface ArtworkCardData {
  slug: string;
  seriesSlug: string | null;
  title: string;
  titleEn?: string | null;
  technique?: string | null;
  techniqueEn?: string | null;
  widthCm?: number | null;
  heightCm?: number | null;
  priceArs?: number | null;
  priceVisible?: boolean;
  status: string;
  coverUrl: string | null;
  contextUrl?: string | null;
}

interface ArtworkCardProps {
  artwork: ArtworkCardData;
  /** Show tilt 3D hover. Default: true. */
  showTilt?: boolean;
  /** Show price next to title. Default: true. */
  showPrice?: boolean;
  /** Toggle to context image (cuadro en pared) on hover. Default: true if contextUrl. */
  showContextOnHover?: boolean;
  /** Eager load first card for LCP. */
  priority?: boolean;
}

export function ArtworkCard({
  artwork,
  showTilt = true,
  showPrice = true,
  showContextOnHover = true,
  priority = false,
}: ArtworkCardProps) {
  const t = useTranslations("arte");
  const locale = useLocale() as Locale;

  const title =
    locale === "en" && artwork.titleEn ? artwork.titleEn : artwork.title;
  const technique =
    locale === "en" && artwork.techniqueEn
      ? artwork.techniqueEn
      : artwork.technique;
  const dims =
    artwork.widthCm && artwork.heightCm
      ? `${artwork.widthCm} × ${artwork.heightCm} cm`
      : null;
  const meta = [technique, dims].filter(Boolean).join(" · ");

  const isSold = artwork.status === "vendido";
  const isReserved = artwork.status === "reservado";
  const priceLabel = formatPriceOrInquire(
    artwork.priceArs,
    artwork.priceVisible !== false,
    locale,
    t("inquire")
  );

  // Routing: por ahora la jerarquía /arte/[serie]/[obra] no está implementada como filesystem.
  // Usamos la ruta plana /arte/[slug]; el campo seriesSlug se sigue exponiendo en la card pero no en la URL.
  const href = {
    pathname: "/arte/[slug]",
    params: { slug: artwork.slug },
  } as const;

  const hasContext =
    showContextOnHover && artwork.contextUrl && !isSold && !isReserved;

  const card = (
    <div className="artwork-card relative aspect-[3/4] bg-brand-crema overflow-hidden">
      {artwork.coverUrl ? (
        <img
          src={cldArtwork(artwork.coverUrl)}
          srcSet={cldSrcSet(artwork.coverUrl, [480, 768, 1200, 1920], {
            h: 2560,
            crop: "fit",
          })}
          sizes="(max-width: 768px) 75vw, (max-width: 1024px) 40vw, 25vw"
          alt={title}
          className="w-full h-full object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          role="img"
          aria-label={title}
        >
          <span className="font-heading text-5xl text-brand-gris-border/40">
            {title.charAt(0)}
          </span>
        </div>
      )}

      {hasContext && artwork.contextUrl && (
        <img
          src={cldArtwork(artwork.contextUrl)}
          alt=""
          aria-hidden="true"
          className="artwork-context absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      )}

      {isSold && (
        <span className="absolute top-3 right-3 font-body text-[9px] tracking-[0.2em] uppercase bg-brand-negro text-brand-blanco-calido px-2.5 py-1">
          {t("sold")}
        </span>
      )}
      {isReserved && (
        <span className="absolute top-3 right-3 font-body text-[9px] tracking-[0.2em] uppercase bg-brand-negro-suave text-brand-blanco-calido px-2.5 py-1">
          {t("reserved")}
        </span>
      )}
    </div>
  );

  return (
    <Link href={href} className="group block">
      {showTilt ? <ArtworkTilt maxTilt={4}>{card}</ArtworkTilt> : card}

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="font-heading text-lg md:text-xl text-brand-negro group-hover:text-brand-gris-nav transition-colors leading-tight truncate">
          {title}
        </h3>
        {showPrice && !isSold && (
          <span
            className={cn(
              "font-body text-sm font-light shrink-0 tabular-nums",
              artwork.priceVisible === false || artwork.priceArs == null
                ? "text-brand-gris-nav italic"
                : "text-brand-negro"
            )}
          >
            {priceLabel}
          </span>
        )}
      </div>
      {meta && (
        <p className="font-body text-xs text-brand-gris-nav mt-0.5">{meta}</p>
      )}
    </Link>
  );
}
