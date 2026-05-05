import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";

/**
 * Footer V3 — Lovable-aligned (F-01).
 *
 * Single centred block (no 4-col layout from v2).
 * Wordmark logo at top + name + email (bold) + phone + address + Instagram.
 * Hover darkens links.
 */
export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const year = new Date().getFullYear();

  const homeHref =
    locale === "en" ? "/en" : "/es";

  return (
    <footer className="border-t border-brand-crema bg-brand-blanco-calido">
      <div className="max-w-[900px] mx-auto px-6 py-16 md:py-20 text-center">
        <Link href="/" aria-label={tNav("homeLabel")}>
          <Logo
            variant="wordmark-dark"
            width={200}
            height={28}
            alt="Sofía Mosquera Estudio"
            className="mx-auto opacity-90 hover:opacity-100 transition-opacity"
          />
        </Link>

        <p className="font-heading font-medium text-2xl md:text-3xl text-brand-negro mt-8 leading-tight">
          {t("studio")}
        </p>

        <div className="mt-8 space-y-3">
          <div>
            <a
              href="mailto:smosquera@sofimosquera.com"
              className="font-body text-base font-bold text-brand-negro hover:text-brand-negro-suave transition-colors"
            >
              smosquera@sofimosquera.com
            </a>
          </div>
          <div>
            <a
              href="tel:+5492615456913"
              className="font-body text-sm font-light text-brand-negro-suave hover:text-brand-negro transition-colors"
            >
              +54 9 261 545 6913
            </a>
          </div>
          <div>
            <span className="font-body text-sm font-light text-brand-negro-suave whitespace-pre-line">
              {t("address")}
            </span>
          </div>
          <div>
            <a
              href="https://instagram.com/sofiamosquera.interiorismo"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm font-light text-brand-negro-suave hover:text-brand-negro transition-colors"
            >
              @sofiamosquera.interiorismo
            </a>
          </div>
        </div>

        <p className="font-body text-[11px] tracking-[0.3em] uppercase text-brand-gris-nav mt-12">
          {t("tagline")}
        </p>

        <p className="font-body text-xs text-brand-gris-nav/70 mt-3">
          © {year} {t("studio")} — {t("rights")}
          {" · "}
          <Link
            href="/contacto"
            className="hover:text-brand-negro transition-colors"
          >
            {tNav("contacto")}
          </Link>
        </p>
      </div>
    </footer>
  );
}
