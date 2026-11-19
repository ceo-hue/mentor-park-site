"use client";

import { brand, cta, leader, research } from "../content";
import { Chars, gsap, useScene } from "../engine";
import { OrbitSymbol } from "./Symbol";

/** 6. 리더십 + 문의 — 스크롤 속도에 따라 흐르는 거대 문장, 글자 단위로 떠오르는 CTA */
export function ContactScene() {
  const ref = useScene((root) => {
    const q = gsap.utils.selector(root);
    gsap.fromTo(
      q("[data-marquee]"),
      { xPercent: 0 },
      { xPercent: -45, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.6 } }
    );
    gsap.from(q("[data-cta] [data-char]"), {
      yPercent: 110,
      stagger: 0.02,
      duration: 0.9,
      ease: "expo.out",
      scrollTrigger: { trigger: q("[data-cta]")[0], start: "top 80%" },
    });
    gsap.from(q("[data-up]"), {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: q("[data-up]")[0], start: "top 85%" },
    });
  });

  const mail = `mailto:${brand.email}?subject=${encodeURIComponent(cta.subject)}`;

  return (
    <section id="m-contact" ref={ref} className="relative overflow-hidden pt-24 pb-10">
      <div className="overflow-hidden whitespace-nowrap" aria-hidden="true">
        <p data-marquee className="font-display text-[clamp(5rem,16vw,15rem)] leading-[0.85] tracking-tight text-ink">
          {cta.marquee} — {cta.marquee} —
        </p>
      </div>

      <div className="mt-14 grid gap-12 px-6 md:px-14 lg:grid-cols-[1fr_1.1fr] lg:px-20">
        <div data-up className="rounded-[2rem] border border-ink/10 bg-white/85 p-6 backdrop-blur md:p-8">
          <p className="font-mono text-[11px] tracking-[0.3em] text-planet">LEADERSHIP</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="w-16 shrink-0">
              <OrbitSymbol className="h-auto w-full" spin={false} />
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight">{leader.name}</p>
              <p className="text-sm font-semibold text-planet">{leader.role}</p>
            </div>
          </div>
          <p className="mt-4 text-base leading-relaxed text-mute">{leader.body}</p>
          <p className="mt-3 rounded-xl bg-sky-1/80 px-4 py-3 text-sm leading-relaxed text-ink/80">{research}</p>
        </div>

        <div>
          <h2 data-cta className="text-[clamp(2rem,5vw,3.8rem)] font-black leading-[1.1] tracking-[-0.03em]">
            {cta.title.map((l) => (
              <span key={l} className="block overflow-hidden pb-1">
                <Chars text={l} />
              </span>
            ))}
          </h2>
          <p data-up className="mt-4 max-w-lg text-base leading-relaxed text-mute">{cta.body}</p>
          <div data-up className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={mail} className="inline-flex items-center justify-center gap-3 rounded-full bg-ink px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-planet">
              {cta.button}
              <span aria-hidden="true">→</span>
            </a>
            <a href={`tel:${brand.phone.replace(/\./g, "")}`} className="inline-flex items-center justify-center rounded-full border border-ink/15 bg-white/80 px-6 py-4 font-display text-xl tracking-wide hover:border-planet">
              {brand.phone}
            </a>
          </div>
          <p data-up className="mt-3 font-mono text-sm text-mute">{brand.email}</p>
        </div>
      </div>

      <footer className="mt-20 flex flex-col justify-between gap-3 border-t border-ink/10 px-6 pt-6 text-xs text-mute md:flex-row md:px-14 lg:px-20">
        <p>
          {brand.nameKo} ({brand.nameEn}) · {brand.address}
        </p>
        <p>© {new Date().getFullYear()} {brand.nameEn}</p>
      </footer>
    </section>
  );
}
