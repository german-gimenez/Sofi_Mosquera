"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cldHero, cldSrcSet, cldVideoUrl, isVideoPublicId } from "@sofi/ui";

interface ProjectHeroProps {
  title: string;
  coverUrl?: string;
}

export function ProjectHero({ title, coverUrl }: ProjectHeroProps) {
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
    reducedMotion ? [1, 1] : [1, 1.1]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [0, 60]
  );

  return (
    <div
      ref={ref}
      className="relative h-[70vh] overflow-hidden mx-3 rounded-b-image"
    >
      <motion.div className="absolute inset-0" style={{ scale, y }}>
        {coverUrl ? (
          isVideoPublicId(coverUrl) && !reducedMotion ? (
            <video
              className="w-full h-full object-cover"
              src={cldVideoUrl(coverUrl, { w: 2000 })}
              poster={cldHero(coverUrl)}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label={title}
            />
          ) : (
            <img
              src={cldHero(coverUrl)}
              srcSet={cldSrcSet(coverUrl, [800, 1200, 1600, 2000, 2560], {
                h: 1200,
                crop: "fill",
                g: "auto",
              })}
              sizes="100vw"
              alt={title}
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          )
        ) : (
          <div className="w-full h-full bg-brand-crema flex items-center justify-center">
            <span className="font-heading text-[15vw] text-brand-gris-border/20 select-none">
              {title.charAt(0)}
            </span>
          </div>
        )}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-brand-negro/40 to-transparent" />
      <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10">
        <h1 className="font-heading text-4xl md:text-6xl text-brand-blanco-calido">
          {title}
        </h1>
      </div>
    </div>
  );
}
