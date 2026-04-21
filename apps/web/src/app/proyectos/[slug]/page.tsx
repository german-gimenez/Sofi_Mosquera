import { notFound } from "next/navigation";
import Link from "next/link";
import { createDb, projects, eq, and, ne } from "@sofi/db";
import { SectionReveal, WhatsAppCTA, cldGallery, cldCard } from "@sofi/ui";
import { ProjectHero } from "@/components/project-hero";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const db = createDb();
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);

  if (!project) return {};
  return {
    title: project.title,
    description: project.summary ?? undefined,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const db = createDb();

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .limit(1);

  if (!project) notFound();

  const related = await db
    .select()
    .from(projects)
    .where(
      and(ne(projects.slug, slug), eq(projects.category, project.category))
    )
    .limit(3);

  const gallery = (project.gallery as string[]) ?? [];
  const tags = (project.tags as string[]) ?? [];

  return (
    <div className="pt-20">
      <ProjectHero
        title={project.title}
        coverUrl={project.coverUrl ?? undefined}
      />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <SectionReveal>
          <div className="grid md:grid-cols-4 gap-6 mb-16 pb-10 border-b border-brand-crema">
            <div>
              <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav">
                Categoria
              </span>
              <p className="font-body text-sm mt-1 capitalize">
                {project.category}
              </p>
            </div>
            {project.year && (
              <div>
                <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav">
                  Año
                </span>
                <p className="font-body text-sm mt-1">{project.year}</p>
              </div>
            )}
            {project.location && (
              <div>
                <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav">
                  Ubicacion
                </span>
                <p className="font-body text-sm mt-1">{project.location}</p>
              </div>
            )}
            {tags.length > 0 && (
              <div>
                <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav">
                  Tags
                </span>
                <p className="font-body text-sm mt-1">
                  {tags.slice(0, 3).join(" / ")}
                </p>
              </div>
            )}
          </div>
        </SectionReveal>

        {project.summary && (
          <SectionReveal>
            <div className="mb-16">
              <span className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav">
                Brief
              </span>
              <p className="font-body font-light text-lg text-brand-negro-suave leading-relaxed mt-4 max-w-2xl">
                {project.summary}
              </p>
            </div>
          </SectionReveal>
        )}
      </div>

      {/* Gallery full-width */}
      {gallery.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 space-y-4 pb-16">
          <SectionReveal>
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav block mb-8">
              Galeria
            </span>
          </SectionReveal>
          {gallery.map((publicId, i) => (
            <SectionReveal key={i} delay={i * 60}>
              <div className="aspect-[16/10] bg-brand-crema rounded-image overflow-hidden">
                <img
                  src={cldGallery(publicId)}
                  alt={`${project.title} — ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </SectionReveal>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 pb-16">
        <SectionReveal>
          <div className="text-center py-12 border-t border-b border-brand-crema">
            <p className="font-heading text-2xl md:text-3xl text-brand-negro mb-6">
              Te imaginas un espacio asi?
            </p>
            <WhatsAppCTA
              label="Consulta tu proyecto"
              message={`Hola Sofia, vi el proyecto "${project.title}" y me gustaria consultar sobre algo similar.`}
            />
          </div>
        </SectionReveal>
      </div>

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <SectionReveal>
            <h2 className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav mb-8">
              Proyectos relacionados
            </h2>
          </SectionReveal>
          <div className="grid md:grid-cols-3 gap-4">
            {related.map((p, i) => (
              <SectionReveal key={p.id} delay={i * 60}>
                <Link href={`/proyectos/${p.slug}`} className="group block">
                  <div className="aspect-[4/3] bg-brand-crema rounded-image overflow-hidden mb-3">
                    {p.coverUrl ? (
                      <img
                        src={cldCard(p.coverUrl)}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        role="img"
                        aria-label={p.title}
                      >
                        <span className="font-heading text-5xl text-brand-gris-border/40">
                          {p.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-heading text-lg text-brand-negro group-hover:text-brand-gris-nav transition-colors">
                    {p.title}
                  </h3>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </section>
      )}

      <div className="max-w-4xl mx-auto px-6 pb-24 pt-4 text-center">
        <Link
          href="/proyectos"
          className="font-body text-sm text-brand-gris-nav border-b border-brand-gris-nav pb-0.5 hover:text-brand-negro hover:border-brand-negro transition-colors"
        >
          &larr; Ver todos los proyectos
        </Link>
      </div>
    </div>
  );
}
