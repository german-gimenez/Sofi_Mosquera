import Link from "next/link";
import { createDb, furniture, desc } from "@sofi/db";

export const dynamic = "force-dynamic";

export default async function FurnitureListPage() {
  const db = createDb();
  const allFurniture = await db.select().from(furniture).orderBy(desc(furniture.createdAt));

  return (
    <div className="min-h-screen">
      <header className="border-b border-brand-crema px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-medium tracking-wide">SM Admin</Link>
          <span className="text-brand-gris-nav">/</span>
          <span className="text-sm">Muebles</span>
        </div>
        <Link
          href="/muebles/nuevo"
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
              <th className="text-left text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav font-normal py-3">Materiales</th>
              <th className="text-left text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav font-normal py-3">Precio</th>
            </tr>
          </thead>
          <tbody>
            {allFurniture.map((piece) => (
              <tr key={piece.id} className="border-b border-brand-crema hover:bg-brand-crema/50 transition-colors">
                <td className="py-4 text-sm">{piece.title}</td>
                <td className="py-4 text-sm text-brand-gris-nav">{piece.materials ?? "—"}</td>
                <td className="py-4 text-sm text-brand-gris-nav">
                  {piece.priceArs ? `$${piece.priceArs.toLocaleString("es-AR")}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
