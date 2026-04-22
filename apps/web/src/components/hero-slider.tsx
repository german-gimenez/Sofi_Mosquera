"use client";

import { useEffect, useRef, useState } from "react";
import { cldHero, cldSrcSet } from "@sofi/ui";

interface HeroSliderProps {
  images: string[];
  tagline?: string;
  intervalMs?: number;
}

export function HeroSlider({
  images,
  tagline = "Interiorismo · Arte · Muebles a medida",
  intervalMs = 7000,
}: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (images.length <= 1 || paused || reducedMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [images.length, paused, reducedMotion, intervalMs]);

  const handleScrollDown = () => {
    const target = sectionRef.current?.nextElementSibling;
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
  };

  if (images.length === 0) {
    return (
      <section className="relative h-screen w-full overflow-hidden bg-brand-crema flex items-center justify-center">
        <span className="font-heading text-[20vw] text-brand-gris-border/30 select-none">SM</span>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-brand-negro"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Proyectos destacados"
    >
      {images.map((publicId, i) => (
        <div
          key={`${publicId}-${i}`}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <img
            src={cldHero(publicId)}
            srcSet={cldSrcSet(publicId, [800, 1200, 1600, 1920, 2560], {
              h: 1200,
              crop: "fill",
              g: "auto",
            })}
            sizes="100vw"
            alt=""
            className="w-full h-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            decoding={i === 0 ? "sync" : "async"}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-brand-negro/40 via-transparent to-brand-negro/20 pointer-events-none" />

      <div className="absolute bottom-8 left-6 md:left-8 right-6 md:right-auto pointer-events-none">
        <p
          className={
            "font-body font-light text-[13px] md:text-sm tracking-[0.08em] text-brand-blanco-calido/80 hidden min-[376px]:block"
          }
        >
          {tagline}
        </p>
      </div>

      <button
        type="button"
        onClick={handleScrollDown}
        aria-label="Scroll hacia los proyectos"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-brand-blanco-calido/80 hover:text-brand-blanco-calido transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blanco-calido/60 rounded-full p-1"
      >
        <span className="block w-px h-10 bg-current opacity-60 animate-bounce-arrow origin-top" />
      </button>

      {images.length > 1 && (
        <div className="absolute bottom-8 right-6 md:right-8 flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir a imagen ${i + 1} de ${images.length}`}
              aria-current={i === index}
              className={
                "h-px w-8 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-brand-blanco-calido/60 " +
                (i === index
                  ? "bg-brand-blanco-calido"
                  : "bg-brand-blanco-calido/30 hover:bg-brand-blanco-calido/60")
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
