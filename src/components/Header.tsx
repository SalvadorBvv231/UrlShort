"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark } from "./Logo";

const links = [
  { href: "/", label: "Acortar" },
  { href: "/mis-enlaces", label: "Mis enlaces" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Escape cierra el menú móvil.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const linkClass = (href: string) =>
    pathname === href ? "font-semibold text-teal" : "hover:text-teal";

  return (
    <header className="border-b border-line/70 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <LogoMark />
          <span className="font-display text-2xl font-semibold tracking-tight">Recorta</span>
        </Link>

        {/* Escritorio */}
        <nav aria-label="Principal" className="hidden items-center gap-7 text-[15px] md:flex">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={linkClass(href)}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Móvil: botón hamburguesa */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md hover:bg-navy/5 md:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="menu-movil" aria-label="Principal (móvil)" className="border-t border-line/70 md:hidden">
          <ul className="mx-auto max-w-5xl px-5 py-2 sm:px-8">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === href ? "page" : undefined}
                  className={`block py-3 text-base ${linkClass(href)}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
