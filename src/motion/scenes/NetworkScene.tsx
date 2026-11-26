"use client";

import { useEffect, useRef, useState } from "react";
import { network } from "../content";
import { gsap, ScrollTrigger, useScene } from "../engine";

type Kind = "mentoring" | "lecture";
type Node = (typeof network.mentoring)[number] & { kind: Kind };

const KIND_LABEL: Record<Kind, string> = { mentoring: "멘토링", lecture: "강의" };

/** 날짜 문자열을 정렬용 숫자로 */
const dateKey = (d: string) => {
  const m = d.match(/(\d{4})(?:\.(\d{2}))?/);
  return m ? Number(m[1]) * 100 + Number(m[2] ?? 0) : 0;
};

function ActivityCard({ n }: { n: Node }) {
  return (
    <div data-node className="motion-surface h-full p-3.5 [--surface-radius:0.9rem]">
      {/* 종류 표시와 기관명을 한 줄에 */}
      <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] font-black leading-snug">
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${n.kind === "mentoring" ? "bg-planet" : "bg-[#7454f0]"}`}>
          {KIND_LABEL[n.kind]}
        </span>
        {n.url ? (
          <a href={n.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
            {n.org}
          </a>
        ) : (
          <span>{n.org}</span>
        )}
      </p>
      <p className="mt-1 text-xs leading-snug text-mute">{n.program}</p>
      <p className="mt-1 text-xs leading-snug">
        <span className={`font-semibold ${n.kind === "mentoring" ? "text-planet-ink" : "text-[#5b3fd6]"}`}>{n.role}</span>
        <span className="ml-1.5 font-mono text-mute/80">{n.date}</span>
      </p>
    </div>
  );
}

function YearBlock({ year, items }: { year: number; items: Node[] }) {
  const m = items.filter((n) => n.kind === "mentoring").length;
  const l = items.length - m;
  return (
    <section data-year-block className="pt-6 first:pt-0">
      <div className="flex items-center gap-4">
        <p className="font-display text-4xl leading-none text-planet md:text-5xl">{year}</p>
        <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
        <p className="flex gap-2 text-[11px] font-bold">
          {m > 0 && <span className="rounded-full bg-planet/10 px-2.5 py-1 text-planet-ink">멘토링 {m}</span>}
          {l > 0 && <span className="rounded-full bg-[#7454f0]/10 px-2.5 py-1 text-[#5b3fd6]">강의 {l}</span>}
        </p>
      </div>
      {/* 화면 폭 전체에 가지런히 */}
      <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((n) => (
          <ActivityCard key={`${n.kind}-${n.date}-${n.org}-${n.program}`} n={n} />
        ))}
      </div>
    </section>
  );
}

/** 5. 기관 활동 — 대표로 운영한 회사, 그리고 최신 연도부터 기관 멘토링·강의 */
export function NetworkScene() {
  // 연도가 있는 기록만 (멘토링 + 강의), 최신 연도부터, 같은 해 안에서도 최근 것부터
  const nodes: Node[] = [
    ...network.mentoring.map((r) => ({ ...r, kind: "mentoring" as Kind })),
    ...network.lecture.map((r) => ({ ...r, kind: "lecture" as Kind })),
  ].filter((n) => n.year !== null);
  const years = Array.from(new Set(nodes.map((n) => n.year as number))).sort((a, b) => b - a);
  const groups = years.map((y) => ({
    year: y,
    items: nodes.filter((n) => n.year === y).sort((a, b) => dateKey(b.date) - dateKey(a.date)),
  }));
  const [latest, ...older] = groups;
  const olderCount = older.reduce((sum, g) => sum + g.items.length, 0);

  const [open, setOpen] = useState(false);
  const olderRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef<HTMLDivElement>(null);

  // 펼치면 이전 연도가 위에서부터 차례로 나타나고, 페이지 길이가 바뀌었으니 스크롤 위치를 다시 계산
  useEffect(() => {
    if (open && olderRef.current) {
      gsap.from(olderRef.current.querySelectorAll("[data-year-block]"), { y: 24, opacity: 0, stagger: 0.06, duration: 0.5, ease: "power3.out" });
    }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [open]);

  const ref = useScene((root) => {
    const q = gsap.utils.selector(root);
    q("[data-startup], [data-latest] [data-node]").forEach((el, i) => {
      gsap.from(el, { y: 24, opacity: 0, duration: 0.6, delay: (i % 4) * 0.05, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%" } });
    });
  });

  const toggle = () => {
    // 접을 때는 버튼이 화면에서 사라지지 않게 최신 연도 목록으로 되돌아온다
    if (open && latestRef.current) {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o: { offset: number; immediate: boolean }) => void } }).__lenis;
      if (lenis) lenis.scrollTo(latestRef.current, { offset: -96, immediate: true });
      else latestRef.current.scrollIntoView({ block: "start" });
    }
    setOpen((v) => !v);
  };

  return (
    <section id="m-network" ref={ref} className="relative px-6 py-24 md:px-14 lg:px-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="motion-heading max-w-2xl">
          <span className="title-gradient">{network.title}</span>
        </h2>
        <dl className="flex gap-6 text-right">
          <div>
            <dt className="font-mono text-[10px] tracking-[0.2em] text-mute">기관 멘토링</dt>
            <dd className="font-display text-4xl leading-none">{network.mentoring.length}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.2em] text-mute">기관 강의</dt>
            <dd className="font-display text-4xl leading-none">{network.lecture.length}</dd>
          </div>
        </dl>
      </div>

      {/* 창업 이력: 대표로 창업·운영한 회사. 지금의 온에어플래닛(IR 피칭 전문 멘토)을 강조 */}
      <div className="mt-6">
        <p className="motion-kicker">창업 이력</p>
        <ol className="mt-2 grid gap-2.5 md:grid-cols-[1.5fr_1fr_1fr]">
          {network.startups.map((s, i) => (
            <li key={s.org} data-startup className={`motion-surface relative overflow-hidden [--surface-radius:1rem] ${i === 0 ? "py-3 pl-6 pr-4" : "px-4 py-3"}`}>
              {i === 0 && <span className="absolute inset-y-0 left-0 w-2 bg-gradient-to-b from-[#3a74e0] via-[#7454f0] to-[#1595ad]" aria-hidden="true" />}
              <p className="font-mono text-[11px] tracking-wide text-mute">{s.period}</p>
              <p className={`mt-0.5 font-black leading-snug ${i === 0 ? "text-xl" : "text-[15px]"}`}>
                {i === 0 ? <span className="title-gradient">{s.org}</span> : s.org}
                <span className={`ml-2 font-bold ${i === 0 ? "text-base text-planet-ink" : "text-sm text-ink/70"}`}>{s.role}</span>
              </p>
              <p className="mt-0.5 text-xs text-mute">{s.field}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* 기관 멘토링·강의: 최신 연도만 보이고 나머지는 펼쳐보기 */}
      <div className="mt-10">
        <p className="motion-kicker">기관 멘토링·강의</p>
        <div ref={latestRef} data-latest className="mt-3 scroll-mt-24">
          {latest && <YearBlock year={latest.year} items={latest.items} />}
        </div>
        <div ref={olderRef} id="m-network-older" hidden={!open} className="mt-6">
          {open && older.map((g) => <YearBlock key={g.year} year={g.year} items={g.items} />)}
        </div>
        {older.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls="m-network-older"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-bold shadow-sm transition-colors hover:border-planet-ink hover:text-planet-ink"
            >
              {open ? "접기" : `이전 활동 펼쳐보기 · ${older[0].year}~${older[older.length - 1].year} ${olderCount}건`}
              <span aria-hidden="true">{open ? "−" : "+"}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
