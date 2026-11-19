/**
 * 메인 사이트(/, 기업형 모션그래픽)의 콘텐츠.
 * 사실 정보(서비스, 진행 과정, 기관 이력, 연락처)는 모두 src/content/site.ts에서 가져온다.
 * 이 파일에는 기업형 어조의 문장과 장면 구성만 둔다. 숫자·고객사·성과를 새로 만들지 않는다.
 */
import { brand, person, process, proof, specialties } from "@/content/site";
import { insights as siteInsights, person as sitePerson } from "@/content/site";

export { brand };

export const hero = {
  kicker: "Early-stage Startup Validation Partner",
  lines: ["WE DESIGN", "THE FIRST", "ORBIT."],
  ko: "온에어플래닛은 극초기 스타트업이 첫 고객, 첫 투자자 미팅, 첫 MVP에 도달하도록 검증의 순서를 설계합니다.",
};

/** 1. 문제 — 세 갈래로 엉킨 질문이 하나의 궤도로 정렬된다 */
export const problem = {
  kicker: "The Problem",
  before: ["아이디어는 있는데", "무엇부터 확인해야 할지", "모를 때."],
  after: ["검증할 순서를 정하면", "궤도가 생깁니다."],
  tracks: [
    { key: "customer", label: "고객", question: "누가, 어떤 상황에서 불편을 겪는가" },
    { key: "investor", label: "투자자", question: "무엇을 근거로 설득할 것인가" },
    { key: "product", label: "제품", question: "가장 먼저 보여 줄 기능은 무엇인가" },
  ],
};

/** 2. 방법론 — 기존 4단계 진행 과정을 궤도 체계로 */
const methodKeys = ["OBSERVE", "TARGET", "DRAFT", "VALIDATE"] as const;
export const method = {
  kicker: "Our Method",
  title: "4개의 궤도로 일합니다",
  steps: process.steps.map((s, i) => ({ ...s, key: methodKeys[i] })),
};

/** 3. 사업 영역 — 세 가지 실무 프랙티스 */
export const practices = specialties.map((s) => ({
  id: s.id,
  title: s.title,
  outcome: s.outcome,
  description: s.description,
  features: [...s.features],
  deliverable: s.deliverable,
  source: s.guide.source,
}));

/** IR 덱 그래픽: 실무 가이드의 덱 구성 (특정 사례 없이) */
export const irDeck = [
  { label: "한 문장 소개", value: "고객, 문제, 해결 방법을 한 문장으로" },
  { label: "문제", value: "고객이 겪는 상황과 지금 쓰는 대안" },
  { label: "해결 방법", value: "핵심 흐름을 한 장에" },
  { label: "근거·검증 계획", value: "확보한 근거에는 기간과 대상, 남은 가설에는 검증 계획" },
  { label: "요청", value: "투자나 협력을 요청하는 이유" },
];

/** MVP 그래픽: AI에 줄 요구사항과 통과 기준 (특정 사례 없이) */
export const mvpBuild = {
  prompt: "시작 화면과 완료 상태를 보여 줘. 검증할 핵심 기능 하나만 동작하게 하고, 필요한 값이 비어 있으면 다음 단계로 넘어갈 수 없게 해 줘.",
  checks: ["시작 화면", "핵심 기능 하나", "예외 상황 처리", "완료 상태 확인"],
};

/** 5. 기관 네트워크 — proof 데이터를 연도 순으로 */
type NetworkNode = { year: number; org: string; role: string; url?: string };

function firstYear(text: string | null | undefined) {
  const m = text?.match(/(\d{4})/);
  return m ? Number(m[1]) : null;
}

const orgOf = (name: string) =>
  name
    .replace(/\s*(예비창업패키지 전담멘토|창업전문가|평가위원|평가·심의위원|창업전문기업)?\s*풀 등록$/, "")
    .replace(/ 수료$/, "")
    .trim();

export const network = {
  kicker: "Institutional Network",
  title: "공공·대학 창업 생태계와 함께 일해 왔습니다",
  note: proof.evaluationPool.note,
  nodes: ([
    ...proof.mentoring.map((e) => ({ year: firstYear(e.period), org: orgOf(e.name), role: e.name })),
    ...proof.evaluationPool.entries.map((e) => ({ year: firstYear(e.period), org: orgOf(e.name), role: e.name })),
    ...proof.activities.map((a) => ({ year: firstYear(a.year), org: a.title, role: a.role, url: a.url })),
  ].filter((n) => n.year !== null) as NetworkNode[]).sort((a, b) => a.year - b.year),
};

export const leader = {
  name: person.name,
  role: person.role,
  body: person.body,
};

export const cta = {
  marquee: "FIND YOUR FIRST ORBIT",
  title: ["첫 상담에서", "검증할 순서를 정합니다."],
  body: "현재 단계와 가장 막히는 일을 알려 주세요. 인터뷰 기록, IR 덱 또는 데모가 있다면 함께 보내 주세요.",
  button: "프로젝트 문의하기",
  subject: "온에어플래닛 프로젝트 문의",
};

export const chapters = [
  { id: "m-intro", label: "INTRO", nav: false },
  { id: "m-problem", label: "PROBLEM", nav: false },
  { id: "m-method", label: "METHOD", nav: true },
  { id: "m-practice", label: "PRACTICE", nav: true },
  { id: "m-guides", label: "GUIDES", nav: true },
  { id: "m-network", label: "NETWORK", nav: true },
  { id: "m-contact", label: "CONTACT", nav: false },
] as const;

/* ------------------------------------------------------------------ */
/* 기존 사이트 콘텐츠 연결                                              */
/* ------------------------------------------------------------------ */

/** 오프닝 타이틀(하이퍼스페이스) — 타이틀 → TEST WITH CARE → 고리와 원칙 → BUILD WITH EVIDENCE */
export const hyper = {
  stage1: ["TEST", "WITH", "CARE"],
  stage2: ["BUILD", "WITH", "EVIDENCE"],
  // 고리 단계의 네 문장 ("|"는 줄바꿈). 기존 사이트 실무 가이드에서 뽑아 줄였다
  says: [
    "최근에 겪은 상황부터|묻습니다.",
    "실험 전에|판단 기준을 정합니다.",
    "슬라이드마다|주장 하나, 근거 하나.",
    "핵심 흐름 하나가|동작하는 MVP부터.",
  ],
};

/** 분야별 실무 가이드 (기존 사이트 specialties.guide) */
export const guides = specialties.map((s) => ({
  id: s.id,
  title: s.title,
  guideTitle: s.guide.title,
  summary: s.guide.summary,
  points: [...s.guide.points],
  source: s.guide.source,
  reference: s.reference,
}));

export const resources = {
  kicker: "Field Guides",
  title: siteInsights.title,
  intro: "고객 검증 계획, IR 덱과 피치, 첫 MVP 요구사항을 준비하는 방법을 분야별로 정리했습니다.",
  videosTitle: siteInsights.videosTitle,
  videos: siteInsights.videos.map((v) => ({ ...v })),
  businessPlan: siteInsights.businessPlan,
};

export const research = sitePerson.research;
