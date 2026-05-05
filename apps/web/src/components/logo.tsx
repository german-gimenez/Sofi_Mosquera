"use client";

import Image from "next/image";
import { useState } from "react";
import { cldUrl, cn } from "@sofi/ui";

export type LogoVariant =
  | "sm-dark"
  | "sm-white"
  | "wordmark-dark"
  | "wordmark-white";

const LOGO_PUBLIC_IDS: Record<LogoVariant, string> = {
  "sm-dark": "sofi-mosquera/branding/sm-dark",
  "sm-white": "sofi-mosquera/branding/sm-white",
  "wordmark-dark": "sofi-mosquera/branding/wordmark-dark",
  "wordmark-white": "sofi-mosquera/branding/wordmark-white",
};

interface LogoProps {
  variant?: LogoVariant;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  alt?: string;
}

/**
 * Brand logo with multi-variant support and graceful text fallback.
 *
 * Variants map to Cloudinary public_ids under sofi-mosquera/branding/.
 * If the Cloudinary asset 404s (or any image error), falls back to a styled
 * "SM" or "Sofía Mosquera" text matching the variant tone, so headers/footers
 * never break before assets are uploaded.
 */
export function Logo({
  variant = "sm-dark",
  width,
  height,
  className,
  priority = false,
  alt = "Sofía Mosquera Estudio",
}: LogoProps) {
  const [errored, setErrored] = useState(false);
  const publicId = LOGO_PUBLIC_IDS[variant];
  const isDark = variant.endsWith("-dark");
  const isWordmark = variant.startsWith("wordmark");

  const defaultW = isWordmark ? 220 : 48;
  const defaultH = isWordmark ? 32 : 48;
  const w = width ?? defaultW;
  const h = height ?? defaultH;

  if (errored) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={cn(
          "inline-flex items-center justify-center font-heading select-none",
          isDark ? "text-brand-negro" : "text-brand-blanco-calido",
          className
        )}
        style={{ width: w, height: h, fontSize: isWordmark ? 18 : 24 }}
        data-logo-variant={variant}
        data-logo-fallback="true"
      >
        {isWordmark ? "Sofía Mosquera" : "SM"}
      </span>
    );
  }

  const src = cldUrl(publicId, {
    w: w * 2,
    h: h * 2,
    crop: "limit",
    f: "auto",
    q: "auto",
  });

  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      priority={priority}
      className={className}
      style={{ maxWidth: "100%", height: "auto" }}
      data-logo-variant={variant}
      data-logo-tone={isDark ? "dark" : "light"}
      onError={() => setErrored(true)}
    />
  );
}
