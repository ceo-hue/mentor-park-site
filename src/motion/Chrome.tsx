"use client";

import { useEffect, useState } from "react";
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
    const total = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        setProgress(self.progress);
        setActive(findActive());
      },
    });
    setActive(findActive());
    // 모든 장면의 고정 구간이 만들어진 뒤 위치를 다시 계산
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => {
      window.clearTimeout(id);
      total.kill();
    };
  }, []);

  // 하이퍼스페이스 도형이 화면을 덮으면(reveal > 0.55) UI를 밝게 — 원본과 같은 기준
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const on = (e: Event) => setDark(Boolean((e as CustomEvent<boolean>).detail));
    window.addEventListener("hyper-dark", on);
    return () => window.removeEventListener("hyper-dark", on);
  }, []);

  const chapter = chapters[active];
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 h-[3px] bg-ink/5" aria-hidden="true">
        <div className="h-full origin-left bg-planet" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <header className={`fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-gradient-to-b to-transparent px-6 transition-colors duration-500 md:h-20 md:px-14 lg:px-20 ${dark ? "from-black/60" : "from-sky-0/90"}`}>
        <a href="#m-intro" className="flex items-center gap-2" aria-label={`${brand.nameKo} 처음으로`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/wordmark-ko.svg" alt="" width={129} height={94} className="h-9 w-auto md:h-11" />
          <span className={`hidden font-mono text-[11px] tracking-[0.25em] sm:inline ${dark ? "text-white/70" : "text-ink/70"}`}>{brand.nameEn}</span>
        </a>
        <nav className="flex items-center gap-4 font-mono text-[11px] tracking-[0.15em] md:gap-6 md:text-xs" aria-label="장면">
          {chapters.filter((c) => c.nav).map((c) => (
            <a key={c.id} href={`#${c.id}`} className={`hidden hover:text-planet lg:inline ${chapter.id === c.id ? "text-planet" : dark ? "text-white/70" : "text-ink/70"}`}>
              [{c.label}]
            </a>
          ))}
          <a href="#m-contact" className={`rounded-full px-4 py-2 font-sans text-sm font-bold tracking-normal hover:bg-planet hover:text-white ${dark ? "bg-white text-ink" : "bg-ink text-white"}`}>
            프로젝트 문의
          </a>
        </nav>
      </header>
      <p className={`fixed bottom-5 left-6 z-40 font-mono text-[11px] tracking-[0.2em] md:left-14 lg:left-20 ${dark ? "text-white/70" : "text-ink/70"}`} aria-live="polite">
        <span className={dark ? "text-white" : "text-ink"}>{String(active + 1).padStart(2, "0")}</span> / {String(chapters.length).padStart(2, "0")} · {chapter.label}
      </p>
    </>
  );
}
