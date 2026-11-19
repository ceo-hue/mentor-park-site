"use client";

import { irDeck, mvpBuild, practices } from "../content";
import { gsap, useScene } from "../engine";
import { HyperBackdrop } from "../HyperBackdrop";

/* ------------------------------------------------------------------ */
/* 패널별 모션그래픽                                                   */
/* ------------------------------------------------------------------ */

const LOOP = ["가설", "인터뷰", "실험", "판단"];

function PmfGraphic() {
  const R = 120;
  return (
    <svg viewBox="-190 -170 380 340" className="h-auto w-full max-w-[26rem]" role="img" aria-label="가설, 인터뷰, 실험, 판단을 반복하는 1주일 검증 루프">
      <circle r={R} fill="none" stroke="#0a0f1c" strokeOpacity="0.08" strokeWidth="14" />
      <g data-pmf-arc>
        <circle r={R} fill="none" stroke="var(--color-planet)" strokeWidth="14" strokeLinecap="round" pathLength={100} strokeDasharray="22 78" transform="rotate(-90)" />
      </g>
      {LOOP.map((label, i) => {
        const a = (i / LOOP.length) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(a) * R;
        const y = Math.sin(a) * R;
        return (
          <g key={label} data-pmf-node={i} transform={`translate(${x} ${y})`}>
            <circle data-pmf-dot r="30" fill="#fff" stroke="var(--color-planet)" strokeWidth="4" />
            <text y="6" textAnchor="middle" className="fill-ink text-[15px] font-bold">
              {label}
            </text>
          </g>
        );
      })}
      <text y="-6" textAnchor="middle" className="fill-mute font-mono text-[12px] tracking-[0.2em]">
        1주일
      </text>
      <text y="18" textAnchor="middle" className="fill-ink text-[17px] font-black">
        검증 루프
      </text>
    </svg>
  );
}

function DeckGraphic() {
  return (
    <div className="relative mx-auto h-[15rem] w-full max-w-[30rem] md:h-[18rem]" role="img" aria-label={`IR 덱 구성: ${irDeck.map((r) => r.label).join(", ")}`}>
      {irDeck.map((r, i) => {
        const k = i - (irDeck.length - 1) / 2;
        return (
          <div
            key={r.label}
            data-slide={i}
            className="absolute left-1/2 top-1/2 w-[52%] rounded-xl border border-ink/10 bg-white p-3 shadow-[0_20px_40px_-24px_rgba(20,40,90,0.45)] md:p-4"
            style={{ zIndex: 10 - i, transform: `translate(${-50 + k * 22}%, ${-50 + Math.abs(k) * 8}%) rotate(${k * 5}deg)` }}
          >
            <div className="flex items-center justify-between font-mono text-[10px] text-mute">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span className="h-1.5 w-8 rounded-full bg-planet/70" />
            </div>
            <p className="mt-2 text-sm font-black md:text-base">{r.label}</p>
            <p className="mt-1 line-clamp-3 text-[11px] leading-snug text-mute md:text-xs">{r.value}</p>
          </div>
        );
      })}
    </div>
  );
}

function VibeGraphic() {
  const { prompt, checks } = mvpBuild;
  return (
    <div className="grid w-full max-w-[34rem] gap-3 sm:grid-cols-[1.15fr_1fr]">
      <div className="rounded-2xl bg-ink p-4 font-mono text-[11px] leading-relaxed text-white/90 shadow-xl md:text-xs">
        <p className="mb-2 flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-[#e2495b]" />
          <span className="h-2 w-2 rounded-full bg-[#f5c451]" />
          <span className="h-2 w-2 rounded-full bg-[#5fd38d]" />
        </p>
        <p className="text-planet-soft">&gt; prompt</p>
        <p data-typed aria-label={prompt}>
          {Array.from(prompt).map((ch, i) => (
            <span key={i} data-ch aria-hidden="true">
              {ch}
            </span>
          ))}
        </p>
      </div>
      <div className="rounded-2xl border border-ink/10 bg-white p-3 shadow-xl">
        <p className="font-mono text-[10px] text-mute">MVP 통과 기준</p>
        <ul className="mt-2 space-y-1.5 text-xs">
          {checks.map((c, i) => (
            <li key={c} data-check-row={i} className="flex items-center gap-2 rounded-lg border border-planet/40 bg-planet/10 px-2.5 py-2 font-semibold">
              <span data-check-box className="grid h-4 w-4 shrink-0 place-items-center rounded bg-planet text-[10px] text-white" aria-hidden="true">
                ✓
              </span>
              {c}
            </li>
          ))}
        </ul>
        <span data-ready className="mt-2 block rounded-lg bg-ink py-1.5 text-center text-xs font-bold text-white">
          데모 준비 완료
        </span>
      </div>
    </div>
  );
}

/** 패널 하나의 모션을 타임라인 at 지점부터 약 1단위 길이로 추가한다 */
function addPanelMotion(tl: gsap.core.Timeline, panel: HTMLElement, id: string, at: number) {
  const q = gsap.utils.selector(panel);
  tl.from(q("[data-p-head] > *"), { y: 30, opacity: 0, stagger: 0.06, duration: 0.25, ease: "power3.out" }, at)
    .from(q("[data-p-row]"), { x: 30, opacity: 0, stagger: 0.07, duration: 0.25, ease: "power3.out" }, at + 0.25);

  if (id === "pmf") {
    tl.fromTo(q("[data-pmf-arc]"), { rotation: -40, svgOrigin: "0 0" }, { rotation: 320, svgOrigin: "0 0", duration: 0.9, ease: "none" }, at)
      .from(q("[data-pmf-node]"), { scale: 0, transformOrigin: "50% 50%", stagger: 0.15, duration: 0.2, ease: "back.out(2.5)" }, at + 0.05);
    q("[data-pmf-dot]").forEach((dot, i) => {
      tl.to(dot, { fill: "var(--color-planet)", duration: 0.08 }, at + 0.2 + i * 0.2);
      tl.to(q(`[data-pmf-node='${i}'] text`), { fill: "#ffffff", duration: 0.08 }, at + 0.2 + i * 0.2);
    });
  }

  if (id === "ir") {
    const slides = q("[data-slide]");
    const n = slides.length;
    slides.forEach((s, i) => {
      const k = i - (n - 1) / 2;
      tl.fromTo(
        s,
        { x: 0, y: 0, xPercent: -50, yPercent: -50, rotation: 0 },
        { x: 0, y: 0, xPercent: -50 + k * 22, yPercent: -50 + Math.abs(k) * 8, rotation: k * 5, duration: 0.45, ease: "power3.inOut" },
        at + 0.15 + i * 0.05
      );
    });
    tl.from(slides, { opacity: 0, y: 40, stagger: 0.05, duration: 0.2 }, at);
  }

  if (id === "vibe-coding") {
    const chars = q("[data-ch]");
    // 시작 상태: 아무것도 통과하지 않음
    tl.set(q("[data-check-row]"), { borderColor: "rgba(10,15,28,0.1)", backgroundColor: "rgba(255,255,255,0)" }, at)
      .set(q("[data-check-box]"), { backgroundColor: "rgba(10,15,28,0.12)", color: "rgba(255,255,255,0)" }, at)
      .set(q("[data-ready]"), { backgroundColor: "rgba(10,15,28,0.15)", color: "rgba(10,15,28,0.5)" }, at);
    tl.from(chars, { opacity: 0, duration: 0.01, stagger: 0.45 / Math.max(chars.length, 1), ease: "none" }, at + 0.05)
      .from(q("[data-check-row]"), { x: 30, opacity: 0, stagger: 0.06, duration: 0.15 }, at + 0.4);
    q("[data-check-row]").forEach((row, i) => {
      const t = at + 0.55 + i * 0.07;
      tl.to(row, { borderColor: "rgba(66,137,216,0.4)", backgroundColor: "rgba(66,137,216,0.1)", duration: 0.05 }, t).to(
        row.querySelector("[data-check-box]"),
        { backgroundColor: "var(--color-planet)", color: "#ffffff", duration: 0.05 },
        t
      );
    });
    tl.to(q("[data-ready]"), { backgroundColor: "#0a0f1c", color: "#ffffff", duration: 0.08 }, at + 0.88);
  }
}

/* ------------------------------------------------------------------ */
/* 장면                                                                */
/* ------------------------------------------------------------------ */

export function PracticeScene() {
  const ref = useScene((root, { isDesktop }) => {
    const q = gsap.utils.selector(root);
    const panels = q<HTMLElement>("[data-panel]");
    const track = q<HTMLElement>("[data-track]")[0];

    if (isDesktop) {
      // 패널마다: 모션 재생(1) → 다음 패널로 이동(0.5)
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top top", end: `+=${panels.length * 130}%`, pin: true, scrub: 0.8 },
        defaults: { ease: "none" },
      });
      panels.forEach((panel, i) => {
        const at = i * 1.5;
        addPanelMotion(tl, panel, panel.dataset.panel!, at);
        if (i < panels.length - 1) {
          tl.to(track, { xPercent: -(100 / panels.length) * (i + 1), duration: 0.5, ease: "power2.inOut" }, at + 1);
        }
      });
      tl.to({}, { duration: 0.3 });
    } else {
      panels.forEach((panel) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: panel, start: "top 75%", end: "bottom 65%", scrub: 0.8 },
        });
        addPanelMotion(tl, panel, panel.dataset.panel!, 0);
      });
    }
  });

  return (
    <section id="m-practice" ref={ref} className="relative isolate overflow-clip lg:h-svh">
      {/* 첫 화면의 하이퍼스페이스 빛줄기 (행성 없이). 그래픽 카드 뒤에서 뻗어 나온다 */}
      <HyperBackdrop className="-z-10" />
      <div className="relative px-6 pt-20 md:px-14 lg:absolute lg:inset-x-0 lg:top-0 lg:z-10 lg:px-20 lg:pt-24">
        <p className="motion-kicker">지원 분야</p>
      </div>
      <div data-track className="relative flex flex-col lg:h-full lg:w-[300%] lg:flex-row">
        {practices.map((p, i) => (
          <article key={p.id} data-panel={p.id} className="flex min-h-svh items-center px-6 py-16 md:px-14 lg:h-full lg:min-h-0 lg:w-1/3 lg:px-20 lg:py-0">
            <div className="grid w-full items-center gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
              <div>
                <div data-p-head>
                  {/* 번호와 제목을 한 줄로 */}
                  <h2 className="motion-heading flex items-baseline gap-[0.35em]">
                    <span className="title-gradient font-display font-normal" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="title-gradient">{p.title}</span>
                  </h2>
                  <p className="mt-2 text-lg font-bold text-planet-ink">{p.outcome}</p>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-mute">{p.description}</p>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {p.features.map((f) => (
                    <li key={f} data-p-row className="rounded-full border border-ink/12 bg-white/85 px-3.5 py-1.5 text-sm font-semibold">
                      {f}
                    </li>
                  ))}
                </ul>
                <div data-p-row className="motion-surface mt-5 p-4">
                  <p className="motion-kicker">준비하는 결과물</p>
                  <p className="mt-1 text-sm font-bold leading-snug">{p.deliverable}</p>
                </div>
              </div>
              <div className="motion-surface flex min-w-0 flex-col overflow-hidden">
                <div className="flex items-center justify-center p-4 sm:p-6">
                  {p.id === "pmf" && <PmfGraphic />}
                  {p.id === "ir" && <DeckGraphic />}
                  {p.id === "vibe-coding" && <VibeGraphic />}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
