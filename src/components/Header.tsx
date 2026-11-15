"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "./Logo";

const links = [
  { href: "/", label: "Acortar" },
  { href: "/mis-enlaces", label: "Mis enlaces" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-line/70 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-display text-2xl font-semibold tracking-tight">Recorta</span>
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-7 text-[15px]">
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={active ? "font-semibold text-teal" : "hover:text-teal"}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
