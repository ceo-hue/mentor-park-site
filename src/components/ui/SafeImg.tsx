"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "./LogoMark";

/** 이미지가 없거나 깨지면 로고 자리표시로 대체 */
export function SafeImg({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // 하이드레이션 전에 이미 실패한 이미지는 onError가 오지 않으므로 마운트 시 한 번 확인
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (failed) {
    return (
      <span className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-sky-1 to-sky-2 text-planet ${className}`}>
        <LogoMark className="w-1/4 max-w-20 opacity-70" />
        <span className="font-mono text-[10px] tracking-[0.2em] text-ink/40">{alt}</span>
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={ref} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={className} />
  );
}
