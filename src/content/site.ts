/**
 * 사이트 콘텐츠. 이전 사이트(master의 src/data/siteData.ts와 각 섹션 문구)를 그대로 옮겼다.
 * 문구를 바꿀 때는 이 파일만 수정하면 된다.
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
};

/** 섹션마다 크게 깔리는 영문 디스플레이 단어 */
export const display = {
  hold: ["FEAR", "TRUST"],
  orbit: "FUNCTIONS",
  process: "PROCESS",
  proof: "VERIFIED AUTHORITY",
  insight: "WATCH INSIGHTS",
  gallery: "ON THE FIELD",
  person: "THE ARCHITECT",
  contact: "ASK BETTER",
};

/* 0. 히어로 */
export const manifesto = {
  eyebrow: "Architect of ARHA & Business Identity",
  title: ["비즈니스의 정체성을", "완성하다."],
  body: [
    "정체성이 없는 비즈니스는 파편화된 기능의 집합일 뿐입니다.",
    "ARHA 시스템을 통해 비즈니스의 영혼을 설계하고, 흔들리지 않는 Value Chain을 구축합니다.",
  ],
};

/* 1. 정체성의 역설 — 길게 누르면 파편이 다시 하나로 */
export const hold = {
  eyebrow: "The Fundamental Question",
  title: "당신의 비즈니스의 정체성은?",
  body: "정체성이 모호한 기업은 시장의 불확실성이라는 공포에 직면합니다.",
  cta: "길게 눌러 정체성을 세우세요",
  after: "선명한 정체성은 가장 강력한 생존 전략",
};

export const paradox = {
  fear: {
    label: "FEAR",
    lead: "정체성이 모호한 기업은 시장의 불확실성이라는 공포에 직면합니다.",
    body: "방향을 잃은 비즈니스는 외부의 자극에 쉽게 흔들리고, 결국 자신의 가치를 증명하지 못한 채 소멸의 길을 걷게 됩니다.",
  },
  trust: {
    label: "TRUST",
    lead: "선명한 아이덴티티는 어떤 위기에도 흔들리지 않는 가장 강력한 생존 전략입니다.",
    body: "명확한 정체성은 단순한 선언이 아닙니다. 그것은 시장이 당신을 신뢰하게 만드는 가장 강력한 실체이자, 대체 불가능한 자산입니다.",
  },
  conclusion: {
    before: "박용근은 비즈니스의 보이지 않는 ",
    mind: "마음",
    middle: "을 설계하여, 시장이 신뢰할 수 있는 ",
    chain: "실체적 가치사슬",
    after: "을 구축합니다.",
  },
};

/* 2. 서비스 — 기능마다 위성 하나 */
export const orbit = {
  eyebrow: "Service Functions",
  services: [
    {
      key: "01",
      label: "MAIN SERVICE",
      title: "Startup Architecture",
      desc: "아이덴티티 설계로 비즈니스의 영혼과 구조를 완성합니다.",
      features: [
        "PSST 사업계획서의 전략적 고도화",
        "본질을 타격하는 IR 피칭 아키텍처",
        "지속 가능한 비즈니스 모델(BM) 정체성 수립",
        "생존을 넘어 성장을 위한 가치사슬 설계",
      ],
    },
    {
      key: "02",
      label: "CORE RESEARCH",
      title: "Project ARHA",
      desc: "AI의 '마음'을 설계하는 지능형 아키텍처 연구",
      features: [
        "ARHA(Autonomous Resonance & Harmonic Architecture) 설계",
        "감정-인지 런타임 기반의 지능형 에이전트 구축",
        "비즈니스 아이덴티티가 투영된 프롬프트 체계 연구",
        "인간의 통찰과 AI의 효율을 결합하는 시스템 최적화",
      ],
    },
  ],
  objective: {
    label: "Current Objective",
    quote: "정체성이 내재된 AI는 도구를 넘어 비즈니스의 페르소나가 됩니다.",
  },
};

/** 고리 위 위성 수 = 전체 기능 수 */
export const satelliteCount = orbit.services.reduce((n, s) => n + s.features.length, 0);

export const process = {
  eyebrow: "Mentoring Process",
  steps: [
    { step: "01", title: "진단", desc: "창업 아이템의 시장성과 실현 가능성을 다각도로 분석합니다." },
    { step: "02", title: "전략", desc: "비즈니스 모델을 정교화하고 실행 가능한 로드맵을 수립합니다." },
    { step: "03", title: "실행", desc: "IR 피칭, 정부지원사업 신청 등 실질적인 액션 플랜을 함께합니다." },
    { step: "04", title: "성장", desc: "지속 가능한 성장 구조를 설계하고 네트워크를 연결합니다." },
  ],
};

/* 3. 검증된 이력 */
export const proof = {
  eyebrow: "Empirical Credibility",
  current: {
    label: "Current Role",
    role: "한성대학교 캠퍼스타운 사업단",
    title: "기술창업센터 총괄매니저",
    desc: "창업 생태계의 구조를 설계하고 예비 창업자의 성장을 가속화하는 시스템 매니지먼트.",
  },
  years: { number: "15+", label: "Years of Excellence" },
  stats: [
    { number: "15+", label: "Experience", desc: "창업·경영 멘토링" },
    { number: "200+", label: "Teams", desc: "예비~초기 창업자 지원" },
    { number: "50+", label: "Consulting", desc: "사업화 전략 수립" },
    { number: "30+", label: "Lectures", desc: "대학·기관 출강" },
  ],
  registrations: [
    { name: "창업진흥원 평가위원 풀 등록", period: "2023~현재" },
    { name: "경기콘텐츠진흥원 평가·심의위원 풀 등록", period: "2024~현재" },
    { name: "경기콘텐츠진흥원 문화창업플래너 풀 등록", period: "2019~현재" },
    { name: "성남산업진흥원 창업전문위원 풀 등록", period: "2023~현재" },
    { name: "창업진흥원 예비창업패키지 전담멘토 풀 등록", period: "2019~2023" },
    { name: "한성대학교 창업멘토 풀 등록", period: "2021~2022" },
    { name: "동국대학교 창업전문기업 풀 등록", period: "2023~2025" },
  ],
  specialty: {
    label: "Specialty",
    title: "IR 피칭 컨설팅",
    desc: "보이스 트레이닝과 커뮤니케이션 기술을 결합하여 투자자의 마음을 움직이는 설득의 구조를 설계합니다.",
    highlights: ["창업에듀 교육영상", "K-STARTUP 본선 멘토", "LG디스플레이 초청강의"],
  },
};

export const insights = {
  eyebrow: "Watch Insights",
  title: "예비 ~ 초기 단계 스타트업을 위한 핵심 인사이트 영상",
  videos: [
    {
      id: "dEIglevKkdA",
      title: "예시로 알아보는 사업계획서",
      provider: "K-스타트업, 창업에듀 · 2021년 14차시",
      type: "youtube" as const,
      start: 1151,
      url: "https://www.youtube.com/watch?v=dEIglevKkdA&t=1151s",
      thumbnail: null as string | null,
    },
    {
      id: "seoulsbdc",
      title: "항목별 키포인트로 술술쓰는 사업계획서",
      provider: "서울시 자영업지원센터 · 2023년",
      type: "external" as const,
      start: 0,
      url: "https://edu.seoulsbdc.or.kr/course/course_view.jsp?id=49967&cid=11475&lnb=6159&ch=course1#cview3",
      thumbnail: "/thumbnails/seoulsbdc.jpg",
    },
    {
      id: "gmr",
      title: "예비창업자를 위한 사업계획서 핵심 가이드",
      provider: "경기도 자영업 아카데미 · 2023년",
      type: "external" as const,
      start: 0,
      url: "https://edu.gmr.or.kr/onlineCos/contentsPreview/1823",
      thumbnail: "/thumbnails/gmr.jpg",
    },
  ],
};

export const gallery = {
  eyebrow: "Mentoring Gallery",
  title: "현장의 기록",
  body: "멘토링, 강연, 평가 현장에서 함께한 순간들",
  cloudName: "dhohspefk",
  images: [
    { file: "sample1", alt: "멘토링 현장 1" },
    { file: "sample2", alt: "멘토링 현장 2" },
    { file: "sample3", alt: "멘토링 현장 3" },
    { file: "sample4", alt: "멘토링 현장 4" },
    { file: "sample5", alt: "멘토링 현장 5" },
    { file: "sample6", alt: "멘토링 현장 6" },
    { file: "sample7", alt: "멘토링 현장 7" },
    { file: "sample8", alt: "멘토링 현장 8" },
  ],
};

export const galleryUrl = (file: string, width: number) =>
  `https://res.cloudinary.com/${gallery.cloudName}/image/upload/w_${width},q_auto,f_auto/gallery/${file}`;

/* 4. 인물 */
export const person = {
  eyebrow: "The Pilot",
  name: "박용근",
  role: "대표 · IR피칭멘토",
  current: "한성대학교 캠퍼스타운 기술창업센터 총괄매니저",
  body: "정보는 AI가, 결정은 통찰이. 중장년 기술창업 전문 멘토로서 15년 이상 창업·경영 현장에서 예비~초기 창업자 200여 팀과 함께했습니다.",
  creds: ["문화창업플래너", "창업진흥원 평가위원 등록", "성남산업진흥원 창업멘토 등록"],
};

/* 5. 문의 */
export const contact = {
  eyebrow: "Mentoring Reservation",
  title: ["당신의 질문을", "바꿀 준비가 되셨습니까?"],
  body: ["통찰은 올바른 질문에서 시작됩니다.", "지금 멘토링 상담을 예약하세요."],
  cta: "멘토링 상담 예약하기",
  mailSubject: "멘토링 상담 예약 문의",
};

/** 장면(행성 자세)을 가진 섹션. 순서가 World.tsx의 POSES와 맞아야 한다 */
export const sections = [
  { id: "manifesto", label: "Identity", short: "ID" },
  { id: "hold", label: "Question", short: "ASK" },
  { id: "paradox", label: "Paradox", short: "TRUST" },
  { id: "orbit", label: "Functions", short: "FUNC" },
  { id: "process", label: "Process", short: "STEP" },
  { id: "proof", label: "Authority", short: "PROOF" },
  { id: "insight", label: "Insights", short: "WATCH" },
  { id: "gallery", label: "Gallery", short: "FIELD" },
  { id: "person", label: "Architect", short: "PILOT" },
  { id: "contact", label: "Contact", short: "CALL" },
] as const;
