"use client";

import { useRef } from "react";

/** 무지갯빛 테두리 + 도트 질감 + 포인터 기울기 카드 */
export function HoloCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg) translateZ(0)`;
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={`holo rounded-[28px] p-[6px] transition-transform duration-300 ease-out will-change-transform shadow-[0_30px_60px_-30px_rgba(40,60,120,0.45)] ${className}`}
    >
      <div className="relative h-full rounded-[23px] overflow-hidden bg-white/75 backdrop-blur-md">
        <div className="dots absolute inset-0 opacity-50" aria-hidden="true" />
        <div
          className="absolute inset-0 opacity-60 mix-blend-soft-light pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at var(--gx,50%) var(--gy,30%), rgba(255,255,255,0.9), transparent 45%)",
          }}
          aria-hidden="true"
        />
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  );
}
