"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  WHATSAPP_MESSAGES,
  buildWhatsAppUrl,
  cn,
  messageForPath,
} from "@sofi/ui";

export const NAV_LINKS = [
  { href: "/proyectos", label: "PROYECTOS" },
  { href: "/arte", label: "ARTE" },
  { href: "/muebles", label: "MUEBLES" },
  { href: "/studio", label: "STUDIO" },
  { href: "/contacto", label: "CONTACTO" },
] as const;

const links = NAV_LINKS;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M20.52 3.48A11.82 11.82 0 0 0 12.04 0C5.5 0 .19 5.3.19 11.84c0 2.08.55 4.11 1.6 5.9L0 24l6.42-1.68a11.8 11.8 0 0 0 5.61 1.43h.01c6.54 0 11.85-5.31 11.85-11.85 0-3.17-1.23-6.14-3.37-8.42ZM12.04 21.6a9.76 9.76 0 0 1-4.98-1.36l-.36-.22-3.81 1 1.02-3.71-.23-.38a9.74 9.74 0 0 1-1.49-5.19c0-5.38 4.38-9.75 9.85-9.75 2.63 0 5.1 1.02 6.96 2.88a9.76 9.76 0 0 1 2.88 6.87c0 5.38-4.38 9.86-9.84 9.86Zm5.38-7.34c-.3-.15-1.75-.87-2.02-.97-.27-.1-.47-.15-.67.15s-.76.97-.94 1.17c-.17.2-.34.22-.64.07a8.1 8.1 0 0 1-2.39-1.47 8.93 8.93 0 0 1-1.66-2.06c-.17-.3 0-.45.13-.6.13-.14.3-.34.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01a1.1 1.1 0 0 0-.8.37c-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.06 2.9 1.21 3.1.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const waMessage = messageForPath(pathname ?? "/") ?? WHATSAPP_MESSAGES.default;
  const waUrl = buildWhatsAppUrl(waMessage);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-brand-blanco-calido/90 backdrop-blur-md border-b border-brand-crema/70"
            : "bg-transparent"
        )}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 py-4 md:py-5">
          <Link
            href="/"
            aria-label="Sofia Mosquera — inicio"
            className={cn(
              "font-heading leading-none text-[26px] md:text-[30px] transition-colors",
              scrolled ? "text-brand-negro" : "text-brand-blanco-calido"
            )}
          >
            SM
          </Link>

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {links.map((link) => {
                const active = isActive(pathname ?? "", link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "nav-underline font-body text-[14px] font-light tracking-[0.1em] uppercase transition-colors",
                        scrolled
                          ? "text-brand-negro hover:text-brand-gris-nav"
                          : "text-brand-blanco-calido hover:text-brand-blanco-calido/80",
                        active && "nav-underline-active"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escribir por WhatsApp"
              className={cn(
                "hidden md:inline-flex items-center justify-center transition-colors",
                scrolled
                  ? "text-brand-negro hover:text-brand-gris-nav"
                  : "text-brand-blanco-calido hover:text-brand-blanco-calido/80"
              )}
            >
              <WhatsAppIcon className="w-5 h-5" />
            </a>

            <button
              type="button"
              className="md:hidden p-2 -mr-2"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Cerrar menu" : "Abrir menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <div className="w-6 flex flex-col gap-1.5">
                <span
                  className={cn(
                    "block h-px transition-all duration-300",
                    open
                      ? "bg-brand-negro rotate-45 translate-y-[6px]"
                      : scrolled
                        ? "bg-brand-negro"
                        : "bg-brand-blanco-calido"
                  )}
                />
                <span
                  className={cn(
                    "block h-px transition-all duration-300",
                    open
                      ? "opacity-0"
                      : scrolled
                        ? "bg-brand-negro"
                        : "bg-brand-blanco-calido"
                  )}
                />
                <span
                  className={cn(
                    "block h-px transition-all duration-300",
                    open
                      ? "bg-brand-negro -rotate-45 -translate-y-[6px]"
                      : scrolled
                        ? "bg-brand-negro"
                        : "bg-brand-blanco-calido"
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={cn(
          "md:hidden fixed inset-0 z-40 bg-brand-blanco-calido transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div className="h-full flex flex-col pt-24 px-6 pb-10">
          <ul className="flex flex-col gap-6">
            {links.map((link) => {
              const active = isActive(pathname ?? "", link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "font-heading text-3xl leading-none tracking-wide",
                      active ? "text-brand-negro" : "text-brand-negro/80"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pt-10 border-t border-brand-crema flex items-center justify-between">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-sm font-light tracking-[0.1em] uppercase text-brand-negro"
            >
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-brand-gris-nav">
              Mendoza · Santiago
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
