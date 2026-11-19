"use client";

import { useEffect, useRef, useState } from "react";
import { gate, specialties } from "@/content/site";
import { emit, scene, subscribe } from "@/lib/sceneStore";
import { startAudio } from "@/lib/audio";
import { BrandWordmark, LogoMark } from "./LogoMark";
import { SoundToggle } from "./Controls";

/**
 * 진입 화면: TUNE [ ● ] IN → 의 거대 타이포 사이에 원형 버튼.
 * 원 안에 행성 심볼과 로딩 진행률을 표시한다.
 */
export function Gate() {
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const startedAt = useRef(0);

  useEffect(() => subscribe(() => setReady(scene.ready)), []);

  useEffect(() => {
    if (!startedAt.current) startedAt.current = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = (performance.now() - startedAt.current) / 1800;
      const cap = scene.ready ? 100 : 92;
      const next = Math.min(cap, Math.round(100 * (1 - Math.pow(1 - Math.min(elapsed, 1), 2))));
      setPct(next);
      if (next < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  const done = pct >= 100;
  const enter = () => {
    if (!done || leaving) return;
    setLeaving(true);
    startAudio(scene.sound);
    scene.started = true;
    emit();
    const section = document.getElementById(window.location.hash.slice(1));
    if (section) section.scrollIntoView();
    else window.scrollTo(0, 0);
    setTimeout(() => setGone(true), 1300);
  };

  if (gone) return null;

  const word = "font-display text-[min(17vw,10svh)] md:text-[min(9.5vw,17svh)] leading-none tracking-tight text-ink";
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
        leaving ? "opacity-0 scale-110 pointer-events-none" : "opacity-100"
      }`}
      style={{ background: "linear-gradient(180deg, #f8faff 0%, #dbe6fd 60%, #b9cdf8 100%)" }}
    >
      <div className="dots absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="absolute inset-x-4 top-[max(1rem,5svh)] text-center">
        <p className="text-lg font-black tracking-tight md:text-2xl">{gate.heading}</p>
        <p className="mt-1.5 text-sm font-semibold text-mute md:text-base">
          {specialties.map(({ title }) => title).join(" / ")}
        </p>
      </div>

      <div className="relative flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <span className={word}>TUNE</span>

        <div className="relative">
          {/* 대괄호 모서리 */}
          {["-left-4 -top-4", "-right-4 -top-4", "-left-4 -bottom-4", "-right-4 -bottom-4"].map((p, i) => (
            <span key={i} className={`absolute ${p} font-mono text-ink/70 text-lg`} aria-hidden="true">
              {i % 2 ? "]" : "["}
            </span>
          ))}
          <button
            type="button"
            onClick={enter}
            disabled={!done}
            aria-label={done ? "사이트 시작" : `불러오는 중 ${pct}%`}
            className="relative grid place-items-center size-[min(9rem,25svh)] md:size-[11vw] md:min-w-40 md:min-h-40 rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.6),0_20px_60px_-20px_rgba(66,137,216,0.6)] enabled:hover:scale-105 transition-transform focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-planet"
          >
            <span className="absolute inset-2 rounded-full border border-ink/10" />
            <span className="flex flex-col items-center gap-2">
              <LogoMark className="h-auto w-16 md:w-20" />
              <span className="font-mono text-xs tracking-[0.3em] text-ink tabular-nums">
                {done ? gate.enter : `${String(pct).padStart(3, "0")}%`}
              </span>
            </span>
          </button>
        </div>

        <span className={`${word} flex items-center gap-[2vw]`}>
          IN
          <svg viewBox="0 0 48 32" className="w-[9vw] md:w-[5vw]" fill="none" stroke="currentColor" strokeWidth="3.5" aria-hidden="true">
            <path d="M2 16h42M30 3l14 13-14 13" />
          </svg>
        </span>
      </div>

      <div className="absolute bottom-8 md:bottom-12 flex flex-col items-center gap-4">
        <BrandWordmark className="h-auto w-28" />
        <SoundToggle />
      </div>
    </div>
  );
}
