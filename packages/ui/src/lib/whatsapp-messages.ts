export const WHATSAPP_PHONE = "5492615456913";

export type Locale = "es" | "en";

export type WhatsAppContext =
  | "default"
  | "home"
  | "asesoria"
  | "contacto"
  | "sobre"
  | "studio"
  | "interiorismo"
  | "arte-index"
  | "muebles-index"
  | "proyectos-index"
  | "servicios"
  | "muebles-custom"
  | "muebles-personalize"
  | "newsletter";

interface BilingualMessage {
  es: string;
  en: string;
}

export const WHATSAPP_MESSAGES_I18N: Record<WhatsAppContext, BilingualMessage> = {
  default: {
    es: "Hola Sofi! Estoy navegando tu sitio y me gustaría conversar.",
    en: "Hi Sofi! I'm browsing your site and would love to chat.",
  },
  home: {
    es: "Hola Sofi! Entré a tu sitio y me gustaría coordinar una asesoría para mi espacio.",
    en: "Hi Sofi! I visited your site and I'd like to book a consultation for my space.",
  },
  asesoria: {
    es: "Hola Sofi! Leí sobre tu proceso de asesoría y quiero coordinar una primera conversación. Te cuento brevemente: [tipo de espacio, m2, ciudad].",
    en: "Hi Sofi! I read about your consultation process and want to schedule a first conversation. Briefly: [space type, m2, city].",
  },
  contacto: {
    es: "Hola Sofi! Te escribo desde la página de Contacto. Me interesa consultar sobre [interiorismo / una obra / un mueble].",
    en: "Hi Sofi! I'm writing from your Contact page. I'm interested in [interior design / an artwork / a furniture piece].",
  },
  sobre: {
    es: "Hola Sofi! Leí tu historia y me gustaría conversar sobre un proyecto.",
    en: "Hi Sofi! I read your story and I'd like to discuss a project.",
  },
  studio: {
    es: "Hola Sofi! Conocí tu estudio y me gustaría coordinar la primera asesoría para mi espacio.",
    en: "Hi Sofi! I learned about your studio and I'd like to book the first consultation for my space.",
  },
  interiorismo: {
    es: "Hola Sofi! Vi tu trabajo de interiorismo y quiero coordinar una asesoría para mi espacio.",
    en: "Hi Sofi! I saw your interior design work and want to book a consultation for my space.",
  },
  "arte-index": {
    es: "Hola Sofi! Estoy mirando tus obras y me gustaría consultar.",
    en: "Hi Sofi! I'm looking at your artworks and I'd like to inquire.",
  },
  "muebles-index": {
    es: "Hola Sofi! Estoy mirando el catálogo de muebles.",
    en: "Hi Sofi! I'm browsing the furniture catalogue.",
  },
  "proyectos-index": {
    es: "Hola Sofi! Me inspiraron tus proyectos y quiero conversar sobre el mío.",
    en: "Hi Sofi! Your projects inspired me and I'd like to discuss mine.",
  },
  servicios: {
    es: "Hola Sofi! Vi tus servicios y me gustaría coordinar una primera conversación.",
    en: "Hi Sofi! I saw your services and I'd like to set up a first conversation.",
  },
  "muebles-custom": {
    es: "Hola Sofi! Vi la sección de Muebles y me interesa diseñar una pieza a medida. Te cuento qué necesito para mi espacio...",
    en: "Hi Sofi! I saw the Furniture section and I'd like to design a custom piece. Here's what I need for my space...",
  },
  "muebles-personalize": {
    es: "Hola Sofi! Vi el catálogo y me gustaría adaptar una pieza (medidas, madera o terminación) para mi espacio.",
    en: "Hi Sofi! I saw the catalogue and I'd like to adapt a piece (size, wood or finish) for my space.",
  },
  newsletter: {
    es: "Hola Sofi! Quiero sumarme a la lista de coleccionistas para recibir avisos de nuevas obras.",
    en: "Hi Sofi! I'd like to join the collectors list to get notified about new artworks.",
  },
};

/** Backward-compat: returns Spanish messages (legacy callers). */
export const WHATSAPP_MESSAGES: Record<WhatsAppContext, string> = Object.fromEntries(
  (Object.keys(WHATSAPP_MESSAGES_I18N) as WhatsAppContext[]).map((k) => [
    k,
    WHATSAPP_MESSAGES_I18N[k].es,
  ])
) as Record<WhatsAppContext, string>;

interface ArtworkMessageOptions {
  series?: string | null;
  widthCm?: number | null;
  heightCm?: number | null;
  technique?: string | null;
  priceArs?: number | null;
  locale?: Locale;
}

/**
 * Enriched artwork inquiry message including dimensions, technique and price
 * when available — reduces back-and-forth in the WhatsApp conversation.
 */
export function artworkMessage(
  title: string,
  optsOrSeries: ArtworkMessageOptions | string | null = {},
  locale?: Locale
): string {
  // Backward-compat: artworkMessage(title, series) old signature
  const opts: ArtworkMessageOptions =
    typeof optsOrSeries === "string" || optsOrSeries === null
      ? { series: optsOrSeries, locale }
      : { ...optsOrSeries, locale: optsOrSeries.locale ?? locale };

  const lang = opts.locale ?? "es";
  const series = opts.series;
  const dims =
    opts.widthCm && opts.heightCm
      ? `${opts.widthCm}×${opts.heightCm} cm`
      : null;
  const tech = opts.technique;
  const price =
    opts.priceArs != null
      ? `$${opts.priceArs.toLocaleString("es-AR")}`
      : null;

  if (lang === "en") {
    const seriePart = series ? ` from the ${series} series` : "";
    const detailParts = [dims, tech, price].filter(Boolean).join(", ");
    const detailSuffix = detailParts ? ` (${detailParts})` : "";
    return `Hi Sofi! I'm interested in the piece "${title}"${seriePart}${detailSuffix}. Is it available? I'd like to know final price and shipping.`;
  }

  const seriePart = series ? ` de la serie ${series}` : "";
  const detailParts = [dims, tech, price].filter(Boolean).join(", ");
  const detailSuffix = detailParts ? ` (${detailParts})` : "";
  return `Hola Sofi! Me interesa la obra "${title}"${seriePart}${detailSuffix}. ¿Está disponible? Me gustaría saber precio final, medidas y envío.`;
}

export function furnitureMessage(title: string, locale: Locale = "es"): string {
  if (locale === "en") {
    return `Hi Sofi! I'm interested in the piece "${title}" from the Furniture catalogue. Can we discuss dimensions, finishes and delivery time?`;
  }
  return `Hola Sofi! Me interesa la pieza "${title}" del catálogo de Muebles. ¿Podemos conversar sobre medidas, terminaciones y tiempo de entrega?`;
}

export function projectMessage(title: string, locale: Locale = "es"): string {
  if (locale === "en") {
    return `Hi Sofía, I saw the project ${title} and I'd love to know more.`;
  }
  return `Hola Sofía, vi el proyecto ${title} y me interesa saber más.`;
}

/**
 * Build a context-appropriate WhatsApp message from a pathname.
 * Pathname may include a leading locale prefix (`/es/...`, `/en/...`) or not.
 */
export function messageForPath(pathname: string, locale?: Locale): string {
  // strip leading locale prefix if present
  const stripped = pathname
    .replace(/^\/(es|en)(?=\/|$)/, "")
    .replace(/^$/, "/");
  const ctx = contextForPath(stripped);
  const lang = locale ?? (pathname.startsWith("/en") ? "en" : "es");
  return WHATSAPP_MESSAGES_I18N[ctx][lang];
}

function contextForPath(pathname: string): WhatsAppContext {
  if (pathname === "/" || pathname === "") return "home";
  if (pathname === "/asesoria") return "asesoria";
  if (pathname === "/contacto" || pathname === "/contact") return "contacto";
  if (pathname === "/sobre") return "sobre";
  if (pathname === "/studio" || pathname === "/estudio" || pathname.startsWith("/studio") || pathname.startsWith("/estudio"))
    return "studio";
  if (pathname === "/servicios" || pathname === "/services") return "servicios";
  if (pathname === "/interiorismo") return "interiorismo";
  if (pathname === "/arte" || pathname === "/art") return "arte-index";
  if (pathname === "/muebles" || pathname === "/furniture")
    return "muebles-index";
  if (pathname === "/proyectos" || pathname === "/projects")
    return "proyectos-index";
  if (
    pathname.startsWith("/arte/") ||
    pathname.startsWith("/art/")
  )
    return "arte-index";
  if (
    pathname.startsWith("/muebles/") ||
    pathname.startsWith("/furniture/")
  )
    return "muebles-index";
  if (
    pathname.startsWith("/proyectos/") ||
    pathname.startsWith("/projects/")
  )
    return "proyectos-index";
  return "default";
}

export function buildWhatsAppUrl(message: string, phone = WHATSAPP_PHONE): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
