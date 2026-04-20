import Link from "next/link";
import Image from "next/image";
import { SectionReveal } from "@sofi/ui";
import { createDb, projects, desc } from "@sofi/db";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Proyectos integrales de interiorismo residencial y comercial por Sofia Mosquera.",
};

export default async function ProyectosPage() {
  const db = createDb();

  const allProjects = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.publishedAt));

  const featured = allProjects.filter((p) => p.featured);
  const rest = allProjects.filter((p) => !p.featured);

  return (
    <div className="pt-28">
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <SectionReveal>
          <span className="font-body text-[10px] font-medium tracking-[0.35em] uppercase text-brand-gris-nav">
            Portfolio
          </span>
          <h1 className="font-heading text-5xl md:text-6xl mt-4 text-brand-negro">
            Proyectos
          </h1>
          <p className="font-body font-light text-brand-negro-suave mt-4 max-w-2xl text-lg leading-relaxed">
            Cada proyecto nace de una visión integral: interiorismo, muebles a
            medida y arte original bajo una misma mirada.
          </p>
        </SectionReveal>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-2 gap-4">
            {featured.map((project, i) => (
              <SectionReveal key={project.id} delay={i * 80}>
                <Link href={`/proyectos/${project.slug}`} className="group block">
                  <div className="aspect-[4/3] bg-brand-crema rounded-image overflow-hidden mb-4 relative">
                    {project.coverUrl ? (
                      <Image
                        src={project.coverUrl}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" role="img" aria-label={project.title}>
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

      {/* Rest */}
      {rest.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <SectionReveal>
            <div className="flex items-center gap-5 mb-12">
              <span className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav">
                Más proyectos
              </span>
              <div className="flex-1 h-px bg-brand-crema" />
            </div>
          </SectionReveal>

          <div className="grid md:grid-cols-3 gap-4">
            {rest.map((project, i) => (
              <SectionReveal key={project.id} delay={i * 60}>
                <Link href={`/proyectos/${project.slug}`} className="group block">
                  <div className="aspect-[4/3] bg-brand-crema rounded-image overflow-hidden mb-3 relative">
                    {project.coverUrl ? (
                      <Image
                        src={project.coverUrl}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" role="img" aria-label={project.title}>
                        <span className="font-heading text-5xl text-brand-gris-border/40">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-heading text-lg text-brand-negro group-hover:text-brand-gris-nav transition-colors">
                    {project.title}
                  </h3>
                  <p className="font-body text-xs font-light text-brand-gris-nav mt-1">
                    {project.location} · {project.year}
                  </p>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </section>
      )}

      {allProjects.length === 0 && (
        <div className="text-center py-20 max-w-7xl mx-auto px-6">
          <p className="font-body text-brand-gris-nav">
            Próximamente — estamos preparando el portfolio.
          </p>
        </div>
      )}
    </div>
  );
}
