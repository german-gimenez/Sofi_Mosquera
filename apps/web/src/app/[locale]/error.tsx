"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <span className="font-heading text-6xl text-brand-gris-border/30">
          SM
        </span>
        <h1 className="font-heading text-3xl text-brand-negro mt-4">
          Algo salió mal
        </h1>
        <p className="font-body font-light text-brand-gris-nav mt-4">
          Estamos trabajando para resolverlo. Intentá de nuevo.
        </p>
        <button
          onClick={reset}
          className="inline-block font-body text-sm bg-brand-negro text-brand-blanco-calido px-6 py-3 rounded-[8px] mt-8 hover:bg-brand-negro-suave transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
