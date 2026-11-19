"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/**
 * 장면 하나를 만든다. build는 동작 줄이기를 쓰지 않는 사용자에게만 실행되고,
 * 장면이 사라지면 모든 트윈과 ScrollTrigger가 정리된다.
 * 동작 줄이기 사용자는 CSS 기본 상태(완성된 화면)를 그대로 본다.
 */
export function useScene(build: (root: HTMLElement, mm: { isDesktop: boolean }) => void | (() => void)) {
  const ref = useRef<HTMLElement>(null);
  const buildRef = useRef(build);
  buildRef.current = build;

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add(
      { motion: MOTION_OK, isDesktop: "(min-width: 1024px)" },
      (ctx) => {
        const c = ctx.conditions as { motion: boolean; isDesktop: boolean };
        if (!c.motion) return;
        // 모션이 켜진 장면에서만 겹침 배치 등 애니메이션용 레이아웃을 쓴다
        root.classList.add("is-animated");
        const cleanup = buildRef.current(root, { isDesktop: c.isDesktop });
        return () => {
          root.classList.remove("is-animated");
          if (typeof cleanup === "function") cleanup();
        };
      },
      root
    );
    return () => mm.revert();
  }, []);

  return ref;
}

/** 부드러운 스크롤과 ScrollTrigger를 한 시계로 묶는다 */
export function useSmoothScroll() {
  useEffect(() => {
    document.documentElement.classList.remove("is-gated");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    lenis.on("scroll", ScrollTrigger.update);
    // 원본 데모와 같이 디버그용으로 노출
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='#']");
      if (!a) return;
      const target = document.getElementById(a.getAttribute("href")!.slice(1));
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target);
      }
    };
    document.addEventListener("click", onClick);
    // 글꼴이 늦게 로드되면 높이가 바뀌므로 다시 계산
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}

/** 문자 하나하나를 span으로 감싼다 (키네틱 타이포용) */
export function Chars({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {Array.from(text).map((ch, i) => (
        <span key={i} data-char aria-hidden="true" className="inline-block will-change-transform">
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
