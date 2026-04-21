"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-start px-3 pt-0">
        <nav
          className="bg-brand-blanco-calido rounded-b-[20px] px-4 pb-3 pt-1 shadow-sm"
          aria-label="Principal"
        >
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2" aria-label="Ir a inicio">
              <span className="font-heading text-2xl text-brand-negro">SM</span>
            </Link>

            <ul className="hidden md:flex items-center gap-5" id="main-menu">
              {links.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "font-body text-[15px] font-light transition-colors relative",
                        active
                          ? "text-brand-negro"
                          : "text-brand-negro hover:text-brand-gris-nav",
                        active &&
                          "after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-px after:bg-brand-negro"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <button
              className="md:hidden p-1"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              aria-controls="main-menu"
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

        <div className="hidden md:flex bg-brand-blanco-calido rounded-bl-[18px] px-4 pb-3 pt-1 shadow-sm">
          <Link
            href="/asesoria"
            className="font-body text-[14px] font-light text-brand-negro hover:text-brand-gris-nav transition-colors"
          >
            Consultá tu proyecto
          </Link>
        </div>
      </div>

      {open && (
        <div
          id="main-menu-mobile"
          className="md:hidden bg-brand-blanco-calido mx-3 mt-1 rounded-card p-6 shadow-lg"
        >
          <ul className="flex flex-col gap-4">
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "font-body text-lg font-light",
                      active ? "text-brand-negro underline" : "text-brand-negro"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
