"use client";

import { useEffect, useRef, useState } from "react";
import { insights, process, proof, specialties } from "@/content/site";

/* ------------------------------------------------------------------ */
/* 공용 훅                                                             */
/* ------------------------------------------------------------------ */

/** 요소가 화면에 들어오면 true (한 번만) */
function useInView<T extends HTMLElement>(margin = "0px 0px -15% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: margin }
    );
    io.observe(el);
    // 빠른 스크롤로 지나친 경우
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
        setInView(true);
        io.disconnect();
        window.removeEventListener("scroll", check);
      }
    };
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", check);
    };
  }, [margin]);
  return [ref, inView] as const;
}

/** 요소가 화면을 지나가는 정도 0~1 (스크롤에 연동) */
function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setP(1);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 요소 윗변이 화면 75% 지점에 오면 시작, 아랫변이 45% 지점에 오면 완료
      const start = vh * 0.75;
      const end = vh * 0.45;
      const total = r.height + (start - end);
      const v = Math.min(1, Math.max(0, (start - r.top) / total));
      setP(v);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return [ref, p] as const;
}

/** 0에서 목표값까지 세어 올라가는 숫자 */
function CountUp({ to, run, duration = 1200 }: { to: number; run: boolean; duration?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const x = Math.min(1, (t - t0) / duration);
      setV(Math.round(to * (1 - Math.pow(1 - x, 3))));
      if (x < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, run, duration]);
  return <>{run ? v : 0}</>;
}

/* ------------------------------------------------------------------ */
/* 1. 활동 타임라인 (기관 등록·공개 활동을 연도 축 위에)                  */
/* ------------------------------------------------------------------ */

type Item = { name: string; from: number; to: number | null; url?: string; group: string };

/** "2019~2023", "2023년 등록 이력", "2019년" 같은 표기에서 연도 범위를 읽는다 */
function parsePeriod(text: string | null | undefined): { from: number; to: number | null } | null {
  if (!text) return null;
  const m = text.match(/(\d{4})\s*(?:~\s*(\d{4}|현재))?/);
  if (!m) return null;
  const from = Number(m[1]);
  if (!m[2]) return { from, to: null };
  return { from, to: m[2] === "현재" ? new Date().getFullYear() : Number(m[2]) };
}

function timelineItems(): Item[] {
  const items: Item[] = [];
  for (const e of proof.mentoring) {
    const p = parsePeriod(e.period);
    if (p) items.push({ name: e.name, ...p, group: "멘토·전문가 활동" });
  }
  for (const a of proof.activities) {
    const p = parsePeriod(a.year);
    if (p) items.push({ name: a.title, ...p, url: a.url, group: "기관 공개 활동" });
  }
  return items;
}

export function ActivityTimeline() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const items = timelineItems();
  const thisYear = new Date().getFullYear();
  const first = Math.min(...items.map((i) => i.from));
  const last = Math.max(thisYear, ...items.map((i) => i.to ?? i.from));
  const years = Array.from({ length: last - first + 1 }, (_, k) => first + k);
  // 각 연도는 한 칸. 기간 막대는 시작 연도 칸 왼쪽에서 끝 연도 칸 오른쪽까지
  const pos = (y: number) => ((y - first) / years.length) * 100;
  const span = 100 / years.length;

  const groups = Array.from(new Set(items.map((i) => i.group)));
  const registrations = proof.mentoring.filter((e) => e.name.includes("풀 등록")).length;
  const publicRecords = proof.activities.filter((a) => a.url).length + insights.videos.filter((v) => v.url).length;

  const stats = [
    { value: thisYear - first + 1, unit: "년째", label: `${first}년 첫 기록부터 올해까지` },
    { value: registrations, unit: "건", label: "기관 멘토 풀 등록" },
    { value: publicRecords, unit: "건", label: "링크로 직접 확인할 수 있는 활동·강의" },
  ];

  return (
    <div ref={ref} className="rounded-3xl border border-ink/10 bg-white/95 p-5 sm:p-7">
      {/* 요약 수치 */}
      <dl className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-sky-1/70 px-4 py-4">
            <dt className="text-sm leading-snug text-mute">{s.label}</dt>
            <dd className="mt-1 flex items-baseline gap-1">
              <span className="font-display text-5xl leading-none text-ink tabular-nums">
                <CountUp to={s.value} run={inView} />
              </span>
              <span className="text-base font-bold">{s.unit}</span>
            </dd>
          </div>
        ))}
      </dl>

      {/* 연도 축 타임라인 */}
      <figure className="mt-7" aria-labelledby="timeline-caption">
        <figcaption id="timeline-caption" className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-lg font-bold">연도별 활동</span>
          <span className="flex items-center gap-4 text-xs text-mute">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-5 rounded-full bg-planet" aria-hidden="true" />
              기간 활동
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-planet bg-white" aria-hidden="true" />
              등록·행사 연도
            </span>
          </span>
        </figcaption>

        <div className="mt-4">
          <div>
            {/* 축 */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,14rem)_1fr]">
              <span className="hidden sm:block" />
              <div className="relative flex">
                {years.map((y) => (
                  <span
                    key={y}
                    className={`flex-1 border-l border-ink/10 pl-0.5 text-[10px] sm:pl-1 sm:text-[11px] tabular-nums ${y === thisYear ? "font-bold text-ink" : "text-mute"}`}
                  >
                    {y}
                  </span>
                ))}
              </div>
            </div>

            {groups.map((g) => (
              <div key={g} className="mt-3">
                <p className="mb-1 text-xs font-bold text-mute">{g}</p>
                <ul>
                  {items
                    .filter((i) => i.group === g)
                    .map((it, k) => {
                      const isRange = it.to !== null && it.to !== it.from;
                      const left = pos(it.from);
                      const width = isRange ? pos(it.to! + 1) - left : span;
                      const label = isRange ? `${it.from}~${it.to}` : `${it.from}`;
                      const delay = `${0.1 + k * 0.08}s`;
                      return (
                        <li
                          key={it.name}
                          className="group grid grid-cols-1 items-center gap-x-3 gap-y-0.5 rounded-lg py-1.5 hover:bg-sky-1/60 sm:grid-cols-[minmax(0,14rem)_1fr]"
                        >
                          <span className="text-sm leading-snug sm:truncate" title={it.name}>
                            {it.url ? (
                              <a href={it.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
                                {it.name}
                              </a>
                            ) : (
                              it.name
                            )}
                            <span className="ml-1.5 text-xs text-mute tabular-nums sm:hidden">{label}</span>
                          </span>
                          <div className="relative h-6">
                            {/* 연도 격자 */}
                            <div className="absolute inset-0 flex" aria-hidden="true">
                              {years.map((y) => (
                                <span key={y} className="flex-1 border-l border-ink/[0.06]" />
                              ))}
                            </div>
                            {isRange ? (
                              <span
                                className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full bg-planet origin-left transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                style={{
                                  left: `calc(${left}% + 2px)`,
                                  width: `calc(${width}% - 4px)`,
                                  transform: `translateY(-50%) scaleX(${inView ? 1 : 0})`,
                                  transitionDelay: delay,
                                }}
                              />
                            ) : (
                              <span
                                className="absolute top-1/2 h-3.5 w-3.5 rounded-full border-[3px] border-planet bg-white transition-transform duration-500"
                                style={{
                                  left: `calc(${left + span / 2}% - 7px)`,
                                  transform: `translateY(-50%) scale(${inView ? 1 : 0})`,
                                  transitionDelay: delay,
                                }}
                              />
                            )}
                            <span
                              aria-hidden="true"
                              className="absolute -top-0.5 whitespace-nowrap rounded bg-ink px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                              style={{ left: `${left}%` }}
                            >
                              {label}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-mute">
          아래 목록과 같은 자료입니다. 연도 표기가 없는 활동은 막대에서 제외했습니다.
        </p>
      </figure>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. 멘토링 진행 과정 — 스크롤에 따라 선이 이어지는 흐름도              */
/* ------------------------------------------------------------------ */

export function ProcessFlow() {
  const [ref, p] = useScrollProgress<HTMLOListElement>();
  const n = process.steps.length;
  return (
    <ol ref={ref} className="relative grid gap-8 lg:grid-cols-4 lg:gap-5">
      {/* 연결선: 데스크톱은 가로, 모바일은 세로 */}
      <span aria-hidden="true" className="absolute left-[1.375rem] top-6 bottom-6 w-[3px] rounded-full bg-ink/10 lg:hidden" />
      <span
        aria-hidden="true"
        className="absolute left-[1.375rem] top-6 w-[3px] rounded-full bg-planet lg:hidden"
        style={{ height: `calc((100% - 3rem) * ${p})` }}
      />
      <span aria-hidden="true" className="absolute left-6 right-6 top-[1.375rem] hidden h-[3px] rounded-full bg-ink/10 lg:block" />
      <span
        aria-hidden="true"
        className="absolute left-6 top-[1.375rem] hidden h-[3px] rounded-full bg-planet lg:block"
        style={{ width: `calc((100% - 3rem) * ${p})` }}
      />
      {process.steps.map((s, i) => {
        const reached = p >= i / (n - 1) - 0.02;
        return (
          <li key={s.step} className="relative flex gap-4 lg:block">
            <span
              className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border-[3px] font-display text-lg transition-all duration-500 ${
                reached ? "border-planet bg-planet text-white scale-100" : "border-ink/15 bg-white text-ink/40 scale-90"
              }`}
            >
              {s.step}
            </span>
            <div
              className={`rounded-2xl border bg-white/90 p-4 transition-all duration-700 lg:mt-5 lg:min-h-44 lg:p-5 ${
                reached ? "border-planet/40 opacity-100 translate-y-0 shadow-[0_18px_40px_-24px_rgba(40,80,160,0.5)]" : "border-ink/10 opacity-60 translate-y-2"
              }`}
            >
              <p className="text-xl font-black tracking-tight">{s.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">{s.desc}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* 3. 창업 여정 지도 — 세 분야가 어느 단계를 맡는지                      */
/* ------------------------------------------------------------------ */

export function JourneyMap() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const stops = [
    { id: null as string | null, title: "아이디어", outcome: "풀고 싶은 문제" },
    ...specialties.map((s) => ({ id: s.id as string | null, title: s.title, outcome: s.outcome })),
  ];
  return (
    <div ref={ref} className="relative mt-8 rounded-3xl border border-ink/10 bg-white/80 p-5 backdrop-blur sm:p-7">
      <p className="text-sm font-bold text-mute">아이디어에서 첫 MVP까지</p>
      <div className="relative mt-5">
        {/* 궤도 선과 움직이는 위성 */}
        <div aria-hidden="true" className="absolute left-5 right-5 top-5 hidden h-[3px] sm:block">
          <span className="absolute inset-0 rounded-full bg-ink/10" />
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-planet transition-[width] duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: inView ? "100%" : "0%" }}
          />
          {inView && <span className="journey-dot absolute -top-[5px] h-[13px] w-[13px] rounded-full bg-white ring-[3px] ring-planet" />}
        </div>
        <ol className="relative grid gap-4 sm:grid-cols-4">
          {stops.map((s, i) => (
            <li
              key={s.title}
              className="flex items-start gap-3 transition-all duration-700 sm:flex-col sm:items-start"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(10px)", transitionDelay: `${0.2 + i * 0.25}s` }}
            >
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-base ${
                  i === 0 ? "border-2 border-ink/20 bg-white text-ink/60" : "bg-ink text-white"
                }`}
              >
                {i === 0 ? "★" : String(i).padStart(2, "0")}
              </span>
              <div>
                {s.id ? (
                  <a href={`#${s.id}`} className="text-base font-black underline-offset-4 hover:underline">
                    {s.title}
                  </a>
                ) : (
                  <p className="text-base font-black">{s.title}</p>
                )}
                <p className="mt-0.5 text-sm leading-snug text-mute">{s.outcome}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
