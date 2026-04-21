import { SectionReveal, cldHero, cldPortrait } from "@sofi/ui";
import { createDb, settings, eq } from "@sofi/db";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sobre Sofia Mosquera",
  description:
    "Diseñadora de interiores y artista plastica. Conoce la historia detras de SM Studio en Mendoza, Argentina.",
};

export default async function SobrePage() {
  const db = createDb();

  const [photosSetting] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, "about_photos"))
    .limit(1);

  const [aboutSetting] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, "about"))
    .limit(1);

  const photos = (photosSetting?.value as string[]) ?? [];
  const about = (aboutSetting?.value as {
    eyebrow?: string;
    heading?: string;
    body?: string;
    mission?: string;
    values?: { title: string; description: string }[];
  } | null) ?? null;

  const heroPhoto = photos[0];

  return (
    <div className="pt-28">
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <SectionReveal>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-body text-[10px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
                {about?.eyebrow ?? "Sobre"}
              </span>
              <h1 className="font-heading text-5xl md:text-6xl mt-4 text-brand-negro">
                Sofia Mosquera
              </h1>
              <p className="font-body font-light text-brand-negro-suave mt-6 text-lg leading-relaxed">
                {about?.body ??
                  "Apasionada del arte en todas sus formas, creo que detras de cada obra hay un alma que se expresa y sucede lo mismo en los espacios que diseñamos y habitamos."}
              </p>
              <p className="font-body font-light text-brand-negro-suave mt-4 leading-relaxed">
                A traves del interiorismo, diseño y me conecto con las personas
                para adaptar sus espacios a la vida que sueñan vivir, reflejando
                su esencia en cada detalle.
              </p>
            </div>
            <div className="aspect-[4/5] bg-brand-crema rounded-image overflow-hidden">
              {heroPhoto ? (
                <img
                  src={cldPortrait(heroPhoto)}
                  alt="Sofia Mosquera"
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-heading text-[15vw] text-brand-gris-border/30">
                    SM
                  </span>
                </div>
              )}
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* Golden Circle */}
      <section className="mx-3 mb-16">
        <SectionReveal>
          <div className="grid md:grid-cols-3 gap-px">
            <div className="bg-brand-negro p-10">
              <span className="font-heading text-5xl text-brand-blanco-calido/10">
                W
              </span>
              <span className="font-body text-[9px] tracking-[0.35em] uppercase text-brand-gris-nav/50 block mt-4 mb-3">
                Por que existe SM
              </span>
              <p className="font-body font-light text-sm text-brand-blanco-calido/70 leading-relaxed">
                Creemos que cada persona merece habitar un espacio que sea un
                reflejo genuino de quien es. Que las paredes donde vivis y
                trabajas deberian contar tu historia.
              </p>
            </div>
            <div className="bg-brand-negro-suave p-10">
              <span className="font-heading text-5xl text-brand-blanco-calido/10">
                H
              </span>
              <span className="font-body text-[9px] tracking-[0.35em] uppercase text-brand-gris-nav/50 block mt-4 mb-3">
                Como lo hacemos
              </span>
              <p className="font-body font-light text-sm text-brand-blanco-calido/70 leading-relaxed">
                Integrando interiorismo, muebles a medida y arte original en un
                unico proceso creativo. El espacio, los muebles y las obras
                nacen de la misma vision.
              </p>
            </div>
            <div className="bg-brand-negro-suave p-10">
              <span className="font-heading text-5xl text-brand-blanco-calido/10">
                W
              </span>
              <span className="font-body text-[9px] tracking-[0.35em] uppercase text-brand-gris-nav/50 block mt-4 mb-3">
                Que ofrecemos
              </span>
              <p className="font-body font-light text-sm text-brand-blanco-calido/70 leading-relaxed">
                Proyectos integrales de interiorismo, muebles a medida y arte
                original para quienes quieren vivir y trabajar en espacios que
                los representan.
              </p>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* Photo gallery */}
      {photos.length > 1 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <SectionReveal>
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav block mb-8">
              En el estudio
            </span>
          </SectionReveal>
          <div className="grid md:grid-cols-2 gap-4">
            {photos.slice(1, 3).map((publicId, i) => (
              <SectionReveal key={i} delay={i * 100}>
                <div className="aspect-[4/3] bg-brand-crema rounded-image overflow-hidden">
                  <img
                    src={cldHero(publicId)}
                    alt={`Sofia en el estudio ${i + 2}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </SectionReveal>
            ))}
          </div>
        </section>
      )}

      {/* Values */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <SectionReveal>
          <div className="flex items-center gap-5 mb-12">
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav">
              Valores
            </span>
            <div className="flex-1 h-px bg-brand-crema" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(about?.values ?? [
              { title: "Calidad", description: "Diseños a medida de gran impacto en tu calidad de vida." },
              { title: "Empatia", description: "Para que los espacios sean un reflejo de quien los habita." },
              { title: "Sustentabilidad", description: "Desde los materiales hasta la linea de produccion." },
            ]).map((value) => (
              <div key={value.title} className="bg-brand-crema p-8 rounded-card">
                <h3 className="font-heading text-xl text-brand-negro mb-3">
                  {value.title}
                </h3>
                <p className="font-body text-sm font-light text-brand-gris-nav leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </SectionReveal>
      </section>

      {/* Tagline block */}
      <section className="mx-3 mb-24">
        <SectionReveal>
          <div className="bg-brand-negro rounded-image px-8 md:px-16 py-14 text-center">
            <p className="font-heading text-2xl md:text-3xl italic text-brand-blanco-calido">
              &ldquo;No decoramos. Habitamos.&rdquo;
            </p>
            <p className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav/50 mt-4">
              Tagline de marca
            </p>
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}
