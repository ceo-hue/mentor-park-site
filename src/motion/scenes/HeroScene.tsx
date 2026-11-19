"use client";

import { hero } from "../content";
import { Chars, gsap, useScene } from "../engine";
import { OrbitSymbol } from "./Symbol";

/** 0. 인트로 — 선이 그려지며 심볼이 완성되고, 거대 문장이 떠오른다. 스크롤하면 심볼이 화면을 채우며 다음 장면으로 */
export function HeroScene() {
  const ref = useScene((root) => {
    const q = gsap.utils.selector(root);
    // 로드 직후 인트로
    const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
    intro
      .from(q("[data-draw]"), { strokeDashoffset: 1, duration: 1.8, stagger: 0.25, ease: "power2.inOut" }, 0.1)
      .from(q("[data-planet-fill]"), { opacity: 0, scale: 0.6, transformOrigin: "50% 50%", duration: 1.4 }, 0.6)
      .from(q("[data-pop]"), { scale: 0, transformOrigin: "50% 50%", duration: 0.8, stagger: 0.12, ease: "back.out(3)" }, 1.2)
      .from(q("[data-line] [data-char]"), { yPercent: 115, duration: 1.1, stagger: 0.025 }, 0.35)
      .from(q("[data-fade]"), { y: 20, opacity: 0, duration: 1, stagger: 0.1 }, 1.0);

    // 스크롤 퇴장
    gsap
      .timeline({
        scrollTrigger: { trigger: root, start: "top top", end: "+=120%", pin: true, scrub: 0.8 },
      })
      .to(q("[data-line='0']"), { xPercent: -18, opacity: 0, ease: "power2.in" }, 0)
      .to(q("[data-line='1']"), { xPercent: 14, opacity: 0, ease: "power2.in" }, 0.05)
      .to(q("[data-line='2']"), { xPercent: -10, opacity: 0, ease: "power2.in" }, 0.1)
      .to(q("[data-fade]"), { y: -30, opacity: 0 }, 0)
      .to(q("[data-symbol]"), { scale: 2.6, xPercent: -40, opacity: 0, ease: "power2.in" }, 0.15);
  });

  return (
    <section id="m-hero" ref={ref} className="relative h-svh overflow-hidden px-6 md:px-14 lg:px-20">
      <div className="dots absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="relative grid h-full grid-rows-[1fr_auto] pt-24 pb-10 lg:grid-cols-[1.25fr_1fr] lg:grid-rows-1 lg:items-center lg:pt-16">
        <div className="relative z-10 self-center">
          <p data-fade className="font-mono text-[11px] tracking-[0.3em] uppercase text-planet md:text-xs">
            {hero.kicker}
          </p>
          <h1 className="mt-4 font-display leading-[0.86] tracking-tight text-ink text-[clamp(4.2rem,17vw,13rem)] lg:text-[clamp(5rem,9.4vw,11rem)]">
            {hero.lines.map((l, i) => (
              <span key={l} data-line={i} className="block overflow-hidden pb-[0.04em]">
                <Chars text={l} className={i === 2 ? "text-planet" : ""} />
              </span>
            ))}
          </h1>
          <p data-fade className="mt-6 max-w-xl text-base leading-relaxed text-ink/80 md:text-lg">
            {hero.ko}
          </p>
        </div>
        <div data-symbol className="pointer-events-none absolute right-[-18vw] bottom-[12svh] w-[78vw] opacity-40 lg:static lg:w-full lg:opacity-100">
          <OrbitSymbol className="h-auto w-full drop-shadow-[0_30px_50px_rgba(66,137,216,0.25)]" />
        </div>
      </div>
      <div data-fade className="absolute bottom-6 right-6 flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-ink/60 md:right-14">
        SCROLL
        <span className="relative block h-10 w-px overflow-hidden bg-ink/15">
          <span className="scroll-cue absolute inset-x-0 top-0 h-4 bg-ink" />
        </span>
      </div>
    </section>
  );
}
