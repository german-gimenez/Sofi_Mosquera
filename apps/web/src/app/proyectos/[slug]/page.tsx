import { notFound } from "next/navigation";
import Link from "next/link";
import { createDb, projects, eq, and, ne } from "@sofi/db";
import {
  SectionReveal,
  WhatsAppCTA,
  projectMessage,
  cldCard,
  cldHero,
  cldSrcSet,
} from "@sofi/ui";
import { ProjectHero } from "@/components/project-hero";
import { GalleryLightbox } from "@/components/gallery-lightbox";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import {
  jsonLdScript,
  projectCreativeWorkSchema,
} from "@/lib/structured-data";
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

function capWords(text: string, max: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= max) return text;
  return words.slice(0, max).join(" ") + "…";
}

/**
 * Pulls optional before/after image pairs from the gallery using a naming
 * convention: public_ids containing "antes" or "before" are treated as the
 * before image, paired with the next non-before image. Falls back to none
 * until Sofía uploads before/after pairs.
 */
function extractBeforeAfter(gallery: string[]): {
  before: string;
  after: string;
} | null {
  const beforeIdx = gallery.findIndex((id) =>
    /(antes|before)/i.test(id)
  );
  if (beforeIdx === -1) return null;
  const before = gallery[beforeIdx];
  const afterIdx = gallery.findIndex(
    (id, i) => i !== beforeIdx && !/(antes|before)/i.test(id)
  );
  if (afterIdx === -1) return null;
  return { before, after: gallery[afterIdx] };
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
  const beforeAfter = extractBeforeAfter(gallery);
  // If we extracted a before/after, remove those ids from the main gallery
  const mainGallery = beforeAfter
    ? gallery.filter((id) => id !== beforeAfter.before && id !== beforeAfter.after)
    : gallery;

  const summaryCapped = project.summary
    ? capWords(project.summary, 80)
    : null;

  const schema = projectCreativeWorkSchema({
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    year: project.year,
    location: project.location,
    category: project.category,
    coverImageUrl: project.coverUrl ? cldHero(project.coverUrl) : null,
  });

  return (
    <div className="pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(schema)}
      />
      <ProjectHero
        title={project.title}
        coverUrl={project.coverUrl ?? undefined}
      />

      <div className="max-w-[1440px] mx-auto px-6 py-16 md:py-[120px]">
        <SectionReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-14 pb-10 border-b border-brand-crema">
            {project.location && (
              <div>
                <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav">
                  Ciudad
                </span>
                <p className="font-body text-sm mt-1">{project.location}</p>
              </div>
            )}
            <div>
              <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav">
                Tipo de espacio
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
            {tags.length > 0 && (
              <div>
                <span className="font-body text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav">
                  Alcance
                </span>
                <p className="font-body text-sm mt-1">
                  {tags.slice(0, 3).join(" / ")}
                </p>
              </div>
            )}
          </div>
        </SectionReveal>

        {summaryCapped && (
          <SectionReveal>
            <div className="max-w-2xl">
              <p className="font-body font-light text-lg md:text-xl text-brand-negro-suave leading-relaxed">
                {summaryCapped}
              </p>
            </div>
          </SectionReveal>
        )}
      </div>

      {beforeAfter && (
        <div className="max-w-6xl mx-auto px-6 pb-16 md:pb-[120px]">
          <SectionReveal>
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav block mb-6">
              Antes / despues
            </span>
            <BeforeAfterSlider
              beforeId={beforeAfter.before}
              afterId={beforeAfter.after}
              alt={project.title}
            />
          </SectionReveal>
        </div>
      )}

      {mainGallery.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 pb-16 md:pb-[120px]">
          <SectionReveal>
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav block mb-8">
              Galeria
            </span>
          </SectionReveal>
          <GalleryLightbox publicIds={mainGallery} title={project.title} />
        </div>
      )}

      {tags.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <SectionReveal>
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav block mb-5">
              Materiales y arte
            </span>
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="font-body text-xs text-brand-negro bg-brand-crema px-3 py-1.5 rounded-pill"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </SectionReveal>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 pb-16">
        <SectionReveal>
          <div className="text-center py-12 border-t border-b border-brand-crema">
            <p className="font-heading text-2xl md:text-3xl text-brand-negro mb-6">
              ¿Querés algo así?
            </p>
            <WhatsAppCTA
              label="Coordiná una asesoría"
              message={projectMessage(project.title)}
              ariaLabel={`Consultar por WhatsApp sobre un proyecto similar a ${project.title}`}
            />
          </div>
        </SectionReveal>
      </div>

      {related.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 pb-20">
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
                        srcSet={cldSrcSet(p.coverUrl, [480, 768, 1000, 1200], {
                          h: 900,
                          crop: "fill",
                          g: "auto",
                        })}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
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
                  {p.location && (
                    <p className="font-body text-xs text-brand-gris-nav mt-0.5">
                      {p.location}
                    </p>
                  )}
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
          ← Ver todos los proyectos
        </Link>
      </div>
    </div>
  );
}
