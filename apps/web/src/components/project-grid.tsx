import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { cldCard, cldSrcSet } from "@sofi/ui";
import { pickLocale } from "@/lib/i18n-helpers";
import type { Locale } from "@/i18n/routing";

interface ProjectCard {
  id: number;
  slug: string;
  title: string;
  titleEn?: string | null;
  subtitle?: string | null;
  subtitleEn?: string | null;
  year?: number | null;
  location: string | null;
  coverUrl: string | null;
}

interface ProjectGridProps {
  projects: ProjectCard[];
}

/**
 * Project grid V3 (P-01 applied).
 *
 * - Masonry-ish grid (CSS columns) with mixed aspect ratios.
 * - NO permanent text below cards (per V3 P-01).
 * - Title + year/location revealed only on hover overlay.
 * - Hover scale 1.03 with cubic-bezier easing.
 */
export function ProjectGrid({ projects }: ProjectGridProps) {
  const locale = useLocale() as Locale;

  if (projects.length === 0) {
    return (
      <section className="max-w-[1440px] mx-auto px-6 py-16 md:py-[120px]">
        <p className="font-body text-brand-gris-nav text-center">
          —
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
          const title = pickLocale(project.title, project.titleEn, locale);
          const subtitle = pickLocale(
            project.subtitle ?? null,
            project.subtitleEn ?? null,
            locale
          );
          const meta =
            [project.year, project.location].filter(Boolean).join(" · ") ||
            null;

          return (
            <Link
              key={project.id}
              href={{ pathname: "/proyectos/[slug]", params: { slug: project.slug } }}
              className="group mb-4 block break-inside-avoid relative"
            >
              <div
                className={
                  "bg-brand-crema overflow-hidden relative " + aspect
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
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                    />
                    <div
                      className="absolute inset-0 bg-brand-negro/0 group-hover:bg-brand-negro/35 transition-colors duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none"
                      aria-hidden="true"
                    />
                    <div
                      className="absolute inset-x-0 bottom-0 p-5 md:p-7 opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms] pointer-events-none"
                      aria-hidden="true"
                    >
                      {meta && (
                        <span className="block font-body text-[10px] tracking-[0.3em] uppercase text-brand-blanco-calido/85">
                          {meta}
                        </span>
                      )}
                      <span className="block font-heading text-2xl md:text-3xl text-brand-blanco-calido leading-tight mt-1">
                        {title}
                      </span>
                      {subtitle && (
                        <span className="block font-body text-sm font-light text-brand-blanco-calido/85 mt-1">
                          {subtitle}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    role="img"
                    aria-label={title}
                  >
                    <span className="font-heading text-6xl text-brand-gris-border/40">
                      {title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              {/* P-01: No permanent text below card. Title appears only on hover overlay above. */}
              <span className="sr-only">
                {title}
                {subtitle ? ` — ${subtitle}` : ""}
                {meta ? ` (${meta})` : ""}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
