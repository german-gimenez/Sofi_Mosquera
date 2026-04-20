import { SectionReveal, WhatsAppCTA } from "@sofi/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contactá a Sofia Mosquera. Interiorismo, arte y muebles a medida en Mendoza, Argentina.",
};

const contactInfo = [
  { label: "WhatsApp", value: "+54 9 261 545 6913", href: "https://wa.me/5492615456913" },
  { label: "Instagram Interiorismo", value: "@sofiamosquera.interiorismo", href: "https://instagram.com/sofiamosquera.interiorismo" },
  { label: "Instagram Arte", value: "@sofiamosquera.arte", href: "https://instagram.com/sofiamosquera.arte" },
  { label: "Ubicación", value: "Mendoza, Argentina", href: null },
];

export default function ContactoPage() {
  return (
    <div className="pt-28">
      <section className="max-w-7xl mx-auto px-6 pb-24">
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
                Si tenés un espacio que todavía no te representa — una casa, una
                oficina, un local — coordinamos una asesoría y empezamos a
                diseñar tu esencia.
              </p>

              <div className="mt-10">
                <WhatsAppCTA
                  label="Escribinos por WhatsApp"
                  message="Hola Sofia, me gustaría consultar sobre un proyecto."
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
    </div>
  );
}
