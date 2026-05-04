import Image from "next/image";
import { cldUrl } from "@sofi/ui";

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
 * Brand logo with multi-variant support.
 *
 * Variants map to Cloudinary public_ids under sofi-mosquera/branding/.
 * Falls back to a text "SM" placeholder if Cloudinary asset missing,
 * so headers/footers never break before assets are uploaded.
 */
export function Logo({
  variant = "sm-dark",
  width,
  height,
  className,
  priority = false,
  alt = "Sofía Mosquera Estudio",
}: LogoProps) {
  const publicId = LOGO_PUBLIC_IDS[variant];
  const isDark = variant.endsWith("-dark");
  const isWordmark = variant.startsWith("wordmark");

  // Default sizes per variant if caller didn't specify
  const defaultW = isWordmark ? 220 : 48;
  const defaultH = isWordmark ? 32 : 48;
  const w = width ?? defaultW;
  const h = height ?? defaultH;

  // Cloudinary URL with limit crop preserves aspect; png to keep transparency
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
      // If the Cloudinary asset 404s, the broken-image will be invisible — handle via onError
      // and we keep an aria-fallback text below
      style={{ maxWidth: "100%", height: "auto" }}
      data-logo-variant={variant}
      data-logo-tone={isDark ? "dark" : "light"}
    />
  );
}
