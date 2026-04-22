import type { Metadata } from "next";
import { Instrument_Serif, Jost } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import {
  organizationSchema,
  localBusinessSchema,
  jsonLdScript,
} from "@/lib/structured-data";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sofimosquera.com";
const CLOUD =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "dsrvlln9j";
const OG_IMAGE = `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,c_fill,g_auto,w_1200,h_630/sofi-mosquera/projects/casa-susel/01`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sofia Mosquera — Interiorismo · Arte · Muebles a medida",
    template: "%s | Sofia Mosquera",
  },
  description:
    "Estudio de interiorismo, arte original y muebles a medida en Mendoza y Santiago. Portfolio de proyectos que integran diseño, arte y piezas únicas.",
  keywords: [
    "interiorismo",
    "diseño de interiores",
    "arte",
    "cuadros",
    "muebles a medida",
    "Mendoza",
    "Sofia Mosquera",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: "Sofia Mosquera",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Sofia Mosquera — Interiorismo, Arte y Muebles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sofia Mosquera — Interiorismo · Arte · Muebles a medida",
    description:
      "Estudio de interiorismo, arte original y muebles a medida en Mendoza y Santiago.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${instrumentSerif.variable} ${jost.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(organizationSchema())}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(localBusinessSchema())}
        />
      </head>
      <body className="antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-brand-negro focus:text-brand-blanco-calido focus:px-4 focus:py-2 focus:rounded-[8px]">
          Ir al contenido principal
        </a>
        <Nav />
        <main id="main-content">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
