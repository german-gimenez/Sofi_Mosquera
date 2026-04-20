"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@sofi/ui";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/interiorismo", label: "Interiorismo" },
  { href: "/arte", label: "Arte" },
  { href: "/muebles", label: "Muebles" },
  { href: "/asesoria", label: "Asesoría" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contacto", label: "Contacto" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-start px-3 pt-0">
        {/* Left pill — logo + nav */}
        <nav className="bg-brand-blanco-calido rounded-b-[20px] px-4 pb-3 pt-1 shadow-sm">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-heading text-2xl text-brand-negro">SM</span>
            </Link>

            {/* Desktop nav */}
            <ul className="hidden md:flex items-center gap-5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-[15px] font-light text-brand-negro hover:text-brand-gris-nav transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-1"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
            >
              <div className="w-5 flex flex-col gap-1">
                <span
                  className={cn(
                    "block h-px bg-brand-negro transition-transform",
                    open && "rotate-45 translate-y-[3px]"
                  )}
                />
                <span
                  className={cn(
                    "block h-px bg-brand-negro transition-opacity",
                    open && "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "block h-px bg-brand-negro transition-transform",
                    open && "-rotate-45 -translate-y-[3px]"
                  )}
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Right pill — CTA */}
        <div className="hidden md:flex bg-brand-blanco-calido rounded-bl-[18px] px-4 pb-3 pt-1 shadow-sm">
          <Link
            href="/asesoria"
            className="font-body text-[14px] font-light text-brand-negro hover:text-brand-gris-nav transition-colors"
          >
            Consultá tu proyecto
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-brand-blanco-calido mx-3 mt-1 rounded-card p-6 shadow-lg">
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-body text-lg font-light text-brand-negro"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
