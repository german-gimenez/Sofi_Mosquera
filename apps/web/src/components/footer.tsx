import Link from "next/link";

const footerLinks = [
  {
    title: "Servicios",
    links: [
      { label: "Interiorismo", href: "/interiorismo" },
      { label: "Asesoría", href: "/asesoria" },
      { label: "Muebles", href: "/muebles" },
      { label: "Arte", href: "/arte" },
    ],
  },
  {
    title: "Sobre",
    links: [
      { label: "Sobre SM", href: "/sobre" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  {
    title: "Redes",
    links: [
      { label: "Instagram Interiorismo", href: "https://instagram.com/sofiamosquera.interiorismo" },
      { label: "Instagram Arte", href: "https://instagram.com/sofiamosquera.arte" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-brand-negro text-brand-blanco-calido mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <span className="font-heading text-3xl">SM</span>
            <p className="font-body font-light text-sm text-brand-gris-nav mt-4 leading-relaxed">
              Estudio de interiorismo, arte y muebles a medida. Diseñamos
              espacios que reflejan tu esencia.
            </p>
            <p className="font-body text-xs text-brand-gris-nav mt-4 tracking-wider uppercase">
              Mendoza, Argentina
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-body text-[10px] font-medium tracking-[0.3em] uppercase text-brand-gris-nav mb-6">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body text-sm font-light text-brand-blanco-calido hover:text-brand-gris-nav transition-colors"
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand-blanco-calido/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-brand-gris-nav/50">
            &copy; {new Date().getFullYear()} Sofia Mosquera. Todos los derechos reservados.
          </p>
          <p className="font-body text-xs text-brand-gris-nav/30 tracking-wider uppercase">
            &ldquo;Espacios que reflejan tu esencia&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
