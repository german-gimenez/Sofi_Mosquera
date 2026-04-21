const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  "dsrvlln9j";

const BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

export interface CldUrlOptions {
  /** Target width in px. Default 1200. */
  w?: number;
  /** Target height in px. */
  h?: number;
  /** Crop mode: limit (default), fill, fit, thumb, pad, crop, scale. */
  crop?: "limit" | "fill" | "fit" | "thumb" | "pad" | "crop" | "scale";
  /** Quality: "auto" (default), "auto:good", "auto:best", number 1-100. */
  q?: string | number;
  /** Format: "auto" (default), "webp", "avif", "jpg". */
  f?: string;
  /** Gravity: "auto" (default for fill), "face", "center". */
  g?: string;
  /** AI effects: "improve", "upscale", "sharpen", "art:audrey", etc. */
  effect?: string;
  /** Background removal (AI). */
  removeBg?: boolean;
  /** Generative fill outwards. */
  generativeFill?: boolean;
  /** Extra raw transformation string (appended). */
  raw?: string;
  /** Device pixel ratio. Default "auto". */
  dpr?: string | number;
}

/**
 * Build a Cloudinary delivery URL with on-the-fly transformations.
 *
 * @param publicIdOrUrl - Cloudinary public_id (e.g. "sofi-mosquera/projects/casa-susel/01")
 *   OR full URL (returned as-is for backward compat with Blob URLs).
 */
export function cldUrl(
  publicIdOrUrl: string | null | undefined,
  opts: CldUrlOptions = {}
): string {
  if (!publicIdOrUrl) return "";
  if (publicIdOrUrl.startsWith("http")) return publicIdOrUrl;

  const {
    w = 1200,
    h,
    crop = "limit",
    q = "auto",
    f = "auto",
    g,
    effect,
    removeBg,
    generativeFill,
    raw,
    dpr = "auto",
  } = opts;

  const parts = [`f_${f}`, `q_${q}`, `c_${crop}`, `w_${w}`];
  if (h) parts.push(`h_${h}`);
  if (g) parts.push(`g_${g}`);
  if (dpr) parts.push(`dpr_${dpr}`);

  if (removeBg) parts.push("e_background_removal");
  if (generativeFill) parts.push("b_gen_fill");
  if (effect) parts.push(`e_${effect}`);
  if (raw) parts.push(raw);

  return `${BASE}/${parts.join(",")}/${publicIdOrUrl}`;
}

/** Preset: thumbnail 600x750 (4:5) crop fill */
export function cldThumb(publicId: string | null | undefined): string {
  return cldUrl(publicId, { w: 600, h: 750, crop: "fill", g: "auto" });
}

/** Preset: card 800x1000 (4:5) */
export function cldCard(publicId: string | null | undefined): string {
  return cldUrl(publicId, { w: 800, h: 1000, crop: "fill", g: "auto" });
}

/** Preset: wide hero 2000x1200 */
export function cldHero(publicId: string | null | undefined): string {
  return cldUrl(publicId, { w: 2000, h: 1200, crop: "fill", g: "auto" });
}

/** Preset: square 600x600 */
export function cldSquare(publicId: string | null | undefined): string {
  return cldUrl(publicId, { w: 600, h: 600, crop: "fill", g: "auto" });
}

/** Preset: full-res zoom (for lightbox) */
export function cldZoom(publicId: string | null | undefined): string {
  return cldUrl(publicId, { w: 2400, q: 90, crop: "limit" });
}

/** Preset: gallery detail 1600x1000 */
export function cldGallery(publicId: string | null | undefined): string {
  return cldUrl(publicId, { w: 1600, h: 1000, crop: "fill", g: "auto" });
}

/** Preset: artwork portrait (3:4) */
export function cldArtwork(publicId: string | null | undefined): string {
  return cldUrl(publicId, { w: 900, h: 1200, crop: "fit" });
}

/** AI preset: auto-enhance (improve color + contrast automatically). */
export function cldEnhanced(
  publicId: string | null | undefined,
  opts: Partial<CldUrlOptions> = {}
): string {
  return cldUrl(publicId, { w: 1600, h: 1000, crop: "fill", g: "auto", effect: "improve", ...opts });
}

/** AI preset: upscale lower-res originals (good for art up close). */
export function cldUpscaled(
  publicId: string | null | undefined,
  opts: Partial<CldUrlOptions> = {}
): string {
  return cldUrl(publicId, { w: 2400, crop: "limit", effect: "upscale", ...opts });
}

/** AI preset: sharp portrait. */
export function cldPortrait(
  publicId: string | null | undefined,
  opts: Partial<CldUrlOptions> = {}
): string {
  return cldUrl(publicId, {
    w: 900,
    h: 1200,
    crop: "fill",
    g: "face:auto",
    effect: "sharpen:100",
    ...opts,
  });
}

/** Responsive srcset string for use in <img srcSet>. */
export function cldSrcSet(
  publicId: string | null | undefined,
  widths: number[] = [400, 800, 1200, 1600, 2000],
  opts: CldUrlOptions = {}
): string {
  if (!publicId) return "";
  return widths
    .map((w) => `${cldUrl(publicId, { ...opts, w })} ${w}w`)
    .join(", ");
}
