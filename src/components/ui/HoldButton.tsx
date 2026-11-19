"use client";

import { useEffect, useRef, useState } from "react";
import { now, scene } from "@/lib/sceneStore";
import { holdTone, shatterSound } from "@/lib/audio";

const HOLD_SECONDS = 1.4;

/** 길게 누르면 진행 원이 차고, 다 차면 행성이 분해된다. 키보드(Space/Enter)도 지원 */
export function HoldButton({ label, after }: { label: string; after: string }) {
  const circle = useRef<SVGCircleElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const pressing = useRef(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      const busy = scene.shatterAt && now() - scene.shatterAt < 2.8;
      if (pressing.current && !busy) {
        scene.hold = Math.min(1, scene.hold + dt / HOLD_SECONDS);
        if (scene.hold >= 1) {
          scene.shatterAt = now();
          scene.hold = 0;
          pressing.current = false;
          shatterSound();
          setDone(true);
          if ("vibrate" in navigator) navigator.vibrate?.(30);
        }
      } else {
        scene.hold = Math.max(0, scene.hold - dt * 2);
      }
      holdTone(scene.hold);
      if (circle.current) circle.current.style.strokeDashoffset = String(1 - scene.hold);
      if (pct.current) pct.current.textContent = `${String(Math.round(scene.hold * 100)).padStart(3, "0")}%`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      scene.hold = 0;
      holdTone(0);
    };
  }, []);

  const down = () => (pressing.current = true);
  const up = () => (pressing.current = false);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        {["-left-3 -top-3", "-right-3 -top-3", "-left-3 -bottom-3", "-right-3 -bottom-3"].map((p, i) => (
          <span key={i} className={`absolute ${p} font-mono text-ink/60`} aria-hidden="true">
            {i % 2 ? "]" : "["}
          </span>
        ))}
        <button
          type="button"
          onPointerDown={down}
          onPointerUp={up}
          onPointerLeave={up}
          onPointerCancel={up}
          onKeyDown={(e) => {
            if ((e.key === " " || e.key === "Enter") && !e.repeat) {
              e.preventDefault();
              down();
            }
          }}
          onKeyUp={up}
          onContextMenu={(e) => e.preventDefault()}
          className="relative grid place-items-center w-28 h-28 rounded-full bg-white/80 backdrop-blur select-none touch-none shadow-[0_0_0_5px_rgba(255,255,255,0.5)] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-planet"
          aria-label={label}
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
            <circle
              ref={circle}
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="var(--color-planet)"
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
            />
          </svg>
          <span className="flex flex-col items-center gap-1">
            <span className="font-mono text-xs tracking-[0.3em] text-ink">HOLD</span>
            <span ref={pct} className="font-mono text-[10px] text-mute tabular-nums">
              000%
            </span>
          </span>
        </button>
      </div>
      <p className="font-mono text-xs tracking-[0.25em] text-ink uppercase" aria-live="polite">
        {done ? after : label}
      </p>
    </div>
  );
}
