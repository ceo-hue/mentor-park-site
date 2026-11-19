import { LOGO_PX } from "@/lib/logo";

/**
 * 측정값으로 다시 그린 심볼(2D). 명함 원본의 손맛 있는 곡선과는 1~3px 차이가 날 수 있다.
 * draw=true면 선이 그려지는 진입 애니메이션을 재생한다.
 */
export function LogoMark({
  className,
  draw = false,
  title = "ONAIR PLANET",
}: {
  className?: string;
  draw?: boolean;
  title?: string;
}) {
  const s = LOGO_PX.stroke;
  const line = draw ? "draw-line" : undefined;
  const style = (delay: number) =>
    draw ? ({ ["--len" as string]: 1, animationDelay: `${delay}s` } as React.CSSProperties) : undefined;
  return (
    <svg viewBox="-82 -48 164 96" className={className} role="img" aria-label={title} fill="none">
      <circle
        r={LOGO_PX.r}
        stroke="currentColor"
        strokeWidth={s}
        pathLength={1}
        className={line}
        style={style(0)}
        transform="rotate(-60)"
      />
      <ellipse
        rx={LOGO_PX.ringA}
        ry={LOGO_PX.ringB}
        transform={`rotate(${LOGO_PX.tiltDeg})`}
        stroke="currentColor"
        strokeWidth={s}
        pathLength={1}
        className={line}
        style={style(0.35)}
      />
      <circle cx={LOGO_PX.moon.x} cy={LOGO_PX.moon.y} r={LOGO_PX.moon.r} fill="currentColor" />
      <circle
        cx={LOGO_PX.node.x}
        cy={LOGO_PX.node.y}
        r={LOGO_PX.node.r - s / 2}
        stroke="currentColor"
        strokeWidth={s}
        fill="none"
      />
    </svg>
  );
}
