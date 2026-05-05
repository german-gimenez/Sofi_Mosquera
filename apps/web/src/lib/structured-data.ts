import { WHATSAPP_PHONE } from "@sofi/ui";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sofimosquera.com";
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "dsrvlln9j";
const LOGO_URL = `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_512,h_512,c_fill,g_auto/sofi-mosquera/branding/sm-dark`;

export type SchemaLocale = "es" | "en";

export interface Organization {
  "@context": "https://schema.org";
  "@type": "Organization" | "LocalBusiness";
  [key: string]: unknown;
}

export function organizationSchema(): Organization {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sofía Mosquera",
    alternateName: "SM Studio",
    url: SITE_URL,
    logo: LOGO_URL,
    sameAs: [
      "https://instagram.com/sofiamosquera.interiorismo",
      "https://instagram.com/sofiamosquera.arte",
    ],
  };
}

export function localBusinessSchema(): Organization {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}#business`,
    name: "Sofía Mosquera — SM Studio",
    description:
      "Estudio de interiorismo, arte original y muebles a medida en Mendoza.",
    url: SITE_URL,
    image: LOGO_URL,
    telephone: `+${WHATSAPP_PHONE}`,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Besares 271B, Chacras de Coria",
      addressLocality: "Luján de Cuyo",
      addressRegion: "Mendoza",
      addressCountry: "AR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -33.0091,
      longitude: -68.8965,
    },
    areaServed: [
      { "@type": "Country", name: "Argentina" },
      { "@type": "Country", name: "Chile" },
    ],
    sameAs: [
      "https://instagram.com/sofiamosquera.interiorismo",
      "https://instagram.com/sofiamosquera.arte",
    ],
  };
}

function projectUrl(slug: string, locale: SchemaLocale): string {
  const path = locale === "en" ? "projects" : "proyectos";
  return `${SITE_URL}/${locale}/${path}/${slug}`;
}

function artworkUrl(slug: string, locale: SchemaLocale): string {
  const path = locale === "en" ? "art" : "arte";
  return `${SITE_URL}/${locale}/${path}/${slug}`;
}

export interface ProjectSchemaInput {
  title: string;
  slug: string;
  summary?: string | null;
  year?: number | null;
  location?: string | null;
  category?: string | null;
  coverImageUrl?: string | null;
  locale?: SchemaLocale;
}

export function projectCreativeWorkSchema(
  p: ProjectSchemaInput
): Record<string, unknown> {
  const lc = p.locale ?? "es";
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    url: projectUrl(p.slug, lc),
    inLanguage: lc === "en" ? "en" : "es-AR",
    ...(p.summary ? { description: p.summary } : {}),
    ...(p.year ? { dateCreated: String(p.year) } : {}),
    ...(p.coverImageUrl ? { image: p.coverImageUrl } : {}),
    ...(p.category ? { genre: p.category } : {}),
    ...(p.location
      ? { locationCreated: { "@type": "Place", name: p.location } }
      : {}),
    creator: { "@type": "Organization", name: "Sofía Mosquera" },
  };
}

export interface ArtworkSchemaInput {
  title: string;
  slug: string;
  technique?: string | null;
  year?: number | null;
  widthCm?: number | null;
  heightCm?: number | null;
  coverImageUrl?: string | null;
  priceArs?: number | null;
  status?: string | null;
  locale?: SchemaLocale;
}

export function artworkVisualArtworkSchema(
  a: ArtworkSchemaInput
): Record<string, unknown> {
  const lc = a.locale ?? "es";
  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: a.title,
    url: artworkUrl(a.slug, lc),
    inLanguage: lc === "en" ? "en" : "es-AR",
    ...(a.technique ? { artMedium: a.technique } : {}),
    ...(a.year ? { dateCreated: String(a.year) } : {}),
    ...(a.widthCm && a.heightCm
      ? {
          width: `${a.widthCm} cm`,
          height: `${a.heightCm} cm`,
        }
      : {}),
    ...(a.coverImageUrl ? { image: a.coverImageUrl } : {}),
    ...(a.priceArs
      ? {
          offers: {
            "@type": "Offer",
            price: String(a.priceArs),
            priceCurrency: "ARS",
            availability:
              a.status === "vendido"
                ? "https://schema.org/SoldOut"
                : a.status === "reservado"
                  ? "https://schema.org/Reserved"
                  : "https://schema.org/InStock",
            url: artworkUrl(a.slug, lc),
          },
        }
      : {}),
    creator: { "@type": "Person", name: "Sofía Mosquera" },
  };
}

/** Small server-safe helper to emit <script type="application/ld+json"> */
export function jsonLdScript(data: unknown): { __html: string } {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
