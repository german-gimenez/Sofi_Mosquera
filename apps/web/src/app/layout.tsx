import type { Metadata } from "next";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sofimosquera.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sofía Mosquera — Interiorismo · Arte · Muebles a medida",
    template: "%s | Sofía Mosquera",
  },
  description:
    "Estudio de interiorismo, arte original y muebles a medida en Mendoza. Portfolio + galería de arte original.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
