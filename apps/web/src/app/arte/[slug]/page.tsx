import { notFound } from "next/navigation";
import Link from "next/link";
import { createDb, artworks, eq, and, ne, desc } from "@sofi/db";
import { SectionReveal, WhatsAppCTA, cldArtwork } from "@sofi/ui";
import { ArtworkLightbox } from "@/components/artwork-lightbox";
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
    description: `${artwork.title} \u2014 ${artwork.technique ?? "Obra original"} de Sofia Mosquera`,
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

  const related = artwork.series
    ? await db
        .select()
        .from(artworks)
        .where(
          and(ne(artworks.slug, slug), eq(artworks.series, artwork.series))
        )
        .orderBy(desc(artworks.publishedAt))
        .limit(3)
    : [];

  return (
    <div className="pt-28">
      <div className="max-w-6xl mx-auto px-6">
        <SectionReveal>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {artwork.coverUrl ? (
              <ArtworkLightbox
                publicId={artwork.coverUrl}
                title={artwork.title}
              />
            ) : (
              <div className="aspect-[3/4] bg-brand-crema rounded-image overflow-hidden flex items-center justify-center">
                <span className="font-heading text-[15vw] text-brand-gris-border/30">
                  {artwork.title.charAt(0)}
                </span>
              </div>
            )}

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

              <div className="mt-8 space-y-0">
                {artwork.technique && (
                  <div className="flex justify-between py-3 border-b border-brand-crema">
                    <span className="font-body text-[9px] tracking-[0.25em] uppercase text-brand-gris-nav">
                      Tecnica
                    </span>
                    <span className="font-body text-sm">
                      {artwork.technique}
                    </span>
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
                      An\u0303o
                    </span>
                    <span className="font-body text-sm">{artwork.year}</span>
                  </div>
                )}
              </div>

              {artwork.status !== "vendido" && (
                <div className="mt-10">
                  <WhatsAppCTA
                    label="Consultar por esta obra"
                    message={`Hola Sofia, me interesa la obra "${artwork.title}"${artwork.series ? ` de la serie ${artwork.series}` : ""}. Podemos hablar?`}
                    className="w-full justify-center"
                  />
                </div>
              )}

              <div className="mt-8 p-5 bg-brand-crema rounded-card">
                <p className="font-body text-xs text-brand-negro-suave leading-relaxed">
                  <strong className="font-medium">Certificado de autenticidad:</strong> cada obra incluye certificado firmado por la artista y acompan\u0303amiento para envio a cualquier parte del pais o del exterior.
                </p>
              </div>
            </div>
          </div>
        </SectionReveal>

        {related.length > 0 && (
          <div className="mt-24 pb-16">
            <SectionReveal>
              <h2 className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav mb-8">
                Otras obras de la serie {artwork.series}
              </h2>
            </SectionReveal>
            <div className="grid grid-cols-3 gap-4">
              {related.map((a, i) => (
                <SectionReveal key={a.id} delay={i * 60}>
                  <Link href={`/arte/${a.slug}`} className="group block">
                    <div className="aspect-[3/4] bg-brand-crema rounded-image overflow-hidden">
                      {a.coverUrl ? (
                        <img
                          src={cldArtwork(a.coverUrl)}
                          alt={a.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          role="img"
                          aria-label={a.title}
                        >
                          <span className="font-heading text-4xl text-brand-gris-border/40">
                            {a.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-heading text-base text-brand-negro group-hover:text-brand-gris-nav transition-colors mt-2">
                      {a.title}
                    </h3>
                  </Link>
                </SectionReveal>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 pb-24 pt-8 border-t border-brand-crema text-center">
          <Link
            href="/arte"
            className="font-body text-sm text-brand-gris-nav border-b border-brand-gris-nav pb-0.5 hover:text-brand-negro hover:border-brand-negro transition-colors"
          >
            &larr; Ver toda la galeria
          </Link>
        </div>
      </div>
    </div>
  );
}
