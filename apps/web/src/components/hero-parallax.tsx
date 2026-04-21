"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { cldHero, cldSrcSet } from "@sofi/ui";

interface HeroParallaxProps {
  coverPublicId?: string;
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
}

export function HeroParallax({
  coverPublicId,
  eyebrow = "SM Studio · Mendoza, Argentina",
  headline = "Espacios que reflejan tu esencia",
  subheadline = "Interiorismo, arte original y muebles a medida. No decoramos — habitamos.",
}: HeroParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [1, 1] : [1, 1.15]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.8],
    reducedMotion ? [1, 1] : [1, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [0, 100]
  );

  return (
    <section
      ref={ref}
      className="relative h-screen overflow-hidden mx-3 mt-3 rounded-b-image"
    >
      <motion.div className="absolute inset-0" style={{ scale }}>
        {coverPublicId ? (
          <>
            <img
              src={cldHero(coverPublicId)}
              srcSet={cldSrcSet(coverPublicId, [800, 1200, 1600, 2000, 2560], {
                h: 1200,
                crop: "fill",
                g: "auto",
              })}
              sizes="100vw"
              alt=""
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-negro/30 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-brand-crema flex items-center justify-center">
            <span className="font-heading text-[20vw] text-brand-gris-border/30 select-none">
              SM
            </span>
          </div>
        )}
      </motion.div>

      <motion.div
        className="relative z-10 h-full flex items-end p-6 md:p-10"
        style={{ opacity, y }}
      >
        <div className="bg-brand-blanco-calido rounded-card p-8 md:p-10 max-w-md shadow-sm">
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav">
            {eyebrow}
          </span>
          <h1 className="font-heading text-3xl md:text-4xl text-brand-negro mt-4">
            {headline}
          </h1>
          <p className="font-body font-light text-brand-negro-suave mt-4 text-[15px]">
            {subheadline}
          </p>
          <Link
            href="/proyectos"
            className="inline-block font-body text-sm text-brand-negro border-b border-brand-negro pb-0.5 mt-6 hover:text-brand-gris-nav hover:border-brand-gris-nav transition-colors"
          >
            Ver proyectos
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
