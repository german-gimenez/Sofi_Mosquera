"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { WhatsAppCTA, messageForPath } from "@sofi/ui";

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const message = messageForPath(pathname ?? "/");

  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof IntersectionObserver === "undefined") return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-wa-inline='true']")
    );
    if (targets.length === 0) {
      setHidden(false);
      return;
    }

    const visibility = new Map<Element, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target, entry.isIntersecting);
        }
        const anyVisible = Array.from(visibility.values()).some(Boolean);
        setHidden(anyVisible);
      },
      { threshold: 0.2 }
    );

    targets.forEach((el) => {
      visibility.set(el, false);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div
      aria-hidden={hidden}
      className={
        "transition-opacity duration-300 motion-reduce:transition-none " +
        (hidden
          ? "opacity-0 pointer-events-none"
          : "opacity-100 pointer-events-auto")
      }
    >
      <WhatsAppCTA
        variant="floating"
        message={message}
        label="Escribinos"
        tabIndex={hidden ? -1 : 0}
      />
    </div>
  );
}
