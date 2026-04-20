import { notFound } from "next/navigation";
import Link from "next/link";
import { createDb, furniture, eq } from "@sofi/db";
import { SectionReveal, WhatsAppCTA } from "@sofi/ui";
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

  const gallery = (piece.gallery as string[]) ?? [];

  return (
    <div className="pt-28">
      <div className="max-w-6xl mx-auto px-6">
        <SectionReveal>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="aspect-[4/3] bg-brand-crema rounded-image overflow-hidden">
              {piece.coverUrl ? (
                <img
                  src={piece.coverUrl}
                  alt={piece.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
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
                  ${piece.priceArs.toLocaleString("es-AR")} ARS
                </p>
              )}

              {piece.description && (
                <p className="font-body font-light text-brand-negro-suave mt-6 leading-relaxed">
                  {piece.description}
                </p>
              )}

              <div className="mt-8 space-y-4">
                {piece.materials && (
                  <div className="flex justify-between py-3 border-b border-brand-crema">
                    <span className="font-body text-[9px] tracking-[0.25em] uppercase text-brand-gris-nav">
                      Materiales
                    </span>
                    <span className="font-body text-sm">{piece.materials}</span>
                  </div>
                )}
                {piece.dimensions && (
                  <div className="flex justify-between py-3 border-b border-brand-crema">
                    <span className="font-body text-[9px] tracking-[0.25em] uppercase text-brand-gris-nav">
                      Dimensiones
                    </span>
                    <span className="font-body text-sm">{piece.dimensions}</span>
                  </div>
                )}
              </div>

              <div className="mt-10">
                <WhatsAppCTA
                  label="Consultar por esta pieza"
                  message={`Hola Sofia, me interesa el mueble "${piece.title}". ¿Podemos hablar?`}
                  className="w-full justify-center"
                />
              </div>
            </div>
          </div>
        </SectionReveal>

        {gallery.length > 0 && (
          <div className="mt-16 grid grid-cols-2 gap-4">
            {gallery.map((url, i) => (
              <SectionReveal key={i} delay={i * 60}>
                <div className="aspect-[4/3] bg-brand-crema rounded-image overflow-hidden">
                  <img
                    src={url}
                    alt={`${piece.title} — ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SectionReveal>
            ))}
          </div>
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
