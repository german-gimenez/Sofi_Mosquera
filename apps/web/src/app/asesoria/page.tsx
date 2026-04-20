import { SectionReveal, WhatsAppCTA } from "@sofi/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Asesoria de Diseno",
  description:
    "Consulta tu proyecto con Sofia Mosquera. Asesorias de disen\u0303o de interiores para transformar tu espacio.",
};

const steps = [
  {
    num: "01",
    title: "Consulta tu proyecto",
    description:
      "Primera asesoria para entender tu espacio, tu esencia y lo que queres lograr.",
  },
  {
    num: "02",
    title: "Disen\u0303amos tu espacio integral",
    description:
      "Interiorismo + muebles + arte en un unico proceso creativo alineado a tu identidad.",
  },
  {
    num: "03",
    title: "Habita tu esencia",
    description: "Entras a tu espacio y sentis: esto soy yo.",
  },
];

const comparison = [
  {
    feature: "Duracion",
    asesoria: "1-2 sesiones",
    integral: "3-8 meses",
  },
  {
    feature: "Alcance",
    asesoria: "Orientacion puntual",
    integral: "Disen\u0303o completo + obra",
  },
  {
    feature: "Incluye renders 3D",
    asesoria: "No",
    integral: "Si",
  },
  {
    feature: "Gestion de proveedores",
    asesoria: "No",
    integral: "Si",
  },
  {
    feature: "Muebles a medida",
    asesoria: "Recomendaciones",
    integral: "Disen\u0303o y produccion",
  },
  {
    feature: "Obras de arte",
    asesoria: "Recomendaciones",
    integral: "Integracion custom",
  },
];

const faqs = [
  {
    q: "Que incluye la primera asesoria?",
    a: "Una sesion para entender tu espacio (puede ser presencial u online), relevamiento de tus necesidades, y recomendaciones iniciales sobre distribucion, materiales y estilo.",
  },
  {
    q: "Puedo contratar solo asesoria sin proyecto integral?",
    a: "Si. La asesoria es ideal si queres orientarte antes de decidir el alcance, o si ya tenes un equipo y solo necesitas direccion creativa.",
  },
  {
    q: "Trabajan fuera de Mendoza?",
    a: "Si. Hemos realizado proyectos en todo el pais y en Chile. Coordinamos visitas presenciales o trabajamos con renders y videollamadas.",
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
            Asesoria de Diseno
          </h1>
          <p className="font-body font-light text-brand-negro-suave mt-4 max-w-2xl text-lg leading-relaxed">
            Sabemos lo frustrante que es invertir en tu espacio y que todavia no
            se sienta tuyo. Que algo falte. Que no te inspire. Eso tiene
            solucion.
          </p>
        </SectionReveal>
      </section>

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

      {/* Comparison table */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <SectionReveal>
          <div className="flex items-center gap-5 mb-10">
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav">
              Cual eleges?
            </span>
            <div className="flex-1 h-px bg-brand-crema" />
          </div>

          <div className="overflow-hidden rounded-card border border-brand-crema">
            <table className="w-full">
              <thead className="bg-brand-crema">
                <tr>
                  <th className="text-left font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav font-normal p-4">
                    Servicio
                  </th>
                  <th className="text-left font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav font-normal p-4">
                    Asesoria
                  </th>
                  <th className="text-left font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav font-normal p-4">
                    Proyecto Integral
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-brand-crema bg-brand-blanco-calido"
                  >
                    <td className="font-body text-sm font-medium text-brand-negro p-4">
                      {row.feature}
                    </td>
                    <td className="font-body text-sm text-brand-gris-nav p-4">
                      {row.asesoria}
                    </td>
                    <td className="font-body text-sm text-brand-negro-suave p-4">
                      {row.integral}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionReveal>
      </section>

      {/* Before/After */}
      <section className="mx-3 mb-16">
        <SectionReveal>
          <div className="grid md:grid-cols-2 gap-px">
            <div className="bg-brand-crema p-12">
              <span className="font-body text-[9px] tracking-[0.35em] uppercase text-brand-gris-nav mb-6 block">
                Antes
              </span>
              <p className="font-heading text-xl italic text-brand-gris-nav leading-relaxed">
                &ldquo;Seguir viviendo en un espacio que no te representa. Que
                no te inspira. Que le pertenece a otra version de vos.&rdquo;
              </p>
            </div>
            <div className="bg-brand-negro p-12">
              <span className="font-body text-[9px] tracking-[0.35em] uppercase text-brand-gris-nav/50 mb-6 block">
                Despues
              </span>
              <p className="font-heading text-xl italic text-brand-blanco-calido/80 leading-relaxed">
                &ldquo;Entras a tu casa u oficina y sentis: esto soy yo. El
                espacio te habla. Te inspira. Cada detalle nacio de tu
                esencia.&rdquo;
              </p>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <SectionReveal>
          <div className="flex items-center gap-5 mb-10">
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav">
              Preguntas frecuentes
            </span>
            <div className="flex-1 h-px bg-brand-crema" />
          </div>
        </SectionReveal>

        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <SectionReveal key={i} delay={i * 60}>
              <details className="group border-b border-brand-crema py-6 cursor-pointer">
                <summary className="flex justify-between items-center font-heading text-lg text-brand-negro marker:hidden list-none">
                  {faq.q}
                  <span className="font-body text-2xl text-brand-gris-nav transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="font-body font-light text-brand-negro-suave mt-4 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <SectionReveal>
          <h2 className="font-heading text-3xl md:text-4xl text-brand-negro">
            Tenes un espacio que todavia no te representa?
          </h2>
          <p className="font-body font-light text-brand-negro-suave mt-4 mb-8">
            Coordinamos tu primera asesoria por WhatsApp. Sin compromiso.
          </p>
          <WhatsAppCTA
            label="Coordina tu asesoria"
            message="Hola Sofia, me gustaria coordinar una asesoria de disen\u0303o para mi espacio."
          />
        </SectionReveal>
      </section>
    </div>
  );
}
