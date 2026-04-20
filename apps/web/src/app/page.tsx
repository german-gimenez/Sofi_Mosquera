import Link from "next/link";
import {
  SectionReveal,
  Marquee,
  WhatsAppCTA,
  cldHero,
  cldCard,
  cldSquare,
  cldArtwork,
} from "@sofi/ui";
import { createDb, projects, artworks, settings, desc, eq } from "@sofi/db";
import { HeroParallax } from "@/components/hero-parallax";

export const dynamic = "force-dynamic";

const pillarItems = [
  "Proyectos Integrales",
  "Muebles a Medida",
  "Asesorias",
  "Arte Original",
];

const services = [
  {
    num: "01",
    title: "Interiorismo",
    description:
      "Proyectos integrales de disen\u0303o interior. Del concepto a la obra, con supervision en cada etapa.",
    href: "/proyectos",
  },
  {
    num: "02",
    title: "Arte Original",
    description:
      "Cuadros y piezas unicas de Sofia Mosquera. Arte que completa el espacio y lo transforma.",
    href: "/arte",
  },
  {
    num: "03",
    title: "Muebles a Medida",
    description:
      "Piezas disen\u0303adas y fabricadas para cada proyecto. Materiales nobles, terminaciones premium.",
    href: "/muebles",
  },
];

export default async function HomePage() {
  const db = createDb();

  const featuredProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.featured, true))
    .orderBy(desc(projects.publishedAt))
    .limit(3);

  const availableArtworks = await db
    .select()
    .from(artworks)
    .orderBy(desc(artworks.featured), desc(artworks.publishedAt))
    .limit(4);

  const [heroSetting] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, "hero"))
    .limit(1);

  const hero = (heroSetting?.value as {
    eyebrow?: string;
    headline?: string;
    subheadline?: string;
    coverPublicId?: string;
  } | null) ?? null;

  return (
    <>
      <HeroParallax
        eyebrow={hero?.eyebrow}
        headline={hero?.headline}
        subheadline={hero?.subheadline}
        coverPublicId={hero?.coverPublicId ?? featuredProjects[0]?.coverUrl ?? undefined}
      />

      <section className="px-3 -mt-2">
        <Marquee items={pillarItems} speed={25} />
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <SectionReveal>
          <div className="mb-16">
            <span className="font-body text-[10px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
              Lo que hacemos
            </span>
            <h2 className="font-heading text-4xl md:text-5xl mt-4 text-brand-negro">
              Interiorismo, arte y muebles
              <br />
              <span className="text-brand-gris-nav italic">en un unico proceso</span>
            </h2>
          </div>
        </SectionReveal>

        <div className="space-y-0">
          {services.map((service, i) => (
            <SectionReveal key={service.num} delay={i * 100}>
              <Link href={service.href} className="group block">
                <div className="flex items-start gap-6 md:gap-12 py-10 border-b border-brand-gris-border">
                  <span className="font-body text-sm text-brand-gris-nav pt-1">
                    {service.num}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-heading text-2xl md:text-3xl text-brand-negro group-hover:text-brand-gris-nav transition-colors">
                      {service.title}
                    </h3>
                    <p className="font-body font-light text-brand-negro-suave mt-2 max-w-xl">
                      {service.description}
                    </p>
                  </div>
                  <span className="font-body text-sm text-brand-gris-nav border-b border-brand-gris-nav pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                    Ver mas
                  </span>
                </div>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* Proyectos destacados */}
      {featuredProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <SectionReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="font-body text-[10px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
                  Portfolio
                </span>
                <h2 className="font-heading text-3xl md:text-4xl mt-4 text-brand-negro">
                  Proyectos destacados
                </h2>
              </div>
              <Link
                href="/proyectos"
                className="font-body text-sm text-brand-negro border-b border-brand-negro pb-0.5 hover:text-brand-gris-nav hover:border-brand-gris-nav transition-colors"
              >
                Ver todos
              </Link>
            </div>
          </SectionReveal>

          <div className="grid md:grid-cols-3 gap-4">
            {featuredProjects.map((project, i) => (
              <SectionReveal key={project.id} delay={i * 80}>
                <Link href={`/proyectos/${project.slug}`} className="group block">
                  <div className="aspect-[4/5] bg-brand-crema rounded-image overflow-hidden mb-4">
                    {project.coverUrl ? (
                      <img
                        src={cldCard(project.coverUrl)}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading={i === 0 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        role="img"
                        aria-label={project.title}
                      >
                        <span className="font-heading text-6xl text-brand-gris-border/40">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-heading text-xl text-brand-negro group-hover:text-brand-gris-nav transition-colors">
                    {project.title}
                  </h3>
                  <p className="font-body text-sm font-light text-brand-gris-nav mt-1">
                    {project.location} \u00b7 {project.year}
                  </p>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </section>
      )}

      {/* Diferenciador */}
      <section className="mx-3 my-16">
        <SectionReveal>
          <div className="bg-brand-negro rounded-image px-8 md:px-16 py-16 md:py-20 text-center">
            <span className="font-body text-[9px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
              Lo que nos hace unicos
            </span>
            <p className="font-heading text-2xl md:text-4xl text-brand-blanco-calido mt-6 max-w-3xl mx-auto leading-relaxed">
              Sofia no solo disen\u0303a espacios \u2014{" "}
              <span className="italic text-brand-gris-nav">
                los integra con arte propio.
              </span>{" "}
              El mismo estudio que disen\u0303a tu living puede crear el cuadro que lo completa.
            </p>
          </div>
        </SectionReveal>
      </section>

      {/* Arte disponible */}
      {availableArtworks.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <SectionReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="font-body text-[10px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
                  Galeria
                </span>
                <h2 className="font-heading text-3xl md:text-4xl mt-4 text-brand-negro">
                  Arte disponible
                </h2>
              </div>
              <Link
                href="/arte"
                className="font-body text-sm text-brand-negro border-b border-brand-negro pb-0.5 hover:text-brand-gris-nav hover:border-brand-gris-nav transition-colors"
              >
                Ver galeria
              </Link>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availableArtworks.map((artwork, i) => (
              <SectionReveal key={artwork.id} delay={i * 60}>
                <Link href={`/arte/${artwork.slug}`} className="group block">
                  <div className="aspect-[3/4] bg-brand-crema rounded-image overflow-hidden mb-3">
                    {artwork.coverUrl ? (
                      <img
                        src={cldArtwork(artwork.coverUrl)}
                        alt={artwork.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        role="img"
                        aria-label={artwork.title}
                      >
                        <span className="font-heading text-4xl text-brand-gris-border/40">
                          {artwork.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-heading text-base text-brand-negro group-hover:text-brand-gris-nav transition-colors">
                    {artwork.title}
                  </h3>
                  <p className="font-body text-xs text-brand-gris-nav mt-1">
                    {artwork.series}
                  </p>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="max-w-7xl mx-auto px-6 pb-24 pt-8">
        <SectionReveal>
          <div className="bg-brand-crema rounded-image px-8 md:px-16 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl text-brand-negro">
                Tenes un espacio que todavia no te representa?
              </h2>
              <p className="font-body font-light text-brand-negro-suave mt-3">
                Coordinamos una asesoria y empezamos a disen\u0303ar tu esencia.
              </p>
            </div>
            <WhatsAppCTA
              label="Coordina tu asesoria"
              message="Hola Sofia, me interesa coordinar una asesoria para mi proyecto."
            />
          </div>
        </SectionReveal>
      </section>
    </>
  );
}
