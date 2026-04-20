"use client";

import { cn } from "../lib/utils";

interface MarqueeProps {
  items: string[];
  separator?: string;
  className?: string;
  speed?: number;
  dark?: boolean;
}

export function Marquee({
  items,
  separator = " · ",
  className,
  speed = 30,
  dark = true,
}: MarqueeProps) {
  const text = items.join(separator) + separator;

  return (
    <div
      className={cn(
        "overflow-hidden whitespace-nowrap",
        dark ? "bg-brand-negro text-brand-blanco-calido" : "bg-brand-crema text-brand-negro",
        "py-4 rounded-image",
        className
      )}
    >
      <div
        className="inline-flex animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        <span className="font-body font-light text-sm tracking-[0.15em] uppercase px-4">
          {text}
        </span>
        <span className="font-body font-light text-sm tracking-[0.15em] uppercase px-4" aria-hidden>
          {text}
        </span>
        <span className="font-body font-light text-sm tracking-[0.15em] uppercase px-4" aria-hidden>
          {text}
        </span>
      </div>
    </div>
  );
}
