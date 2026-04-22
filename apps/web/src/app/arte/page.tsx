import Link from "next/link";
import { SectionReveal, cldArtwork, cldSrcSet } from "@sofi/ui";
import { createDb, artworks, desc } from "@sofi/db";
import { ArtworkTilt } from "@/components/artwork-tilt";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Arte",
  description:
    "Cuadros y obras de arte originales de Sofia Mosquera. Piezas unicas que transforman espacios.",
};

export default async function ArtePage() {
  const db = createDb();

  const allArtworks = await db
    .select()
    .from(artworks)
    .orderBy(desc(artworks.featured), desc(artworks.publishedAt));

  return (
    <div className="pt-24 md:pt-28">
      <section className="max-w-[1440px] mx-auto px-6 pt-6 pb-4">
        <span className="font-body text-[10px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
          Arte
        </span>
      </section>

      <section className="max-w-[1440px] mx-auto px-6 pb-16 md:pb-[120px]">
        {allArtworks.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-body text-brand-gris-nav">
              Proximamente — estamos preparando la galeria.
            </p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
            {allArtworks.map((artwork, i) => {
              const dim =
                artwork.widthCm && artwork.heightCm
                  ? `${artwork.widthCm}x${artwork.heightCm} cm`
                  : null;
              return (
                <SectionReveal key={artwork.id} delay={i * 40}>
                  <Link
                    href={`/arte/${artwork.slug}`}
                    className="group mb-4 block break-inside-avoid"
                  >
                    <ArtworkTilt>
                      <div className="aspect-[3/4] bg-brand-crema rounded-image overflow-hidden relative">
                        {artwork.coverUrl ? (
                          <img
                            src={cldArtwork(artwork.coverUrl)}
                            srcSet={cldSrcSet(artwork.coverUrl, [480, 768, 1200, 1920], {
                              h: 2560,
                              crop: "fit",
                            })}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            alt={artwork.title}
                            className="w-full h-full object-cover"
                            loading={i < 3 ? "eager" : "lazy"}
                            decoding="async"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            role="img"
                            aria-label={artwork.title}
                          >
                            <span className="font-heading text-5xl text-brand-gris-border/40">
                              {artwork.title.charAt(0)}
                            </span>
                          </div>
                        )}
                        {artwork.status === "vendido" && (
                          <span className="absolute top-3 right-3 font-body text-[9px] tracking-wider uppercase bg-brand-negro text-brand-blanco-calido px-2 py-0.5 rounded-pill">
                            Vendido
                          </span>
                        )}
                      </div>
                    </ArtworkTilt>
                    <div className="mt-3">
                      <h3 className="font-heading text-lg text-brand-negro group-hover:text-brand-gris-nav transition-colors">
                        {artwork.title}
                      </h3>
                      {dim && (
                        <p className="font-body text-xs text-brand-gris-nav mt-0.5">
                          {dim}
                        </p>
                      )}
                    </div>
                  </Link>
                </SectionReveal>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
