"use client";

import { useState } from "react";
import { guides, resources } from "../content";
import { gsap, ScrollTrigger, useScene } from "../engine";
import { Modal } from "@/components/ui/Modal";

type Video = (typeof resources.videos)[number];

/** 실무 가이드 · 강의 영상 · PSST — 기존 사이트의 자료를 모션 카드로 */
export function GuidesScene() {
  const [open, setOpen] = useState<string | null>(null);
  const [playing, setPlaying] = useState<Video | null>(null);

  const ref = useScene((root) => {
    const q = gsap.utils.selector(root);
    gsap.from(q("[data-head] > *"), {
      y: 30,
      opacity: 0,
      stagger: 0.08,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: q("[data-head]")[0], start: "top 85%" },
    });
    ScrollTrigger.batch(q("[data-card]"), {
      start: "top 88%",
      onEnter: (els) => gsap.from(els, { y: 60, opacity: 0, rotate: 1.5, stagger: 0.12, duration: 0.9, ease: "power3.out" }),
      once: true,
    });
    // 카드 머리의 번호가 카드보다 느리게 움직여 깊이를 만든다
    q<HTMLElement>("[data-parallax]").forEach((el) => {
      gsap.fromTo(el, { yPercent: 25 }, { yPercent: -25, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    });
  });

  return (
    <section id="m-guides" ref={ref} className="relative px-6 py-24 md:px-14 lg:px-20">
      <div data-head className="max-w-3xl">
        <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-planet md:text-xs">{resources.kicker}</p>
        <h2 className="mt-3 text-[clamp(1.8rem,4.4vw,3.2rem)] font-black leading-tight tracking-[-0.03em]">{resources.title}</h2>
        <p className="mt-3 text-base leading-relaxed text-mute">{resources.intro}</p>
      </div>

      {/* 분야별 가이드 */}
      <div className="mt-10 grid items-start gap-5 lg:grid-cols-3">
        {guides.map((g, i) => {
          const isOpen = open === g.id;
          return (
            <article key={g.id} data-card className="overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white/90 shadow-[0_30px_60px_-40px_rgba(30,60,130,0.5)] backdrop-blur">
              <div className="holo relative flex h-28 items-end overflow-hidden px-5 pb-3 md:px-6" aria-hidden="true">
                <span data-parallax className="font-display text-[5.5rem] leading-none text-white/90 drop-shadow-[0_8px_20px_rgba(40,80,160,0.25)]">
                  0{i + 1}
                </span>
                <span className="dots absolute inset-0 opacity-40" />
              </div>
              <div className="p-5 md:p-6">
                <p className="font-mono text-[11px] tracking-[0.2em] text-planet">0{i + 1} · {g.title}</p>
                <h3 className="mt-2 text-xl font-black leading-snug">{g.guideTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{g.summary}</p>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => {
                    setOpen(isOpen ? null : g.id);
                    requestAnimationFrame(() => ScrollTrigger.refresh());
                  }}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-bold hover:bg-ink hover:text-white"
                >
                  {isOpen ? "접기" : "가이드 펼치기"}
                  <span aria-hidden="true" className={`transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
                {isOpen && (
                  <div className="mt-5 space-y-4">
                    <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed">
                      {g.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ol>
                    <a href={g.source.url} target="_blank" rel="noopener noreferrer" className="block text-sm font-semibold underline underline-offset-4">
                      참고 · {g.source.label}
                    </a>
                  </div>
                )}
                <div className="mt-5 border-t border-ink/10 pt-4 text-sm">
                  <p className="text-mute">{g.reference.description}</p>
                  <a href={g.reference.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block font-semibold underline underline-offset-4">
                    {g.reference.label}
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* 강의 영상 */}
      <h3 className="mt-16 text-2xl font-black md:text-3xl">{resources.videosTitle}</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {resources.videos.map((v) => {
          const thumb = v.thumbnail ?? (v.type === "youtube" ? `https://img.youtube.com/vi/${v.id}/hqdefault.jpg` : null);
          const body = (
            <>
              <span className="relative block aspect-video overflow-hidden rounded-xl bg-sky-1">
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src="/brand/wordmark-ko.svg" alt="" className="absolute left-1/2 top-1/2 h-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
                <span className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-xs shadow group-hover:bg-ink group-hover:text-white" aria-hidden="true">
                  {v.type === "youtube" ? "▶" : "↗"}
                </span>
              </span>
              <span className="mt-3 block font-bold leading-snug">{v.title}</span>
              <span className="mt-1 block text-xs text-mute">{v.provider}</span>
              {"detail" in v && v.detail && <span className="mt-2 block text-xs leading-relaxed text-mute">{v.detail}</span>}
            </>
          );
          return (
            <div key={v.id} data-card className="rounded-2xl border border-ink/10 bg-white/85 p-3 backdrop-blur">
              {v.type === "youtube" ? (
                <button type="button" onClick={() => setPlaying(v)} className="group block w-full text-left" aria-label={`${v.title} 영상 재생`}>
                  {body}
                </button>
              ) : (
                <a href={v.url} target="_blank" rel="noopener noreferrer" className="group block" aria-label={`${v.title} (새 창)`}>
                  {body}
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* PSST */}
      <div data-card className="mt-8 rounded-[1.75rem] bg-ink p-6 text-white md:p-8">
        <p className="font-mono text-[11px] tracking-[0.25em] text-planet-soft">BUSINESS PLAN · PSST</p>
        <h3 className="mt-2 text-2xl font-black">{resources.businessPlan.title}</h3>
        <p className="mt-2 text-white/75">{resources.businessPlan.summary}</p>
        <ol className="mt-5 grid gap-4 md:grid-cols-3">
          {resources.businessPlan.points.map((p, i) => (
            <li key={p} className="rounded-2xl border border-white/15 bg-white/5 p-4 text-sm leading-relaxed text-white/85">
              <span className="mb-2 block font-display text-3xl text-planet-soft">0{i + 1}</span>
              {p}
            </li>
          ))}
        </ol>
        <a href={resources.businessPlan.source.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm font-semibold underline underline-offset-4">
          참고 · {resources.businessPlan.source.label}
        </a>
      </div>

      <Modal open={!!playing} onClose={() => setPlaying(null)} label={playing?.title ?? "영상"}>
        {playing && (
          <div className="aspect-video overflow-hidden rounded-2xl bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${playing.id}?autoplay=1&start=${playing.start}`}
              title={playing.title}
              className="h-full w-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </Modal>
    </section>
  );
}
