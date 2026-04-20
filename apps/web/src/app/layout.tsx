import type { Metadata } from "next";
import { Instrument_Serif, Jost } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { WhatsAppCTA } from "@sofi/ui";

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

export const metadata: Metadata = {
  title: {
    default: "Sofia Mosquera — Interiorismo · Arte · Muebles a medida",
    template: "%s | Sofia Mosquera",
  },
  description:
    "Diseñamos espacios que reflejan tu esencia. Interiorismo, arte original y muebles a medida en Mendoza, Argentina.",
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
    url: "https://sofimosquera.com",
    siteName: "Sofia Mosquera",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${instrumentSerif.variable} ${jost.variable}`}>
      <body className="antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
        <WhatsAppCTA variant="floating" />
      </body>
    </html>
  );
}
