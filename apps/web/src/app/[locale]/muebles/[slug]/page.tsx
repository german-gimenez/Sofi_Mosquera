import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import {
  createDb,
  furniture,
  eq,
  ne,
  desc,
  asc,
  and,
} from "@sofi/db";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  WhatsAppCTA,
  furnitureMessage,
  cldGallery,
  cldCard,
  cldSrcSet,
} from "@sofi/ui";
import { pickLocale, formatPriceArs } from "@/lib/i18n-helpers";
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
  const [piece] = await db
    .select()
    .from(furniture)
    .where(eq(furniture.slug, slug))
    .limit(1);
  if (!piece) return {};
  const lc = locale as Locale;
  const title = pickLocale(piece.title, piece.titleEn, lc);
  const description = pickLocale(
    piece.description ?? null,
    piece.descriptionEn ?? null,
    lc
  );
  return {
    title,
    description: description ?? undefined,
  };
}

export default async function FurniturePage({ params }: Props) {
  const { slug, locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "muebles" });
  const lc = locale as Locale;

  const db = createDb();
  const [piece] = await db
    .select()
    .from(furniture)
    .where(eq(furniture.slug, slug))
    .limit(1);

  if (!piece) notFound();

  const related = await db
    .select()
    .from(furniture)
    .where(and(ne(furniture.slug, slug), eq(furniture.isCatalog, true)))
    .orderBy(asc(furniture.position), desc(furniture.featured))
    .limit(3);

  const title = pickLocale(piece.title, piece.titleEn, lc);
  const description = pickLocale(
    piece.description ?? null,
    piece.descriptionEn ?? null,
    lc
  );
  const materials = pickLocale(
    piece.materials ?? null,
    piece.materialsEn ?? null,
    lc
  );
  const gallery = (piece.gallery as string[]) ?? [];
  const priceFormatted = piece.priceArs
    ? formatPriceArs(piece.priceArs, lc)
    : null;

  return (
    <div className="pt-28 md:pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <Link
          href="/muebles"
          className="inline-block font-body text-sm text-brand-gris-nav border-b border-brand-gris-nav pb-0.5 hover:text-brand-negro hover:border-brand-negro transition-colors mb-10"
        >
          {t("back")}
        </Link>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="aspect-[4/3] bg-brand-crema overflow-hidden">
            {piece.coverUrl ? (
              <img
                src={cldGallery(piece.coverUrl)}
                srcSet={cldSrcSet(piece.coverUrl, [600, 900, 1200, 1600], {
                  h: 1200,
                  crop: "fill",
                  g: "auto",
                })}
                sizes="(max-width: 768px) 100vw, 50vw"
                alt={title}
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                role="img"
                aria-label={title}
              >
                <span className="font-heading text-[10vw] text-brand-gris-border/30">
                  {title.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="py-4">
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav">
              {t("eyebrow")}
            </span>
            <h1 className="font-heading text-4xl text-brand-negro mt-2">
              {title}
            </h1>

            {priceFormatted && (
              <p className="font-body text-2xl font-light text-brand-negro mt-4 tabular-nums">
                {t("priceFrom")} {priceFormatted}
              </p>
            )}

            {description && (
              <p className="font-body font-light text-brand-negro-suave mt-6 leading-relaxed">
                {description}
              </p>
            )}

            <dl className="mt-8 divide-y divide-brand-crema">
              {materials && (
                <div className="flex justify-between gap-4 py-3">
                  <dt className="font-body text-[9px] tracking-[0.25em] uppercase text-brand-gris-nav">
                    {t("materials")}
                  </dt>
                  <dd className="font-body text-sm text-right">
                    {materials}
                  </dd>
                </div>
              )}
              {piece.dimensions && (
                <div className="flex justify-between gap-4 py-3">
                  <dt className="font-body text-[9px] tracking-[0.25em] uppercase text-brand-gris-nav">
                    {t("dimensions")}
                  </dt>
                  <dd className="font-body text-sm text-right">
                    {piece.dimensions}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-10">
              <WhatsAppCTA
                label={t("consultPiece")}
                message={furnitureMessage(title, lc)}
                ariaLabel={`WhatsApp ${title}`}
                className="w-full justify-center"
              />
            </div>

            <div className="mt-8 p-5 bg-brand-crema">
              <p className="font-body text-xs text-brand-negro-suave leading-relaxed">
                <strong className="font-medium">{t("custom")}:</strong>{" "}
                {t("customBody")}
              </p>
            </div>
          </div>
        </div>

        {gallery.length > 0 && (
          <div className="mt-16 grid grid-cols-2 gap-4">
            {gallery.map((publicId, i) => (
              <div
                key={publicId}
                className="aspect-[4/3] bg-brand-crema overflow-hidden"
              >
                <img
                  src={cldGallery(publicId)}
                  srcSet={cldSrcSet(publicId, [400, 800, 1200], {
                    h: 900,
                    crop: "fill",
                    g: "auto",
                  })}
                  sizes="(max-width: 768px) 50vw, 33vw"
                  alt={`${title} — ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <section className="mt-24 pb-12">
            <h2 className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav mb-8">
              {t("otherPieces")}
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((p) => {
                const pTitle = pickLocale(p.title, p.titleEn, lc);
                return (
                  <Link
                    key={p.id}
                    href={{
                      pathname: "/muebles/[slug]",
                      params: { slug: p.slug },
                    }}
                    className="group block"
                  >
                    <div className="aspect-[4/3] bg-brand-crema overflow-hidden mb-3">
                      {p.coverUrl ? (
                        <img
                          src={cldCard(p.coverUrl)}
                          alt={pTitle}
                          className="w-full h-full object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          role="img"
                          aria-label={pTitle}
                        >
                          <span className="font-heading text-5xl text-brand-gris-border/40">
                            {pTitle.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-heading text-base text-brand-negro group-hover:text-brand-gris-nav transition-colors">
                      {pTitle}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
