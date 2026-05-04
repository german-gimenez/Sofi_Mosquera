"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@sofi/ui";
import type { Locale } from "@/i18n/routing";

interface LocaleSwitcherProps {
  scrolled: boolean;
}

export function LocaleSwitcher({ scrolled }: LocaleSwitcherProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("languageSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const switchTo = (newLocale: Locale) => {
    if (newLocale === locale) return;
    startTransition(() => {
      // pathname here is the canonical path (no locale prefix)
      // params contains [slug], [serie], [obra] etc.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace({ pathname, params: params as any }, { locale: newLocale });
    });
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "flex items-center gap-2 font-body text-[13px] font-light tracking-[0.15em] transition-colors",
        scrolled ? "text-brand-negro" : "text-brand-blanco-calido",
        isPending && "opacity-50"
      )}
    >
      <button
        type="button"
        onClick={() => switchTo("es")}
        aria-current={locale === "es"}
        className={cn(
          "uppercase",
          locale === "es" ? "font-medium" : "opacity-60 hover:opacity-100"
        )}
      >
        {t("es")}
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        onClick={() => switchTo("en")}
        aria-current={locale === "en"}
        className={cn(
          "uppercase",
          locale === "en" ? "font-medium" : "opacity-60 hover:opacity-100"
        )}
      >
        {t("en")}
      </button>
    </div>
  );
}
