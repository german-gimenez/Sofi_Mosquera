import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./logo";
import { NAV_LINKS } from "@/lib/nav-links";

/* ------------------------------------------------------------------ */
/*  SVG icons — inline to avoid external dependencies                 */
/* ------------------------------------------------------------------ */

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.088 4.088 0 0 1 1.523.99 4.088 4.088 0 0 1 .99 1.524c.163.46.349 1.26.403 2.428.058 1.267.07 1.647.07 4.851s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.088 4.088 0 0 1-.99 1.523 4.088 4.088 0 0 1-1.524.99c-.46.163-1.26.349-2.428.403-1.267.058-1.647.07-4.851.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.088 4.088 0 0 1-1.523-.99 4.088 4.088 0 0 1-.99-1.524c-.163-.46-.349-1.26-.403-2.428C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43a4.088 4.088 0 0 1 .99-1.523A4.088 4.088 0 0 1 5.15 2.636c.46-.163 1.26-.349 2.428-.403C8.845 2.175 9.225 2.163 12 2.163ZM12 0C8.741 0 8.333.014 7.053.072 5.775.131 4.903.333 4.14.63a5.876 5.876 0 0 0-2.126 1.384A5.876 5.876 0 0 0 .63 4.14C.333 4.903.131 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.059 1.278.261 2.15.558 2.913a5.876 5.876 0 0 0 1.384 2.126A5.876 5.876 0 0 0 4.14 23.37c.763.297 1.635.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.278-.059 2.15-.261 2.913-.558a5.876 5.876 0 0 0 2.126-1.384 5.876 5.876 0 0 0 1.384-2.126c.297-.763.499-1.635.558-2.913C23.986 15.667 24 15.259 24 12s-.014-3.667-.072-4.947c-.059-1.278-.261-2.15-.558-2.913a5.876 5.876 0 0 0-1.384-2.126A5.876 5.876 0 0 0 19.86.63C19.097.333 18.225.131 16.947.072 15.667.014 15.259 0 12 0Zm0 5.838a6.163 6.163 0 1 0 0 12.325 6.163 6.163 0 0 0 0-12.325ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M20.52 3.48A11.82 11.82 0 0 0 12.04 0C5.5 0 .19 5.3.19 11.84c0 2.08.55 4.11 1.6 5.9L0 24l6.42-1.68a11.8 11.8 0 0 0 5.61 1.43h.01c6.54 0 11.85-5.31 11.85-11.85 0-3.17-1.23-6.14-3.37-8.42ZM12.04 21.6a9.76 9.76 0 0 1-4.98-1.36l-.36-.22-3.81 1 1.02-3.71-.23-.38a9.74 9.74 0 0 1-1.49-5.19c0-5.38 4.38-9.75 9.85-9.75 2.63 0 5.1 1.02 6.96 2.88a9.76 9.76 0 0 1 2.88 6.87c0 5.38-4.38 9.86-9.84 9.86Zm5.38-7.34c-.3-.15-1.75-.87-2.02-.97-.27-.1-.47-.15-.67.15s-.76.97-.94 1.17c-.17.2-.34.22-.64.07a8.1 8.1 0 0 1-2.39-1.47 8.93 8.93 0 0 1-1.66-2.06c-.17-.3 0-.45.13-.6.13-.14.3-.34.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01a1.1 1.1 0 0 0-.8.37c-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.06 2.9 1.21 3.1.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

/**
 * Footer V4 — Professional multi-column layout.
 *
 * 4 columns on desktop (Logo+tagline | Navigation | Contact | Social).
 * 2 columns on tablet, stacked on mobile.
 * Bottom bar: copyright + legal links.
 */
export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-crema bg-brand-blanco-calido">
      {/* ---- Main grid ---- */}
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-12 md:pt-20 md:pb-14">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Col 1 — Logo + tagline */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label={tNav("homeLabel")}>
              <Logo
                variant="wordmark-dark"
                width={180}
                height={25}
                alt="Sofía Mosquera Estudio"
                className="opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="font-body text-[11px] tracking-[0.25em] uppercase text-brand-gris-nav mt-5">
              {t("tagline")}
            </p>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <h3 className="font-body text-[10px] font-light tracking-[0.3em] uppercase text-brand-gris-nav mb-5">
              {t("navigationTitle")}
            </h3>
            <nav aria-label={t("navigationTitle")}>
              <ul className="space-y-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body text-sm font-light text-brand-negro-suave hover:text-brand-negro transition-colors"
                    >
                      {tNav(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <h3 className="font-body text-[10px] font-light tracking-[0.3em] uppercase text-brand-gris-nav mb-5">
              {t("contactTitle")}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:smosquera@sofimosquera.com"
                  className="font-body text-sm font-light text-brand-negro-suave hover:text-brand-negro transition-colors"
                >
                  smosquera@sofimosquera.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+5492615456913"
                  className="font-body text-sm font-light text-brand-negro-suave hover:text-brand-negro transition-colors"
                >
                  +54 9 261 545 6913
                </a>
              </li>
              <li>
                <span className="font-body text-sm font-light text-brand-negro-suave whitespace-pre-line">
                  {t("address")}
                </span>
              </li>
              <li>
                <span className="font-body text-sm font-light text-brand-gris-nav">
                  {t("hours")}
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4 — Social */}
          <div>
            <h3 className="font-body text-[10px] font-light tracking-[0.3em] uppercase text-brand-gris-nav mb-5">
              {t("socialTitle")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://instagram.com/sofiamosquera.interiorismo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 font-body text-sm font-light text-brand-negro-suave hover:text-brand-negro transition-colors group"
                >
                  <InstagramIcon className="w-4 h-4 text-brand-gris-nav group-hover:text-brand-negro transition-colors" />
                  {t("igInteriorismo")}
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/sofiamosquera.arte"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 font-body text-sm font-light text-brand-negro-suave hover:text-brand-negro transition-colors group"
                >
                  <InstagramIcon className="w-4 h-4 text-brand-gris-nav group-hover:text-brand-negro transition-colors" />
                  {t("igArte")}
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5492615456913"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 font-body text-sm font-light text-brand-negro-suave hover:text-brand-negro transition-colors group"
                >
                  <WhatsAppIcon className="w-4 h-4 text-brand-gris-nav group-hover:text-brand-negro transition-colors" />
                  {t("whatsappLabel")}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ---- Bottom bar ---- */}
      <div className="border-t border-brand-crema">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs font-light text-brand-gris-nav">
            &copy; {year} {t("studio")} &mdash; {t("rights")}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacidad"
              className="font-body text-xs font-light text-brand-gris-nav hover:text-brand-negro transition-colors"
            >
              {t("privacy")}
            </Link>
            <span className="text-brand-crema" aria-hidden="true">|</span>
            <Link
              href="/terminos"
              className="font-body text-xs font-light text-brand-gris-nav hover:text-brand-negro transition-colors"
            >
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
