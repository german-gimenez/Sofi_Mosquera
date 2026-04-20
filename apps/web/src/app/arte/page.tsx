import Link from "next/link";
import { SectionReveal } from "@sofi/ui";
import { createDb, artworks, desc } from "@sofi/db";
import { ArtworkTilt } from "@/components/artwork-tilt";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Arte",
  description:
    "Cuadros y obras de arte originales de Sofia Mosquera. Piezas únicas que transforman espacios.",
};

export default async function ArtePage() {
  const db = createDb();

  const allArtworks = await db
    .select()
    .from(artworks)
    .orderBy(desc(artworks.publishedAt));

  return (
    <div className="pt-28">
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <SectionReveal>
          <span className="font-body text-[10px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
            Galería
          </span>
          <h1 className="font-heading text-5xl md:text-6xl mt-4 text-brand-negro">
            Arte Original
          </h1>
          <p className="font-body font-light text-brand-negro-suave mt-4 max-w-2xl text-lg leading-relaxed">
            Cada pieza nace de la misma sensibilidad con la que diseñamos
            espacios. Arte que no decora — transforma.
          </p>
        </SectionReveal>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allArtworks.map((artwork, i) => (
            <SectionReveal key={artwork.id} delay={i * 60}>
              <Link href={`/arte/${artwork.slug}`} className="group block">
                <ArtworkTilt>
                  <div className="aspect-[3/4] bg-brand-crema rounded-image overflow-hidden">
                    {artwork.coverUrl ? (
                      <img
                        src={artwork.coverUrl}
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-heading text-5xl text-brand-gris-border/40">
                          {artwork.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </ArtworkTilt>
                <div className="mt-3">
                  <h3 className="font-heading text-lg text-brand-negro group-hover:text-brand-gris-nav transition-colors">
                    {artwork.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {artwork.series && (
                      <span className="font-body text-xs text-brand-gris-nav">
                        {artwork.series}
                      </span>
                    )}
                    {artwork.status === "vendido" && (
                      <span className="font-body text-[9px] tracking-wider uppercase bg-brand-negro text-brand-blanco-calido px-2 py-0.5 rounded-pill">
                        Vendido
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
