"use client";

import { problem } from "../content";
import { gsap, useScene } from "../engine";

/** 세 질문이 엉킨 선(같은 명령 구조)과 정렬된 궤도 선 — GSAP이 d 속성의 숫자를 보간한다 */
const COLORS = ["#0a0f1c", "var(--color-planet)", "#e2495b"];
const Y = [90, 200, 310];
const TANGLED = [
  "M 30 90 C 160 360, 260 -60, 360 210 C 440 420, 520 20, 600 260 C 660 420, 720 120, 770 90",
  "M 30 200 C 150 -40, 250 420, 360 120 C 450 -60, 540 380, 600 140 C 650 0, 720 330, 770 200",
  "M 30 310 C 170 60, 230 260, 330 40 C 420 -70, 530 420, 610 300 C 680 200, 700 40, 770 310",
];
const STRAIGHT = Y.map(
  (y) => `M 30 ${y} C 160 ${y}, 260 ${y}, 360 ${y} C 440 ${y}, 520 ${y}, 600 ${y} C 660 ${y}, 720 ${y}, 770 ${y}`
);

export function ProblemScene() {
  const ref = useScene((root) => {
    const q = gsap.utils.selector(root);
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: "+=260%", pin: true, scrub: 0.8 },
      defaults: { ease: "none" },
    });
    tl.set(q("[data-path]"), { attr: { d: (i: number) => TANGLED[i] } })
      .set(q("[data-before]"), { opacity: 1 })
      .set(q("[data-after] [data-word]"), { yPercent: 110 })
      .set(q("[data-dot]"), { opacity: 0 })
      .set(q("[data-question]"), { opacity: 0, x: 20 })
      .set(q("[data-label]"), { opacity: 0 })
      // 1) 엉킨 선이 그려진다
      .from(q("[data-before] [data-word]"), { yPercent: 110, stagger: 0.08, duration: 0.3, ease: "power3.out" }, 0)
      .fromTo(q("[data-path]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.12 }, 0.1)
      .fromTo(q("[data-guide-path]"), { opacity: 0.22 }, { opacity: 0, duration: 0.75 }, 0.24)
      .to(q("[data-label]"), { opacity: 1, duration: 0.2, stagger: 0.1 }, 0.7)
      // 2) 선이 하나의 질서로 정렬된다
      .to(q("[data-path]"), { attr: { d: (i: number) => STRAIGHT[i] }, duration: 1, stagger: 0.08, ease: "power2.inOut" }, 1.3)
      .to(q("[data-before] [data-word]"), { yPercent: -110, stagger: 0.05, duration: 0.3, ease: "power2.in" }, 1.4)
      .to(q("[data-after] [data-word]"), { yPercent: 0, stagger: 0.08, duration: 0.4, ease: "power3.out" }, 1.85)
      // 3) 각 궤도를 따라 위성이 이동하고 질문이 붙는다
      .to(q("[data-dot]"), { opacity: 1, duration: 0.1 }, 2.3)
      .fromTo(q("[data-dot]"), { attr: { cx: 30 } }, { attr: { cx: 770 }, duration: 1, stagger: 0.12, ease: "power2.inOut" }, 2.3)
      .to(q("[data-question]"), { opacity: 1, x: 0, stagger: 0.12, duration: 0.4, ease: "power3.out" }, 2.8);
  });

  return (
    <section id="m-problem" ref={ref} className="relative z-[6] h-svh overflow-hidden bg-sky-0 px-6 md:px-14 lg:px-20">
      <div className="grid h-full content-center gap-8 pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
        <div>
          <p className="motion-kicker">{problem.kicker}</p>
          <div className="motion-heading relative mt-4 min-h-[9.5rem] md:min-h-[13rem]">
            <p data-before className="absolute inset-0 opacity-0">
              {problem.before.map((w) => (
                <span key={w} className="block overflow-hidden">
                  <span data-word className="title-gradient block">{w}</span>
                </span>
              ))}
            </p>
            <p data-after className="absolute inset-0 text-planet-ink">
              {problem.after.map((w) => (
                <span key={w} className="block overflow-hidden">
                  <span data-word className="title-gradient block">{w}</span>
                </span>
              ))}
            </p>
          </div>
        </div>

        <div>
          <div className="motion-surface overflow-hidden">
            <div className="p-3 md:p-5">
            <svg viewBox="0 0 800 400" className="h-auto w-full overflow-visible" aria-hidden="true">
              {Y.map((y) => (
                <line key={y} x1="30" x2="770" y1={y} y2={y} stroke="#0a0f1c" strokeOpacity="0.06" strokeDasharray="2 8" />
              ))}
              {TANGLED.map((d, i) => (
                <path key={d} data-guide-path d={d} fill="none" stroke={COLORS[i]} strokeWidth="3" strokeDasharray="3 8" opacity="0" />
              ))}
              {STRAIGHT.map((d, i) => (
                <path
                  key={i}
                  data-path
                  d={d}
                  pathLength={1}
                  strokeDasharray="1"
                  stroke={COLORS[i]}
                  strokeWidth={i === 1 ? 5 : 3.5}
                  strokeLinecap="round"
                  fill="none"
                />
              ))}
              {Y.map((y, i) => (
                <circle key={y} data-dot cx="770" cy={y} r="9" fill="#fff" stroke={COLORS[i]} strokeWidth="4" />
              ))}
              {problem.tracks.map((t, i) => (
                <text key={t.key} data-label x="30" y={Y[i] - 18} className="fill-ink text-[18px] font-bold">
                  {t.label}
                </text>
              ))}
            </svg>
            </div>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-3">
            {problem.tracks.map((t, i) => (
              <li key={t.key} data-question className="rounded-2xl border border-ink/10 bg-white/85 p-3.5 text-sm leading-snug backdrop-blur">
                <span className="mb-1 flex items-center gap-2 font-bold">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} aria-hidden="true" />
                  {t.label}
                </span>
                <span className="text-mute">{t.question}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
