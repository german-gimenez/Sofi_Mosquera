"use client";

import { useState, useEffect } from "react";
import { cldZoom, cldCard } from "@sofi/ui";
import { ArtworkTilt } from "./artwork-tilt";

interface ArtworkLightboxProps {
  publicId: string;
  title: string;
}

export function ArtworkLightbox({ publicId, title }: ArtworkLightboxProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in"
        aria-label={`Ampliar ${title}`}
      >
        <ArtworkTilt maxTilt={4}>
          <div className="aspect-[3/4] bg-brand-crema rounded-image overflow-hidden">
            <img
              src={cldCard(publicId)}
              alt={title}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </ArtworkTilt>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-brand-negro/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada de ${title}`}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-brand-blanco-calido font-body text-sm tracking-widest uppercase hover:text-brand-gris-nav"
            aria-label="Cerrar"
          >
            Cerrar [ESC]
          </button>
          <img
            src={cldZoom(publicId)}
            alt={title}
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-6 text-brand-blanco-calido font-heading text-xl">
            {title}
          </div>
        </div>
      )}
    </>
  );
}
