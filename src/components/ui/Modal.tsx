"use client";

import { useEffect } from "react";

/** 영상·사진을 크게 보는 오버레이. Esc 또는 바깥 클릭으로 닫힌다 */
export function Modal({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      data-lenis-prevent
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/85 backdrop-blur-md p-4 md:p-10"
      onClick={onClose}
    >
      <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
        {children}
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="absolute -top-10 right-0 font-mono text-sm text-white tracking-widest hover:text-planet-soft"
        >
          [CLOSE ×]
        </button>
      </div>
    </div>
  );
}
