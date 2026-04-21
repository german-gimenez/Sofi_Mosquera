import {
  SectionReveal,
  WhatsAppCTA,
  WHATSAPP_MESSAGES,
  buildWhatsAppUrl,
} from "@sofi/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta a Sofia Mosquera. Interiorismo, arte y muebles a medida en Mendoza, Argentina.",
};

const contactInfo = [
  {
    label: "WhatsApp",
    value: "+54 9 261 545 6913",
    href: buildWhatsAppUrl(WHATSAPP_MESSAGES.contacto),
  },
  {
    label: "Instagram Interiorismo",
    value: "@sofiamosquera.interiorismo",
    href: "https://instagram.com/sofiamosquera.interiorismo",
  },
  {
    label: "Instagram Arte",
    value: "@sofiamosquera.arte",
    href: "https://instagram.com/sofiamosquera.arte",
  },
  {
    label: "Ubicacion",
    value: "Mendoza, Argentina",
    href: null,
  },
  {
    label: "Horarios",
    value: "Lunes a viernes · 09:00 a 18:00",
    href: null,
  },
];

const faqs = [
  {
    q: "Trabajan fuera de Mendoza?",
    a: "Si. Hemos realizado proyectos en todo el pais y en Chile. Coordinamos visitas presenciales o trabajamos con renders y videollamadas.",
  },
  {
    q: "Cuanto dura un proyecto integral?",
    a: "Entre 3 y 8 meses dependiendo del alcance. Empezamos con una asesoria inicial donde definimos tiempos concretos para tu proyecto.",
  },
  {
    q: "Puedo comprar solo una obra de arte o un mueble?",
    a: "Por supuesto. Las obras estan disponibles via WhatsApp y los muebles se fabrican a medida segun especificacion. Coordinamos envio a cualquier parte del pais.",
  },
  {
    q: "Como es el proceso de una asesoria?",
    a: "Primero conversamos por WhatsApp para entender tu espacio y tus necesidades. Luego coordinamos una visita presencial o virtual, y te entregamos una propuesta concreta.",
  },
];

export default function ContactoPage() {
  return (
    <div className="pt-28">
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <SectionReveal>
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <span className="font-body text-[10px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
                Contacto
              </span>
              <h1 className="font-heading text-5xl md:text-6xl mt-4 text-brand-negro">
                Hablemos de
                <br />
                tu proyecto
              </h1>
              <p className="font-body font-light text-brand-negro-suave mt-6 leading-relaxed">
                Si tenes un espacio que todavia no te representa — una casa, una
                oficina, un local — coordinamos una asesoria y empezamos a
                diseñar tu esencia.
              </p>

              <div className="mt-10">
                <WhatsAppCTA
                  label="Escribinos por WhatsApp"
                  message={WHATSAPP_MESSAGES.contacto}
                />
              </div>
            </div>

            <div className="space-y-0">
              {contactInfo.map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-baseline py-5 border-b border-brand-crema"
                >
                  <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav">
                    {item.label}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-sm text-brand-negro hover:text-brand-gris-nav transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="font-body text-sm text-brand-negro">
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <SectionReveal>
          <div className="flex items-center gap-5 mb-12">
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
    </div>
  );
}
