"use client";

import { useState } from "react";
import {
  brand,
  contact,
  display,
  gallery,
  hold,
  insights,
  manifesto,
  paradox,
  person,
  proof,
  specialties,
} from "@/content/site";
import { Eyebrow, Reveal } from "../ui/Reveal";
import { HoldButton } from "../ui/HoldButton";
import { HoloCard } from "../ui/HoloCard";
import { BrandLogo, BrandWordmark, LogoMark } from "../ui/LogoMark";
import { Modal } from "../ui/Modal";
import { SafeImg } from "../ui/SafeImg";
import { ActivityTimeline, JourneyMap, ProcessFlow } from "../ui/Infographics";

const pad = "px-6 md:px-16 lg:px-28";
const giant = "font-display leading-[0.82] tracking-tight text-ink select-none";

function Marquee({ text, className = "", speed }: { text: string; className?: string; speed?: string }) {
  const unit = (
    <span className="flex items-center gap-[4vw] pr-[4vw]">
      {text}
      <LogoMark className="h-auto w-[9vw] md:w-[7vw] shrink-0" />
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

/* 0. 히어로 */
export function Manifesto() {
  return (
    <section id="manifesto" data-scene className={`relative min-h-[150svh] ${pad}`}>
      <div className="sticky top-0 h-svh flex flex-col items-center justify-end pb-[12svh] md:pb-[7svh] text-center">
        <BrandWordmark className="absolute top-[max(5.25rem,14svh)] h-auto w-[min(76vw,49svh)] md:w-[min(42vw,56svh)]" />
        <Reveal>
          <p className="mb-3 text-sm font-semibold text-ink/75">
            {manifesto.eyebrow}
          </p>
        </Reveal>
        <h1 className="font-black tracking-tight leading-[1.08] text-[clamp(1.55rem,6.5vw,2.75rem)]">
          {manifesto.title.map((line, i) => (
            <Reveal key={i} as="span" delay={0.1 + i * 0.12} className="block">
              {line}
            </Reveal>
          ))}
        </h1>
        <Reveal as="p" delay={0.4} className="mt-3 max-w-md text-ink/75 text-base leading-relaxed">
          {manifesto.body}
        </Reveal>
        <Reveal delay={0.45} className="mt-5">
          <nav aria-label="집중 멘토링 분야" className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {specialties.map((specialty) => (
              <a key={specialty.id} href={`#${specialty.id}`} className="rounded-full border border-ink/15 bg-white/90 px-2.5 py-2 text-sm font-bold hover:bg-ink hover:text-white sm:px-4">
                {specialty.title}
              </a>
            ))}
          </nav>
        </Reveal>
      </div>
    </section>
  );
}

/* 첫 고객 가설 */
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

/* 고객 문제 가설과 첫 실험 */
export function Paradox() {
  const cards = [paradox.hypothesis, paradox.experiment];
  return (
    <section id="paradox" data-scene className={`relative ${pad} pt-[max(5.75rem,10svh)] pb-[10svh]`}>
      <div className="rounded-[2rem] border border-white/15 bg-ink p-5 text-white sm:p-8 lg:p-10">
        <p className="mb-2 text-sm font-semibold text-planet-soft">가상 사례 · 1인 미용실 예약 관리</p>
        <h2 className="text-3xl font-black tracking-tight md:text-4xl">빈 예약 시간을 다시 채울 수 있을까?</h2>
        <div className="mt-6 grid items-start gap-7 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <video
              aria-label="가상 사례 시연 영상. 고객 검증부터 IR 피치·덱, 예약 재배정 흐름까지"
              className="aspect-video w-full rounded-2xl bg-[#14253e]"
              controls
              playsInline
              preload="none"
              poster="/case/demo-poster.webp"
            >
              <source src="/case/startup-demo.mp4" type="video/mp4" />
              <a href="/case/startup-demo.mp4">가상 사례 영상 열기</a>
            </video>
            <details className="mt-4 text-sm leading-relaxed text-white/80">
              <summary className="w-fit cursor-pointer font-semibold text-white">영상 내용 읽기</summary>
              <ol className="mt-2 list-decimal space-y-2 pl-5">
                <li>고객 검증 기록표에 당일 취소 대처 방법, 다시 채운 예약 수와 처리 시간을 적습니다.</li>
                <li>IR 덱 한 장에 문제와 해결 흐름을 담습니다. 실험이 시작되면 모을 근거도 제시합니다.</li>
                <li>가상 MVP에서 대기 고객을 골라 빈 시간에 예약을 확정합니다. 완료된 시간에는 재확정 버튼이 비활성화됩니다.</li>
              </ol>
            </details>
          </div>
          <div className="space-y-5 lg:col-span-2">
            {cards.map((card) => (
              <article key={card.label} className="rounded-2xl border border-white/15 bg-white/8 p-4 sm:p-5">
                <h3 className="text-sm font-bold text-planet-soft">{card.label}</h3>
                <p className="mt-2 text-base font-bold leading-snug">{card.lead}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 집중 멘토링 분야 */
export function Orbit() {
  return (
    <section id="orbit" data-scene className={`relative ${pad} pt-[max(6rem,16svh)] pb-[5svh]`}>
      <h2 className="text-3xl font-black tracking-tight md:text-5xl">극초기 팀을 위한 집중 멘토링</h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-mute">
        처음 만날 고객을 찾고 있거나, 투자자 앞에서 아이디어를 설명해야 하거나, 보여 줄 첫 제품이 필요하다면 지금 막힌 지점부터 시작합니다.
      </p>
      <JourneyMap />
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {specialties.map((specialty) => (
          <article key={specialty.id} id={specialty.id} tabIndex={-1} className="flex scroll-mt-24 flex-col rounded-3xl border border-ink/10 bg-white/95 p-5 shadow-sm sm:p-6">
            <h3 className="text-2xl font-black tracking-tight sm:text-3xl">{specialty.title}</h3>
            <p className="mt-2 text-base font-bold lg:min-h-12 xl:min-h-6">{specialty.outcome}</p>
            <figure className="mt-4">
              <a href={specialty.preview.src} target="_blank" rel="noopener noreferrer" className="block cursor-zoom-in rounded-xl hover:ring-2 hover:ring-planet">
                <img
                  src={specialty.preview.src}
                  alt={`${specialty.preview.alt} 이미지 크게 보기 (새 창)`}
                  width={960}
                  height={540}
                  loading="lazy"
                  decoding="async"
                  className="aspect-video w-full rounded-xl border border-ink/10 bg-sky-0 object-cover"
                />
              </a>
              <figcaption className="mt-2 text-sm leading-relaxed text-mute">{specialty.deliverable}</figcaption>
            </figure>
            <p className="mt-4 text-base leading-relaxed text-mute">{specialty.description}</p>
            <ul className="my-4 list-disc space-y-1.5 pl-5 text-sm marker:text-planet">
              {specialty.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <div className="mt-auto">
              <a href={`#${specialty.id}-guide`} className="inline-flex min-h-10 items-center rounded-full border border-ink/15 px-3.5 text-sm font-semibold hover:bg-ink hover:text-white">
                {specialty.title} 가이드 보기
              </a>
            </div>
            <div className="mt-4 border-t border-ink/10 pt-4 text-sm leading-relaxed">
              <p className="text-mute">{specialty.reference.description}</p>
              <a href={specialty.reference.url} className="mt-1 inline-block font-semibold underline underline-offset-4">
                {specialty.reference.label}
              </a>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-semibold">
        <a href="#paradox" className="rounded-full bg-ink px-4 py-2.5 text-white hover:bg-mute">30초 사례 영상 보기</a>
        <a href="#proof" className="underline underline-offset-4">박용근 멘토 이력 보기</a>
      </div>
    </section>
  );
}

/* 4. 멘토링 프로세스 */
export function Process() {
  return (
    <section id="process" data-scene className="relative pt-[max(5.75rem,14svh)] pb-[12svh]">
      <div className={pad}>
        <h2 className="mb-8 text-3xl font-black tracking-tight md:mb-12 md:text-5xl">멘토링 진행 과정</h2>
        <ProcessFlow />
      </div>
    </section>
  );
}

/* 멘토 이력 */
export function Proof() {
  const groups = [
    proof.evaluationPool,
    { label: "멘토·전문가 활동", note: null, entries: proof.mentoring },
  ];
  return (
    <section id="proof" data-scene className={`relative ${pad} pt-[max(5.75rem,14svh)] pb-[12svh]`}>
      <h2 className="mb-7 text-3xl font-black tracking-tight md:text-5xl">{proof.title}</h2>
      <ActivityTimeline />
      <div className="mt-5 grid gap-5 lg:grid-cols-12">
        <div className="rounded-3xl border border-ink/10 bg-white/95 p-5 sm:p-7 lg:col-span-7">
          <h3 className="text-xl font-bold">기관 공개 활동</h3>
          <ul className="mt-2 divide-y divide-ink/10">
            {proof.activities.map((activity) => (
              <li key={activity.title} className="py-4 last:pb-0">
                <a href={activity.url} className="font-bold underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                  {activity.title}
                </a>
                <p className="mt-1 text-sm leading-relaxed text-mute">
                  {activity.year && `${activity.year} · `}{activity.role}
                </p>
              </li>
            ))}
          </ul>
          <a href="#lectures" className="mt-6 inline-block text-sm font-semibold underline underline-offset-4">
            사업계획서 강의 영상 보기
          </a>
        </div>
        <div className="rounded-3xl border border-ink/10 bg-white/95 p-5 sm:p-7 lg:col-span-5">
          {groups.map((group) => (
            <div key={group.label} className="border-b border-ink/10 pb-5 last:border-0 last:pb-0 [&+div]:mt-5">
              <h3 className="text-xl font-bold">{group.label}</h3>
              {group.note && <p className="mt-2 rounded-xl bg-sky-1 px-3.5 py-3 text-sm leading-relaxed text-ink">{group.note}</p>}
              <ul className="mt-2">
                {group.entries.map((entry) => (
                  <li key={entry.name} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2 text-sm">
                    <span>{entry.name}</span>
                    <span className="shrink-0 text-mute">{entry.period}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 6. 실무 가이드와 강의 영상 */
export function Insight() {
  const [playing, setPlaying] = useState<(typeof insights.videos)[number] | null>(null);
  return (
    <section id="insight" data-scene className="relative pt-[max(5.75rem,14svh)] pb-[12svh]">
      <div className={pad}>
        <Reveal as="h2" className="text-3xl font-black tracking-tight md:text-5xl">{insights.title}</Reveal>
        <Reveal as="p" className="mt-4 max-w-2xl text-base leading-relaxed text-mute">{insights.intro}</Reveal>
        <div className="mt-8 grid items-start gap-4 lg:grid-cols-3">
          {specialties.map(({ id, title, guide }) => (
            <article key={id} id={`${id}-guide`} tabIndex={-1} className="scroll-mt-24 rounded-3xl border border-ink/10 bg-white/90 p-5 backdrop-blur sm:p-6">
              <p className="text-sm font-bold text-mute">{title}</p>
              <h3 className="mt-2 text-xl font-black leading-snug">{guide.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-mute">{guide.summary}</p>
              <details className="mt-4 border-t border-ink/10 pt-3">
                <summary className="w-fit cursor-pointer rounded-sm font-semibold hover:text-mute focus-visible:outline-2 focus-visible:outline-offset-4">
                  {guide.sample.title} 보기
                </summary>
                <ol className="mt-4 list-decimal space-y-3 pl-5 text-base leading-relaxed">
                  {guide.points.map((point) => <li key={point}>{point}</li>)}
                </ol>
                <div className="mt-5 rounded-2xl bg-sky-1/80 p-4">
                  <p className="text-sm font-bold">가상 사례 · 1인 미용실 예약 관리</p>
                  <dl className="mt-3 space-y-3 divide-y divide-ink/10 text-sm leading-relaxed">
                    {guide.sample.rows.map((row) => (
                      <div key={row.label} className="pb-3 last:pb-0">
                        <dt className="font-bold">{row.label}</dt>
                        <dd className="mt-0.5 text-mute">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <a href={guide.source.url} className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">
                  {guide.source.label}
                </a>
              </details>
            </article>
          ))}
        </div>
        <h3 id="lectures" tabIndex={-1} className="mb-5 mt-12 scroll-mt-24 text-2xl font-black md:mt-16 md:text-3xl">{insights.videosTitle}</h3>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {insights.videos.map((v, i) => {
            const thumb = v.thumbnail ?? (v.type === "youtube" ? `https://img.youtube.com/vi/${v.id}/hqdefault.jpg` : null);
            const inner = (
              <HoloCard className="h-full">
                <div className="p-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-sky-2">
                    {thumb ? (
                      <SafeImg src={thumb} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div aria-hidden="true" className="grid h-full w-full place-items-center bg-sky-1">
                        <BrandWordmark className="h-auto w-1/2 max-w-40" />
                      </div>
                    )}
                    {/* 썸네일은 가리지 않고 모서리에 작은 아이콘만 */}
                    {v.type === "youtube" && (
                      <span
                        className="absolute right-2 bottom-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur text-ink grid place-items-center text-xs shadow-md group-hover:bg-ink group-hover:text-white group-hover:scale-110 transition"
                        aria-hidden="true"
                      >
                        ▶
                      </span>
                    )}
                  </div>
                  <div className="px-3 pt-4 pb-3">
                    <p className="font-bold text-base md:text-lg leading-snug">{v.title}</p>
                    <p className="text-xs md:text-sm text-mute mt-1">{v.provider}</p>
                    {v.detail && <p className="mt-2 text-sm leading-relaxed text-mute">{v.detail}</p>}
                    <p className="mt-4 text-sm font-medium text-ink/75 group-hover:text-ink transition-colors">
                      {v.type === "youtube" ? "영상 재생" : "강의 페이지 열기"}
                    </p>
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
        <details className="mt-5 rounded-2xl border border-ink/10 bg-white/85 p-5">
          <summary className="w-fit cursor-pointer rounded-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4">
            {insights.businessPlan.title}
          </summary>
          <p className="mt-3 text-base text-mute">{insights.businessPlan.summary}</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-base leading-relaxed">
            {insights.businessPlan.points.map((point) => <li key={point}>{point}</li>)}
          </ol>
          <a href={insights.businessPlan.source.url} className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">
            {insights.businessPlan.source.label}
          </a>
        </details>
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

/* 7. 기관 공개 현장 기록 */
export function Gallery() {
  return (
    <section id="gallery" data-scene className={`relative ${pad} pt-[max(5.75rem,14svh)] pb-[12svh]`}>
      <h2 className="text-3xl font-black tracking-tight md:text-5xl">{gallery.title}</h2>
      <p className="mt-3 text-base text-mute">{gallery.body}</p>
      <ul className="mt-7 grid gap-4 lg:grid-cols-3">
        {gallery.records.map((record) => (
          <li key={record.title} className="rounded-2xl border border-ink/10 bg-white/95 p-5">
            <p className="text-sm font-semibold text-mute">{record.year}</p>
            <h3 className="mt-2 text-lg font-bold">{record.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mute">{record.role}</p>
            <a href={record.url} className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">{record.linkLabel}</a>
          </li>
        ))}
      </ul>
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
          <Reveal as="p" delay={0.35} className="mt-4 text-sm leading-relaxed text-mute">
            {person.research}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* 9. 문의 */
export function Contact() {
  const mail = `mailto:${brand.email}?subject=${encodeURIComponent(contact.mailSubject)}&body=${encodeURIComponent(contact.mailBody)}`;
  return (
    <section id="contact" data-scene className="relative min-h-svh pt-[14svh] pb-8 flex flex-col">
      <Marquee text={display.contact} className={`${giant} text-[24vw] md:text-[15vw]`} />
      <div className={`${pad} mt-8 md:mt-12 grid md:grid-cols-2 gap-8 items-end`}>
        <div>
          <Reveal as="h2" className="font-black tracking-[-0.04em] leading-[1.08] text-4xl md:text-6xl">
            {contact.title}
          </Reveal>
          <Reveal as="p" delay={0.3} className="mt-4 max-w-md text-mute leading-relaxed">
            {contact.body}
          </Reveal>
        </div>
        <Reveal delay={0.35} className="flex flex-col gap-3 md:items-end">
          <a
            href={mail}
            className="inline-flex justify-center px-8 py-5 rounded-full bg-ink text-white text-lg md:text-xl font-bold hover:bg-mute transition-colors"
          >
            {contact.cta}
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
      <footer className={`${pad} mt-auto pt-20 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-3 text-sm text-ink/75`}>
        <div>
          <BrandLogo className="w-36" />
          <p className="mt-2">대표 {person.name} · {brand.address}</p>
        </div>
        <p>© {new Date().getFullYear()} {brand.nameEn}</p>
      </footer>
    </section>
  );
}
