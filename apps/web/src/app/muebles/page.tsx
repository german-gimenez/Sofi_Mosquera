import Link from "next/link";
import { SectionReveal, WhatsAppCTA, cldCard } from "@sofi/ui";
import { createDb, furniture, desc } from "@sofi/db";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Muebles a Medida",
  description:
    "Muebles disen\u0303ados y fabricados a medida. Piezas unicas con materiales nobles y terminaciones premium.",
};

export default async function MueblesPage() {
  const db = createDb();

  const allFurniture = await db
    .select()
    .from(furniture)
    .orderBy(desc(furniture.featured), desc(furniture.publishedAt));

  return (
    <div className="pt-28">
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <SectionReveal>
          <span className="font-body text-[10px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
            Catalogo
          </span>
          <h1 className="font-heading text-5xl md:text-6xl mt-4 text-brand-negro">
            Muebles a Medida
          </h1>
          <p className="font-body font-light text-brand-negro-suave mt-4 max-w-2xl text-lg leading-relaxed">
            Piezas disen\u0303adas y fabricadas para cada proyecto. Materiales nobles,
            terminaciones premium, pensados para durar.
          </p>
        </SectionReveal>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        {allFurniture.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allFurniture.map((piece, i) => (
              <SectionReveal key={piece.id} delay={i * 80}>
                <Link href={`/muebles/${piece.slug}`} className="group block">
                  <div className="aspect-[4/3] bg-brand-crema rounded-image overflow-hidden mb-4">
                    {piece.coverUrl ? (
                      <img
                        src={cldCard(piece.coverUrl)}
                        alt={piece.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading={i < 3 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        role="img"
                        aria-label={piece.title}
                      >
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
                  {piece.priceArs && (
                    <p className="font-body text-sm text-brand-negro mt-1">
                      ${piece.priceArs.toLocaleString("es-AR")} ARS
                    </p>
                  )}
                </Link>
              </SectionReveal>
            ))}
          </div>
        ) : (
          <SectionReveal>
            <div className="bg-brand-crema rounded-image p-12 text-center">
              <h3 className="font-heading text-2xl text-brand-negro mb-3">
                Proximamente en el catalogo
              </h3>
              <p className="font-body text-brand-gris-nav mb-6 max-w-xl mx-auto">
                Mientras tanto, disen\u0303amos y fabricamos muebles a medida para cada
                proyecto. Consultanos por tu pieza ideal.
              </p>
              <WhatsAppCTA
                label="Consultar mueble a medida"
                message="Hola Sofia, me interesa disen\u0303ar un mueble a medida."
              />
            </div>
          </SectionReveal>
        )}
      </section>

      {allFurniture.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <SectionReveal>
            <div className="bg-brand-crema rounded-image p-10 text-center">
              <h3 className="font-heading text-2xl text-brand-negro mb-3">
                No encontras lo que buscas?
              </h3>
              <p className="font-body text-brand-gris-nav mb-6 max-w-xl mx-auto">
                Todas nuestras piezas se pueden adaptar en dimensiones,
                materiales y terminaciones. Contanos que necesitas.
              </p>
              <WhatsAppCTA
                label="Consultar mueble personalizado"
                message="Hola Sofia, me interesa disen\u0303ar un mueble a medida para mi espacio."
              />
            </div>
          </SectionReveal>
        </section>
      )}
    </div>
  );
}
