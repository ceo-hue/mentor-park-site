"use client";

import { network } from "../content";
import { gsap, useScene } from "../engine";

/** 5. 기관 네트워크 — 연도 축 위를 행성이 지나가며 그해의 기관 활동이 차례로 켜진다 */
export function NetworkScene() {
  const nodes = network.nodes;
  const thisYear = new Date().getFullYear();
  const first = nodes[0]?.year ?? thisYear;
  const years = Array.from({ length: thisYear - first + 1 }, (_, i) => first + i);

  const ref = useScene((root, { isDesktop }) => {
    const q = gsap.utils.selector(root);
    if (!isDesktop) {
      q("[data-node]").forEach((el) => {
        gsap.from(el, { x: 24, opacity: 0, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      });
      return;
    }
    const n = years.length;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top top", end: `+=${n * 32}%`, pin: true, scrub: 0.8 },
      defaults: { ease: "none" },
    });
    tl.set(q("[data-node]"), { opacity: 0, y: 24 })
      .set(q("[data-year-col]"), { opacity: 0.35 })
      .set(q("[data-cursor]"), { left: "0%" })
      .set(q("[data-fill]"), { scaleX: 0, transformOrigin: "0 50%" })
      .set(q("[data-year-num]"), { yPercent: 100 })
      .set(q("[data-year-num='0']"), { yPercent: 0 });

    years.forEach((y, i) => {
      const t = i;
      tl.to(q("[data-cursor]"), { left: `${((i + 0.5) / n) * 100}%`, duration: 0.6, ease: "power2.inOut" }, t)
        .to(q("[data-fill]"), { scaleX: (i + 0.5) / n, duration: 0.6, ease: "power2.inOut" }, t)
        .to(q(`[data-year-col='${y}']`), { opacity: 1, duration: 0.2 }, t + 0.4)
        .to(q(`[data-year-col='${y}'] [data-node]`), { opacity: 1, y: 0, stagger: 0.12, duration: 0.3, ease: "power3.out" }, t + 0.45);
      if (i > 0) {
        tl.to(q(`[data-year-num='${i - 1}']`), { yPercent: -100, duration: 0.3 }, t + 0.2).to(
          q(`[data-year-num='${i}']`),
          { yPercent: 0, duration: 0.3 },
          t + 0.2
        );
      }
    });
    tl.to({}, { duration: 0.5 });
  });

  return (
    <section id="m-network" ref={ref} className="relative overflow-hidden px-6 py-20 md:px-14 lg:h-svh lg:px-20 lg:py-0">
      <div className="flex h-full flex-col justify-center lg:pt-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-planet md:text-xs">{network.kicker}</p>
            <h2 className="mt-3 max-w-2xl text-[clamp(1.8rem,4.4vw,3.2rem)] font-black leading-tight tracking-[-0.03em]">{network.title}</h2>
          </div>
          <div className="flex items-end gap-6">
            <span className="relative hidden h-[clamp(4rem,8vw,7rem)] w-[clamp(9rem,16vw,14rem)] overflow-hidden lg:block" aria-hidden="true">
              {years.map((y, i) => (
                <span key={y} data-year-num={i} className="absolute inset-0 font-display text-[clamp(4rem,8vw,7rem)] leading-none text-planet">
                  {y}
                </span>
              ))}
            </span>
            <dl className="text-right">
              <dt className="font-mono text-[10px] tracking-[0.2em] text-mute">기관 등록·활동 기록</dt>
              <dd className="font-display text-4xl leading-none">{nodes.length}</dd>
            </dl>
          </div>
        </div>

        {/* 연도 축 (데스크톱) */}
        <div className="relative mt-10 hidden h-6 lg:block" aria-hidden="true">
          <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-ink/10" />
          <span data-fill className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-planet" />
          <span
            data-cursor
            className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-planet shadow-[0_0_0_6px_rgba(66,137,216,0.18)]"
            style={{ left: "100%" }}
          />
        </div>

        <ol className="mt-6 grid gap-4 lg:mt-4 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))] lg:gap-3" style={{ ["--cols" as string]: years.length }}>
          {years.map((y) => {
            const items = nodes.filter((n) => n.year === y);
            return (
              <li key={y} data-year-col={y} className="grid grid-cols-[4rem_1fr] gap-3 border-t border-ink/10 pt-3 lg:block lg:border-t-0 lg:pt-0">
                <p className={`font-mono text-sm ${items.length ? "font-bold text-ink" : "text-mute"} lg:text-center`}>{y}</p>
                <div className="space-y-2 lg:mt-3">
                  {items.length === 0 && <p className="text-xs text-mute/70 lg:text-center">—</p>}
                  {items.map((n) => (
                    <div key={n.role} data-node className="rounded-xl border border-ink/10 bg-white/90 p-2.5 shadow-sm backdrop-blur">
                      <p className="text-[13px] font-black leading-snug">
                        {n.url ? (
                          <a href={n.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
                            {n.org}
                          </a>
                        ) : (
                          n.org
                        )}
                      </p>
                      <p className="mt-1 text-[11px] leading-snug text-mute">{n.role}</p>
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-mute">{network.note}</p>
      </div>
    </section>
  );
}
