"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export function HeroParallax() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section
      ref={ref}
      className="relative h-screen overflow-hidden mx-3 mt-3 rounded-b-image"
    >
      {/* Background with parallax scale */}
      <motion.div
        className="absolute inset-0 bg-brand-crema"
        style={{ scale }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-heading text-[20vw] text-brand-gris-border/30 select-none">
            SM
          </span>
        </div>
      </motion.div>

      {/* Content overlay */}
      <motion.div
        className="relative z-10 h-full flex items-end p-6 md:p-10"
        style={{ opacity, y }}
      >
        <div className="bg-brand-blanco-calido rounded-card p-8 md:p-10 max-w-md shadow-sm">
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-brand-gris-nav">
            SM Studio · Mendoza, Argentina
          </span>
          <h1 className="font-heading text-3xl md:text-4xl text-brand-negro mt-4">
            Espacios que reflejan
            <br />
            tu esencia
          </h1>
          <p className="font-body font-light text-brand-negro-suave mt-4 text-[15px]">
            Interiorismo, arte original y muebles a medida. No decoramos —
            habitamos.
          </p>
          <Link
            href="/interiorismo"
            className="inline-block font-body text-sm text-brand-negro border-b border-brand-negro pb-0.5 mt-6 hover:text-brand-gris-nav hover:border-brand-gris-nav transition-colors"
          >
            Ver proyectos
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
