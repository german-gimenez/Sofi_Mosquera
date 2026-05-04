import { cldHero, cldSrcSet } from "@sofi/ui";
import { getTranslations } from "next-intl/server";

interface HeroProps {
  /** Cloudinary public_id for the hero background image. */
  coverPublicId: string | null | undefined;
  /** Optional override for caption/subtitle, falls back to translations. */
  eyebrow?: string;
  headline?: string;
  body?: string;
}

/**
 * Hero V3 — Lovable-aligned.
 *
 * Fullscreen background image with subtle Ken Burns animation.
 * Caption block bottom-left: eyebrow + headline + body.
 * No SM logo overlay (logo lives in nav). No CTA buttons (manifesto-only copy).
 *
 * Server component: reads translations server-side; image is eager + high priority for LCP.
 */
export async function Hero({ coverPublicId, eyebrow, headline, body }: HeroProps) {
  const t = await getTranslations("home");
  const eb = eyebrow ?? t("heroEyebrow");
  const hl = headline ?? t("heroHeadline");
  const bd = body ?? t("heroBody");

  const fallback = !coverPublicId;

  return (
    <section
      className="relative w-full h-screen min-h-[600px] overflow-hidden bg-brand-negro"
      aria-label={hl}
    >
      <div className="absolute inset-0">
        {fallback ? (
          <div className="w-full h-full bg-brand-crema flex items-center justify-center">
            <span className="font-heading text-[20vw] text-brand-gris-border/30 select-none">
              SM
            </span>
          </div>
        ) : (
          <img
            src={cldHero(coverPublicId)}
            srcSet={cldSrcSet(coverPublicId, [800, 1200, 1600, 1920, 2560], {
              h: 1440,
              crop: "fill",
              g: "center",
            })}
            sizes="100vw"
            alt=""
            className="w-full h-full object-cover animate-ken-burns"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />
        )}
      </div>

      {/* Gradient overlay for caption legibility */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-brand-negro/55 via-brand-negro/10 to-brand-negro/15 pointer-events-none"
        aria-hidden="true"
      />

      {/* Caption bottom-left */}
      <div className="absolute bottom-10 md:bottom-14 left-6 md:left-12 right-6 md:right-12 max-w-2xl">
        <span className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-blanco-calido/85 block">
          {eb}
        </span>
        <h1 className="font-heading text-5xl md:text-7xl text-brand-blanco-calido mt-4 leading-[1.05]">
          {hl}
        </h1>
        <p className="font-body font-light text-sm md:text-base text-brand-blanco-calido/85 mt-5 leading-relaxed max-w-xl">
          {bd}
        </p>
      </div>
    </section>
  );
}
