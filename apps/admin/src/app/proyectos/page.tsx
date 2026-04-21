import Link from "next/link";
import { createDb, projects, desc } from "@sofi/db";

export const dynamic = "force-dynamic";

export default async function ProjectsListPage() {
  const db = createDb();
  const allProjects = await db.select().from(projects).orderBy(desc(projects.createdAt));

  return (
    <div className="min-h-screen">
      <header className="border-b border-brand-crema px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-medium tracking-wide">SM Admin</Link>
          <span className="text-brand-gris-nav">/</span>
          <span className="text-sm">Proyectos</span>
        </div>
        <Link
          href="/proyectos/nuevo"
          className="bg-brand-negro text-brand-blanco-calido px-4 py-2 text-sm hover:bg-brand-negro-suave transition-colors"
        >
          + Nuevo
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-crema">
              <th className="text-left text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav font-normal py-3">Título</th>
              <th className="text-left text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav font-normal py-3">Categoría</th>
              <th className="text-left text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav font-normal py-3">Año</th>
              <th className="text-left text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav font-normal py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {allProjects.map((project) => (
              <tr key={project.id} className="border-b border-brand-crema hover:bg-brand-crema/50 transition-colors">
                <td className="py-4">
                  <span className="text-sm">{project.title}</span>
                  <span className="block text-xs text-brand-gris-nav">
                    {project.slug}
                  </span>
                </td>
                <td className="py-4 text-sm text-brand-gris-nav capitalize">{project.category}</td>
                <td className="py-4 text-sm text-brand-gris-nav">{project.year ?? "—"}</td>
                <td className="py-4">
                  {project.publishedAt ? (
                    <span className="text-[9px] tracking-wider uppercase bg-brand-crema px-2 py-1">Publicado</span>
                  ) : (
                    <span className="text-[9px] tracking-wider uppercase bg-brand-gris-border/30 px-2 py-1">Borrador</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {allProjects.length === 0 && (
          <p className="text-center py-16 text-brand-gris-nav">
            No hay proyectos todavía.{" "}
            <Link href="/proyectos/nuevo" className="underline text-brand-negro">
              Creá el primero
            </Link>
          </p>
        )}
      </main>
    </div>
  );
}
