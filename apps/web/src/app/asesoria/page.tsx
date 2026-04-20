import { SectionReveal, WhatsAppCTA, Marquee } from "@sofi/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Asesoría de Diseño",
  description:
    "Consultá tu proyecto con Sofia Mosquera. Asesorías de diseño de interiores para transformar tu espacio.",
};

const steps = [
  {
    num: "01",
    title: "Consultá tu proyecto",
    description:
      "Primera asesoría para entender tu espacio, tu esencia y lo que querés lograr.",
  },
  {
    num: "02",
    title: "Diseñamos tu espacio integral",
    description:
      "Interiorismo + muebles + arte en un único proceso creativo alineado a tu identidad.",
  },
  {
    num: "03",
    title: "Habitá tu esencia",
    description: "Entrás a tu espacio y sentís: esto soy yo.",
  },
];

export default function AsesoriaPage() {
  return (
    <div className="pt-28">
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <SectionReveal>
          <span className="font-body text-[10px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
            Tu primer paso
          </span>
          <h1 className="font-heading text-5xl md:text-6xl mt-4 text-brand-negro">
            Asesoría de Diseño
          </h1>
          <p className="font-body font-light text-brand-negro-suave mt-4 max-w-2xl text-lg leading-relaxed">
            Sabemos lo frustrante que es invertir en tu espacio y que todavía no
            se sienta tuyo. Que algo falte. Que no te inspire. Eso tiene
            solución.
          </p>
        </SectionReveal>
      </section>

      {/* Process */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-px">
          {steps.map((step, i) => (
            <SectionReveal key={step.num} delay={i * 100}>
              <div
                className={`p-10 ${
                  i === 2
                    ? "bg-brand-negro text-brand-blanco-calido"
                    : "bg-brand-crema"
                }`}
              >
                <span
                  className={`font-body text-6xl font-thin leading-none ${
                    i === 2
                      ? "text-brand-blanco-calido/5"
                      : "text-brand-negro/5"
                  }`}
                >
                  {step.num}
                </span>
                <h3
                  className={`font-heading text-xl mt-5 mb-3 ${
                    i === 2 ? "text-brand-blanco-calido" : "text-brand-negro"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`font-body text-sm font-light ${
                    i === 2 ? "text-brand-gris-nav/60" : "text-brand-gris-nav"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* Transformation */}
      <section className="mx-3 mb-16">
        <SectionReveal>
          <div className="grid md:grid-cols-2 gap-px">
            <div className="bg-brand-crema p-12">
              <span className="font-body text-[9px] tracking-[0.35em] uppercase text-brand-gris-nav mb-6 block">
                Antes
              </span>
              <p className="font-heading text-xl italic text-brand-gris-nav leading-relaxed">
                &ldquo;Seguir viviendo en un espacio que no te representa. Que
                no te inspira. Que le pertenece a otra versión de vos.&rdquo;
              </p>
            </div>
            <div className="bg-brand-negro p-12">
              <span className="font-body text-[9px] tracking-[0.35em] uppercase text-brand-gris-nav/50 mb-6 block">
                Después
              </span>
              <p className="font-heading text-xl italic text-brand-blanco-calido/80 leading-relaxed">
                &ldquo;Entrás a tu casa u oficina y sentís: esto soy yo. El
                espacio te habla. Te inspira. Cada detalle nació de tu
                esencia.&rdquo;
              </p>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <SectionReveal>
          <h2 className="font-heading text-3xl md:text-4xl text-brand-negro">
            ¿Tenés un espacio que todavía no te representa?
          </h2>
          <p className="font-body font-light text-brand-negro-suave mt-4 mb-8">
            Coordinamos tu primera asesoría por WhatsApp. Sin compromiso.
          </p>
          <WhatsAppCTA
            label="Coordiná tu asesoría"
            message="Hola Sofia, me gustaría coordinar una asesoría de diseño para mi espacio."
          />
        </SectionReveal>
      </section>
    </div>
  );
}
