import Link from "next/link";
import { SectionReveal, cldCard } from "@sofi/ui";
import { createDb, projects, desc } from "@sofi/db";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Interiorismo",
  description:
    "Proyectos integrales de interiorismo residencial y comercial. Diseño que refleja la esencia de quien habita cada espacio.",
};

export default async function InteriorismoPage() {
  const db = createDb();

  const allProjects = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.publishedAt));

  const residencial = allProjects.filter((p) => p.category === "residencial");
  const comercial = allProjects.filter((p) => p.category === "comercial");

  return (
    <div className="pt-28">
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <SectionReveal>
          <span className="font-body text-[10px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
            Servicios
          </span>
          <h1 className="font-heading text-5xl md:text-6xl mt-4 text-brand-negro">
            Interiorismo
          </h1>
          <p className="font-body font-light text-brand-negro-suave mt-4 max-w-2xl text-lg leading-relaxed">
            Diseñamos cada espacio desde una vision integral, combinando
            materiales nobles, arte y muebles a medida para crear ambientes que
            dialogan con quienes los habitan.
          </p>
        </SectionReveal>
      </section>

      {residencial.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <SectionReveal>
            <div className="flex items-center gap-5 mb-12">
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav">
                01
              </span>
              <h2 className="font-body text-[10px] tracking-[0.35em] uppercase font-medium">
                Residencial
              </h2>
              <div className="flex-1 h-px bg-brand-crema" />
            </div>
          </SectionReveal>

          <div className="grid md:grid-cols-2 gap-4">
            {residencial.map((project, i) => (
              <SectionReveal key={project.id} delay={i * 80}>
                <Link
                  href={`/proyectos/${project.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] bg-brand-crema rounded-image overflow-hidden mb-4">
                    {project.coverUrl ? (
                      <img
                        src={cldCard(project.coverUrl)}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading={i < 2 ? "eager" : "lazy"}
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
                    {project.location} · {project.year}
                  </p>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </section>
      )}

      {comercial.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <SectionReveal>
            <div className="flex items-center gap-5 mb-12">
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav">
                02
              </span>
              <h2 className="font-body text-[10px] tracking-[0.35em] uppercase font-medium">
                Comercial
              </h2>
              <div className="flex-1 h-px bg-brand-crema" />
            </div>
          </SectionReveal>

          <div className="grid md:grid-cols-2 gap-4">
            {comercial.map((project, i) => (
              <SectionReveal key={project.id} delay={i * 80}>
                <Link
                  href={`/proyectos/${project.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] bg-brand-crema rounded-image overflow-hidden mb-4">
                    {project.coverUrl ? (
                      <img
                        src={cldCard(project.coverUrl)}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
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
                    {project.location} · {project.year}
                  </p>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
