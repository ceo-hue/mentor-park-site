"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 화면에 들어오면 아래에서 떠오르는 블록.
 * 빠르게 스크롤해 요소가 한 프레임 만에 지나가도 놓치지 않도록,
 * IntersectionObserver와 함께 "이미 화면 위쪽을 지나갔는지"를 스크롤마다 확인한다.
 */
const pending = new Set<{ el: HTMLElement; show: () => void }>();
let listening = false;

function sweep() {
  const limit = window.innerHeight * 0.92;
  pending.forEach((p) => {
    if (p.el.getBoundingClientRect().top < limit) {
      p.show();
      pending.delete(p);
    }
  });
}

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", sweep, { passive: true });
  window.addEventListener("resize", sweep);
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "p" | "h2" | "h1" | "li" | "span";
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const entry = { el, show: () => setShown(true) };
    pending.add(entry);
    listen();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          entry.show();
          pending.delete(entry);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    sweep();
    return () => {
      io.disconnect();
      pending.delete(entry);
    };
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`reveal ${shown ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </Tag>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] md:text-xs tracking-[0.3em] uppercase text-planet mb-3 md:mb-4">
      {children}
    </p>
  );
}
