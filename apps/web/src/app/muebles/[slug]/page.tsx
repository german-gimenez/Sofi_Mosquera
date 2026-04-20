import { notFound } from "next/navigation";
import Link from "next/link";
import { createDb, furniture, eq, ne, desc } from "@sofi/db";
import { SectionReveal, WhatsAppCTA, cldGallery, cldCard } from "@sofi/ui";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const db = createDb();
  const [piece] = await db
    .select()
    .from(furniture)
    .where(eq(furniture.slug, slug))
    .limit(1);

  if (!piece) return {};
  return {
    title: piece.title,
    description: piece.description ?? "Mueble a medida por Sofia Mosquera",
  };
}

export default async function FurniturePage({ params }: Props) {
  const { slug } = await params;
  const db = createDb();

  const [piece] = await db
    .select()
    .from(furniture)
    .where(eq(furniture.slug, slug))
    .limit(1);

  if (!piece) notFound();

  const related = await db
    .select()
    .from(furniture)
    .where(ne(furniture.slug, slug))
    .orderBy(desc(furniture.featured))
    .limit(3);

  const gallery = (piece.gallery as string[]) ?? [];

  return (
    <div className="pt-28">
      <div className="max-w-6xl mx-auto px-6">
        <SectionReveal>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="aspect-[4/3] bg-brand-crema rounded-image overflow-hidden">
              {piece.coverUrl ? (
                <img
                  src={cldGallery(piece.coverUrl)}
                  alt={piece.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  role="img"
                  aria-label={piece.title}
                >
                  <span className="font-heading text-[10vw] text-brand-gris-border/30">
                    {piece.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="py-4">
              <span className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav">
                Mueble a Medida
              </span>
              <h1 className="font-heading text-4xl text-brand-negro mt-2">
                {piece.title}
              </h1>

              {piece.priceArs && (
                <p className="font-body text-2xl font-light text-brand-negro mt-4">
                  Desde ${piece.priceArs.toLocaleString("es-AR")} ARS
                </p>
              )}

              {piece.description && (
                <p className="font-body font-light text-brand-negro-suave mt-6 leading-relaxed">
                  {piece.description}
                </p>
              )}

              <div className="mt-8 space-y-0">
                {piece.materials && (
                  <div className="flex justify-between py-3 border-b border-brand-crema">
                    <span className="font-body text-[9px] tracking-[0.25em] uppercase text-brand-gris-nav">
                      Materiales
                    </span>
                    <span className="font-body text-sm text-right">
                      {piece.materials}
                    </span>
                  </div>
                )}
                {piece.dimensions && (
                  <div className="flex justify-between py-3 border-b border-brand-crema">
                    <span className="font-body text-[9px] tracking-[0.25em] uppercase text-brand-gris-nav">
                      Dimensiones
                    </span>
                    <span className="font-body text-sm text-right">
                      {piece.dimensions}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-10">
                <WhatsAppCTA
                  label="Consultar por esta pieza"
                  message={`Hola Sofia, me interesa el mueble "${piece.title}". Podemos hablar?`}
                  className="w-full justify-center"
                />
              </div>

              <div className="mt-8 p-5 bg-brand-crema rounded-card">
                <p className="font-body text-xs text-brand-negro-suave leading-relaxed">
                  <strong className="font-medium">A medida:</strong> dimensiones, maderas y terminaciones se pueden adaptar segun el proyecto. Tiempos de fabricacion 45-60 dias.
                </p>
              </div>
            </div>
          </div>
        </SectionReveal>

        {gallery.length > 0 && (
          <div className="mt-16 grid grid-cols-2 gap-4">
            {gallery.map((publicId, i) => (
              <SectionReveal key={i} delay={i * 60}>
                <div className="aspect-[4/3] bg-brand-crema rounded-image overflow-hidden">
                  <img
                    src={cldGallery(publicId)}
                    alt={`${piece.title} \u2014 ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </SectionReveal>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <section className="mt-24 pb-20">
            <SectionReveal>
              <h2 className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav mb-8">
                Otras piezas
              </h2>
            </SectionReveal>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((p, i) => (
                <SectionReveal key={p.id} delay={i * 60}>
                  <Link href={`/muebles/${p.slug}`} className="group block">
                    <div className="aspect-[4/3] bg-brand-crema rounded-image overflow-hidden mb-3">
                      {p.coverUrl ? (
                        <img
                          src={cldCard(p.coverUrl)}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          role="img"
                          aria-label={p.title}
                        >
                          <span className="font-heading text-5xl text-brand-gris-border/40">
                            {p.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-heading text-base text-brand-negro group-hover:text-brand-gris-nav transition-colors">
                      {p.title}
                    </h3>
                  </Link>
                </SectionReveal>
              ))}
            </div>
          </section>
        )}

        <div className="mt-16 pb-24 pt-8 border-t border-brand-crema text-center">
          <Link
            href="/muebles"
            className="font-body text-sm text-brand-gris-nav border-b border-brand-gris-nav pb-0.5 hover:text-brand-negro hover:border-brand-negro transition-colors"
          >
            &larr; Ver todos los muebles
          </Link>
        </div>
      </div>
    </div>
  );
}
