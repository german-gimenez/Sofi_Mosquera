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
  const t = await getTranslations({ locale, namespace: "terms" });
  return { title: t("title"), description: t("metaDescription") };
}

export default async function TerminosPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "terms" });

  const sections = [
    { title: t("s1Title"), body: t("s1Body") },
    { title: t("s2Title"), body: t("s2Body") },
    {
      title: t("s3Title"),
      body: t("s3Body"),
      items: [t("s3Item1"), t("s3Item2"), t("s3Item3")],
    },
    { title: t("s4Title"), body: t("s4Body") },
    { title: t("s5Title"), body: t("s5Body") },
    { title: t("s6Title"), body: t("s6Body") },
    { title: t("s7Title"), body: t("s7Body") },
    { title: t("s8Title"), body: t("s8Body") },
    { title: t("s9Title"), body: t("s9Body") },
  ];

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <div className="max-w-[720px] mx-auto px-6">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav mb-4">
          {t("lastUpdated")}
        </p>
        <h1 className="font-heading text-4xl md:text-5xl font-light text-brand-negro leading-tight">
          {t("title")}
        </h1>
        <p className="font-body text-base font-light text-brand-negro-suave mt-6 leading-relaxed">
          {t("intro")}
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-heading text-xl md:text-2xl font-light text-brand-negro mb-3">
                {section.title}
              </h2>
              <p className="font-body text-sm font-light text-brand-negro-suave leading-relaxed whitespace-pre-line">
                {section.body}
              </p>
              {section.items && (
                <ul className="mt-3 space-y-1.5 pl-5">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="font-body text-sm font-light text-brand-negro-suave leading-relaxed list-disc"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
