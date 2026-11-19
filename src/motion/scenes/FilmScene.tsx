"use client";

import { film } from "../content";
import { gsap, useScene } from "../engine";

/** 시연 영상 — 작은 카드에서 화면 폭으로 커지며 모서리가 펴진다 */
export function FilmScene() {
  const ref = useScene((root) => {
    const q = gsap.utils.selector(root);
    gsap.fromTo(
      q("[data-frame]"),
      { scale: 0.62, borderRadius: "3rem" },
      {
        scale: 1,
        borderRadius: "1.25rem",
        ease: "none",
        scrollTrigger: { trigger: root, start: "top 85%", end: "top 15%", scrub: 0.6 },
      }
    );
    gsap.from(q("[data-up]"), {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: q("[data-up]")[0], start: "top 85%" },
    });
  });

  return (
    <section id="m-film" ref={ref} className="relative px-6 py-24 md:px-14 lg:px-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div data-up>
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-planet md:text-xs">{film.kicker}</p>
          <h2 className="mt-3 text-[clamp(1.8rem,4.4vw,3.2rem)] font-black leading-tight tracking-[-0.03em]">{film.title}</h2>
        </div>
        <p data-up className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">{film.label}</p>
      </div>
      <div data-frame className="mt-8 origin-top overflow-hidden rounded-[1.25rem] bg-[#14253e] shadow-[0_50px_100px_-50px_rgba(20,50,120,0.6)]">
        <video
          aria-label="가상 사례 시연 영상. 고객 검증부터 IR 피치·덱, 예약 재배정 흐름까지"
          className="aspect-video w-full"
          controls
          playsInline
          preload="none"
          poster={film.poster}
        >
          <source src={film.src} type="video/mp4" />
          <a href={film.src}>가상 사례 영상 열기</a>
        </video>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <ol data-up className="space-y-3">
          {film.transcript.map((t, i) => (
            <li key={t} className="flex gap-4 text-base leading-relaxed">
              <span className="font-display text-2xl leading-none text-planet">0{i + 1}</span>
              <span className="text-ink/80">{t}</span>
            </li>
          ))}
        </ol>
        <div data-up className="rounded-2xl border border-ink/10 bg-white/85 p-5 backdrop-blur">
          <p className="text-sm font-bold text-planet">{film.experiment.label}</p>
          <p className="mt-2 text-lg font-black leading-snug">{film.experiment.lead}</p>
          <p className="mt-2 text-sm leading-relaxed text-mute">{film.experiment.body}</p>
        </div>
      </div>
    </section>
  );
}
