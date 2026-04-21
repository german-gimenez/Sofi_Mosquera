"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ArtworkTiltProps {
  children: ReactNode;
  maxTilt?: number;
}

export function ArtworkTilt({ children, maxTilt = 6 }: ArtworkTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  const rotateX = useSpring(useTransform(y, [0, 1], [maxTilt, -maxTilt]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxTilt, maxTilt]), {
    stiffness: 200,
    damping: 20,
  });

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}
