"use client";

import { brand } from "@/content/site";
import { LogoMark } from "./LogoMark";

const links = [
  { href: "#orbit", label: "ORBIT" },
  { href: "#proof", label: "SIGNALS" },
  { href: "#contact", label: "CONTACT" },
];

export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 md:px-8 h-16 md:h-20 bg-gradient-to-b from-sky-0/90 via-sky-0/50 to-transparent">
      <a href="#manifesto" className="flex items-center gap-2.5 text-planet" aria-label={`${brand.nameEn} 처음으로`}>
        <LogoMark className="w-10 md:w-12" />
        <span className="font-serif font-bold tracking-[0.04em] text-sm md:text-[17px] text-planet">
          {brand.nameEn}
        </span>
      </a>
      <nav className="flex items-center gap-3 md:gap-6 font-mono text-[11px] md:text-sm tracking-wider">
        {links.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            className={`hover:text-planet transition-colors ${i < 2 ? "hidden sm:inline" : ""}`}
          >
            [{l.label}]
          </a>
        ))}
      </nav>
    </header>
  );
}
