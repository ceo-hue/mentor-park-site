"use client";

import { method } from "../content";
import { gsap, useScene } from "../engine";

const RINGS = [72, 112, 152, 192];
const ANGLES = [-35, 20, 150, 235];

/** 2. 방법론 — 행성 둘레에 네 개의 궤도가 차례로 그려지고, 단계 카드가 교체된다 */
export function MethodScene() {
  const n = method.steps.length;
  const ref = useScene((root) => {
    const q = gsap.utils.selector(root);
    const cards = q("[data-card]");
    const nums = q("[data-num]");
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: `+=${n * 90}%`, pin: true, scrub: 0.8 },
      defaults: { ease: "none" },
    });
    tl.set(cards.slice(1), { autoAlpha: 0, y: 40 })
      .set(nums.slice(1), { yPercent: 100 })
      .set(q("[data-ring]"), { strokeDashoffset: 1 })
      .set(q("[data-sat]"), { scale: 0, transformOrigin: "50% 50%" })
      .set(q("[data-ring-label]"), { opacity: 0 })
      .set(q("[data-seg]"), { scaleX: 0, transformOrigin: "0 50%" })
      .from(q("[data-core]"), { scale: 0.4, opacity: 0, transformOrigin: "50% 50%", duration: 0.4, ease: "back.out(2)" }, 0);

    method.steps.forEach((_, i) => {
      const t = 0.3 + i;
      tl.to(q(`[data-ring='${i}']`), { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut" }, t)
        .to(q(`[data-sat='${i}']`), { scale: 1, duration: 0.25, ease: "back.out(3)" }, t + 0.45)
        .to(q(`[data-ring-label='${i}']`), { opacity: 1, duration: 0.2 }, t + 0.5)
        .to(q(`[data-orbit='${i}']`), { rotation: 70, svgOrigin: "0 0", duration: 1.6 }, t)
        .to(q(`[data-seg='${i}']`), { scaleX: 1, duration: 0.6 }, t);
      if (i > 0) {
        tl.to(cards[i - 1], { autoAlpha: 0, y: -40, duration: 0.3, ease: "power2.in" }, t - 0.05)
          .to(cards[i], { autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out" }, t + 0.2)
          .to(nums[i - 1], { yPercent: -100, duration: 0.3, ease: "power2.in" }, t - 0.05)
          .to(nums[i], { yPercent: 0, duration: 0.35, ease: "power3.out" }, t + 0.15)
          // 지난 궤도는 옅게
          .to(q(`[data-ring='${i - 1}']`), { strokeOpacity: 0.35, duration: 0.3 }, t);
      }
    });
    tl.to({}, { duration: 0.4 });
  });

  return (
    <section id="m-method" ref={ref} className="group relative min-h-svh overflow-hidden px-6 py-20 md:px-14 lg:px-20 [&.is-animated]:h-svh [&.is-animated]:py-0">
      <div className="grid h-full content-center gap-6 pt-16 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className="order-2 lg:order-1">
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-planet md:text-xs">{method.kicker}</p>
          <h2 className="mt-3 text-[clamp(1.8rem,5vw,3.4rem)] font-black leading-tight tracking-[-0.03em]">{method.title}</h2>

          <div className="mt-6 hidden items-end gap-5 group-[.is-animated]:flex">
            <span className="relative block h-[clamp(4.5rem,11vw,8.5rem)] w-[clamp(6rem,15vw,11rem)] overflow-hidden" aria-hidden="true">
              {method.steps.map((s) => (
                <span key={s.step} data-num className="absolute inset-0 font-display text-[clamp(4.5rem,11vw,8.5rem)] leading-none text-planet">
                  {s.step}
                </span>
              ))}
            </span>
            <span className="pb-2 font-mono text-xs text-mute">/ {String(n).padStart(2, "0")}</span>
          </div>

          <div className="relative mt-4 space-y-3 group-[.is-animated]:min-h-[9rem] group-[.is-animated]:space-y-0">
            {method.steps.map((s) => (
              <article key={s.step} data-card className="relative group-[.is-animated]:absolute inset-x-0 top-0 rounded-3xl border border-ink/10 bg-white/90 p-5 backdrop-blur md:p-6">
                <p className="font-mono text-[11px] tracking-[0.3em] text-planet">{s.key}</p>
                <h3 className="mt-1 text-2xl font-black tracking-tight">{s.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-mute">{s.desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-4 gap-2" aria-hidden="true">
            {method.steps.map((s, i) => (
              <span key={s.step} className="block h-1 overflow-hidden rounded-full bg-ink/10">
                <span data-seg={i} className="block h-full bg-planet" />
              </span>
            ))}
          </div>
        </div>

        <div className="order-1 mx-auto w-[min(82vw,46svh)] lg:order-2 lg:w-[min(40vw,72svh)]">
          <svg viewBox="-230 -230 460 460" className="h-auto w-full overflow-visible" role="img" aria-label={`${method.title}: ${method.steps.map((s) => s.title).join(", ")}`}>
            {RINGS.map((r, i) => (
              <g key={r}>
                <circle data-ring={i} r={r} fill="none" stroke="var(--color-planet)" strokeWidth={i === 0 ? 3 : 2} pathLength={1} strokeDasharray="1" transform="rotate(-90)" />
                <g data-orbit={i}>
                  <g transform={`rotate(${ANGLES[i]})`}>
                    <circle data-sat={i} cx={r} cy={0} r={11} fill="#fff" stroke="var(--color-planet)" strokeWidth={4} />
                  </g>
                </g>
                <text
                  data-ring-label={i}
                  x={0}
                  y={-r - 8}
                  textAnchor="middle"
                  className="fill-ink font-mono text-[12px] tracking-[0.2em]"
                >
                  {method.steps[i].key}
                </text>
              </g>
            ))}
            <g data-core>
              <circle r={38} fill="var(--color-planet)" />
              <circle r={38} fill="url(#core-shine)" />
              <defs>
                <radialGradient id="core-shine" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
                  <stop offset="60%" stopColor="#fff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <text y={5} textAnchor="middle" className="fill-white font-display text-[15px] tracking-wide">
                YOUR TEAM
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
