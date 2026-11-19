"use client";

import { brand, cta, leader, research } from "../content";
import { gsap, useScene } from "../engine";
import { BrandLogo } from "@/components/ui/LogoMark";

/** 실무 가이드 카드의 위쪽 띠: 홀로그램 색 + 점 무늬 + 큰 흰 글자 */
function HoloBand({ label }: { label: string }) {
  return (
    <div className="holo relative flex h-28 items-end overflow-hidden px-6 pb-3 md:h-32 md:px-8" aria-hidden="true">
      <span className="font-display text-[clamp(3.75rem,7vw,5.5rem)] leading-none text-white/90 drop-shadow-[0_8px_20px_rgba(40,80,160,0.25)]">
        {label}
      </span>
      <span className="dots absolute inset-0 opacity-40" />
    </div>
  );
}

/** 운영자 소개와 첫 상담으로 이어지는 문의 영역 */
export function ContactScene() {
  const ref = useScene((root) => {
    const q = gsap.utils.selector(root);
    gsap.from(q("[data-cta] [data-line]"), {
      yPercent: 110,
      stagger: 0.12,
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
      <div className="grid items-start gap-6 px-6 md:px-14 lg:grid-cols-[0.82fr_1.18fr] lg:px-20">
        <div data-up className="motion-surface overflow-hidden">
          {/* 실무 가이드 카드와 같은 홀로그램 띠 + 흰 글자 하나 */}
          <HoloBand label="MENTOR" />
          <div className="px-6 pt-6 md:px-8 md:pt-7">
            <p className="motion-kicker">멘토 소개</p>
            <div className="mt-4 flex items-center gap-5">
              <BrandLogo className="w-28 shrink-0 md:w-32" />
              <div>
                <p className="text-2xl font-black tracking-tight">{leader.name}</p>
                <p className="text-sm font-semibold text-planet-ink">{leader.role}</p>
              </div>
            </div>
          </div>
          <div className="px-6 pt-4 pb-6 md:px-8 md:pb-8">
            <p className="text-base leading-relaxed text-mute">{leader.body}</p>
            <p className="mt-3 rounded-xl bg-sky-1/80 px-4 py-3 text-sm leading-relaxed text-ink/80">{research}</p>
          </div>
        </div>

        <div className="motion-surface overflow-hidden">
          <HoloBand label="CONTACT" />
          <div className="px-6 pt-7 pb-5 md:px-10 md:pt-9 md:pb-6">
            <h2 data-cta aria-label={cta.title.join(" ")} className="motion-heading">
              {cta.title.map((l) => (
                <span key={l} className="block overflow-hidden pb-1 last:text-planet-ink">
                  <span data-line className="title-gradient block">{l}</span>
                </span>
              ))}
            </h2>
          </div>
          <div className="px-6 pb-6 md:px-10 md:pb-10">
          <p data-up className="max-w-lg text-base leading-relaxed text-mute">{cta.body}</p>
          <div data-up className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={`tel:${brand.phone.replace(/\./g, "")}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-3 text-base font-bold tabular-nums transition-colors hover:border-planet-ink hover:text-planet-ink"
            >
              <span aria-hidden="true">☎</span>
              {brand.phone}
            </a>
            <a
              href={`mailto:${brand.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-3 text-base font-bold transition-colors hover:border-planet-ink hover:text-planet-ink"
            >
              <span aria-hidden="true">✉</span>
              {brand.email}
            </a>
            <a
              href={mail}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-ink px-6 py-3 text-base font-bold text-white transition-colors hover:bg-planet-ink"
            >
              {cta.button}
              <span aria-hidden="true">→</span>
            </a>
          </div>
          </div>
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
