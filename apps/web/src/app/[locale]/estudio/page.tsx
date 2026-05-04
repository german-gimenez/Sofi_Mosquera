import { SectionReveal, WhatsAppCTA, WHATSAPP_MESSAGES, cldPortrait, cldSrcSet } from "@sofi/ui";
import { createDb, settings, eq } from "@sofi/db";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "estudio" });
  return { title: t("title") };
}

export default async function EstudioPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "estudio" });

  const db = createDb();
  const [photosSetting] = await db
    .select().from(settings).where(eq(settings.key, "about_photos")).limit(1);
  const photos = (photosSetting?.value as string[]) ?? [];
  const heroPhoto = photos[0];

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <section className="max-w-[1100px] mx-auto px-6">
        <SectionReveal>
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="max-w-lg">
              <span className="font-body text-[10px] font-medium tracking-[0.4em] uppercase text-brand-gris-nav">
                {t("team")}
              </span>
              <h1 className="font-heading text-5xl md:text-6xl mt-4 text-brand-negro leading-[1.05]">
                Sofía Mosquera
              </h1>
              <p className="font-body font-light text-base md:text-lg text-brand-negro-suave mt-6 leading-relaxed">
                SM Studio es un estudio de diseño dirigido por Sofía Mosquera,
                que integra interiorismo, muebles a medida y arte original
                en un único proceso creativo.
              </p>
              <p className="font-body font-light text-base md:text-lg text-brand-negro-suave mt-4 leading-relaxed">
                A diferencia de otros estudios, creemos que un espacio
                verdaderamente único no puede diseñarse por partes. El espacio,
                los muebles y las obras que lo habitan nacen de la misma visión
                y de la misma mano. Eso no lo hace nadie más.
              </p>
              <p className="font-body font-light text-base md:text-lg text-brand-negro-suave mt-4 leading-relaxed">
                El espacio donde vivís y trabajás dice algo sobre vos. Cuando no
                te representa, lo sentís. Creamos experiencias de espacio:
                diseñamos el interiorismo, fabricamos los muebles y creamos las
                obras de arte —todo desde la misma visión.
              </p>
              <div className="flex gap-4 mt-10">
                <Link
                  href="/proyectos"
                  className="font-body text-sm font-medium tracking-[0.15em] uppercase text-brand-negro border-b border-brand-negro pb-1 hover:text-brand-gris-nav hover:border-brand-gris-nav transition-colors"
                >
                  {t("ctaProyectos")}
                </Link>
                <Link
                  href="/contacto"
                  className="font-body text-sm font-medium tracking-[0.15em] uppercase text-brand-gris-nav border-b border-brand-gris-nav pb-1 hover:text-brand-negro hover:border-brand-negro transition-colors"
                >
                  {t("ctaContacto")}
                </Link>
              </div>
            </div>
            <div className="aspect-[4/5] bg-brand-crema overflow-hidden">
              {heroPhoto ? (
                <img
                  src={cldPortrait(heroPhoto)}
                  srcSet={cldSrcSet(heroPhoto, [480, 768, 1000, 1200], {
                    h: 1500, crop: "fill", g: "face:auto", effect: "sharpen:100",
                  })}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt="Sofía Mosquera"
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-heading text-[15vw] text-brand-gris-border/30">SM</span>
                </div>
              )}
            </div>
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}
