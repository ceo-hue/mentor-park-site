"use client";

import { useState } from "react";
import {
  brand,
  contact,
  display,
  gallery,
  galleryUrl,
  hold,
  insights,
  manifesto,
  orbit,
  paradox,
  person,
  process,
  proof,
} from "@/content/site";
import { Eyebrow, Reveal } from "../ui/Reveal";
import { HoldButton } from "../ui/HoldButton";
import { HoloCard } from "../ui/HoloCard";
import { LogoMark } from "../ui/LogoMark";
import { Modal } from "../ui/Modal";
import { SafeImg } from "../ui/SafeImg";

const pad = "px-6 md:px-16 lg:px-28";
const giant = "font-display leading-[0.82] tracking-tight text-ink select-none";

function Marquee({ text, className = "", speed }: { text: string; className?: string; speed?: string }) {
  const unit = (
    <span className="flex items-center gap-[4vw] pr-[4vw]">
      {text}
      <LogoMark className="w-[9vw] md:w-[7vw] text-planet shrink-0" />
    </span>
  );
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden="true">
      <div className="marquee inline-flex" style={speed ? { animationDuration: speed } : undefined}>
        {unit}
        {unit}
        {unit}
        {unit}
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, title, right }: { eyebrow: string; title: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-6 mb-8 md:mb-12">
      <div>
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal as="h2" delay={0.1} className="font-black text-3xl md:text-5xl tracking-[-0.03em] leading-tight">
          {title}
        </Reveal>
      </div>
      {right && <span className="hidden md:block font-mono text-sm text-mute shrink-0">{right}</span>}
    </div>
  );
}

/* 0. 히어로 — 거대 워드마크(3D)가 행성 뒤에, 문장은 아래 중앙 */
export function Manifesto() {
  return (
    <section id="manifesto" data-scene className={`relative min-h-[150svh] ${pad}`}>
      <div className="sticky top-0 h-svh flex flex-col items-center justify-end pb-[12svh] md:pb-[5svh] text-center">
        <Reveal>
          <p className="font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase text-planet mb-3">
            {manifesto.eyebrow}
          </p>
        </Reveal>
        <h1 className="font-black tracking-[-0.03em] leading-[1.08] text-[8vw] md:text-[2.8vw]">
          {manifesto.title.map((line, i) => (
            <Reveal key={i} as="span" delay={0.1 + i * 0.12} className="block">
              {i === 0 ? (
                <>
                  비즈니스의 <span className="text-planet">정체성</span>을
                </>
              ) : (
                line
              )}
            </Reveal>
          ))}
        </h1>
        <Reveal as="p" delay={0.4} className="mt-3 max-w-xl text-mute text-sm leading-relaxed">
          {manifesto.body[0]}
          <br className="hidden md:block" /> {manifesto.body[1]}
        </Reveal>
      </div>
    </section>
  );
}

/* 1. 근본 질문 — 길게 누르면 파편이 다시 하나로 */
export function Hold() {
  return (
    <section id="hold" data-scene className={`relative min-h-[160svh] ${pad}`}>
      <div className="sticky top-0 h-svh flex flex-col items-center justify-between pt-[13svh] pb-[8svh] text-center">
        <div>
          <Reveal>
            <Eyebrow>{hold.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal as="h2" delay={0.1} className="font-black text-3xl md:text-5xl tracking-[-0.03em]">
            {hold.title}
          </Reveal>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-[60%] md:top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-10">
          <Reveal className={`${giant} text-[15vw] md:text-[12vw] text-[#e2495b]`}>{display.hold[0]}</Reveal>
          <Reveal delay={0.15} className={`${giant} text-[15vw] md:text-[12vw] text-planet`}>
            {display.hold[1]}
          </Reveal>
        </div>

        <div className="relative flex flex-col items-center gap-6">
          <Reveal as="p" delay={0.2} className="max-w-md text-mute text-sm md:text-base leading-relaxed">
            {hold.body}
          </Reveal>
          <HoldButton label={hold.cta} after={hold.after} />
        </div>
      </div>
    </section>
  );
}

/* 2. 정체성의 역설 — FEAR / TRUST */
export function Paradox() {
  const cards = [
    { ...paradox.fear, color: "#e2495b" },
    { ...paradox.trust, color: "var(--color-planet)" },
  ];
  return (
    <section id="paradox" data-scene className={`relative ${pad} pt-[34svh] pb-[16svh]`}>
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.12}>
            <HoloCard className="h-full">
              <div className="p-8 md:p-12 min-h-80 flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-12 h-px" style={{ background: c.color }} />
                  <span className="font-display text-3xl md:text-4xl tracking-wide" style={{ color: c.color }}>
                    {c.label}
                  </span>
                </div>
                <p className="text-xl md:text-3xl font-bold leading-snug tracking-[-0.02em]">{c.lead}</p>
                <p className="mt-6 text-mute text-sm md:text-base leading-relaxed">{c.body}</p>
              </div>
            </HoloCard>
          </Reveal>
        ))}
      </div>
      <Reveal
        as="p"
        delay={0.2}
        className="mt-14 md:mt-24 text-center text-2xl md:text-4xl font-bold leading-snug tracking-[-0.03em] max-w-4xl mx-auto"
      >
        {paradox.conclusion.before}
        <span className="text-planet">{paradox.conclusion.mind}</span>
        {paradox.conclusion.middle}
        <span className="underline decoration-[#e2495b] decoration-4 underline-offset-8">{paradox.conclusion.chain}</span>
        {paradox.conclusion.after}
      </Reveal>
    </section>
  );
}

/* 3. 서비스 — 기능마다 위성 하나가 고리 위에 정렬 */
export function Orbit() {
  let n = 0;
  return (
    <section id="orbit" data-scene className={`relative md:min-h-[180svh] ${pad} py-[14svh] md:py-0`}>
      <div className="md:sticky md:top-0 md:h-svh flex md:items-center">
        <div className="w-full md:w-[52%]">
          <div className="flex items-end gap-4 mb-6 md:mb-8">
            <Reveal className={`${giant} text-[20vw] md:text-[8vw] text-planet`}>
              {String(orbit.services.length).padStart(2, "0")}
            </Reveal>
            <div className="pb-1">
              <Reveal>
                <Eyebrow>{orbit.eyebrow}</Eyebrow>
              </Reveal>
              <Reveal as="h2" delay={0.1} className={`${giant} text-[12vw] md:text-[4.6vw]`}>
                {display.orbit}
              </Reveal>
            </div>
          </div>
          <div className="space-y-5 md:space-y-6">
            {orbit.services.map((s, si) => (
              <Reveal key={s.key} delay={0.12 + si * 0.1} className="border-t border-ink pt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-xl md:text-3xl font-black tracking-[-0.02em]">{s.title}</p>
                  <span className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-planet shrink-0">
                    [{s.label}]
                  </span>
                </div>
                <p className="text-sm md:text-base text-mute mt-1">{s.desc}</p>
                <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                  {s.features.map((f) => {
                    n += 1;
                    return (
                      <li key={f} className="flex gap-2 text-xs md:text-sm leading-snug">
                        <span className="font-mono text-ink/35 shrink-0">{String(n).padStart(2, "0")}</span>
                        {f}
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.35} className="mt-6 md:mt-8 rounded-2xl bg-ink text-white p-5 md:p-6">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/50 mb-2">
              {orbit.objective.label}
            </p>
            <p className="text-base md:text-lg font-bold leading-snug">“{orbit.objective.quote}”</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* 4. 멘토링 프로세스 */
export function Process() {
  return (
    <section id="process" data-scene className="relative pt-[24svh] pb-[14svh]">
      <Marquee text={display.process} className={`${giant} text-[22vw] md:text-[14vw] mb-10 md:mb-14`} speed="36s" />
      <div className={pad}>
        <SectionHead eyebrow={process.eyebrow} title="진단에서 성장까지, 네 개의 궤도" right="[04 STEPS]" />
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {process.steps.map((s, i) => (
            <Reveal key={s.step} as="li" delay={i * 0.08} className={i % 2 ? "lg:translate-y-10" : ""}>
              <HoloCard className="h-full">
                <div className="p-6 md:p-7 min-h-60 flex flex-col">
                  <span className="font-display text-6xl text-planet/80">{s.step}</span>
                  <p className="mt-auto text-2xl font-black tracking-[-0.02em]">{s.title}</p>
                  <p className="text-sm text-mute mt-2 leading-relaxed">{s.desc}</p>
                </div>
              </HoloCard>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 5. 검증된 이력 — 벤토 그리드 */
export function Proof() {
  return (
    <section id="proof" data-scene className={`relative ${pad} pt-[26svh] pb-[14svh]`}>
      <Reveal className={`${giant} text-[13vw] md:text-[8.5vw] mb-8 md:mb-12`}>{display.proof}</Reveal>
      <Reveal>
        <Eyebrow>{proof.eyebrow}</Eyebrow>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
        <Reveal className="md:col-span-8">
          <HoloCard className="h-full">
            <div className="p-8 md:p-12 min-h-72 flex flex-col justify-between">
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-planet">{proof.current.label}</span>
              <h3 className="mt-6 text-3xl md:text-5xl font-black tracking-[-0.03em] leading-[1.1]">
                {proof.current.role}
                <br />
                <span className="text-planet">{proof.current.title}</span>
              </h3>
              <p className="mt-8 text-mute md:text-lg max-w-xl">{proof.current.desc}</p>
            </div>
          </HoloCard>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-4">
          <div className="h-full min-h-60 rounded-[28px] bg-planet text-white grid place-items-center text-center p-8 group">
            <div>
              <span className="font-display text-8xl md:text-9xl block group-hover:scale-110 transition-transform duration-500">
                {proof.years.number}
              </span>
              <p className="mt-3 font-mono text-xs tracking-[0.3em] uppercase opacity-80">{proof.years.label}</p>
            </div>
          </div>
        </Reveal>

        <div className="md:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {proof.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="h-full rounded-[24px] bg-white/70 backdrop-blur border border-ink/10 p-6 md:p-8 group">
                <span className="font-display text-5xl md:text-6xl text-planet block group-hover:-translate-y-1 transition-transform">
                  {s.number}
                </span>
                <p className="mt-6 text-lg font-bold">{s.label}</p>
                <p className="text-sm text-mute">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="md:col-span-5">
          <div className="h-full rounded-[28px] bg-ink text-white p-8 md:p-10">
            <p className="font-display text-3xl md:text-4xl leading-none mb-8">
              PROFESSIONAL
              <br />
              <span className="text-planet-soft">REGISTRATIONS</span>
            </p>
            <ul className="space-y-3">
              {proof.registrations.map((r) => (
                <li key={r.name} className="flex justify-between gap-4 border-b border-white/10 pb-2.5 text-sm">
                  <span className="text-white/75">{r.name}</span>
                  <span className="font-mono text-[11px] text-white/45 shrink-0">{r.period}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-7">
          <HoloCard className="h-full">
            <div className="relative p-8 md:p-12 min-h-80 overflow-hidden">
              <span className="font-mono text-xs tracking-[0.25em] uppercase text-[#e2495b]">{proof.specialty.label}</span>
              <h3 className="mt-4 text-3xl md:text-4xl font-black tracking-[-0.03em]">{proof.specialty.title}</h3>
              <p className="mt-5 text-mute md:text-lg leading-relaxed max-w-lg">{proof.specialty.desc}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {proof.specialty.highlights.map((h) => (
                  <span key={h} className="px-4 py-2 rounded-full bg-white border border-ink/10 text-xs font-bold">
                    + {h}
                  </span>
                ))}
              </div>
              <span
                className={`${giant} absolute -right-4 -bottom-6 text-[9rem] md:text-[12rem] text-ink/[0.05] pointer-events-none`}
                aria-hidden="true"
              >
                PITCH
              </span>
            </div>
          </HoloCard>
        </Reveal>
      </div>
    </section>
  );
}

/* 6. 인사이트 영상 */
export function Insight() {
  const [playing, setPlaying] = useState<(typeof insights.videos)[number] | null>(null);
  return (
    <section id="insight" data-scene className="relative pt-[22svh] pb-[14svh]">
      <Marquee text={display.insight} className={`${giant} text-[20vw] md:text-[12vw] mb-10 md:mb-14`} />
      <div className={pad}>
        <SectionHead eyebrow={insights.eyebrow} title={insights.title} right={`[${String(insights.videos.length).padStart(2, "0")} VIDEOS]`} />
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {insights.videos.map((v, i) => {
            const thumb = v.thumbnail ?? `https://img.youtube.com/vi/${v.id}/hqdefault.jpg`;
            const inner = (
              <HoloCard className="h-full">
                <div className="p-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-sky-2">
                    <SafeImg src={thumb} alt={v.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/40 transition-colors" />
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="px-5 py-2.5 rounded-full bg-white text-ink font-mono text-xs tracking-widest opacity-90 group-hover:opacity-100 group-hover:scale-105 transition">
                        {v.type === "youtube" ? "▶ PLAY INSIGHT" : "VIEW INSIGHT ↗"}
                      </span>
                    </span>
                  </div>
                  <div className="px-3 pt-4 pb-3">
                    <p className="font-bold text-base md:text-lg leading-snug">{v.title}</p>
                    <p className="text-xs md:text-sm text-mute mt-1">{v.provider}</p>
                  </div>
                </div>
              </HoloCard>
            );
            return (
              <Reveal key={v.id} delay={i * 0.08}>
                {v.type === "youtube" ? (
                  <button type="button" onClick={() => setPlaying(v)} className="group block w-full text-left" aria-label={`${v.title} 영상 재생`}>
                    {inner}
                  </button>
                ) : (
                  <a href={v.url} target="_blank" rel="noopener noreferrer" className="group block" aria-label={`${v.title} (새 창)`}>
                    {inner}
                  </a>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
      <Modal open={!!playing} onClose={() => setPlaying(null)} label={playing?.title ?? "영상"}>
        {playing && (
          <div className="aspect-video rounded-2xl overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${playing.id}?autoplay=1&start=${playing.start}`}
              title={playing.title}
              className="w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </Modal>
    </section>
  );
}

/* 7. 현장 갤러리 */
export function Gallery() {
  const [selected, setSelected] = useState<(typeof gallery.images)[number] | null>(null);
  const strip = [...gallery.images, ...gallery.images];
  return (
    <section id="gallery" data-scene className="relative pt-[22svh] pb-[14svh] overflow-hidden">
      <div className={pad}>
        <SectionHead
          eyebrow={gallery.eyebrow}
          title={
            <>
              {gallery.title}
              <span className="block text-base md:text-lg font-medium text-mute mt-2 tracking-normal">{gallery.body}</span>
            </>
          }
          right={display.gallery}
        />
      </div>
      <div className="mb-6 md:mb-8">
        <div className="marquee inline-flex gap-4 pl-4" style={{ animationDuration: "50s" }}>
          {strip.map((img, i) => (
            <button
              key={`${img.file}-${i}`}
              type="button"
              onClick={() => setSelected(img)}
              aria-label={`${img.alt} 크게 보기`}
              className="holo shrink-0 w-[260px] md:w-[380px] aspect-[4/3] rounded-[24px] p-[5px] group"
            >
              <span className="block w-full h-full rounded-[20px] overflow-hidden bg-sky-2">
                <SafeImg src={galleryUrl(img.file, 760)} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className={`${pad} grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4`}>
        {gallery.images.map((img, i) => (
          <Reveal key={img.file} delay={(i % 4) * 0.05}>
            <button
              type="button"
              onClick={() => setSelected(img)}
              aria-label={`${img.alt} 크게 보기`}
              className="block w-full aspect-square rounded-2xl overflow-hidden bg-sky-2 group relative"
            >
              <SafeImg src={galleryUrl(img.file, 480)} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <span className="absolute inset-0 bg-planet/0 group-hover:bg-planet/25 transition-colors" />
            </button>
          </Reveal>
        ))}
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)} label={selected?.alt ?? "사진"}>
        {selected && (
          <figure>
            <SafeImg src={galleryUrl(selected.file, 1400)} alt={selected.alt} className="w-full max-h-[80vh] aspect-[4/3] object-contain rounded-2xl" />
            <figcaption className="mt-3 text-center text-sm text-white/70">{selected.alt}</figcaption>
          </figure>
        )}
      </Modal>
    </section>
  );
}

/* 8. 인물 */
export function Person() {
  return (
    <section id="person" data-scene className={`relative min-h-[150svh] ${pad}`}>
      <div className="sticky top-0 h-svh flex items-end md:items-center md:justify-end pb-[8svh] md:pb-0">
        <div className="w-full md:w-[50%]">
          <Reveal>
            <Eyebrow>{person.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal className={`${giant} text-[15vw] md:text-[7vw]`}>{display.person}</Reveal>
          <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-ink pt-5">
            <Reveal as="h2" delay={0.1} className="font-black text-4xl md:text-6xl tracking-[-0.04em]">
              {person.name}
            </Reveal>
            <Reveal as="p" delay={0.18} className="font-mono text-xs md:text-sm text-planet">
              {person.role}
            </Reveal>
          </div>
          <Reveal as="p" delay={0.22} className="mt-3 text-sm md:text-base font-bold">
            {person.current}
          </Reveal>
          <Reveal as="p" delay={0.26} className="mt-4 text-mute leading-relaxed">
            {person.body}
          </Reveal>
          <ul className="mt-6 flex flex-wrap gap-2">
            {person.creds.map((c, i) => (
              <Reveal
                key={c}
                as="li"
                delay={0.3 + i * 0.06}
                className="px-4 py-2 rounded-full bg-white/70 backdrop-blur border border-ink/10 text-sm"
              >
                {c}
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* 9. 문의 */
export function Contact() {
  const mail = `mailto:${brand.email}?subject=${encodeURIComponent(contact.mailSubject)}`;
  return (
    <section id="contact" data-scene className="relative min-h-svh pt-[14svh] pb-8 flex flex-col">
      <Marquee text={display.contact} className={`${giant} text-[24vw] md:text-[15vw]`} />
      <div className={`${pad} mt-8 md:mt-12 grid md:grid-cols-2 gap-8 items-end`}>
        <div>
          <Reveal>
            <Eyebrow>{contact.eyebrow}</Eyebrow>
          </Reveal>
          <h2 className="font-black tracking-[-0.04em] leading-[1.08] text-4xl md:text-6xl">
            {contact.title.map((l, i) => (
              <Reveal key={i} as="span" delay={0.1 + i * 0.1} className="block">
                {l}
              </Reveal>
            ))}
          </h2>
          <Reveal as="p" delay={0.3} className="mt-4 max-w-md text-mute">
            {contact.body[0]}
            <br />
            {contact.body[1]}
          </Reveal>
        </div>
        <Reveal delay={0.35} className="flex flex-col gap-3 md:items-end">
          <a
            href={mail}
            className="group inline-flex items-center justify-between gap-6 px-8 py-5 rounded-full bg-planet text-white text-lg md:text-xl font-bold hover:bg-ink transition-colors"
          >
            {contact.cta}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`mailto:${brand.email}`}
              className="inline-flex items-center justify-center px-6 py-4 rounded-full bg-white/70 backdrop-blur border border-ink/10 font-mono text-sm hover:border-planet transition-colors"
            >
              {brand.email}
            </a>
            <a
              href={`tel:${brand.phone.replace(/\./g, "")}`}
              className="inline-flex items-center justify-center px-6 py-4 rounded-full bg-white/70 backdrop-blur border border-ink/10 font-display text-xl tracking-wide hover:border-planet transition-colors"
            >
              {brand.phone}
            </a>
          </div>
        </Reveal>
      </div>
      <footer className={`${pad} mt-auto pt-20 flex flex-col md:flex-row md:items-end justify-between gap-2 font-mono text-[11px] text-ink/70`}>
        <p>
          <span className="font-serif font-bold text-planet tracking-[0.04em] mr-2">{brand.nameEn}</span>
          {brand.nameKo} · 대표 {person.name} · {brand.address}
        </p>
        <p>© {new Date().getFullYear()} {brand.nameEn}. All rights reserved.</p>
      </footer>
    </section>
  );
}
