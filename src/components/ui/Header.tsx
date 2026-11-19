"use client";

import { brand } from "@/content/site";
import { BrandLogo } from "./LogoMark";

const links = [
  { href: "#orbit", label: "멘토링", mobile: true },
  { href: "#proof", label: "멘토 이력" },
  { href: "#insight", label: "가이드", mobile: true },
  { href: "#contact", label: "상담 문의", mobile: true },
];

export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between gap-3 px-4 md:px-8 h-16 md:h-20 bg-gradient-to-b from-sky-0 via-sky-0/90 to-sky-0/60 backdrop-blur-sm">
      <a href="#manifesto" className="shrink-0" aria-label={`${brand.nameKo} 처음으로`}>
        <BrandLogo className="w-28 md:w-40" />
      </a>
      <nav aria-label="주 메뉴" className="flex items-center gap-2.5 md:gap-6 text-sm font-semibold">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`hover:text-planet transition-colors whitespace-nowrap ${link.mobile ? "" : "hidden sm:inline"}`}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
