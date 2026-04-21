import { redirect } from "next/navigation";
import { createDb, furniture } from "@sofi/db";
import Link from "next/link";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function createFurniture(formData: FormData) {
  "use server";

  const db = createDb();
  const title = formData.get("title") as string;

  await db.insert(furniture).values({
    slug: slugify(title),
    title,
    description: (formData.get("description") as string) || null,
    materials: (formData.get("materials") as string) || null,
    dimensions: (formData.get("dimensions") as string) || null,
    priceArs: formData.get("price") ? Number(formData.get("price")) : null,
    featured: formData.get("featured") === "on",
    publishedAt: formData.get("publish") === "on" ? new Date() : null,
  });

  redirect("/muebles");
}

export default function NewFurniturePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-brand-crema px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-xl font-medium tracking-wide">
          SM Admin
        </Link>
        <span className="text-brand-gris-nav">/</span>
        <Link
          href="/muebles"
          className="text-sm text-brand-gris-nav hover:text-brand-negro"
        >
          Muebles
        </Link>
        <span className="text-brand-gris-nav">/</span>
        <span className="text-sm">Nuevo</span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-light mb-8">Nuevo Mueble</h1>

        <form action={createFurniture} className="space-y-6">
          <div>
            <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-2">
              Título *
            </label>
            <input
              name="title"
              required
              className="w-full border border-brand-crema bg-brand-blanco-calido px-4 py-3 text-sm focus:outline-none focus:border-brand-gris-nav"
            />
          </div>

          <div>
            <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              rows={4}
              className="w-full border border-brand-crema bg-brand-blanco-calido px-4 py-3 text-sm focus:outline-none focus:border-brand-gris-nav resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-2">
                Materiales
              </label>
              <input
                name="materials"
                className="w-full border border-brand-crema bg-brand-blanco-calido px-4 py-3 text-sm focus:outline-none focus:border-brand-gris-nav"
                placeholder="Roble, hierro forjado"
              />
            </div>
            <div>
              <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-2">
                Dimensiones
              </label>
              <input
                name="dimensions"
                className="w-full border border-brand-crema bg-brand-blanco-calido px-4 py-3 text-sm focus:outline-none focus:border-brand-gris-nav"
                placeholder="220 x 100 x 75 cm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-2">
              Precio (ARS)
            </label>
            <input
              name="price"
              type="number"
              className="w-full border border-brand-crema bg-brand-blanco-calido px-4 py-3 text-sm focus:outline-none focus:border-brand-gris-nav"
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="featured"
                className="accent-brand-negro"
              />
              Destacado
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="publish"
                className="accent-brand-negro"
              />
              Publicar ahora
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-negro text-brand-blanco-calido py-3 text-sm hover:bg-brand-negro-suave transition-colors"
          >
            Crear mueble
          </button>
        </form>
      </main>
    </div>
  );
}
