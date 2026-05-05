"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@sofi/ui";

type Status = "idle" | "submitting" | "success" | "error";

interface ContactFormProps {
  locale: string;
}

/**
 * Client-side contact form. Posts JSON to /api/contact and reports status.
 * Handles its own validation messaging via next-intl `contacto.form` namespace.
 * Honeypot field `_hp` is included for anti-spam.
 */
export function ContactForm({ locale }: ContactFormProps) {
  const t = useTranslations("contacto.form");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      subject: String(fd.get("subject") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      locale,
      _hp: String(fd.get("_hp") ?? ""),
    };

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg((err as Error).message);
    }
  };

  if (status === "success") {
    return (
      <div className="border border-brand-crema p-8 text-center">
        <p className="font-body text-base text-brand-negro">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="name"
          className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav block mb-2"
        >
          {t("name")}
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full bg-transparent border-b border-brand-gris-border focus:border-brand-negro outline-none py-2 font-body text-sm text-brand-negro transition-colors"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav block mb-2"
        >
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full bg-transparent border-b border-brand-gris-border focus:border-brand-negro outline-none py-2 font-body text-sm text-brand-negro transition-colors"
        />
      </div>
      <div>
        <label
          htmlFor="subject"
          className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav block mb-2"
        >
          {t("subject")}
        </label>
        <input
          id="subject"
          name="subject"
          className="w-full bg-transparent border-b border-brand-gris-border focus:border-brand-negro outline-none py-2 font-body text-sm text-brand-negro transition-colors"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav block mb-2"
        >
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full bg-transparent border-b border-brand-gris-border focus:border-brand-negro outline-none py-2 font-body text-sm text-brand-negro transition-colors resize-none"
        />
      </div>

      {/* Honeypot — hidden from users, bots fill it */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
      >
        <label>
          Website
          <input type="text" name="_hp" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className={cn(
          "font-body text-sm font-medium tracking-[0.15em] uppercase whitespace-nowrap bg-brand-negro text-brand-blanco-calido px-8 py-3 rounded-[8px] transition-colors hover:bg-brand-negro-suave",
          status === "submitting" && "opacity-60 cursor-wait"
        )}
      >
        {status === "submitting" ? t("submitting") : t("submit")}
      </button>

      {status === "error" && (
        <p
          role="alert"
          className="font-body text-sm text-brand-negro-suave mt-2"
        >
          {t("error")} {errorMsg && `(${errorMsg})`}
        </p>
      )}
    </form>
  );
}
