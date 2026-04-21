import Link from "next/link";
import { createDb, artworks, desc } from "@sofi/db";

export const dynamic = "force-dynamic";

export default async function ArtworksListPage() {
  const db = createDb();
  const allArtworks = await db.select().from(artworks).orderBy(desc(artworks.createdAt));

  return (
    <div className="min-h-screen">
      <header className="border-b border-brand-crema px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-medium tracking-wide">SM Admin</Link>
          <span className="text-brand-gris-nav">/</span>
          <span className="text-sm">Obras</span>
        </div>
        <Link
          href="/obras/nueva"
          className="bg-brand-negro text-brand-blanco-calido px-4 py-2 text-sm hover:bg-brand-negro-suave transition-colors"
        >
          + Nueva
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-crema">
              <th className="text-left text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav font-normal py-3">Título</th>
              <th className="text-left text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav font-normal py-3">Serie</th>
              <th className="text-left text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav font-normal py-3">Estado</th>
              <th className="text-left text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav font-normal py-3">Precio</th>
            </tr>
          </thead>
          <tbody>
            {allArtworks.map((artwork) => (
              <tr key={artwork.id} className="border-b border-brand-crema hover:bg-brand-crema/50 transition-colors">
                <td className="py-4">
                  <span className="text-sm">{artwork.title}</span>
                  <span className="block text-xs text-brand-gris-nav">
                    {artwork.slug}
                  </span>
                </td>
                <td className="py-4 text-sm text-brand-gris-nav">{artwork.series ?? "—"}</td>
                <td className="py-4">
                  <span className={`text-[9px] tracking-wider uppercase px-2 py-1 ${
                    artwork.status === "vendido" ? "bg-brand-negro text-brand-blanco-calido" : "bg-brand-crema"
                  }`}>
                    {artwork.status}
                  </span>
                </td>
                <td className="py-4 text-sm text-brand-gris-nav">
                  {artwork.priceArs ? `$${artwork.priceArs.toLocaleString("es-AR")}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
