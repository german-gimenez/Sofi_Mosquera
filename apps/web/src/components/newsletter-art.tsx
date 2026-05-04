"use client";

import { useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@sofi/ui";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Pre-footer collectors-list opt-in. Posts to /api/newsletter.
 * Persists subscriber to inquiries(kind="newsletter") for follow-up campaigns.
 */
export function NewsletterArt() {
  const t = useTranslations("home");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot — bots will fill, real users won't
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, hp, locale }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg((err as Error).message);
    }
  };

  return (
    <section
      className="border-t border-brand-crema"
      aria-labelledby="newsletter-title"
    >
      <div className="max-w-[1440px] mx-auto px-6 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <span className="font-body text-[10px] tracking-[0.4em] uppercase text-brand-gris-nav block">
            {t("newsletterTitle")}
          </span>
          <h2
            id="newsletter-title"
            className="font-heading text-3xl md:text-4xl text-brand-negro mt-4 leading-tight"
          >
            {t("newsletterBody")}
          </h2>

          {status === "success" ? (
            <p className="mt-8 font-body text-base text-brand-negro">
              {t("newsletterSuccess")}
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
              noValidate
            >
              {/* Honeypot field — visually hidden, real users skip it */}
              <label
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                }}
              >
                Website
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                />
              </label>
              <input
                type="email"
                required
                aria-label="Email"
                placeholder={t("newsletterPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "submitting"}
                className="flex-1 bg-transparent border-b border-brand-negro/40 focus:border-brand-negro outline-none px-1 py-3 font-body text-sm text-brand-negro placeholder:text-brand-gris-nav transition-colors"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className={cn(
                  "font-body text-sm font-medium tracking-[0.15em] uppercase px-6 py-3 transition-colors",
                  "bg-brand-negro text-brand-blanco-calido hover:bg-brand-negro-suave",
                  status === "submitting" && "opacity-60 cursor-wait"
                )}
              >
                {t("newsletterCTA")}
              </button>
            </form>
          )}

          {status === "error" && (
            <p
              role="alert"
              className="mt-4 font-body text-sm text-brand-negro-suave"
            >
              {t("newsletterError")} {errorMsg && `(${errorMsg})`}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
