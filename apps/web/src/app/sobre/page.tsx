import { SectionReveal } from "@sofi/ui";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Sofia Mosquera",
  description:
    "Diseñadora de interiores y artista plástica. Conocé la historia detrás de SM Studio en Mendoza, Argentina.",
};

export default function SobrePage() {
  return (
    <div className="pt-28">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <SectionReveal>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-body text-[10px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
                Sobre
              </span>
              <h1 className="font-heading text-5xl md:text-6xl mt-4 text-brand-negro">
                Sofia Mosquera
              </h1>
              <p className="font-body font-light text-brand-negro-suave mt-6 text-lg leading-relaxed">
                Apasionada del arte en todas sus formas, creo que detrás de cada
                obra hay un alma que se expresa y sucede lo mismo en los espacios
                que diseñamos y habitamos.
              </p>
              <p className="font-body font-light text-brand-negro-suave mt-4 leading-relaxed">
                A través del interiorismo, diseño y me conecto con las personas
                para adaptar sus espacios a la vida que sueñan vivir, reflejando
                su esencia en cada detalle.
              </p>
            </div>
            <div className="aspect-[4/5] bg-brand-crema rounded-image overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-heading text-[15vw] text-brand-gris-border/30">SM</span>
              </div>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* Golden Circle */}
      <section className="mx-3 mb-16">
        <SectionReveal>
          <div className="grid md:grid-cols-3 gap-px">
            <div className="bg-brand-negro p-10">
              <span className="font-heading text-5xl text-brand-blanco-calido/10">W</span>
              <span className="font-body text-[9px] tracking-[0.35em] uppercase text-brand-gris-nav/50 block mt-4 mb-3">
                Por qué existe SM
              </span>
              <p className="font-body font-light text-sm text-brand-blanco-calido/70 leading-relaxed">
                Creemos que cada persona merece habitar un espacio que sea un
                reflejo genuino de quién es. Que las paredes donde vivís y
                trabajás deberían contar tu historia.
              </p>
            </div>
            <div className="bg-brand-negro-suave p-10">
              <span className="font-heading text-5xl text-brand-blanco-calido/10">H</span>
              <span className="font-body text-[9px] tracking-[0.35em] uppercase text-brand-gris-nav/50 block mt-4 mb-3">
                Cómo lo hacemos
              </span>
              <p className="font-body font-light text-sm text-brand-blanco-calido/70 leading-relaxed">
                Integrando interiorismo, muebles a medida y arte original en un
                único proceso creativo. El espacio, los muebles y las obras
                nacen de la misma visión.
              </p>
            </div>
            <div className="bg-[#2A2A2A] p-10">
              <span className="font-heading text-5xl text-brand-blanco-calido/10">W</span>
              <span className="font-body text-[9px] tracking-[0.35em] uppercase text-brand-gris-nav/50 block mt-4 mb-3">
                Qué ofrecemos
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
            {[
              {
                title: "Calidad",
                description:
                  "Diseños a medida de gran impacto. Cada material es elegido especialmente para cada proyecto.",
              },
              {
                title: "Empatía",
                description:
                  "Para que los espacios sean un reflejo de quien los habita. Nos conectamos con tu esencia.",
              },
              {
                title: "Sustentabilidad",
                description:
                  "Desde los materiales hasta la línea de producción. Pequeños emprendedores y trabajadores de oficio son parte de nuestra cadena.",
              },
            ].map((value, i) => (
              <div key={value.title} className="bg-brand-crema p-8">
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

      {/* Tagline */}
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
