"use client";

import { brand, contact, display, hold, manifesto, orbit, person, proof } from "@/content/site";
import { Eyebrow, Reveal } from "../ui/Reveal";
import { HoldButton } from "../ui/HoldButton";
import { HoloCard } from "../ui/HoloCard";
import { LogoMark } from "../ui/LogoMark";

const pad = "px-6 md:px-16 lg:px-28";
const giant = "font-display leading-[0.82] tracking-tight text-ink select-none";

function Marquee({ text, className = "" }: { text: string; className?: string }) {
  const unit = (
    <span className="flex items-center gap-[4vw] pr-[4vw]">
      {text}
      <LogoMark className="w-[9vw] md:w-[7vw] text-planet shrink-0" />
    </span>
  );
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden="true">
      <div className="marquee inline-flex">
        {unit}
        {unit}
        {unit}
        {unit}
      </div>
    </div>
  );
}

/* 0. 선언 — 거대 워드마크(3D)가 행성 뒤에, 문장은 아래 중앙 */
export function Manifesto() {
  return (
    <section id="manifesto" data-scene className={`relative min-h-[150svh] ${pad}`}>
      <div className="sticky top-0 h-svh flex flex-col items-center justify-end pb-[12svh] md:pb-[5svh] text-center">
        <Reveal>
          <LogoMark className="w-10 text-planet mx-auto mb-3" />
        </Reveal>
        <h1 className="font-black tracking-[-0.03em] leading-[1.08] text-[7.4vw] md:text-[2.4vw]">
          {manifesto.title.map((line, i) => (
            <Reveal key={i} as="span" delay={0.1 + i * 0.12} className="block">
              {line}
            </Reveal>
          ))}
        </h1>
        <Reveal as="p" delay={0.4} className="mt-3 max-w-xl text-mute text-sm leading-relaxed">
          {manifesto.body}
        </Reveal>
      </div>
    </section>
  );
}

/* 1. 길게 누르기 — 양옆 거대 단어 사이에서 행성이 부서졌다 모임 */
export function Hold() {
  return (
    <section id="hold" data-scene className={`relative min-h-[160svh] ${pad}`}>
      <div className="sticky top-0 h-svh flex flex-col items-center justify-between pt-[13svh] pb-[8svh] text-center">
        <div>
          <Reveal>
            <Eyebrow>{hold.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal as="h2" delay={0.1} className="font-black text-2xl md:text-4xl tracking-[-0.02em]">
            {hold.title}
          </Reveal>
        </div>

        {/* 행성 양옆의 거대 단어 */}
        <div className="pointer-events-none absolute inset-x-0 top-[60%] md:top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-10">
          <Reveal className={`${giant} text-[12.5vw] md:text-[11vw]`}>{display.hold[0]}</Reveal>
          <Reveal delay={0.15} className={`${giant} text-[12.5vw] md:text-[11vw]`}>
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

/* 2. 궤도 — 서비스 수만큼 위성이 고리 위에 정렬 */
export function Orbit() {
  return (
    <section id="orbit" data-scene className={`relative min-h-[180svh] ${pad}`}>
      <div className="sticky top-0 h-svh flex items-end md:items-center pb-[6svh] md:pb-0">
        <div className="w-full md:w-[50%]">
          <div className="flex items-end gap-4 mb-6 md:mb-10">
            <Reveal className={`${giant} text-[22vw] md:text-[10vw] text-planet`}>
              {String(orbit.items.length).padStart(2, "0")}
            </Reveal>
            <div className="pb-2">
              <Reveal>
                <Eyebrow>{orbit.eyebrow}</Eyebrow>
              </Reveal>
              <Reveal as="h2" delay={0.1} className={`${giant} text-[12vw] md:text-[5.5vw]`}>
                {display.orbit}
              </Reveal>
            </div>
          </div>
          <ol className="border-t border-ink">
            {orbit.items.map((it, i) => (
              <Reveal
                key={it.key}
                as="li"
                delay={0.12 + i * 0.07}
                className="group border-b border-ink/20 py-3 md:py-5 grid grid-cols-[3.5rem_1fr_auto] md:grid-cols-[5rem_1fr_auto] items-center gap-3 hover:bg-white/50 transition-colors"
              >
                <span className="font-display text-3xl md:text-5xl text-ink/25 group-hover:text-planet transition-colors">
                  {it.key}
                </span>
                <div>
                  <p className="text-lg md:text-2xl font-bold tracking-[-0.02em]">{it.name}</p>
                  <p className="text-xs md:text-sm text-mute mt-0.5">{it.desc}</p>
                </div>
                <span className="font-mono text-lg text-ink/30 group-hover:text-planet group-hover:translate-x-1 transition-all">
                  →
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* 3. 기록 — 흐르는 거대 띠 + 홀로그램 카드 */
export function Proof() {
  return (
    <section id="proof" data-scene className="relative min-h-[170svh] pt-[36svh] pb-[18svh]">
      <Marquee text={display.proof} className={`${giant} text-[20vw] md:text-[13vw] mb-12 md:mb-16`} />
      <div className={pad}>
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <Reveal>
              <Eyebrow>{proof.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal as="h2" delay={0.1} className="font-black text-3xl md:text-5xl tracking-[-0.03em]">
              {proof.title}
            </Reveal>
          </div>
          <span className="hidden md:block font-mono text-sm text-mute">
            [{String(proof.items.length).padStart(2, "0")} RECORDS]
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {proof.items.map((it, i) => (
            <Reveal key={i} delay={0.06 * (i % 3)} className={i % 3 === 1 ? "lg:translate-y-16" : ""}>
              <HoloCard className="h-full">
                <div className="p-6 md:p-7 min-h-64 md:min-h-72 flex flex-col">
                  <div className="aspect-[16/10] rounded-2xl bg-gradient-to-br from-sky-1 to-sky-2 mb-5 grid place-items-center">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-ink/40">IMAGE</span>
                  </div>
                  <p className={`${giant} text-3xl md:text-4xl`}>{it.title}</p>
                  <p className="text-sm text-mute mt-2 flex-1">{it.desc}</p>
                  <div className="mt-5 flex items-center justify-between font-mono text-[11px] tracking-wider">
                    <span>• {it.tag} • {it.year} •</span>
                    <span className="w-8 h-8 rounded-full border border-ink grid place-items-center">→</span>
                  </div>
                </div>
              </HoloCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 4. 인물 — 행성이 왼쪽, 거대 이름 */
export function Person() {
  return (
    <section id="person" data-scene className={`relative min-h-[160svh] ${pad}`}>
      <div className="sticky top-0 h-svh flex items-end md:items-center md:justify-end pb-[6svh] md:pb-0">
        <div className="w-full md:w-[48%]">
          <Reveal>
            <Eyebrow>{person.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal className={`${giant} text-[16vw] md:text-[7.5vw]`}>{display.person}</Reveal>
          <div className="mt-6 flex items-baseline gap-4 border-t border-ink pt-5">
            <Reveal as="h2" delay={0.1} className="font-black text-4xl md:text-6xl tracking-[-0.04em]">
              {person.name}
            </Reveal>
            <Reveal as="p" delay={0.18} className="font-mono text-xs md:text-sm text-planet">
              {person.role}
            </Reveal>
          </div>
          <Reveal as="p" delay={0.26} className="mt-5 text-mute leading-relaxed">
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

/* 5. 교신 — 행성이 아래로 지고, 거대 띠와 연락처 */
export function Contact() {
  return (
    <section id="contact" data-scene className="relative min-h-svh pt-[14svh] pb-8 flex flex-col">
      <Marquee text={display.contact} className={`${giant} text-[24vw] md:text-[15vw]`} />
      <div className={`${pad} mt-8 md:mt-12 grid md:grid-cols-2 gap-8 items-end`}>
        <div>
          <Reveal>
            <Eyebrow>{contact.eyebrow}</Eyebrow>
          </Reveal>
          <h2 className="font-black tracking-[-0.04em] leading-[1.02] text-4xl md:text-6xl">
            {contact.title.map((l, i) => (
              <Reveal key={i} as="span" delay={0.1 + i * 0.1} className="block">
                {l}
              </Reveal>
            ))}
          </h2>
          <Reveal as="p" delay={0.3} className="mt-4 max-w-md text-mute">
            {contact.body}
          </Reveal>
        </div>
        <Reveal delay={0.35} className="flex flex-col gap-3 md:items-end">
          <a
            href={`mailto:${brand.email}`}
            className="group inline-flex items-center justify-between gap-6 px-7 py-5 rounded-full bg-ink text-white hover:bg-planet transition-colors"
          >
            <span className="font-mono text-sm md:text-base">{brand.email}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <a
            href={`tel:${brand.phone.replace(/\./g, "")}`}
            className="inline-flex items-center justify-between gap-6 px-7 py-5 rounded-full bg-white/70 backdrop-blur border border-ink/10 hover:border-planet transition-colors"
          >
            <span className="font-display text-2xl tracking-wide">{brand.phone}</span>
            <span>☎</span>
          </a>
        </Reveal>
      </div>
      <footer className={`${pad} mt-auto pt-20 flex flex-col md:flex-row md:items-end justify-between gap-2 font-mono text-[11px] text-ink/70`}>
        <p>
          <span className="font-serif font-bold text-planet tracking-[0.04em] mr-2">{brand.nameEn}</span>
          {brand.nameKo} · {brand.address}
        </p>
        <p>© {new Date().getFullYear()} {brand.nameEn}</p>
      </footer>
    </section>
  );
}
