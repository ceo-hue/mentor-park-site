/**
 * 메인 사이트(/, 기업형 모션그래픽)의 콘텐츠.
 * 사실 정보(서비스, 진행 과정, 기관 이력, 연락처)는 모두 src/content/site.ts에서 가져온다.
 * 이 파일에는 기업형 어조의 문장과 장면 구성만 둔다. 숫자·고객사·성과를 새로 만들지 않는다.
 */
import { brand, institutionRecords, person, process, proof, specialties } from "@/content/site";
import { insights as siteInsights, person as sitePerson } from "@/content/site";

export { brand };

export const hero = {
  kicker: "극초기 스타트업 멘토링",
  lines: ["스타트업의 시작을", "돕는 파트너"],
  services: specialties.map(({ title }) => title),
  ko: "고객 반응을 살피고, 투자 발표와 첫 MVP를 준비하도록 돕습니다.",
};

/** 1. 첫 상담에서 확인할 질문 */
export const problem = {
  kicker: "첫 상담에서 확인할 질문",
  before: ["아이디어는 있는데", "무엇부터 확인해야 할지", "모를 때."],
  after: ["가장 먼저 검증할", "가설을 정합니다."],
  tracks: [
    { key: "customer", label: "고객", question: "누가, 어떤 상황에서 불편을 겪는가" },
    { key: "investor", label: "투자자", question: "무엇을 근거로 설득할 것인가" },
    { key: "product", label: "제품", question: "가장 먼저 보여 줄 기능은 무엇인가" },
  ],
};

/** 2. 멘토링 진행 과정 */
const methodKeys = ["현황", "목표", "초안", "검증"] as const;
export const method = {
  title: "멘토링 진행 과정",
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

/** 5. 기관 활동 — 대표로 운영한 회사와 기관 멘토링·강의 이력 (평가·심사 활동은 공개하지 않는다) */
export const network = {
  title: "기관 활동",
  startups: proof.startups,
  mentoring: institutionRecords.mentoring,
  lecture: institutionRecords.lecture,
};

export const leader = {
  name: person.name,
  role: person.role,
  body: person.body,
};

export const cta = {
  title: ["첫 상담에서", "검증할 순서를 정합니다."],
  body: "현재 단계와 가장 막히는 일을 알려 주세요. 인터뷰 기록, IR 덱 또는 데모가 있다면 함께 보내 주세요.",
  button: "프로젝트 문의하기",
  subject: "온에어플래닛 프로젝트 문의",
};

export const chapters = [
  { id: "m-intro", label: "처음", nav: false },
  { id: "m-problem", label: "첫 상담", nav: false },
  { id: "m-method", label: "진행 과정", nav: true },
  { id: "m-practice", label: "지원 분야", nav: true },
  { id: "m-guides", label: "실무 가이드", nav: true },
  { id: "m-network", label: "멘토 이력", nav: true },
  { id: "m-contact", label: "문의", nav: false },
] as const;

/* ------------------------------------------------------------------ */
/* 기존 사이트 콘텐츠 연결                                              */
/* ------------------------------------------------------------------ */

/** 오프닝 타이틀과 장면별 실무 원칙 */
export const hyper = {
  stage1: {
    lines: ["고객의 문제부터", "확인합니다."],
    ko: "PMF 검증에서는 고객이 이미 쓰는 대안과 실제 행동을 살핍니다.",
  },
  stage2: {
    lines: ["IR 피치·덱과", "첫 MVP를 준비합니다."],
    ko: "IR 덱에 담을 근거를 정리하고, 바이브 코딩으로 MVP의 핵심 기능을 구현하도록 돕습니다.",
  },
  // 고리 장면의 "|"는 줄바꿈 자리다.
  says: [
    "고객이 실제로 겪은|상황을 묻습니다.",
    "실험을 시작하기 전에|판단 기준을 정합니다.",
    "IR 덱에는 주장마다|근거를 붙입니다.",
    "MVP는 검증에 필요한|핵심 기능부터 만듭니다.",
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
  title: siteInsights.title,
  intro: "고객 검증 계획, IR 덱과 피치, 첫 MVP 요구사항을 준비하는 방법을 분야별로 정리했습니다.",
  videosTitle: siteInsights.videosTitle,
  videos: siteInsights.videos.map((v) => ({ ...v })),
  businessPlan: siteInsights.businessPlan,
};

export const research = sitePerson.research;
