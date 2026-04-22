import Link from "next/link";

const footerLinks = [
  {
    title: "Portfolio",
    links: [
      { label: "Proyectos", href: "/proyectos" },
      { label: "Arte", href: "/arte" },
      { label: "Muebles", href: "/muebles" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Sobre el estudio", href: "/studio" },
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
      <div className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div>
            <span className="font-heading text-3xl">SM</span>
            <p className="font-body font-light text-sm text-brand-gris-nav mt-4 leading-relaxed">
              Interiorismo, arte original y muebles a medida. Un único proceso
              creativo.
            </p>
            <p className="font-body text-xs text-brand-gris-nav mt-4 tracking-wider uppercase">
              Mendoza · Santiago
            </p>
          </div>

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

        <div className="border-t border-brand-blanco-calido/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-brand-gris-nav/50">
            &copy; {new Date().getFullYear()} Sofía Mosquera. Todos los derechos reservados.
          </p>
          <p className="font-body text-xs text-brand-gris-nav/30 tracking-wider uppercase">
            No decoramos. Habitamos.
          </p>
        </div>
      </div>
    </footer>
  );
}
