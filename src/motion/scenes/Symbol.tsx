import { LOGO_PX } from "@/lib/logo";

/** 명함에서 측정한 심볼을 선으로 그린 SVG. 모션용으로 각 부품에 data 속성을 단다 */
export function OrbitSymbol({ className = "", spin = true }: { className?: string; spin?: boolean }) {
  const s = LOGO_PX.stroke;
  const ring = `M ${-LOGO_PX.ringA} 0 A ${LOGO_PX.ringA} ${LOGO_PX.ringB} 0 1 0 ${LOGO_PX.ringA} 0 A ${LOGO_PX.ringA} ${LOGO_PX.ringB} 0 1 0 ${-LOGO_PX.ringA} 0`;
  return (
    <svg viewBox="-84 -50 168 100" className={className} fill="none" role="img" aria-label="온에어플래닛 심볼">
      <defs>
        <radialGradient id="planet-fill" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="55%" stopColor="var(--color-planet)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--color-planet)" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      <circle data-planet-fill r={LOGO_PX.r} fill="url(#planet-fill)" />
      <circle data-draw r={LOGO_PX.r} stroke="var(--color-planet)" strokeWidth={s} pathLength={1} strokeDasharray={1} transform="rotate(-60)" />
      <g transform={`rotate(${LOGO_PX.tiltDeg})`}>
        <path data-draw d={ring} stroke="var(--color-planet)" strokeWidth={s} pathLength={1} strokeDasharray={1} />
        {spin && (
          <circle r={LOGO_PX.moon.r} fill="var(--color-planet)">
            <animateMotion dur="9s" repeatCount="indefinite" path={ring} />
          </circle>
        )}
      </g>
      <circle data-pop cx={LOGO_PX.moon.x} cy={LOGO_PX.moon.y} r={LOGO_PX.moon.r} fill="var(--color-planet)" />
      <circle
        data-pop
        cx={LOGO_PX.node.x}
        cy={LOGO_PX.node.y}
        r={LOGO_PX.node.r - s / 2}
        stroke="var(--color-planet)"
        strokeWidth={s}
        fill="#f6f8ff"
      />
    </svg>
  );
}
