import { SectionReveal, WhatsAppCTA, WHATSAPP_MESSAGES } from "@sofi/ui";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "contacto" });
  return { title: t("title") };
}

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contacto" });

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <section className="max-w-[900px] mx-auto px-6">
        <SectionReveal>
          <div className="text-center mb-12">
            <span className="font-body text-[10px] font-medium tracking-[0.4em] uppercase text-brand-gris-nav block">
              {t("intro")}
            </span>
            <h1 className="font-heading text-5xl md:text-7xl text-brand-negro mt-4 leading-[1.05]">
              {t("title")}
            </h1>
          </div>
        </SectionReveal>

        <SectionReveal>
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Info */}
            <div className="space-y-6">
              <div>
                <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav block mb-1">
                  {t("address")}
                </span>
                <p className="font-body text-sm text-brand-negro whitespace-pre-line">
                  {t("addressValue")}
                </p>
              </div>
              <div>
                <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav block mb-1">
                  {t("email")}
                </span>
                <a href="mailto:smosquera@sofimosquera.com" className="font-body text-sm font-bold text-brand-negro hover:text-brand-negro-suave transition-colors">
                  smosquera@sofimosquera.com
                </a>
              </div>
              <div>
                <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav block mb-1">
                  {t("phone")}
                </span>
                <a href="tel:+5492615456913" className="font-body text-sm text-brand-negro hover:text-brand-gris-nav transition-colors">
                  +54 9 261 545 6913
                </a>
              </div>
              <div>
                <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav block mb-1">
                  {t("instagram")}
                </span>
                <a href="https://instagram.com/sofiamosquera.interiorismo" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-brand-negro hover:text-brand-gris-nav transition-colors">
                  @sofiamosquera.interiorismo
                </a>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Besares+271B,+Chacras+de+Coria,+Luj%C3%A1n+de+Cuyo,+Mendoza,+Argentina"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-body text-sm font-light tracking-[0.1em] uppercase text-brand-negro border-b border-brand-negro pb-1 hover:text-brand-gris-nav hover:border-brand-gris-nav transition-colors mt-2"
              >
                {t("openMaps")}
              </a>
            </div>

            {/* Contact form */}
            <form action="/api/contact" method="POST" className="space-y-5">
              <input type="hidden" name="locale" value={locale} />
              <div>
                <label htmlFor="name" className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav block mb-2">{t("form.name")}</label>
                <input id="name" name="name" required className="w-full bg-transparent border-b border-brand-gris-border focus:border-brand-negro outline-none py-2 font-body text-sm text-brand-negro transition-colors" />
              </div>
              <div>
                <label htmlFor="email" className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav block mb-2">{t("form.email")}</label>
                <input id="email" name="email" type="email" required className="w-full bg-transparent border-b border-brand-gris-border focus:border-brand-negro outline-none py-2 font-body text-sm text-brand-negro transition-colors" />
              </div>
              <div>
                <label htmlFor="subject" className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav block mb-2">{t("form.subject")}</label>
                <input id="subject" name="subject" className="w-full bg-transparent border-b border-brand-gris-border focus:border-brand-negro outline-none py-2 font-body text-sm text-brand-negro transition-colors" />
              </div>
              <div>
                <label htmlFor="message" className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav block mb-2">{t("form.message")}</label>
                <textarea id="message" name="message" rows={4} className="w-full bg-transparent border-b border-brand-gris-border focus:border-brand-negro outline-none py-2 font-body text-sm text-brand-negro transition-colors resize-none" />
              </div>
              {/* honeypot */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
                <input type="text" name="_hp" tabIndex={-1} autoComplete="off" />
              </div>
              <button type="submit" className="font-body text-sm font-medium tracking-[0.15em] uppercase bg-brand-negro text-brand-blanco-calido px-8 py-3 hover:bg-brand-negro-suave transition-colors">
                {t("form.submit")}
              </button>
            </form>
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}
