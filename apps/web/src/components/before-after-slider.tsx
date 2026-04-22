"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cldGallery } from "@sofi/ui";

interface BeforeAfterSliderProps {
  beforeId: string;
  afterId: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt?: string;
}

/**
 * Drag-handle reveal slider. Works with pointer and touch, and keyboard arrows
 * (handle is a <input type="range"> under the hood for accessibility).
 */
export function BeforeAfterSlider({
  beforeId,
  afterId,
  beforeLabel = "Antes",
  afterLabel = "Despues",
  alt = "Comparativa antes y despues",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, pct)));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      updateFromClientX(e.clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [updateFromClientX]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/10] bg-brand-crema rounded-image overflow-hidden select-none touch-none"
      onPointerDown={(e) => {
        draggingRef.current = true;
        updateFromClientX(e.clientX);
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      }}
    >
      <img
        src={cldGallery(afterId)}
        alt={`${alt} — ${afterLabel}`}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
        aria-hidden="true"
      >
        <img
          src={cldGallery(beforeId)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${10000 / Math.max(position, 0.001)}%`, maxWidth: "none" }}
          loading="lazy"
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-px bg-brand-blanco-calido pointer-events-none"
        style={{ left: `${position}%` }}
        aria-hidden="true"
      />

      <span className="absolute top-3 left-3 font-body text-[10px] tracking-[0.3em] uppercase bg-brand-negro/70 text-brand-blanco-calido px-2 py-1 rounded-pill pointer-events-none">
        {beforeLabel}
      </span>
      <span className="absolute top-3 right-3 font-body text-[10px] tracking-[0.3em] uppercase bg-brand-negro/70 text-brand-blanco-calido px-2 py-1 rounded-pill pointer-events-none">
        {afterLabel}
      </span>

      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-brand-blanco-calido shadow-lg flex items-center justify-center pointer-events-none"
        style={{ left: `${position}%` }}
        aria-hidden="true"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 18l-6-6 6-6M15 6l6 6-6 6" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <label className="sr-only" htmlFor="ba-range">
        Posicion del divisor antes/despues
      </label>
      <input
        id="ba-range"
        type="range"
        min={0}
        max={100}
        step={1}
        value={position}
        onChange={(e) => setPosition(Number(e.currentTarget.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        aria-valuenow={Math.round(position)}
      />
    </div>
  );
}
