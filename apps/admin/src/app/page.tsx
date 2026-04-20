import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { createDb, projects, artworks, furniture, inquiries, count } from "@sofi/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const db = createDb();

  const [projectCount] = await db.select({ count: count() }).from(projects);
  const [artworkCount] = await db.select({ count: count() }).from(artworks);
  const [furnitureCount] = await db.select({ count: count() }).from(furniture);
  const [inquiryCount] = await db.select({ count: count() }).from(inquiries);

  const stats = [
    { label: "Proyectos", count: projectCount.count, href: "/proyectos" },
    { label: "Obras", count: artworkCount.count, href: "/obras" },
    { label: "Muebles", count: furnitureCount.count, href: "/muebles" },
    { label: "Consultas", count: inquiryCount.count, href: "/consultas" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-brand-crema px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-body text-xl font-medium tracking-wide">SM Admin</span>
          <nav className="hidden md:flex items-center gap-4 ml-8">
            <Link href="/proyectos" className="text-sm text-brand-gris-nav hover:text-brand-negro transition-colors">
              Proyectos
            </Link>
            <Link href="/obras" className="text-sm text-brand-gris-nav hover:text-brand-negro transition-colors">
              Obras
            </Link>
            <Link href="/muebles" className="text-sm text-brand-gris-nav hover:text-brand-negro transition-colors">
              Muebles
            </Link>
            <Link href="/consultas" className="text-sm text-brand-gris-nav hover:text-brand-negro transition-colors">
              Consultas
            </Link>
          </nav>
        </div>
        <UserButton />
      </header>

      {/* Dashboard */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-light mb-2">Panel de Administración</h1>
        <p className="text-sm text-brand-gris-nav mb-10">
          Gestioná el contenido de sofimosquera.com
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-brand-crema p-6 hover:bg-brand-gris-border/30 transition-colors"
            >
              <p className="text-3xl font-thin">{stat.count}</p>
              <p className="text-xs text-brand-gris-nav tracking-wider uppercase mt-2">
                {stat.label}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-3">
          <Link
            href="/proyectos/nuevo"
            className="bg-brand-negro text-brand-blanco-calido p-6 text-center hover:bg-brand-negro-suave transition-colors"
          >
            <p className="text-sm">+ Nuevo proyecto</p>
          </Link>
          <Link
            href="/obras/nueva"
            className="bg-brand-negro text-brand-blanco-calido p-6 text-center hover:bg-brand-negro-suave transition-colors"
          >
            <p className="text-sm">+ Nueva obra de arte</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
