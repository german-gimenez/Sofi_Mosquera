"use client";

import { useState, useEffect, useRef } from "react";
import { cldZoom, cldCard } from "@sofi/ui";
import { ArtworkTilt } from "./artwork-tilt";

interface ArtworkLightboxProps {
  publicId: string;
  title: string;
}

export function ArtworkLightbox({ publicId, title }: ArtworkLightboxProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      // Focus trap — keep focus inside the dialog
      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    // Move focus into the dialog
    closeRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      // Return focus to the trigger
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
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
          ref={dialogRef}
          className="fixed inset-0 z-[100] bg-brand-negro/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada de ${title}`}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            className="absolute top-6 right-6 text-brand-blanco-calido font-body text-sm tracking-widest uppercase hover:text-brand-gris-nav focus:outline-none focus:ring-2 focus:ring-brand-blanco-calido rounded px-2 py-1"
            aria-label="Cerrar vista ampliada"
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
