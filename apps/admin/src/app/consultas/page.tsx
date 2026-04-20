import Link from "next/link";
import { createDb, inquiries, desc } from "@sofi/db";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const db = createDb();
  const allInquiries = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));

  return (
    <div className="min-h-screen">
      <header className="border-b border-brand-crema px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-xl font-medium tracking-wide">SM Admin</Link>
        <span className="text-brand-gris-nav">/</span>
        <span className="text-sm">Consultas</span>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-brand-crema">
              <th className="text-left text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav font-normal py-3">Fecha</th>
              <th className="text-left text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav font-normal py-3">Tipo</th>
              <th className="text-left text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav font-normal py-3">Nombre</th>
              <th className="text-left text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav font-normal py-3">Email</th>
              <th className="text-left text-[9px] tracking-[0.3em] uppercase text-brand-gris-nav font-normal py-3">Mensaje</th>
            </tr>
          </thead>
          <tbody>
            {allInquiries.map((inquiry) => (
              <tr key={inquiry.id} className="border-b border-brand-crema">
                <td className="py-4 text-xs text-brand-gris-nav">
                  {inquiry.createdAt.toLocaleDateString("es-AR")}
                </td>
                <td className="py-4">
                  <span className="text-[9px] tracking-wider uppercase bg-brand-crema px-2 py-1">
                    {inquiry.kind}
                  </span>
                </td>
                <td className="py-4 text-sm">{inquiry.name ?? "—"}</td>
                <td className="py-4 text-sm text-brand-gris-nav">{inquiry.email ?? "—"}</td>
                <td className="py-4 text-sm text-brand-gris-nav max-w-xs truncate">
                  {inquiry.message ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {allInquiries.length === 0 && (
          <p className="text-center py-16 text-brand-gris-nav">
            No hay consultas todavía.
          </p>
        )}
      </main>
    </div>
  );
}
