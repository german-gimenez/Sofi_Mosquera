import Link from "next/link";
import { SectionReveal } from "@sofi/ui";
import { createDb, furniture, desc } from "@sofi/db";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Muebles a Medida",
  description:
    "Muebles diseñados y fabricados a medida. Piezas únicas con materiales nobles y terminaciones premium.",
};

export default async function MueblesPage() {
  const db = createDb();

  const allFurniture = await db
    .select()
    .from(furniture)
    .orderBy(desc(furniture.publishedAt));

  return (
    <div className="pt-28">
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <SectionReveal>
          <span className="font-body text-[10px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
            Catálogo
          </span>
          <h1 className="font-heading text-5xl md:text-6xl mt-4 text-brand-negro">
            Muebles a Medida
          </h1>
          <p className="font-body font-light text-brand-negro-suave mt-4 max-w-2xl text-lg leading-relaxed">
            Piezas diseñadas y fabricadas para cada proyecto. Materiales nobles,
            terminaciones premium, pensados para durar.
          </p>
        </SectionReveal>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allFurniture.map((piece, i) => (
            <SectionReveal key={piece.id} delay={i * 80}>
              <Link href={`/muebles/${piece.slug}`} className="group block">
                <div className="aspect-[4/3] bg-brand-crema rounded-image overflow-hidden mb-4">
                  {piece.coverUrl ? (
                    <img
                      src={piece.coverUrl}
                      alt={piece.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-heading text-6xl text-brand-gris-border/40">
                        {piece.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-heading text-lg text-brand-negro group-hover:text-brand-gris-nav transition-colors">
                  {piece.title}
                </h3>
                {piece.materials && (
                  <p className="font-body text-xs text-brand-gris-nav mt-1">
                    {piece.materials}
                  </p>
                )}
              </Link>
            </SectionReveal>
          ))}
        </div>

        {allFurniture.length === 0 && (
          <div className="text-center py-20">
            <p className="font-body text-brand-gris-nav">
              Próximamente — estamos preparando el catálogo.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
