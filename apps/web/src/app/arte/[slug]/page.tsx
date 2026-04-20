import { notFound } from "next/navigation";
import Link from "next/link";
import { createDb, artworks, eq } from "@sofi/db";
import { SectionReveal, WhatsAppCTA } from "@sofi/ui";
import { ArtworkTilt } from "@/components/artwork-tilt";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const db = createDb();
  const [artwork] = await db
    .select()
    .from(artworks)
    .where(eq(artworks.slug, slug))
    .limit(1);

  if (!artwork) return {};
  return {
    title: artwork.title,
    description: `${artwork.title} — ${artwork.technique ?? "Obra original"} de Sofia Mosquera`,
  };
}

export default async function ArtworkPage({ params }: Props) {
  const { slug } = await params;
  const db = createDb();

  const [artwork] = await db
    .select()
    .from(artworks)
    .where(eq(artworks.slug, slug))
    .limit(1);

  if (!artwork) notFound();

  const gallery = (artwork.gallery as string[]) ?? [];

  return (
    <div className="pt-28">
      <div className="max-w-6xl mx-auto px-6">
        <SectionReveal>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Image */}
            <ArtworkTilt maxTilt={4}>
              <div className="aspect-[3/4] bg-brand-crema rounded-image overflow-hidden">
                {artwork.coverUrl ? (
                  <img
                    src={artwork.coverUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-heading text-[15vw] text-brand-gris-border/30">
                      {artwork.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </ArtworkTilt>

            {/* Details */}
            <div className="py-4">
              {artwork.series && (
                <span className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav">
                  Serie {artwork.series}
                </span>
              )}

              <h1 className="font-heading text-4xl md:text-5xl text-brand-negro mt-2">
                {artwork.title}
              </h1>

              {artwork.status === "vendido" ? (
                <span className="inline-block font-body text-[9px] tracking-wider uppercase bg-brand-negro text-brand-blanco-calido px-3 py-1 rounded-pill mt-4">
                  Vendida
                </span>
              ) : artwork.priceArs ? (
                <p className="font-body text-2xl font-light text-brand-negro mt-4">
                  ${artwork.priceArs.toLocaleString("es-AR")} ARS
                </p>
              ) : null}

              <div className="mt-8 space-y-4">
                {artwork.technique && (
                  <div className="flex justify-between py-3 border-b border-brand-crema">
                    <span className="font-body text-[9px] tracking-[0.25em] uppercase text-brand-gris-nav">
                      Técnica
                    </span>
                    <span className="font-body text-sm">{artwork.technique}</span>
                  </div>
                )}
                {artwork.widthCm && artwork.heightCm && (
                  <div className="flex justify-between py-3 border-b border-brand-crema">
                    <span className="font-body text-[9px] tracking-[0.25em] uppercase text-brand-gris-nav">
                      Medidas
                    </span>
                    <span className="font-body text-sm">
                      {artwork.widthCm} x {artwork.heightCm} cm
                    </span>
                  </div>
                )}
                {artwork.year && (
                  <div className="flex justify-between py-3 border-b border-brand-crema">
                    <span className="font-body text-[9px] tracking-[0.25em] uppercase text-brand-gris-nav">
                      Año
                    </span>
                    <span className="font-body text-sm">{artwork.year}</span>
                  </div>
                )}
              </div>

              {artwork.status !== "vendido" && (
                <div className="mt-10">
                  <WhatsAppCTA
                    label="Consultar por esta obra"
                    message={`Hola Sofia, me interesa la obra "${artwork.title}"${artwork.series ? ` de la serie ${artwork.series}` : ""}. ¿Podemos hablar?`}
                    className="w-full justify-center"
                  />
                </div>
              )}

              <p className="font-body text-xs text-brand-gris-nav mt-6">
                Cada obra incluye certificado de autenticidad firmado por la artista.
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* Gallery */}
        {gallery.length > 0 && (
          <div className="mt-16 grid grid-cols-2 gap-4">
            {gallery.map((url, i) => (
              <SectionReveal key={i} delay={i * 60}>
                <div className="aspect-square bg-brand-crema rounded-image overflow-hidden">
                  <img
                    src={url}
                    alt={`${artwork.title} — ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SectionReveal>
            ))}
          </div>
        )}

        <div className="mt-16 pb-24 pt-8 border-t border-brand-crema text-center">
          <Link
            href="/arte"
            className="font-body text-sm text-brand-gris-nav border-b border-brand-gris-nav pb-0.5 hover:text-brand-negro hover:border-brand-negro transition-colors"
          >
            &larr; Ver toda la galería
          </Link>
        </div>
      </div>
    </div>
  );
}
