"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { scene, subscribe } from "@/lib/sceneStore";

/**
 * 부드러운 스크롤(Lenis)과 섹션 진행률 계산.
 * 각 섹션은 data-scene 속성을 가진다. 섹션 i를 읽는 동안 장면은 i에 머물고,
 * 섹션 끝 35% 구간에서 다음 장면(i+1)으로 넘어간다.
 */
export function ScrollDriver() {
  useEffect(() => {
    scene.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    if (!scene.started) lenis.stop();

    const unsub = subscribe(() => {
      if (scene.started) {
        document.documentElement.classList.remove("is-gated");
        lenis.start();
      }
    });

    const compute = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
      const vh = window.innerHeight;
      const probe = vh * 0.5;
      let t = 0;
      for (let i = 0; i < els.length; i++) {
        const r = els[i].getBoundingClientRect();
        if (r.top <= probe) {
          const frac = (probe - r.top) / Math.max(r.height, 1);
          const edge = Math.min(1, Math.max(0, (frac - 0.65) / 0.35));
          t = i + (i < els.length - 1 ? edge : 0);
        }
      }
      scene.t = t;
      const max = document.documentElement.scrollHeight - vh;
      scene.progress = max > 0 ? window.scrollY / max : 0;
    };

    lenis.on("scroll", compute);
    window.addEventListener("resize", compute);
    compute();

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // 앵커 링크를 Lenis로 이동
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a[href^='#']");
      if (!a) return;
      const target = document.getElementById(a.getAttribute("href")!.slice(1));
      if (target) {
        e.preventDefault();
        if (target.hasAttribute("tabindex")) target.focus({ preventScroll: true });
        const offset = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        lenis.scrollTo(target, { offset: -offset, immediate: scene.reducedMotion });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      unsub();
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", compute);
      lenis.destroy();
    };
  }, []);

  return null;
}
