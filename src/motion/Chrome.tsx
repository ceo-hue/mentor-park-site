"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/ui/LogoMark";
import { brand, chapters } from "./content";
import { ScrollTrigger } from "./engine";

/** 고정 UI: 상단 로고·메뉴, 진행 막대, 현재 장 표시 */
export function Chrome() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 화면 가운데에 걸친 장을 찾는다. 고정(pin)된 장면은 pin-spacer 전체를 장의 범위로 본다
    const findActive = () => {
      const mid = window.innerHeight * 0.5;
      for (let i = chapters.length - 1; i >= 0; i--) {
        const el = document.getElementById(chapters[i].id);
        if (!el) continue;
        const box = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
        if (box.getBoundingClientRect().top <= mid) return i;
      }
      return 0;
    };
    let frame = 0;
    const syncActive = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setActive(findActive());
      });
    };
    const total = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => setProgress(self.progress),
    });
    window.addEventListener("scroll", syncActive, { passive: true });
    ScrollTrigger.addEventListener("refresh", syncActive);
    syncActive();
    // 모든 장면의 고정 구간이 만들어진 뒤 위치를 다시 계산
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      window.clearTimeout(id);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", syncActive);
      ScrollTrigger.removeEventListener("refresh", syncActive);
      total.kill();
    };
  }, []);

  // 첫 화면이 남색으로 반전된 동안 헤더도 어둡게
  const [heroDark, setHeroDark] = useState(false);
  useEffect(() => {
    const on = (e: Event) => setHeroDark(Boolean((e as CustomEvent<boolean>).detail));
    window.addEventListener("hyper-dark", on);
    return () => window.removeEventListener("hyper-dark", on);
  }, []);

  const chapter = chapters[active];
  // 지원 분야도 첫 화면과 같은 어두운 톤이라 헤더를 어둡게
  const dark = heroDark || chapter.id === "m-practice";
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 h-[3px] bg-ink/5" aria-hidden="true">
        <div className="h-full origin-left bg-planet" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <header className={`fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-gradient-to-b px-6 transition-colors duration-300 md:h-20 md:px-14 lg:px-20 ${dark ? "from-[#03050a] to-[#03050a]/0" : "from-sky-0 to-sky-0/40"}`}>
        <a href="#m-intro" className="shrink-0" aria-label={`${brand.nameKo} 처음으로`}>
          <BrandLogo className="w-28 md:w-[8.5rem]" />
        </a>
        <nav className="flex items-center gap-4 text-[13px] font-semibold md:gap-7" aria-label="주 메뉴">
          {chapters.filter((c) => c.nav).map((c) => (
            <a key={c.id} href={`#${c.id}`} aria-current={chapter.id === c.id ? "location" : undefined} className={`hidden underline-offset-8 transition-colors hover:text-planet-ink lg:inline ${chapter.id === c.id ? (dark ? "text-planet-soft underline" : "text-planet-ink underline") : dark ? "text-white/70" : "text-mute"}`}>
              {c.label}
            </a>
          ))}
          <a href="#m-contact" className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${dark ? "bg-white text-ink hover:bg-planet-soft" : "bg-ink text-white hover:bg-planet-ink"}`}>
            프로젝트 문의
          </a>
        </nav>
      </header>
      <p className="pointer-events-none fixed bottom-2 left-6 z-40 rounded-full bg-sky-0/90 px-2 py-0.5 text-[11px] font-semibold text-mute backdrop-blur-sm md:left-14 lg:left-20" aria-live="polite">
        <span className="font-mono text-planet-ink">{String(active + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}</span> · {chapter.label}
      </p>
    </>
  );
}
