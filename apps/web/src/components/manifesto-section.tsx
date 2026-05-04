import { useTranslations } from "next-intl";

/**
 * Manifesto section — copy from Lovable.
 * "Una sola mano, una sola visión" — narrative anchor on home.
 */
export function ManifestoSection() {
  const t = useTranslations("home");

  return (
    <section
      className="bg-brand-crema"
      aria-labelledby="manifesto-title"
    >
      <div className="max-w-[1100px] mx-auto px-6 py-20 md:py-[140px] text-center">
        <span className="font-body text-[10px] tracking-[0.4em] uppercase text-brand-gris-nav block">
          {t("manifestoEyebrow")}
        </span>
        <h2
          id="manifesto-title"
          className="font-heading text-4xl md:text-6xl text-brand-negro mt-6 leading-[1.05] tracking-tight"
        >
          {t("manifestoTitle")}
        </h2>
        <div className="mt-8 md:mt-12 max-w-2xl mx-auto space-y-5">
          <p className="font-body font-light text-base md:text-lg text-brand-negro-suave leading-relaxed">
            {t("manifestoBody1")}
          </p>
          <p className="font-body font-light text-base md:text-lg text-brand-negro-suave leading-relaxed">
            {t("manifestoBody2")}
          </p>
        </div>
      </div>
    </section>
  );
}
