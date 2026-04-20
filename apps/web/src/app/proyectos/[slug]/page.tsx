import { notFound } from "next/navigation";
import Link from "next/link";
import { createDb, projects, eq } from "@sofi/db";
import { SectionReveal, WhatsAppCTA } from "@sofi/ui";
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

  const gallery = (project.gallery as string[]) ?? [];

  return (
    <div className="pt-20">
      <ProjectHero
        title={project.title}
        coverUrl={project.coverUrl ?? undefined}
      />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <SectionReveal>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div>
              <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav">
                Categoría
              </span>
              <p className="font-body text-sm mt-1 capitalize">{project.category}</p>
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
                  Ubicación
                </span>
                <p className="font-body text-sm mt-1">{project.location}</p>
              </div>
            )}
          </div>
        </SectionReveal>

        {project.summary && (
          <SectionReveal>
            <p className="font-body font-light text-lg text-brand-negro-suave leading-relaxed mb-16">
              {project.summary}
            </p>
          </SectionReveal>
        )}

        {/* Gallery */}
        {gallery.length > 0 && (
          <div className="space-y-4">
            {gallery.map((url, i) => (
              <SectionReveal key={i} delay={i * 60}>
                <div className="aspect-[16/10] bg-brand-crema rounded-image overflow-hidden">
                  <img
                    src={url}
                    alt={`${project.title} — ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SectionReveal>
            ))}
          </div>
        )}

        {/* CTA */}
        <SectionReveal>
          <div className="mt-20 text-center">
            <p className="font-heading text-2xl text-brand-negro mb-6">
              ¿Te imaginás un espacio así?
            </p>
            <WhatsAppCTA
              label="Consultá tu proyecto"
              message={`Hola Sofia, vi el proyecto "${project.title}" y me gustaría consultar sobre algo similar.`}
            />
          </div>
        </SectionReveal>

        <div className="mt-16 pt-8 border-t border-brand-crema text-center">
          <Link
            href="/proyectos"
            className="font-body text-sm text-brand-gris-nav border-b border-brand-gris-nav pb-0.5 hover:text-brand-negro hover:border-brand-negro transition-colors"
          >
            &larr; Ver todos los proyectos
          </Link>
        </div>
      </div>
    </div>
  );
}
