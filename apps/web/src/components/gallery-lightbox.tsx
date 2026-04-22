"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cldGallery, cldZoom, isVideoPublicId } from "@sofi/ui";
import { GalleryMedia } from "./gallery-media";

interface GalleryLightboxProps {
  publicIds: string[];
  title: string;
}

const SWIPE_THRESHOLD = 50;

export function GalleryLightbox({ publicIds, title }: GalleryLightboxProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggeredByRef = useRef<HTMLButtonElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const open = openIndex !== null;
  const total = publicIds.length;

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i - 1 + total) % total));
  }, [total]);
  const next = useCallback(() => {
    setOpenIndex((i) => (i === null ? null : (i + 1) % total));
  }, [total]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
        return;
      }
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
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      triggeredByRef.current?.focus();
    };
  }, [open, close, prev, next]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  if (publicIds.length === 0) return null;

  const currentId = openIndex !== null ? publicIds[openIndex] : null;
  const currentIsVideo = currentId ? isVideoPublicId(currentId) : false;

  return (
    <>
      <div className="space-y-4">
        {publicIds.map((publicId, i) => (
          <button
            key={`${publicId}-${i}`}
            ref={i === 0 ? undefined : undefined}
            type="button"
            onClick={(e) => {
              triggeredByRef.current = e.currentTarget;
              setOpenIndex(i);
            }}
            className="block w-full cursor-zoom-in group focus:outline-none focus:ring-2 focus:ring-brand-negro/40 rounded-image"
            aria-label={`Ampliar ${title} — imagen ${i + 1} de ${publicIds.length}`}
          >
            <GalleryMedia
              publicId={publicId}
              alt={`${title} — ${i + 1}`}
              priority={i === 0}
              className="aspect-[16/10] bg-brand-crema rounded-image overflow-hidden"
            />
          </button>
        ))}
      </div>

      {open && currentId && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-[100] bg-brand-negro/95 flex items-center justify-center p-4 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria ${title}`}
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute top-5 right-5 md:top-7 md:right-7 z-10 text-brand-blanco-calido font-body text-xs tracking-[0.3em] uppercase hover:text-brand-gris-nav focus:outline-none focus:ring-2 focus:ring-brand-blanco-calido/70 rounded px-2 py-1"
            aria-label="Cerrar galeria"
          >
            Cerrar [ESC]
          </button>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 z-10 text-brand-blanco-calido/70 hover:text-brand-blanco-calido p-3 focus:outline-none focus:ring-2 focus:ring-brand-blanco-calido/70 rounded-full"
                aria-label="Imagen anterior"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 z-10 text-brand-blanco-calido/70 hover:text-brand-blanco-calido p-3 focus:outline-none focus:ring-2 focus:ring-brand-blanco-calido/70 rounded-full"
                aria-label="Imagen siguiente"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}

          <div
            className="relative max-h-full max-w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {currentIsVideo ? (
              <GalleryMedia
                publicId={currentId}
                alt={`${title} — ${openIndex! + 1}`}
                priority
                className="w-auto max-w-[92vw] max-h-[85vh] rounded-image overflow-hidden"
              />
            ) : (
              <img
                src={cldZoom(currentId)}
                alt={`${title} — ${openIndex! + 1}`}
                className="max-h-[85vh] max-w-[92vw] object-contain"
                loading="eager"
              />
            )}
          </div>

          <div className="absolute bottom-5 left-0 right-0 flex items-center justify-between px-6 md:px-10 text-brand-blanco-calido/80 pointer-events-none">
            <span className="font-body text-[11px] tracking-[0.3em] uppercase">
              {title}
            </span>
            <span className="font-body text-[11px] tracking-[0.2em]">
              {openIndex! + 1} / {total}
            </span>
          </div>

          {/* Preload neighbors */}
          <link rel="preload" as="image" href={cldZoom(publicIds[(openIndex! + 1) % total])} />
          <link rel="preload" as="image" href={cldGallery(publicIds[(openIndex! - 1 + total) % total])} />
        </div>
      )}
    </>
  );
}
