"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ACCENTS, scene, setAccent, subscribe, emit } from "@/lib/sceneStore";
import { setSound } from "@/lib/audio";
import { sections } from "@/content/site";

const useScene = <T,>(pick: () => T) => useSyncExternalStore(subscribe, pick, pick);

/** 사운드 토글: 파형 막대 + ON/OFF */
export function SoundToggle({ className = "" }: { className?: string }) {
  const on = useScene(() => scene.sound);
  const toggle = () => {
    scene.sound = !scene.sound;
    setSound(scene.sound);
    emit();
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "사운드 끄기" : "사운드 켜기"}
      className={`flex items-center gap-3 h-11 pl-4 pr-5 rounded-full bg-ink text-white font-mono text-xs tracking-widest ${
        on ? "" : "wave-off"
      } ${className}`}
    >
      <span className="flex items-center gap-[3px] h-4" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => (
          <span
            key={i}
            className="wave-bar block w-[2px] h-4 rounded-full bg-white/80"
            style={{ animationDelay: `${i * 0.11}s` }}
          />
        ))}
      </span>
      {on ? "ON" : "OFF"}
    </button>
  );
}

/** 행성 색 커스터마이저 */
export function Customizer() {
  const accent = useScene(() => scene.accent);
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed right-4 bottom-4 md:right-8 md:bottom-8 z-40">
      {/* 모바일: 접힌 원형 버튼 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="행성 색 바꾸기"
        className={`md:hidden w-11 h-11 rounded-full bg-ink grid place-items-center shadow-xl ${open ? "hidden" : ""}`}
      >
        <span className="w-5 h-5 rounded-full" style={{ background: accent }} />
      </button>
      <div
        className={`${open ? "block" : "hidden"} md:block rounded-2xl bg-ink text-white p-3 shadow-2xl shadow-black/20`}
        onClick={() => setOpen(false)}
      >
      <div className="flex gap-2">
        {ACCENTS.map((a) => (
          <button
            key={a.hex}
            type="button"
            onClick={() => setAccent(a.hex)}
            aria-label={`행성 색: ${a.name}`}
            aria-pressed={accent === a.hex}
            className={`h-7 w-10 md:w-12 rounded-full transition-transform ${
              accent === a.hex ? "ring-2 ring-white ring-offset-2 ring-offset-ink scale-105" : "hover:scale-105"
            }`}
            style={{ background: a.hex }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => setAccent(ACCENTS[0].hex)}
          className="text-white/60 hover:text-white text-sm"
          aria-label="색 초기화"
        >
          ↺
        </button>
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/70">CUSTOMIZE ME</span>
        <span className="w-3" />
      </div>
      </div>
    </div>
  );
}

/** 왼쪽 눈금자(섹션 라벨) + 오른쪽 진행 막대 */
export function Rulers() {
  const [state, setState] = useState({ i: 0, p: 0 });
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const i = Math.round(scene.t);
      const p = Math.round(scene.progress * 100);
      setState((s) => (s.i === i && s.p === p ? s : { i, p }));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const ticks = 44;
  return (
    <>
      <nav
        className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-1.5 font-mono text-[11px]"
        aria-label="섹션"
      >
        {sections.map((s, i) => (
          <div key={s.id} className="flex flex-col gap-1.5">
            {[0, 1, 2].map((k) => (
              <span key={k} className="leading-none text-ink/50">+</span>
            ))}
            <a
              href={`#${s.id}`}
              className={`uppercase tracking-[0.15em] transition-colors ${
                state.i === i ? "text-ink font-medium" : "text-ink/40 hover:text-ink/80"
              }`}
            >
              {state.i === i ? `[${s.short}]` : s.short}
            </a>
          </div>
        ))}
      </nav>

      <div
        className="hidden md:flex fixed right-5 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-[3px]"
        aria-hidden="true"
      >
        {Array.from({ length: ticks }, (_, k) => (
          <span
            key={k}
            className={`block h-[2px] transition-all duration-300 ${
              k / ticks < state.p / 100 ? "w-4 bg-ink" : "w-2.5 bg-ink/25"
            }`}
          />
        ))}
        <span className="mt-2 font-mono text-[10px] text-ink [writing-mode:vertical-rl] tabular-nums">
          {String(state.p).padStart(2, "0")}%
        </span>
      </div>
    </>
  );
}
