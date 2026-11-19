"use client";

import { caseStudy } from "../content";
import { gsap, useScene } from "../engine";

// 화면 예시용 시간표 (가상 사례)
const SLOTS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];
const CANCEL = 3;
const WAITLIST = ["대기 고객 A", "대기 고객 B", "대기 고객 C"];
const PICK = 1;

/** 4. 가상 사례 — 취소된 예약 한 칸이 대기 고객으로 다시 채워지는 과정 */
export function CaseScene() {
  const ref = useScene((root, { isDesktop }) => {
    const q = gsap.utils.selector(root);
    const slot = q<HTMLElement>(`[data-slot='${CANCEL}']`)[0];
    const pick = q<HTMLElement>(`[data-chip='${PICK}']`)[0];
    const dx = () => slot.getBoundingClientRect().left - pick.getBoundingClientRect().left + 12;
    const dy = () => slot.getBoundingClientRect().top - pick.getBoundingClientRect().top + 6;

    const tl = gsap.timeline({
      // 모바일은 장면이 화면보다 길어 고정하지 않고 스크롤 구간에 맞춰 재생
      scrollTrigger: isDesktop
        ? { trigger: root, start: "top top", end: "+=240%", pin: true, scrub: 0.8, invalidateOnRefresh: true }
        : { trigger: root, start: "top 55%", end: "bottom 85%", scrub: 0.8, invalidateOnRefresh: true },
      defaults: { ease: "none" },
    });
    // 시작 상태
    tl.set(q("[data-state='booked']"), { display: "inline" })
      .set(q("[data-state='cancel'], [data-state='done']"), { display: "none" })
      .set(slot, { borderColor: "rgba(10,15,28,0.1)", backgroundColor: "#ffffff" })
      .set(q("[data-chip]"), { x: 0, y: 0, opacity: 0 })
      .set(q("[data-step]"), { opacity: 0.3 })
      .set(q("[data-check]"), { scale: 0 })
      .set(q("[data-output]"), { opacity: 0, y: 16 })
      .from(q("[data-board]"), { y: 40, opacity: 0, duration: 0.3, ease: "power3.out" }, 0)
      .from(q("[data-row]"), { x: -20, opacity: 0, stagger: 0.04, duration: 0.2 }, 0.1);

    // 1) 취소 발생
    tl.to(q("[data-step='0']"), { opacity: 1, duration: 0.1 }, 0.5)
      .set(q(`[data-slot='${CANCEL}'] [data-state='booked']`), { display: "none" }, 0.6)
      .set(q(`[data-slot='${CANCEL}'] [data-state='cancel']`), { display: "inline" }, 0.6)
      .to(slot, { borderColor: "#e2495b", backgroundColor: "rgba(226,73,91,0.1)", duration: 0.1 }, 0.6)
      .fromTo(slot, { x: 0 }, { x: 6, repeat: 5, yoyo: true, duration: 0.03 }, 0.62)
      .to(q("[data-check='0']"), { scale: 1, duration: 0.1, ease: "back.out(3)" }, 0.75)
      // 2) 대기 고객 확인
      .to(q("[data-step='1']"), { opacity: 1, duration: 0.1 }, 1.0)
      .to(q("[data-chip]"), { opacity: 1, stagger: 0.08, duration: 0.15 }, 1.05)
      .fromTo(q("[data-chip]"), { x: 40 }, { x: 0, stagger: 0.08, duration: 0.25, ease: "power3.out" }, 1.05)
      .to(q("[data-check='1']"), { scale: 1, duration: 0.1, ease: "back.out(3)" }, 1.3)
      // 3) 한 명에게 제안
      .to(q("[data-step='2']"), { opacity: 1, duration: 0.1 }, 1.5)
      .to(pick, { backgroundColor: "var(--color-planet)", color: "#ffffff", duration: 0.1 }, 1.55)
      .to(q(`[data-chip]:not([data-chip='${PICK}'])`), { opacity: 0.35, duration: 0.1 }, 1.55)
      .to(pick, { x: dx, y: dy, scale: 0.9, duration: 0.45, ease: "power3.inOut" }, 1.7)
      .to(q("[data-check='2']"), { scale: 1, duration: 0.1, ease: "back.out(3)" }, 1.9)
      // 4) 재예약 확정
      .to(q("[data-step='3']"), { opacity: 1, duration: 0.1 }, 2.15)
      .to(pick, { opacity: 0, duration: 0.1 }, 2.15)
      .set(q(`[data-slot='${CANCEL}'] [data-state='cancel']`), { display: "none" }, 2.2)
      .set(q(`[data-slot='${CANCEL}'] [data-state='done']`), { display: "inline" }, 2.2)
      .to(slot, { borderColor: "var(--color-planet)", backgroundColor: "rgba(66,137,216,0.12)", duration: 0.1 }, 2.2)
      .fromTo(slot, { scale: 1 }, { scale: 1.04, yoyo: true, repeat: 1, duration: 0.06 }, 2.22)
      .to(q("[data-check='3']"), { scale: 1, duration: 0.1, ease: "back.out(3)" }, 2.3)
      // 결과물
      .to(q("[data-output]"), { opacity: 1, y: 0, stagger: 0.08, duration: 0.2, ease: "power3.out" }, 2.5)
      .to({}, { duration: 0.3 });
  });

  return (
    <section id="m-case" ref={ref} className="relative overflow-hidden px-6 py-20 md:px-14 lg:h-svh lg:px-20 lg:py-0">
      <div className="grid h-full content-center gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14">
        <div>
          <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-planet md:text-xs">{caseStudy.kicker}</p>
          <p className="mt-3 inline-block rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">{caseStudy.label}</p>
          <h2 className="mt-3 text-[clamp(1.8rem,4.6vw,3.2rem)] font-black leading-tight tracking-[-0.03em]">{caseStudy.title}</h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-mute">
            <span className="font-bold text-ink">가설 · </span>
            {caseStudy.hypothesis}
          </p>
          <ol className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {caseStudy.steps.map((s, i) => (
              <li key={s} data-step={i} className="rounded-xl border border-ink/10 bg-white/85 px-3 py-2.5 text-sm font-bold">
                <span className="block font-mono text-[10px] text-planet">0{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <div className="mt-6">
            <p className="text-sm font-bold">일주일 동안 기록하는 항목</p>
            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {caseStudy.measures.map((m, i) => (
                <li key={m} className="flex items-center gap-2 text-sm text-mute">
                  <span data-check={i} className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-planet text-[11px] text-white" aria-hidden="true">
                    ✓
                  </span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-board className="rounded-[2rem] border border-ink/10 bg-white/80 p-4 shadow-[0_40px_80px_-40px_rgba(30,60,130,0.45)] backdrop-blur md:p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black">오늘의 예약</p>
            <p className="font-mono text-[10px] text-mute">가상 데이터</p>
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-[1.3fr_1fr]">
            <ul className="space-y-1.5">
              {SLOTS.map((t, i) => (
                <li
                  key={t}
                  data-row
                  data-slot={i}
                  className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2 text-sm ${
                    i === CANCEL ? "border-planet bg-planet/10" : "border-ink/10 bg-white"
                  }`}
                >
                  <span className="font-mono text-xs text-mute">{t}</span>
                  {i === CANCEL ? (
                    <>
                      <span data-state="booked" className="hidden font-semibold">예약됨</span>
                      <span data-state="cancel" className="hidden font-bold text-[#c2283b]">당일 취소</span>
                      <span data-state="done" className="font-bold text-planet">재예약 완료 ✓</span>
                    </>
                  ) : (
                    <span className="font-semibold text-ink/70">예약됨</span>
                  )}
                </li>
              ))}
            </ul>
            <div>
              <p className="text-xs font-bold text-mute">대기 고객</p>
              <ul className="mt-2 space-y-1.5">
                {WAITLIST.map((w, i) => (
                  <li key={w} data-chip={i} className={`rounded-full border border-ink/10 px-3 py-1.5 text-xs font-semibold ${i === PICK ? "opacity-0" : "bg-white"}`}>
                    {w}
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-ink/10 pt-3">
                <p className="text-xs font-bold text-mute">이 실험으로 만드는 결과물</p>
                <ul className="mt-2 space-y-1.5">
                  {caseStudy.outputs.map((o) => (
                    <li key={o} data-output className="rounded-lg bg-ink px-2.5 py-1.5 text-xs font-semibold text-white">
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
