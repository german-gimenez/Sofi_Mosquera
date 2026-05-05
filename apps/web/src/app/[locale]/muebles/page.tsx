import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { createDb, furniture, eq, asc, desc } from "@sofi/db";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  WhatsAppCTA,
  WHATSAPP_MESSAGES_I18N,
  cldCard,
  cldSrcSet,
} from "@sofi/ui";
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
  const t = await getTranslations({ locale, namespace: "muebles" });
  return {
    title: t("title"),
    description: t("tagline"),
  };
}

export default async function MueblesPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "muebles" });
  const lc = locale as Locale;

  const db = createDb();
  // M-01: filter only catalog pieces (visible to public)
  const catalogPieces = await db
    .select()
    .from(furniture)
    .where(eq(furniture.isCatalog, true))
    .orderBy(asc(furniture.position), desc(furniture.publishedAt));

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
          {t("tagline")}
        </p>
      </section>

      {catalogPieces.length > 0 ? (
        <section className="max-w-[1440px] mx-auto px-6 pb-12">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
            {catalogPieces.map((piece, i) => {
              const aspect = i % 3 === 1 ? "aspect-[3/4]" : "aspect-[4/5]";
              const title = pickLocale(piece.title, piece.titleEn, lc);
              const materials = pickLocale(
                piece.materials ?? null,
                piece.materialsEn ?? null,
                lc
              );
              const firstMaterial = materials
                ?.split(/[,·/]/)[0]
                ?.trim();
              return (
                <Link
                  key={piece.id}
                  href={{
                    pathname: "/muebles/[slug]",
                    params: { slug: piece.slug },
                  }}
                  className="group mb-4 block break-inside-avoid"
                >
                  <div
                    className={`bg-brand-crema overflow-hidden relative ${aspect}`}
                  >
                    {piece.coverUrl ? (
                      <img
                        src={cldCard(piece.coverUrl)}
                        srcSet={cldSrcSet(
                          piece.coverUrl,
                          [480, 768, 1200, 1920],
                          { h: 2400, crop: "fill", g: "auto" }
                        )}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
                        loading={i < 3 ? "eager" : "lazy"}
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
                  </div>
                  <div className="mt-3">
                    <h3 className="font-heading text-lg text-brand-negro group-hover:text-brand-gris-nav transition-colors">
                      {title}
                    </h3>
                    {firstMaterial && (
                      <p className="font-body text-xs text-brand-gris-nav mt-0.5">
                        {firstMaterial}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="max-w-3xl mx-auto px-6 pb-12">
          <div className="bg-brand-crema p-10 md:p-14 text-center">
            <h2 className="font-heading text-2xl md:text-3xl text-brand-negro mb-4">
              {t("comingSoon")}
            </h2>
            <p className="font-body font-light text-sm md:text-base text-brand-negro-suave max-w-lg mx-auto mb-8">
              {t("placeholder")}
            </p>
            <WhatsAppCTA
              label={t("consultCTA")}
              message={WHATSAPP_MESSAGES_I18N["muebles-custom"][lc]}
            />
          </div>
        </section>
      )}

      {catalogPieces.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 pb-16 mt-12">
          <div className="bg-brand-crema p-10 text-center">
            <h2 className="font-heading text-2xl text-brand-negro mb-3">
              {t("personalizeTitle")}
            </h2>
            <p className="font-body text-brand-negro-suave mb-6 max-w-xl mx-auto">
              {t("personalizeBody")}
            </p>
            <WhatsAppCTA
              label={t("personalizeCTA")}
              message={WHATSAPP_MESSAGES_I18N["muebles-personalize"][lc]}
            />
          </div>
        </section>
      )}
    </div>
  );
}
