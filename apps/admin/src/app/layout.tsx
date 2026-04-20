import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SM Admin — Sofia Mosquera",
  description: "Panel de administración de Sofia Mosquera",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const body = (
    <html lang="es" className={jost.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );

  if (!hasClerk) return body;

  return <ClerkProvider>{body}</ClerkProvider>;
}
