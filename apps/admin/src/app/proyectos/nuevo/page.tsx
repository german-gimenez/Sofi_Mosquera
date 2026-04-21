"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CloudinaryUpload } from "@/components/cloudinary-upload";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewProjectPage() {
  const router = useRouter();
  const [coverId, setCoverId] = useState<string>("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      slug: slugify(formData.get("title") as string),
      title: formData.get("title"),
      summary: formData.get("summary"),
      category: formData.get("category"),
      year: formData.get("year") ? Number(formData.get("year")) : null,
      location: formData.get("location"),
      featured: formData.get("featured") === "on",
      publish: formData.get("publish") === "on",
      coverUrl: coverId,
      gallery,
    };

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/proyectos");
    } else {
      setSubmitting(false);
      alert("Error al crear el proyecto");
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-brand-crema px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-xl font-medium tracking-wide">SM Admin</Link>
        <span className="text-brand-gris-nav">/</span>
        <Link href="/proyectos" className="text-sm text-brand-gris-nav hover:text-brand-negro">Proyectos</Link>
        <span className="text-brand-gris-nav">/</span>
        <span className="text-sm">Nuevo</span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-light mb-8">Nuevo Proyecto</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-2">Título *</label>
            <input name="title" required className="w-full border border-brand-crema bg-brand-blanco-calido px-4 py-3 text-sm focus:outline-none focus:border-brand-gris-nav" />
          </div>

          <div>
            <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-2">Resumen</label>
            <textarea name="summary" rows={4} className="w-full border border-brand-crema bg-brand-blanco-calido px-4 py-3 text-sm focus:outline-none focus:border-brand-gris-nav resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-2">Categoría</label>
              <select name="category" className="w-full border border-brand-crema bg-brand-blanco-calido px-4 py-3 text-sm focus:outline-none focus:border-brand-gris-nav">
                <option value="residencial">Residencial</option>
                <option value="comercial">Comercial</option>
              </select>
            </div>
            <div>
              <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-2">Año</label>
              <input name="year" type="number" className="w-full border border-brand-crema bg-brand-blanco-calido px-4 py-3 text-sm focus:outline-none focus:border-brand-gris-nav" placeholder="2025" />
            </div>
          </div>

          <div>
            <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-2">Ubicación</label>
            <input name="location" className="w-full border border-brand-crema bg-brand-blanco-calido px-4 py-3 text-sm focus:outline-none focus:border-brand-gris-nav" placeholder="Mendoza, Argentina" />
          </div>

          <div>
            <label className="block text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav mb-3">Imágenes</label>
            <div className="border border-brand-crema bg-brand-blanco-calido p-4">
              <CloudinaryUpload
                folder="sofi-mosquera/projects"
                label="Subir imágenes del proyecto"
                onUploaded={(publicId) => {
                  if (!coverId) setCoverId(publicId);
                  setGallery((g) => [...g, publicId]);
                }}
              />
              {coverId && (
                <p className="text-xs text-brand-gris-nav mt-3">
                  Portada: <code className="text-brand-negro">{coverId}</code>
                </p>
              )}
              {gallery.length > 0 && (
                <p className="text-xs text-brand-gris-nav mt-1">
                  Galería: {gallery.length} imagen(es)
                </p>
              )}
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

          <button type="submit" disabled={submitting} className="w-full bg-brand-negro text-brand-blanco-calido py-3 text-sm hover:bg-brand-negro-suave transition-colors disabled:opacity-50">
            {submitting ? "Creando..." : "Crear proyecto"}
          </button>
        </form>
      </main>
    </div>
  );
}
