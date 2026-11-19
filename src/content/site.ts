/**
 * 사이트 콘텐츠. 지금은 모두 임시 문구이며, 확정 콘텐츠를 받으면 이 파일만 교체한다.
 * TODO(content) 표시가 붙은 항목이 교체 대상이다.
 */

export const brand = {
  nameEn: "ONAIR PLANET",
  nameKo: "온에어플래닛",
  url: "www.onairplanet.com",
  email: "ceo@onairplanet.com",
  phone: "010.2078.2285",
  address: "경기도 광주시 고산별빛1로 11, 303-1004",
};

export const gate = {
  enter: "START",
  hint: "소리 없이 진입합니다",
};

/** 섹션마다 배경에 크게 깔리는 영문 디스플레이 단어 */
export const display = {
  hold: ["BREAK", "REBUILD"],
  orbit: "ORBITS",
  proof: "SIGNALS ON AIR",
  person: "THE PILOT",
  contact: "SAY HELLO",
};

// TODO(content)
export const manifesto = {
  eyebrow: "On Air · Planet",
  title: ["비즈니스가 스스로 도는", "궤도를 만듭니다."],
  body: "임시 문구 — 온에어플래닛이 무엇을 하는 곳인지 한두 문장으로 들어갈 자리입니다.",
};

// TODO(content)
export const hold = {
  eyebrow: "Break & Rebuild",
  title: "흩어진 조각을 하나의 행성으로",
  body: "임시 문구 — 조각난 기능을 정체성으로 다시 묶는다는 메시지가 들어갈 자리입니다.",
  cta: "길게 눌러보세요",
  after: "다시, 하나의 궤도로.",
};

// TODO(content)
export const orbit = {
  eyebrow: "Orbit",
  title: "네 개의 궤도",
  items: [
    { key: "01", name: "서비스 영역 A", desc: "임시 설명 — 이 영역에서 무엇을 하는지." },
    { key: "02", name: "서비스 영역 B", desc: "임시 설명 — 이 영역에서 무엇을 하는지." },
    { key: "03", name: "서비스 영역 C", desc: "임시 설명 — 이 영역에서 무엇을 하는지." },
    { key: "04", name: "서비스 영역 D", desc: "임시 설명 — 이 영역에서 무엇을 하는지." },
  ],
};

// TODO(content)
export const proof = {
  eyebrow: "Signals",
  title: "궤도에 오른 기록",
  items: [
    { year: "2026", title: "사례 제목 1", tag: "카테고리", desc: "임시 설명" },
    { year: "2025", title: "사례 제목 2", tag: "카테고리", desc: "임시 설명" },
    { year: "2025", title: "사례 제목 3", tag: "카테고리", desc: "임시 설명" },
    { year: "2024", title: "사례 제목 4", tag: "카테고리", desc: "임시 설명" },
    { year: "2024", title: "사례 제목 5", tag: "카테고리", desc: "임시 설명" },
    { year: "2023", title: "사례 제목 6", tag: "카테고리", desc: "임시 설명" },
  ],
};

// TODO(content)
export const person = {
  eyebrow: "Pilot",
  name: "박용근",
  role: "대표 · IR피칭멘토",
  creds: ["문화창업플래너", "창업진흥원 평가위원 등록", "성남산업진흥원 창업멘토 등록"],
  body: "임시 문구 — 대표 소개가 들어갈 자리입니다.",
};

export const contact = {
  eyebrow: "Transmission",
  title: ["교신을", "시작하세요."],
  body: "임시 문구 — 문의 방법 안내가 들어갈 자리입니다.",
};

export const sections = [
  { id: "manifesto", label: "Manifesto", short: "ON" },
  { id: "hold", label: "Rebuild", short: "HOLD" },
  { id: "orbit", label: "Orbit", short: "ORBIT" },
  { id: "proof", label: "Signals", short: "SIGNAL" },
  { id: "person", label: "Pilot", short: "PILOT" },
  { id: "contact", label: "Contact", short: "CALL" },
] as const;
