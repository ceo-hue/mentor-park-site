/**
 * DOM(스크롤·버튼)과 WebGL 장면이 함께 읽고 쓰는 가변 상태.
 * 매 프레임 바뀌는 값이라 React state 대신 일반 객체로 둔다.
 */
type Listener = () => void;

export const scene = {
  /** 섹션 인덱스 + 전환 진행률. 예: 2.4 = Orbit에서 Proof로 40% 이동 */
  t: 0,
  /** 0~1, 섹션 전체 스크롤 진행률 */
  progress: 0,
  /** 장면이 첫 프레임을 그렸는지 */
  ready: false,
  /** START를 눌렀는지 */
  started: false,
  /** 길게 누르기 진행률 0~1 */
  hold: 0,
  /** 분해가 시작된 시각(초, performance.now 기준). 0이면 없음 */
  shatterAt: 0,
  reducedMotion: false,
  /** 행성 강조색 (커스터마이저) */
  accent: "#4289D8",
  /** 사운드 사용 여부 */
  sound: true,
};

export const ACCENTS = [
  { name: "Planet Blue", hex: "#4289D8" },
  { name: "Aurora", hex: "#8B5CF6" },
  { name: "Signal Mint", hex: "#14B8A6" },
  { name: "Sunrise", hex: "#F97357" },
] as const;

export function setAccent(hex: string) {
  scene.accent = hex;
  document.documentElement.style.setProperty("--color-planet", hex);
  emit();
}

const listeners = new Set<Listener>();

export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function emit() {
  listeners.forEach((fn) => fn());
}

export const now = () => performance.now() / 1000;

/** 분해 곡선: 0.6초에 흩어지고 0.8초 머문 뒤 1.4초에 걸쳐 다시 모인다 */
export function explodeAmount(time: number) {
  if (!scene.shatterAt) return 0;
  const dt = time - scene.shatterAt;
  if (dt < 0) return 0;
  if (dt < 0.6) {
    const x = dt / 0.6;
    return 1 - Math.pow(1 - x, 3);
  }
  if (dt < 1.4) return 1;
  if (dt < 2.8) {
    const x = (dt - 1.4) / 1.4;
    const e = x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    return 1 - e;
  }
  return 0;
}
