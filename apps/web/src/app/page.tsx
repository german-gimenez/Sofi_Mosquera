import Link from "next/link";
import { SectionReveal, Marquee, WhatsAppCTA } from "@sofi/ui";
import { HeroParallax } from "@/components/hero-parallax";

const pillarItems = [
  "Proyectos Integrales",
  "Muebles a Medida",
  "Asesorías",
  "Arte Original",
];

const services = [
  {
    num: "01",
    title: "Interiorismo",
    description:
      "Proyectos integrales de diseño interior. Del concepto a la obra, con supervisión en cada etapa.",
    href: "/interiorismo",
  },
  {
    num: "02",
    title: "Arte Original",
    description:
      "Cuadros y piezas únicas de Sofia Mosquera. Arte que completa el espacio y lo transforma.",
    href: "/arte",
  },
  {
    num: "03",
    title: "Muebles a Medida",
    description:
      "Piezas diseñadas y fabricadas para cada proyecto. Materiales nobles, terminaciones premium.",
    href: "/muebles",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroParallax />

      {/* Marquee pilares */}
      <section className="px-3 -mt-2">
        <Marquee items={pillarItems} speed={25} />
      </section>

      {/* Servicios */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <SectionReveal>
          <div className="mb-16">
            <span className="font-body text-[10px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
              Lo que hacemos
            </span>
            <h2 className="font-heading text-4xl md:text-5xl mt-4 text-brand-negro">
              Interiorismo, arte y muebles
              <br />
              <span className="text-brand-gris-nav italic">en un único proceso</span>
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
                    Ver más
                  </span>
                </div>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* Diferenciador */}
      <section className="mx-3">
        <SectionReveal>
          <div className="bg-brand-negro rounded-image px-8 md:px-16 py-16 md:py-20 text-center">
            <span className="font-body text-[9px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
              Lo que nos hace únicos
            </span>
            <p className="font-heading text-2xl md:text-4xl text-brand-blanco-calido mt-6 max-w-3xl mx-auto leading-relaxed">
              Sofia no solo diseña espacios —{" "}
              <span className="italic text-brand-gris-nav">
                los integra con arte propio.
              </span>{" "}
              El mismo estudio que diseña tu living puede crear el cuadro que lo
              completa.
            </p>
          </div>
        </SectionReveal>
      </section>

      {/* Sobre (teaser) */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <SectionReveal>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-body text-[10px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
                Sobre Sofia Mosquera
              </span>
              <h2 className="font-heading text-3xl md:text-4xl mt-4 text-brand-negro">
                Diseñando espacios,
                <br />
                inspirando conexión
              </h2>
              <p className="font-body font-light text-brand-negro-suave mt-6 leading-relaxed">
                Apasionada del arte en todas sus formas, creo que detrás de cada
                obra hay un alma que se expresa y sucede lo mismo en los espacios
                que diseñamos y habitamos. A través del interiorismo, diseño y me
                conecto con las personas para adaptar sus espacios a la vida que
                sueñan vivir.
              </p>
              <Link
                href="/sobre"
                className="inline-block font-body text-sm text-brand-negro border-b border-brand-negro pb-0.5 mt-8 hover:text-brand-gris-nav hover:border-brand-gris-nav transition-colors"
              >
                Conocé más sobre SM
              </Link>
            </div>
            <div className="aspect-[4/5] bg-brand-crema rounded-image overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-heading text-8xl text-brand-gris-border">SM</span>
              </div>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* CTA final */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <SectionReveal>
          <div className="bg-brand-crema rounded-image px-8 md:px-16 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl text-brand-negro">
                ¿Tenés un espacio que todavía no te representa?
              </h2>
              <p className="font-body font-light text-brand-negro-suave mt-3">
                Coordinamos una asesoría y empezamos a diseñar tu esencia.
              </p>
            </div>
            <WhatsAppCTA
              label="Coordiná tu asesoría"
              message="Hola Sofia, me interesa coordinar una asesoría para mi proyecto."
            />
          </div>
        </SectionReveal>
      </section>
    </>
  );
}
