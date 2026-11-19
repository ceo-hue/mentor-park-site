"use client";

import { useEffect, useRef } from "react";
import { hyper } from "../content";
import { Chars, gsap, ScrollTrigger, useScene } from "../engine";
import { LOGO_PX } from "@/lib/logo";

/* ------------------------------------------------------------------ */
/* 워프 별빛: 화면 중심에서 바깥으로 뻗는 줄무늬 (Canvas 2D)            */
/* ------------------------------------------------------------------ */
const PALETTE = ["#9cc4ff", "#6fa8ff", "#b69cff", "#7fe3ff", "#ffffff"];

type Streak = { a: number; r: number; v: number; len: number; w: number; c: string };

function makeStreak(maxR: number): Streak {
  return {
    a: Math.random() * Math.PI * 2,
    r: Math.random() * maxR * 0.9 + 4,
    v: 0.4 + Math.random() * 1.6,
    len: 6 + Math.random() * 30,
    w: 0.6 + Math.random() * 1.6,
    c: PALETTE[(Math.random() * PALETTE.length) | 0],
  };
}

/** 장면 상태 — 타임라인이 값을 바꾸고 캔버스 루프가 읽는다 */
type WarpState = { speed: number; alpha: number; running: boolean };

function useWarp(canvas: React.RefObject<HTMLCanvasElement | null>, state: React.RefObject<WarpState>) {
  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let maxR = 0;
    let streaks: Streak[] = [];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      maxR = Math.hypot(w, h) / 2;
      const count = w < 768 ? 260 : 520;
      streaks = Array.from({ length: count }, () => makeStreak(maxR));
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let last = performance.now();
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      const s = state.current!;
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      if (!s.running && !reduce) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = s.alpha;
      ctx.lineCap = "round";
      const cx = w / 2;
      const cy = h / 2;
      const speed = reduce ? 0 : s.speed;
      for (const st of streaks) {
        // 중심에서 멀수록 빨라져 원근감이 생긴다
        st.r += st.v * speed * (40 + st.r * 1.6) * dt;
        if (st.r > maxR) Object.assign(st, makeStreak(maxR * 0.15));
        const stretch = st.len * (0.6 + speed * 1.4) * (0.4 + st.r / maxR);
        const x1 = cx + Math.cos(st.a) * st.r;
        const y1 = cy + Math.sin(st.a) * st.r;
        const x2 = cx + Math.cos(st.a) * (st.r + stretch);
        const y2 = cy + Math.sin(st.a) * (st.r + stretch);
        ctx.strokeStyle = st.c;
        ctx.lineWidth = st.w * (0.5 + st.r / maxR);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [canvas, state]);
}

/* ------------------------------------------------------------------ */
/* 장면                                                                */
/* ------------------------------------------------------------------ */

/** 7개의 고리 — 위아래로 쌓인 궤도. 가운데가 가장 넓다 */
const RINGS = [0.42, 0.62, 0.8, 0.92, 0.8, 0.62, 0.42];
// 문장 위치 (중심 기준 %)
// 데스크톱은 고리 둘레에 흩어 놓고, 모바일은 고리 위아래로 쌓는다
const SPOTS = [
  { x: 58, y: 24, mx: 6, my: 15 },
  { x: 72, y: 40, mx: 6, my: 25 },
  { x: 8, y: 52, mx: 6, my: 68 },
  { x: 24, y: 70, mx: 6, my: 78 },
  { x: 64, y: 74, mx: 6, my: 88 },
] as const;

/** 하이퍼스페이스 — 행성이 화면 전체로 커지고, 안쪽이 워프 별빛으로 채워지며 원칙을 선언한다 */
export function HyperScene() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const warp = useRef<WarpState>({ speed: 0.25, alpha: 1, running: false });
  useWarp(canvas, warp);

  const ref = useScene((root) => {
    const q = gsap.utils.selector(root);
    const w = warp.current;
    w.running = false;

    // 화면에 있을 때만 캔버스를 그린다
    ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (w.running = self.isActive),
    });

    // 행성 원의 실제 반지름(px)에서 화면 대각선까지 커진다
    const vmin = () => Math.min(window.innerWidth, window.innerHeight);
    const r0 = () => `${(0.42 * vmin() * LOGO_PX.r) / 168}px`;
    const r1 = () => `${Math.hypot(window.innerWidth, window.innerHeight) / 2 + 40}px`;

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: "+=700%", pin: true, scrub: 0.8, invalidateOnRefresh: true },
      defaults: { ease: "none" },
    });

    tl.set(q("[data-warp]"), { "--r": r0, "--bg": "#4289d8" })
      .set(q("[data-hud]"), { opacity: 0 })
      .set(q("[data-t='1'] [data-char], [data-t='2'] [data-char], [data-t='4'] [data-char]"), { yPercent: 110 })
      .set(q("[data-t]"), { autoAlpha: 1 })
      .set(q("[data-ring]"), { scaleX: 0, opacity: 0 })
      .set(q("[data-sentence]"), { opacity: 0, y: 20 })
      .set(w, { speed: 0.25 })
      // 1) 행성이 커지며 화면을 덮는다
      .to(q("[data-symbol]"), { scale: 14, opacity: 0, duration: 1.4, ease: "power2.in" }, 0)
      .to(q("[data-warp]"), { "--r": r1, duration: 1.6, ease: "power2.in" }, 0)
      .to(w, { speed: 1, duration: 1.6 }, 0)
      .to(q("[data-hud]"), { opacity: 1, duration: 0.3 }, 1.2)
      // 2) TEST WITH CARE
      .to(q("[data-t='1'] [data-char]"), { yPercent: 0, stagger: 0.03, duration: 0.5, ease: "power3.out" }, 1.1)
      // 파랑에서 검정으로
      .to(q("[data-warp]"), { "--bg": "#05070d", duration: 0.8 }, 1.9)
      .to(q("[data-t='1'] [data-char]"), { yPercent: -110, stagger: 0.02, duration: 0.4, ease: "power2.in" }, 2.6)
      .to(w, { speed: 2.2, duration: 0.5, yoyo: true, repeat: 1 }, 2.6)
      // 3) BUILD WITH EVIDENCE
      .to(q("[data-t='2'] [data-char]"), { yPercent: 0, stagger: 0.03, duration: 0.5, ease: "power3.out" }, 3.0)
      .to(q("[data-t='2'] [data-char]"), { yPercent: -110, stagger: 0.02, duration: 0.4, ease: "power2.in" }, 3.9)
      // 4) 일곱 개의 고리와 다섯 원칙
      .to(q("[data-ring]"), { scaleX: 1, opacity: 1, stagger: { each: 0.06, from: "center" }, duration: 0.5, ease: "power3.out" }, 4.2)
      .to(q("[data-sentence]"), { opacity: 1, y: 0, stagger: 0.25, duration: 0.4, ease: "power3.out" }, 4.5)
      .to(q("[data-rings]"), { rotation: 6, duration: 1.6 }, 4.2)
      .to(q("[data-ring], [data-sentence]"), { opacity: 0, duration: 0.4, stagger: 0.02 }, 6.1)
      .to(w, { speed: 3, duration: 0.6 }, 6.0)
      // 5) EVIDENCE ALWAYS.
      .to(q("[data-t='4'] [data-char]"), { yPercent: 0, stagger: 0.03, duration: 0.5, ease: "power3.out" }, 6.4)
      .to(w, { speed: 0.6, duration: 0.6 }, 6.6)
      .to({}, { duration: 0.5 });
  });

  const ring = `M ${-LOGO_PX.ringA} 0 A ${LOGO_PX.ringA} ${LOGO_PX.ringB} 0 1 0 ${LOGO_PX.ringA} 0 A ${LOGO_PX.ringA} ${LOGO_PX.ringB} 0 1 0 ${-LOGO_PX.ringA} 0`;
  const title = "font-display text-white leading-[0.86] tracking-tight text-center text-[clamp(4rem,15vw,11rem)] lg:text-[clamp(5rem,10vw,10rem)]";

  return (
    <section
      id="m-hyper"
      ref={ref}
      aria-label={`일하는 원칙: ${hyper.principles.join(" ")}`}
      className="group relative min-h-svh overflow-hidden bg-[#05070d] [&.is-animated]:h-svh [&.is-animated]:bg-transparent"
    >
      {/* 워프 공간: 행성 원 모양으로 잘려 있다가 화면 전체로 커진다 */}
      <div
        data-warp
        className="absolute inset-0"
        style={{
          ["--r" as string]: "150vmax",
          ["--bg" as string]: "#05070d",
          background: "var(--bg)",
          clipPath: "circle(var(--r) at 50% 50%)",
        }}
      >
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(0,0,0,0.45)_100%)]" aria-hidden="true" />
      </div>

      {/* 행성 고리와 외곽선: 커지면서 사라진다 */}
      <svg
        data-symbol
        viewBox="-84 -50 168 100"
        className="pointer-events-none absolute left-1/2 top-1/2 hidden w-[42vmin] -translate-x-1/2 -translate-y-1/2 group-[.is-animated]:block"
        fill="none"
        aria-hidden="true"
      >
        <circle r={LOGO_PX.r} stroke="var(--color-planet)" strokeWidth={LOGO_PX.stroke} />
        <path d={ring} transform={`rotate(${LOGO_PX.tiltDeg})`} stroke="var(--color-planet)" strokeWidth={LOGO_PX.stroke} />
      </svg>

      {/* HUD */}
      <div data-hud className="pointer-events-none absolute inset-x-6 top-20 flex justify-between font-mono text-[10px] tracking-[0.25em] text-white/60 md:inset-x-14 md:text-[11px] lg:inset-x-20">
        <span>ONAIR PLANET · PRINCIPLES</span>
        <span>ORBIT INSERTION</span>
      </div>

      {/* 단계별 문구 */}
      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center gap-10 px-6 py-24 group-[.is-animated]:absolute group-[.is-animated]:inset-0 group-[.is-animated]:py-0">
        <h2 data-t="1" className={`${title} group-[.is-animated]:absolute`}>
          {hyper.stage1.map((l) => (
            <span key={l} className="block overflow-hidden">
              <Chars text={l} />
            </span>
          ))}
        </h2>
        <p data-t="2" aria-hidden="true" className={`${title} invisible absolute`}>
          {hyper.stage2.map((l) => (
            <span key={l} className="block overflow-hidden">
              <Chars text={l} />
            </span>
          ))}
        </p>

        {/* 고리 + 원칙 */}
        <div className="relative w-full max-w-5xl group-[.is-animated]:absolute group-[.is-animated]:inset-0 group-[.is-animated]:max-w-none">
          <div data-rings className="pointer-events-none absolute left-1/2 top-1/2 hidden w-[min(70vw,46rem)] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[1.6vmin] group-[.is-animated]:flex" aria-hidden="true">
            {RINGS.map((s, i) => (
              <span
                key={i}
                data-ring
                className="block h-[5.2vmin] rounded-[50%] border-2 border-[#c9ff6b] shadow-[0_0_18px_rgba(201,255,107,0.45)]"
                style={{ width: `${s * 100}%` }}
              />
            ))}
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 group-[.is-animated]:block">
            {hyper.principles.map((p, i) => (
              <li
                key={p}
                data-sentence
                className="text-lg font-bold leading-snug text-white md:text-2xl group-[.is-animated]:absolute group-[.is-animated]:left-[var(--mx)] group-[.is-animated]:top-[var(--my)] group-[.is-animated]:max-w-[85vw] group-[.is-animated]:drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] lg:group-[.is-animated]:left-[var(--x)] lg:group-[.is-animated]:top-[var(--y)] lg:group-[.is-animated]:max-w-[22rem]"
                style={{
                  ["--x" as string]: `${SPOTS[i].x}%`,
                  ["--y" as string]: `${SPOTS[i].y}%`,
                  ["--mx" as string]: `${SPOTS[i].mx}%`,
                  ["--my" as string]: `${SPOTS[i].my}%`,
                }}
              >
                <span className="mr-2 font-mono text-xs text-[#c9ff6b]">0{i + 1}</span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <p data-t="4" aria-hidden="true" className={`${title} invisible absolute`}>
          {hyper.stage4.map((l) => (
            <span key={l} className="block overflow-hidden">
              <Chars text={l} className={l.endsWith(".") ? "text-[#c9ff6b]" : ""} />
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
