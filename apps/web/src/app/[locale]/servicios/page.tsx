import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "servicios" });
  return {
    title: t("title"),
    description: t("01title"),
  };
}

const SERVICE_KEYS = ["01", "02", "03", "04"] as const;

export default async function ServiciosPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "servicios" });

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <section className="max-w-[1100px] mx-auto px-6 mb-16">
        <span className="font-body text-[10px] font-medium tracking-[0.4em] uppercase text-brand-gris-nav">
          {t("title")}
        </span>
        <h1 className="font-heading text-5xl md:text-7xl text-brand-negro mt-4 leading-[1.05]">
          {t("title")}
        </h1>
      </section>

      <section className="max-w-[1100px] mx-auto px-6">
        <ul className="divide-y divide-brand-crema">
          {SERVICE_KEYS.map((num) => (
            <li
              key={num}
              className="grid md:grid-cols-12 gap-6 md:gap-10 py-12 md:py-16"
            >
              <div className="md:col-span-2">
                <span className="font-heading text-5xl md:text-6xl text-brand-gris-nav/40 tabular-nums leading-none">
                  {num}
                </span>
              </div>
              <div className="md:col-span-10 max-w-2xl">
                <h2 className="font-heading text-2xl md:text-4xl text-brand-negro leading-tight">
                  {t(`${num}title`)}
                </h2>
                <p className="font-body font-light text-base md:text-lg text-brand-negro-suave mt-5 leading-relaxed">
                  {t(`${num}body`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
