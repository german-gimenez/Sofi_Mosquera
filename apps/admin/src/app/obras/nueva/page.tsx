import { redirect } from "next/navigation";
import { createDb, artworks } from "@sofi/db";
import Link from "next/link";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function createArtwork(formData: FormData) {
  "use server";

  const db = createDb();
  const title = formData.get("title") as string;

  await db.insert(artworks).values({
    slug: slugify(title),
    title,
    series: (formData.get("series") as string) || null,
    year: formData.get("year") ? Number(formData.get("year")) : null,
    widthCm: formData.get("width") ? Number(formData.get("width")) : null,
    heightCm: formData.get("height") ? Number(formData.get("height")) : null,
    technique: (formData.get("technique") as string) || null,
    priceArs: formData.get("price") ? Number(formData.get("price")) : null,
    status: (formData.get("status") as string) || "disponible",
    featured: formData.get("featured") === "on",
    publishedAt: formData.get("publish") === "on" ? new Date() : null,
  });

  redirect("/obras");
}

export default function NewArtworkPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-brand-crema px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-xl font-medium tracking-wide">SM Admin</Link>
        <span className="text-brand-gris-nav">/</span>
        <Link href="/obras" className="text-sm text-brand-gris-nav hover:text-brand-negro">Obras</Link>
        <span className="text-brand-gris-nav">/</span>
        <span className="text-sm">Nueva</span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-light mb-8">Nueva Obra de Arte</h1>

        <form action={createArtwork} className="space-y-6">
          <div>
            <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-2">Título *</label>
            <input name="title" required className="w-full border border-brand-crema bg-brand-blanco-calido px-4 py-3 text-sm focus:outline-none focus:border-brand-gris-nav" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-2">Serie</label>
              <input name="series" className="w-full border border-brand-crema bg-brand-blanco-calido px-4 py-3 text-sm focus:outline-none focus:border-brand-gris-nav" placeholder="Emociones" />
            </div>
            <div>
              <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-2">Técnica</label>
              <input name="technique" className="w-full border border-brand-crema bg-brand-blanco-calido px-4 py-3 text-sm focus:outline-none focus:border-brand-gris-nav" placeholder="Acrílico sobre lienzo" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-2">Ancho (cm)</label>
              <input name="width" type="number" className="w-full border border-brand-crema bg-brand-blanco-calido px-4 py-3 text-sm focus:outline-none focus:border-brand-gris-nav" />
            </div>
            <div>
              <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-2">Alto (cm)</label>
              <input name="height" type="number" className="w-full border border-brand-crema bg-brand-blanco-calido px-4 py-3 text-sm focus:outline-none focus:border-brand-gris-nav" />
            </div>
            <div>
              <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-2">Año</label>
              <input name="year" type="number" className="w-full border border-brand-crema bg-brand-blanco-calido px-4 py-3 text-sm focus:outline-none focus:border-brand-gris-nav" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-2">Precio (ARS)</label>
              <input name="price" type="number" className="w-full border border-brand-crema bg-brand-blanco-calido px-4 py-3 text-sm focus:outline-none focus:border-brand-gris-nav" />
            </div>
            <div>
              <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-2">Estado</label>
              <select name="status" className="w-full border border-brand-crema bg-brand-blanco-calido px-4 py-3 text-sm focus:outline-none focus:border-brand-gris-nav">
                <option value="disponible">Disponible</option>
                <option value="reservado">Reservado</option>
                <option value="vendido">Vendido</option>
              </select>
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="featured" className="accent-brand-negro" />
              Destacado
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="publish" className="accent-brand-negro" />
              Publicar ahora
            </label>
          </div>

          <button type="submit" className="w-full bg-brand-negro text-brand-blanco-calido py-3 text-sm hover:bg-brand-negro-suave transition-colors">
            Crear obra
          </button>
        </form>
      </main>
    </div>
  );
}
