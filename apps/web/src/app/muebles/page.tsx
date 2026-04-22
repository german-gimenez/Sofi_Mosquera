import Link from "next/link";
import {
  SectionReveal,
  WhatsAppCTA,
  WHATSAPP_MESSAGES,
  cldCard,
  cldSrcSet,
} from "@sofi/ui";
import { createDb, furniture, desc } from "@sofi/db";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Muebles a Medida",
  description:
    "Muebles diseñados y fabricados a medida. Piezas unicas con materiales nobles y terminaciones premium.",
};

export default async function MueblesPage() {
  const db = createDb();

  const allFurniture = await db
    .select()
    .from(furniture)
    .orderBy(desc(furniture.featured), desc(furniture.publishedAt));

  return (
    <div className="pt-24 md:pt-28">
      <section className="max-w-[1440px] mx-auto px-6 pt-6 pb-4">
        <span className="font-body text-[10px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
          Muebles
        </span>
      </section>

      <section className="max-w-[1440px] mx-auto px-6 pb-16 md:pb-[120px]">
        {allFurniture.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
            {allFurniture.map((piece, i) => {
              const firstMaterial = piece.materials?.split(/[,·/]/)[0]?.trim();
              const aspect = i % 3 === 1 ? "aspect-[3/4]" : "aspect-[4/5]";
              return (
                <SectionReveal key={piece.id} delay={i * 40}>
                  <Link
                    href={`/muebles/${piece.slug}`}
                    className="group mb-4 block break-inside-avoid"
                  >
                    <div
                      className={`bg-brand-crema rounded-image overflow-hidden relative ${aspect}`}
                    >
                      {piece.coverUrl ? (
                        <img
                          src={cldCard(piece.coverUrl)}
                          srcSet={cldSrcSet(piece.coverUrl, [480, 768, 1200, 1920], {
                            h: 2400,
                            crop: "fill",
                            g: "auto",
                          })}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          alt={piece.title}
                          className="w-full h-full object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
                          loading={i < 3 ? "eager" : "lazy"}
                          decoding="async"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          role="img"
                          aria-label={piece.title}
                        >
                          <span className="font-heading text-5xl text-brand-gris-border/40">
                            {piece.title.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <h3 className="font-heading text-lg text-brand-negro group-hover:text-brand-gris-nav transition-colors">
                        {piece.title}
                      </h3>
                      {firstMaterial && (
                        <p className="font-body text-xs text-brand-gris-nav mt-0.5">
                          {firstMaterial}
                        </p>
                      )}
                    </div>
                  </Link>
                </SectionReveal>
              );
            })}
          </div>
        ) : (
          <SectionReveal>
            <div className="bg-brand-crema rounded-image p-12 text-center">
              <h3 className="font-heading text-2xl text-brand-negro mb-3">
                Proximamente en el catalogo
              </h3>
              <p className="font-body text-brand-gris-nav mb-6 max-w-xl mx-auto">
                Mientras tanto, diseñamos y fabricamos muebles a medida para cada
                proyecto. Consultanos por tu pieza ideal.
              </p>
              <WhatsAppCTA
                label="Consultá un mueble a medida"
                message={WHATSAPP_MESSAGES["muebles-custom"]}
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
                label="Personalizá esta pieza"
                message={WHATSAPP_MESSAGES["muebles-personalize"]}
              />
            </div>
          </SectionReveal>
        </section>
      )}
    </div>
  );
}
