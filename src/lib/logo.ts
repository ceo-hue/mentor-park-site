/**
 * 온에어플래닛 심볼 측정값. 명함 이미지(1050×600)에서 최소제곱 맞춤으로 얻었다.
 *
 *  - 행성      중심 (140.9, 444.0) 반지름 39.66px
 *  - 고리      행성과 동심, 긴 반지름 72.86px, 짧은 반지름 17.66px, 화면 기울기 −15.0°
 *  - 선 굵기   약 3.3px
 *  - 위성(채움) 중심 약 (+48, −25), 반지름 약 5px
 *  - 위성(빈 원) 중심 약 (−6.4, +40.1), 바깥 반지름 약 6px
 *  - 색        약 #4289D8
 *
 * 3D 해석: 원형 고리를 정면 대비 acos(17.66/72.86) ≈ 76° 젖히고 화면에서 15° 돌리면
 * 명함과 같은 실루엣이 된다.
 */
export const LOGO_PX = {
  r: 39.66,
  ringA: 72.86,
  ringB: 17.66,
  tiltDeg: -15.03,
  stroke: 3.3,
  moon: { x: 48, y: -25, r: 5 },
  node: { x: -6.4, y: 40.1, r: 6 },
} as const;

export const LOGO = {
  color: "#4289D8",
  planetRadius: 1,
  ringRadius: LOGO_PX.ringA / LOGO_PX.r,
  ringTilt: Math.acos(LOGO_PX.ringB / LOGO_PX.ringA),
  ringRoll: (-LOGO_PX.tiltDeg * Math.PI) / 180,
  stroke: LOGO_PX.stroke / LOGO_PX.r / 2,
  moonRadius: LOGO_PX.moon.r / LOGO_PX.r,
  nodeRadius: LOGO_PX.node.r / LOGO_PX.r,
} as const;
