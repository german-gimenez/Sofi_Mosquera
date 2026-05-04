import type { Locale } from "@/i18n/routing";

/**
 * Pick a value based on locale, with graceful fallback to ES.
 *
 * @param es - The Spanish (default) value.
 * @param en - The English value, or null/undefined.
 * @param locale - The active locale.
 *
 * For English: uses `en` if non-empty, otherwise falls back to `es`.
 * For Spanish (or any other): always returns `es`.
 */
export function pickLocale<T extends string | null | undefined>(
  es: T,
  en: T | null | undefined,
  locale: Locale | string
): T {
  if (locale === "en" && en != null && en !== "") {
    return en as T;
  }
  return es;
}

/**
 * Format a price in ARS with locale-aware separators.
 * - es: "$ 250.000"
 * - en: "ARS 250,000"
 */
export function formatPriceArs(
  priceArs: number | null | undefined,
  locale: Locale | string
): string | null {
  if (priceArs == null) return null;
  if (locale === "en") {
    return `ARS ${priceArs.toLocaleString("en-US")}`;
  }
  return `$ ${priceArs.toLocaleString("es-AR")}`;
}

/**
 * Format a price or "Consultar" placeholder when:
 * - price is null/undefined
 * - priceVisible is false (artist hides price publicly)
 */
export function formatPriceOrInquire(
  priceArs: number | null | undefined,
  priceVisible: boolean,
  locale: Locale | string,
  inquireLabel: string
): string {
  if (!priceVisible || priceArs == null) {
    return inquireLabel;
  }
  return formatPriceArs(priceArs, locale) ?? inquireLabel;
}
