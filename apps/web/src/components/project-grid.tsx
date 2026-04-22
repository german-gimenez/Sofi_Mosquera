import Link from "next/link";
import { cldCard, cldSrcSet } from "@sofi/ui";

interface ProjectCard {
  id: number;
  slug: string;
  title: string;
  location: string | null;
  coverUrl: string | null;
}

interface ProjectGridProps {
  projects: ProjectCard[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <section className="max-w-[1440px] mx-auto px-6 py-16 md:py-[120px]">
        <p className="font-body text-brand-gris-nav text-center">
          Proximamente — estamos preparando el portfolio.
        </p>
      </section>
    );
  }

  return (
    <section
      className="max-w-[1440px] mx-auto px-6 py-16 md:py-[120px]"
      aria-label="Proyectos"
    >
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {projects.map((project, i) => {
          const aspect = i % 3 === 1 ? "aspect-[3/4]" : "aspect-[4/5]";
          return (
            <Link
              key={project.id}
              href={`/proyectos/${project.slug}`}
              className="group mb-4 block break-inside-avoid"
            >
              <div
                className={
                  "bg-brand-crema rounded-image overflow-hidden relative " +
                  aspect
                }
              >
                {project.coverUrl ? (
                  <>
                    <img
                      src={cldCard(project.coverUrl)}
                      srcSet={cldSrcSet(project.coverUrl, [480, 768, 1200, 1920], {
                        h: 2400,
                        crop: "fill",
                        g: "auto",
                      })}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                    />
                    <div
                      className="absolute inset-0 bg-brand-negro/0 group-hover:bg-brand-negro/10 transition-colors duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none"
                      aria-hidden="true"
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 p-5 md:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms] pointer-events-none"
                      aria-hidden="true"
                    >
                      <span className="block font-heading text-xl md:text-2xl text-brand-blanco-calido leading-tight">
                        {project.title}
                      </span>
                      {project.location && (
                        <span className="block font-body text-xs text-brand-blanco-calido/80 mt-1">
                          {project.location}
                        </span>
                      )}
                    </div>
                  </>
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

              <div className="mt-3">
                <h3 className="font-heading text-lg md:text-xl text-brand-negro group-hover:text-brand-gris-nav transition-colors">
                  {project.title}
                </h3>
                {project.location && (
                  <p className="font-body text-xs text-brand-gris-nav mt-0.5 tracking-wide">
                    {project.location}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
