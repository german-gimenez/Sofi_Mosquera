import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { createDb, projects, eq, asc, desc } from "@sofi/db";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cldCard, cldSrcSet } from "@sofi/ui";
import { pickLocale } from "@/lib/i18n-helpers";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "proyectos" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: tMeta("siteDescription"),
  };
}

export default async function ProyectosPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "proyectos" });
  const lc = locale as Locale;

  const db = createDb();
  const allProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.visible, true))
    .orderBy(asc(projects.position), desc(projects.publishedAt));

  return (
    <div className="pt-32 md:pt-40 pb-24">
      <section className="max-w-[1100px] mx-auto px-6 mb-12 md:mb-16">
        <span className="font-body text-[10px] font-medium tracking-[0.4em] uppercase text-brand-gris-nav">
          {t("eyebrow")}
        </span>
        <h1 className="font-heading text-5xl md:text-7xl text-brand-negro mt-4 leading-[1.05]">
          {t("title")}
        </h1>
        <p className="font-body font-light text-base md:text-lg text-brand-negro-suave mt-6 max-w-2xl leading-relaxed">
          {t("intro")}
        </p>
      </section>

      <section className="max-w-[1440px] mx-auto px-6 pb-12">
        {allProjects.length === 0 ? (
          <p className="font-body text-brand-gris-nav text-center py-20">
            {t("empty")}
          </p>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
            {allProjects.map((project, i) => {
              const aspect = i % 3 === 1 ? "aspect-[3/4]" : "aspect-[4/5]";
              const title = pickLocale(project.title, project.titleEn, lc);
              const subtitle = pickLocale(
                project.subtitle ?? null,
                project.subtitleEn ?? null,
                lc
              );
              const meta =
                [project.year, project.location].filter(Boolean).join(" · ") ||
                null;
              return (
                <Link
                  key={project.id}
                  href={{
                    pathname: "/proyectos/[slug]",
                    params: { slug: project.slug },
                  }}
                  className="group mb-4 block break-inside-avoid relative"
                >
                  <div
                    className={`bg-brand-crema overflow-hidden relative ${aspect}`}
                  >
                    {project.coverUrl ? (
                      <>
                        <img
                          src={cldCard(project.coverUrl)}
                          srcSet={cldSrcSet(
                            project.coverUrl,
                            [480, 768, 1200, 1920],
                            { h: 2400, crop: "fill", g: "auto" }
                          )}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
                          loading={i < 3 ? "eager" : "lazy"}
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
                  <span className="sr-only">
                    {title}
                    {subtitle ? ` — ${subtitle}` : ""}
                    {meta ? ` (${meta})` : ""}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
