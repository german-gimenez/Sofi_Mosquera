export const WHATSAPP_PHONE = "5492615456913";

export type WhatsAppContext =
  | "default"
  | "home"
  | "asesoria"
  | "contacto"
  | "sobre"
  | "interiorismo"
  | "arte-index"
  | "muebles-index"
  | "proyectos-index"
  | "muebles-custom"
  | "muebles-personalize";

export const WHATSAPP_MESSAGES: Record<WhatsAppContext, string> = {
  default:
    "Hola Sofi! Estoy navegando tu sitio y me gustaría conversar.",
  home: "Hola Sofi! Entré a tu sitio y me gustaría coordinar una asesoría para mi espacio.",
  asesoria:
    "Hola Sofi! Leí sobre tu proceso de asesoría y quiero coordinar una primera conversación. Te cuento brevemente: [tipo de espacio, m2, ciudad].",
  contacto:
    "Hola Sofi! Te escribo desde la página de Contacto. Me interesa consultar sobre [interiorismo / una obra / un mueble].",
  sobre:
    "Hola Sofi! Leí tu historia y me gustaría conversar sobre un proyecto.",
  interiorismo:
    "Hola Sofi! Vi tu trabajo de interiorismo y quiero coordinar una asesoría para mi espacio.",
  "arte-index":
    "Hola Sofi! Estoy mirando tus obras y me gustaría consultar.",
  "muebles-index":
    "Hola Sofi! Estoy mirando el catálogo de muebles.",
  "proyectos-index":
    "Hola Sofi! Me inspiraron tus proyectos y quiero conversar sobre el mío.",
  "muebles-custom":
    "Hola Sofi! Vi la sección de Muebles y me interesa diseñar una pieza a medida. Te cuento qué necesito para mi espacio...",
  "muebles-personalize":
    "Hola Sofi! Vi el catálogo y me gustaría adaptar una pieza (medidas, madera o terminación) para mi espacio.",
};

export function artworkMessage(title: string, series?: string | null): string {
  const seriePart = series ? ` de la serie ${series}` : "";
  return `Hola Sofi! Me interesa la obra "${title}"${seriePart}. ¿Está disponible? Me gustaría saber precio final, medidas y envío.`;
}

export function furnitureMessage(title: string): string {
  return `Hola Sofi! Me interesa la pieza "${title}" del catálogo de Muebles. ¿Podemos conversar sobre medidas, terminaciones y tiempo de entrega?`;
}

export function projectMessage(title: string): string {
  return `Hola Sofi! Vi el proyecto "${title}" y me encantaría conversar sobre algo similar para mi espacio.`;
}

export function messageForPath(pathname: string): string {
  if (pathname === "/") return WHATSAPP_MESSAGES.home;
  if (pathname === "/asesoria") return WHATSAPP_MESSAGES.asesoria;
  if (pathname === "/contacto") return WHATSAPP_MESSAGES.contacto;
  if (pathname === "/sobre") return WHATSAPP_MESSAGES.sobre;
  if (pathname === "/interiorismo") return WHATSAPP_MESSAGES.interiorismo;
  if (pathname === "/arte") return WHATSAPP_MESSAGES["arte-index"];
  if (pathname === "/muebles") return WHATSAPP_MESSAGES["muebles-index"];
  if (pathname === "/proyectos") return WHATSAPP_MESSAGES["proyectos-index"];
  if (pathname.startsWith("/arte/")) return WHATSAPP_MESSAGES["arte-index"];
  if (pathname.startsWith("/muebles/"))
    return WHATSAPP_MESSAGES["muebles-index"];
  if (pathname.startsWith("/proyectos/"))
    return WHATSAPP_MESSAGES["proyectos-index"];
  return WHATSAPP_MESSAGES.default;
}

export function buildWhatsAppUrl(message: string, phone = WHATSAPP_PHONE): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
