import {
  SectionReveal,
  WhatsAppCTA,
  WHATSAPP_MESSAGES,
  cldHero,
  cldPortrait,
  cldSrcSet,
} from "@sofi/ui";
import { createDb, settings, eq } from "@sofi/db";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Sofía Mosquera — estudio de interiorismo, arte original y muebles a medida en Mendoza. Nuestra filosofía, proceso y equipo.",
};

const philosophy = [
  {
    title: "Arte + diseño + muebles, juntos.",
    body:
      "Somos el único estudio que integra interiorismo, muebles a medida y arte original en un solo proceso creativo. El espacio, las piezas y las obras nacen de la misma visión — por eso se sienten parte de algo.",
  },
  {
    title: "Hechos en Mendoza.",
    body:
      "Nuestro estudio trabaja desde Mendoza y Santiago de Chile. Diseñamos con artesanos locales, materiales nobles y el tiempo que cada pieza necesita. Nada es seriado.",
  },
  {
    title: "Premium por único, no por caro.",
    body:
      "Pensamos espacios que duran décadas, no temporadas. Invertimos en materiales, en oficio y en una mirada atenta. Eso es lo que hace que tu espacio sea irrepetible — no el precio.",
  },
];

const process = [
  {
    num: "01",
    title: "Consultás",
    description:
      "Primera asesoría para entender tu espacio, tu esencia y lo que querés lograr.",
  },
  {
    num: "02",
    title: "Diseñamos",
    description:
      "Interiorismo, muebles y arte en un único proceso alineado a tu identidad.",
  },
  {
    num: "03",
    title: "Habitás",
    description: "Entrás a tu espacio y sentís: esto soy yo.",
  },
];

export default async function StudioPage() {
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
  const studioPhotos = photos.slice(1, 3);

  return (
    <div className="pt-24 md:pt-28">
      {/* Hero */}
      <section className="max-w-[1440px] mx-auto px-6 pb-16 md:pb-[120px]">
        <SectionReveal>
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <span className="font-body text-[10px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
                Studio
              </span>
              <h1 className="font-heading text-5xl md:text-6xl mt-4 text-brand-negro leading-[1.05]">
                Sofía Mosquera
              </h1>
              <p className="font-body font-light text-lg text-brand-negro-suave mt-6 leading-relaxed max-w-lg">
                Diseñadora y artista. Dirijo un estudio que integra interiorismo,
                muebles a medida y arte original.
              </p>
            </div>
            <div className="aspect-[4/5] bg-brand-crema rounded-image overflow-hidden">
              {heroPhoto ? (
                <img
                  src={cldPortrait(heroPhoto)}
                  srcSet={cldSrcSet(heroPhoto, [480, 768, 1000, 1200], {
                    h: 1500,
                    crop: "fill",
                    g: "face:auto",
                    effect: "sharpen:100",
                  })}
                  sizes="(max-width: 768px) 100vw, 50vw"
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

      {/* Filosofia */}
      <section className="max-w-[1440px] mx-auto px-6 pb-16 md:pb-[120px]">
        <SectionReveal>
          <div className="flex items-center gap-5 mb-10 md:mb-14">
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav">
              Filosofía
            </span>
            <div className="flex-1 h-px bg-brand-crema" />
          </div>
        </SectionReveal>

        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {philosophy.map((item, i) => (
            <SectionReveal key={item.title} delay={i * 80}>
              <article>
                <h3 className="font-heading text-xl md:text-2xl text-brand-negro leading-snug">
                  {item.title}
                </h3>
                <p className="font-body font-light text-sm md:text-[15px] text-brand-negro-suave mt-4 leading-relaxed">
                  {item.body}
                </p>
              </article>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* Proceso */}
      <section id="proceso" className="max-w-[1440px] mx-auto px-6 pb-16 md:pb-[120px]">
        <SectionReveal>
          <div className="flex items-center gap-5 mb-10 md:mb-14">
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav">
              Proceso
            </span>
            <div className="flex-1 h-px bg-brand-crema" />
          </div>
        </SectionReveal>

        <div className="grid md:grid-cols-3 gap-px">
          {process.map((step, i) => (
            <SectionReveal key={step.num} delay={i * 100}>
              <div
                className={`p-8 md:p-10 h-full ${
                  i === 2
                    ? "bg-brand-negro text-brand-blanco-calido"
                    : "bg-brand-crema"
                }`}
              >
                <span
                  className={`font-body text-6xl font-thin leading-none ${
                    i === 2
                      ? "text-brand-blanco-calido/10"
                      : "text-brand-negro/10"
                  }`}
                >
                  {step.num}
                </span>
                <h3
                  className={`font-heading text-2xl mt-5 mb-3 ${
                    i === 2 ? "text-brand-blanco-calido" : "text-brand-negro"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`font-body text-sm font-light leading-relaxed ${
                    i === 2 ? "text-brand-gris-nav/70" : "text-brand-gris-nav"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* En el estudio — fotos */}
      {studioPhotos.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 pb-16 md:pb-[120px]">
          <SectionReveal>
            <div className="flex items-center gap-5 mb-10 md:mb-14">
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav">
                En el estudio
              </span>
              <div className="flex-1 h-px bg-brand-crema" />
            </div>
          </SectionReveal>

          <div className="grid md:grid-cols-2 gap-4">
            {studioPhotos.map((publicId, i) => (
              <SectionReveal key={publicId} delay={i * 100}>
                <div className="aspect-[4/3] bg-brand-crema rounded-image overflow-hidden">
                  <img
                    src={cldHero(publicId)}
                    srcSet={cldSrcSet(publicId, [480, 768, 1200, 1600], {
                      h: 1200,
                      crop: "fill",
                      g: "auto",
                    })}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    alt={`Sofia en el estudio ${i + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </SectionReveal>
            ))}
          </div>
        </section>
      )}

      {/* Valores */}
      {about?.values && about.values.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 pb-16 md:pb-[120px]">
          <SectionReveal>
            <div className="flex items-center gap-5 mb-10 md:mb-14">
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav">
                Valores
              </span>
              <div className="flex-1 h-px bg-brand-crema" />
            </div>
          </SectionReveal>
          <div className="grid md:grid-cols-3 gap-4 md:gap-8">
            {about.values.map((value) => (
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
        </section>
      )}

      {/* Donde trabajamos */}
      <section className="max-w-[1440px] mx-auto px-6 pb-16 md:pb-[120px]">
        <SectionReveal>
          <div className="flex items-center gap-5 mb-8">
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav">
              Donde trabajamos
            </span>
            <div className="flex-1 h-px bg-brand-crema" />
          </div>
          <p className="font-heading text-3xl md:text-4xl text-brand-negro leading-tight max-w-3xl">
            Mendoza, Argentina · Santiago de Chile.
          </p>
          <p className="font-body font-light text-sm text-brand-gris-nav mt-4 max-w-xl">
            Proyectos a lo largo de ambos países. Visitas presenciales y
            seguimiento remoto con renders y videollamadas.
          </p>
        </SectionReveal>
      </section>

      {/* CTA final */}
      <section className="mx-3 mb-24">
        <SectionReveal>
          <div className="bg-brand-negro rounded-image px-8 md:px-16 py-16 md:py-20 text-center">
            <p className="font-heading text-3xl md:text-4xl text-brand-blanco-calido mb-3">
              Primera asesoría, sin compromiso.
            </p>
            <p className="font-body font-light text-sm text-brand-gris-nav/80 mb-8 max-w-xl mx-auto">
              Contanos de tu espacio por WhatsApp y coordinamos la primera
              conversación.
            </p>
            <WhatsAppCTA
              label="Coordiná tu asesoría"
              message={WHATSAPP_MESSAGES.asesoria}
            />
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}
