import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <span className="font-heading text-[120px] leading-none text-brand-gris-border/30">
          404
        </span>
        <h1 className="font-heading text-3xl text-brand-negro mt-4">
          Página no encontrada
        </h1>
        <p className="font-body font-light text-brand-gris-nav mt-4">
          La página que buscás no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-block font-body text-sm text-brand-negro border-b border-brand-negro pb-0.5 mt-8 hover:text-brand-gris-nav hover:border-brand-gris-nav transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
