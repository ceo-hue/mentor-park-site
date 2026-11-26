/** 브랜드 정보와 섹션별 콘텐츠 */

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
  heading: "극초기 스타트업의 첫 단추",
};

/** 섹션마다 크게 깔리는 영문 디스플레이 단어 */
export const display = {
  hold: ["IDEA", "TEST"],
  person: "THE ARCHITECT",
  contact: "CONTACT",
};

/* 0. 히어로 */
export const manifesto = {
  eyebrow: "온에어플래닛 · 박용근 멘토",
  title: ["극초기 스타트업의", "첫 단추를 함께 끼웁니다"],
  body: "아이디어부터 첫 MVP까지, 지금 검증할 가설과 만들 결과물을 함께 정합니다.",
};

/* 가설을 검증하는 흐름 */
export const hold = {
  eyebrow: "첫 검증",
  title: "어떤 가설부터 확인할까요?",
  body: "고객이 겪는 문제 하나를 고르고, 그 문제가 해결됐을 때 어떤 행동이 달라질지 정해 보세요.",
  cta: "길게 눌러 행성 나누기",
  after: "가설을 나눴다면, 관찰할 행동을 하나 골라 보세요",
};

export const paradox = {
  hypothesis: {
    label: "고객 문제 가설",
    lead: "당일 예약이 취소되면 1인 미용실은 빈 시간을 다시 채우기 어렵다.",
    body: "가상의 미용실 예약 관리 서비스를 예로 들어, 최근 취소가 발생한 상황과 대기 고객에게 연락한 과정을 들어봅니다.",
  },
  experiment: {
    label: "첫 검증 방법",
    lead: "취소된 시간 한 칸을 대기 고객에게 다시 배정해 봅니다.",
    body: "먼저 수작업으로 진행하며 확인에 걸린 시간과 다시 예약된 건을 기록합니다. 반복되는 흐름을 바탕으로 MVP 범위와 IR 덱에 담을 근거를 정합니다.",
  },
};

const mentorActivities = {
  pmf: {
    year: "2026",
    title: "관악S밸리 창업페스티벌",
    role: "1:1 밋업 초기 아이디어 검증·비즈니스 모델 전문가",
    linkLabel: "공식 행사 프로그램 보기",
    url: "https://startupfestival.kr/",
  },
  ir: {
    year: "2021",
    title: "세종대 피칭 & 집중 멘토링 데이",
    role: "피칭 & 멘토링 DAY 피칭 멘토",
    linkLabel: "행사 사진과 공식 보도 보기",
    url: "https://pr.sejong.ac.kr/news/today/press-release.do?article.offset=0&articleLimit=10&articleNo=723586&mode=view",
  },
  lecture: {
    year: null,
    title: "소상공인 지식배움터",
    role: "‘성공적인 사업계획서 작성’ 강사",
    url: "https://edu.sbiz.or.kr/edu/online/onlineEduForm.do?cseqno=832",
  },
  workshop: {
    year: "2023",
    title: "서울시 50플러스포털 성북 하루공부",
    role: "‘중장년 기술창업 및 발굴설명회’ 강사",
    linkLabel: "공식 강연 소개 보기",
    url: "https://www.50plus.or.kr/sbc/education-detail.do?id=33377713",
  },
};

export const specialties = [
  {
    id: "pmf",
    title: "PMF 검증",
    outcome: "첫 고객과 검증할 가설 정하기",
    description: "제품·시장 적합성(PMF)을 찾는 첫 단계입니다. 고객이 어떤 상황에서 문제를 겪고 지금 어떤 대안에 시간과 비용을 쓰는지 살핍니다.",
    features: ["목표 고객 구체화", "고객 인터뷰 설계", "첫 실험과 판단 기준 설정"],
    deliverable: "고객 가설·인터뷰 질문지·실험 기록표",
    preview: {
      src: "/case/pmf-workbook.webp",
      alt: "가상 미용실 사례의 일주일 고객 검증 기록표. 가설, 인터뷰 질문, 관찰 지표와 다음 판단을 담았습니다.",
    },
    reference: {
      label: "관악S밸리 전문가 소개",
      description: mentorActivities.pmf.role,
      url: mentorActivities.pmf.url,
    },
    guide: {
      title: "고객 가설과 첫 실험 설계하기",
      summary: "인터뷰에서 들은 문제를 고객이 실제로 하는 행동과 연결합니다.",
      points: [
        "최근에 그 문제를 겪은 상황을 물어보세요. 발생 빈도, 현재 대안, 해결에 드는 시간이나 비용을 기록합니다.",
        "다음 만남이나 시범 운영에 참여할 의사가 있는지 확인하세요. 신청, 재사용, 유료 전환 등 팀이 관찰할 행동을 고릅니다.",
        "실험 전에 대상, 기간, 기록할 항목, 다음 단계로 넘어갈 기준을 정하세요.",
      ],
      sample: {
        title: "1주일 고객 검증 계획",
        rows: [
          { label: "대상", value: "당일 취소가 발생하고 대기 고객 명단을 관리하는 1인 미용실 3곳" },
          { label: "질문", value: "지난번 당일 취소가 났을 때 빈 시간을 채우기 위해 어떤 순서로 연락하셨나요?" },
          { label: "실험", value: "일주일 동안 취소 건수, 대기 고객에게 연락한 건수, 다시 채운 건수, 처리 시간을 따로 기록합니다." },
          { label: "다음 단계 예시", value: "참여 매장 중 2곳 이상이 다음 주에도 사용을 요청하면 실제로 다시 사용하는지 추적합니다. 취소 건이 적으면 관찰 기간을 늘립니다." },
        ],
      },
      source: { label: "Y Combinator · PMF를 찾는 방법", url: "https://www.ycombinator.com/library/7V-how-to-find-product-market-fit" },
    },
  },
  {
    id: "ir",
    title: "IR 피치·덱",
    outcome: "발표와 슬라이드에 사업의 근거 담기",
    description: "투자자가 고객 문제와 사업의 진행 상황을 빠르게 이해하도록 발표 흐름과 덱을 다듬고, 질의응답을 연습합니다.",
    features: ["한 문장 사업 소개", "슬라이드별 주장과 근거", "피치 리허설과 예상 질문"],
    deliverable: "IR 덱 목차·발표 대본·예상 질문과 답변",
    preview: {
      src: "/case/ir-slide.webp",
      alt: "가상 미용실 예약 서비스 IR 덱의 문제와 해결 슬라이드. 빈 시간 확인, 대기 고객 선택, 예약 확정 순서를 보여 줍니다.",
    },
    reference: {
      label: "세종대학교 공식 보도",
      description: mentorActivities.ir.role,
      url: mentorActivities.ir.url,
    },
    guide: {
      title: "첫 IR 덱과 피치의 흐름 잡기",
      summary: "각 슬라이드에 전달할 주장 하나와 이를 뒷받침하는 근거를 붙입니다.",
      points: [
        "첫 장에서 고객, 문제, 해결 방법을 한 문장으로 설명하세요.",
        "인터뷰, 사용 기록, 매출 등 확보한 근거에 집계 기간과 대상을 붙이세요. 앞으로 확인할 가설에는 검증 계획을 적습니다.",
        "마지막 장에서 투자나 협력을 요청하는 이유를 설명하세요. 자료에 근거해 답할 수 있도록 예상 질문을 연습합니다.",
        "투자 유치용 덱에는 목표 시장, 수익 모델, 팀의 실행 역량과 조달 자금의 사용 계획을 보강하세요.",
      ],
      sample: {
        title: "검증 전 팀의 5장 덱 초안",
        rows: [
          { label: "사업 소개", value: "당일 취소가 발생하면 대기 고객을 찾아 빈 예약 시간을 다시 채우는 도구입니다." },
          { label: "문제", value: "1인 미용실에서 취소가 발생하면 시술 중에 대기 고객에게 차례로 연락하기 어렵다는 가설을 제시합니다." },
          { label: "해결 방법", value: "취소된 시간 확인, 대기 고객 선택, 예약 확정까지의 흐름을 한 화면으로 보여 줍니다." },
          { label: "검증 계획", value: "시범 운영에서 다시 채운 예약 수와 처리 시간을 기록하고, 매장의 반복 사용 의사를 확인합니다." },
          { label: "요청", value: "일주일간 시범 운영을 함께할 1인 미용실 3곳을 찾습니다." },
        ],
      },
      source: { label: "Y Combinator · 시드 투자용 피치 덱 구성", url: "https://www.ycombinator.com/library/2u-how-to-build-your-seed-round-pitch-deck" },
    },
  },
  {
    id: "vibe-coding",
    title: "바이브 코딩",
    outcome: "고객에게 보여 줄 첫 MVP 만들기",
    description: "AI에 자연어로 요구사항을 설명해 첫 프로토타입을 만듭니다. 한 가지 사용자 흐름을 완성하고 실제로 동작하는지 확인합니다.",
    features: ["사용자 흐름과 MVP 범위 설정", "AI용 요구사항 작성", "동작 점검과 데모 준비"],
    deliverable: "MVP 요구사항·시연용 프로토타입·테스트 체크리스트",
    preview: {
      src: "/case/mvp-screen.webp",
      alt: "가상 예약 관리 MVP 화면. 취소된 시간에 대기 고객을 선택하고 예약을 확정하는 흐름입니다.",
    },
    reference: {
      label: "K-Startup 관련 교육 공고",
      description: "2026년 예비창업자 대상 바이브 코딩 실습·그룹 멘토링 프로그램",
      url: "https://www.k-startup.go.kr/web/contents/bizpbanc-ongoing.do?pbancSn=178864&schM=view",
    },
    guide: {
      title: "핵심 흐름이 동작하는 MVP 만들기",
      summary: "AI에 화면, 예외 상황, 완료 기준을 함께 설명하면 만든 결과를 바로 점검할 수 있습니다.",
      points: [
        "고객에게 보여 줄 시작 화면과 완료 상태를 먼저 적고, 검증에 필요한 기능을 하나 고르세요.",
        "AI에 사용할 데이터와 화면의 동작을 설명하세요. 시연에는 가상 데이터를 쓰고, 필요해질 때 로그인이나 외부 연동을 추가합니다.",
        "정상 흐름과 예외를 각각 실행해 보세요. AI가 만든 코드와 의존성을 검토하고, 외부 공개 전에 개인정보 처리와 권한을 확인합니다.",
      ],
      sample: {
        title: "예약 재배정 데모 요구사항",
        rows: [
          { label: "구현 요청 예시", value: "취소된 예약 한 건과 가상의 대기 고객 세 명을 보여 줘. 한 명을 선택해 예약을 확정하면 상태를 ‘재예약 완료’로 바꾸고 같은 시간은 다시 배정할 수 없게 해 줘." },
          { label: "포함할 범위", value: "예약 목록, 대기 고객 선택, 확정 상태 표시. 시연은 가상 데이터로 진행합니다." },
          { label: "통과 기준", value: "선택한 대기 고객만 예약에 표시됩니다. 고객을 고르지 않으면 확정할 수 없고, 같은 시간에 두 번째 확정이 생기지 않습니다." },
        ],
      },
      source: { label: "GitHub Docs · AI 생성 코드 검토 방법", url: "https://docs.github.com/en/copilot/tutorials/review-ai-generated-code" },
    },
  },
] as const;

/** 고리 위 위성 수 = 전체 기능 수 */
export const satelliteCount = specialties.reduce((n, specialty) => n + specialty.features.length, 0);

export const process = {
  steps: [
    { step: "01", title: "현황 파악", desc: "아이디어, 고객 인터뷰, 덱, 데모 중 현재까지 준비한 자료를 살펴봅니다." },
    { step: "02", title: "목표 설정", desc: "지금 확인할 가설과 상담에서 다룰 결과물을 하나씩 고릅니다." },
    { step: "03", title: "초안 만들기", desc: "고객 실험 계획, IR 덱·피치, MVP 중 정한 결과물의 초안을 함께 점검합니다." },
    { step: "04", title: "다음 검증 준비", desc: "고객에게 보여 줄 내용, 기록할 행동, 검증 후 내릴 결정을 정리합니다." },
  ],
};

/**
 * 기관 멘토링·강의 이력 (박용근 프로필 기준).
 * 평가·심사 활동과 평가위원 풀 등록은 공개하지 않는다.
 * 기업 사내 강의, 대학 진로·스피치 강의, 방송·MC 이력은 창업 분야가 아니라 넣지 않았다.
 */
type InstitutionRecord = { date: string; year: number | null; org: string; program: string; role: string; url?: string };

export const institutionRecords: { mentoring: InstitutionRecord[]; lecture: InstitutionRecord[] } = {
  mentoring: [
    { date: "2026", year: 2026, org: "관악S밸리 창업페스티벌", program: "1:1 밋업", role: "초기 아이디어 검증·비즈니스 모델 전문가", url: mentorActivities.pmf.url },
    { date: "2026.07", year: 2026, org: "동국대학교 창업교육센터", program: "창업동아리 멘토링", role: "창업동아리 멘토" },
    { date: "2025.10~11", year: 2025, org: "(주)오픈놀", program: "로컬파이오니어스쿨 ‘창업부스팅’ 과정", role: "사업계획서 멘토링·컨설팅" },
    { date: "2025.10", year: 2025, org: "화성시 꿈마루", program: "2025 화성시 취창업박람회", role: "일반경영 컨설팅" },
    { date: "2024.05", year: 2024, org: "동국대학교 창업지원단", program: "예비창업패키지 상담창구 멘토링", role: "예비창업패키지 멘토링" },
    { date: "2024.02", year: 2024, org: "백석대학교", program: "입주기업 IR 컨설팅 사업(독립잇다.)", role: "IR 컨설팅" },
    { date: "2023.01~02", year: 2023, org: "동국대학교 창업지원단", program: "예비창업패키지 상담창구 멘토링", role: "예비창업패키지 멘토링" },
    { date: "2022.06", year: 2022, org: "세종대학교", program: "피칭 & 멘토링 대회", role: "멘토링" },
    { date: "2021.11", year: 2021, org: "구미전자정보기술원", program: "대-스타 해결사 플랫폼 반도체 분야", role: "IR 피칭 멘토링" },
    { date: "2021.11", year: 2021, org: "세종대학교", program: "피칭 & 멘토링 DAY", role: "피칭 멘토", url: mentorActivities.ir.url },
    { date: "2021.10", year: 2021, org: "한국발명진흥회", program: "시니어 퇴직인력의 기술기반 창업지원 사업", role: "사업계획·IR 컨설팅" },
    { date: "2021.08", year: 2021, org: "세종대학교", program: "피칭 & 멘토링 대회", role: "멘토링" },
    { date: "2021.07", year: 2021, org: "세종창조경제혁신센터", program: "2021 도전! K-스타트업 참가팀(지역 최종예선)", role: "IR 피칭 멘토링" },
    { date: "2021.06", year: 2021, org: "충무창업큐브", program: "서울시 스타트업 챌린지 충무로점 참여기업", role: "사업계획·피칭 멘토링" },
    { date: "2021.05", year: 2021, org: "스파크", program: "찾아가는 국군 창업 멘토링(국군 창업 경진대회)", role: "비대면 창업 멘토링" },
    { date: "2020.10", year: 2020, org: "창업진흥원", program: "2020 도전! K-스타트업 본선 진출(공군)", role: "비대면 멘토링" },
    { date: "2020.10", year: 2020, org: "강원대학교", program: "예비창업자 비대면 멘토링", role: "비대면 멘토링" },
    { date: "2020.10", year: 2020, org: "공주대학교", program: "예비창업자 비대면 멘토링", role: "비대면 멘토링" },
    { date: "2020.07", year: 2020, org: "신림사회복지관", program: "예비창업자 멘토링", role: "멘토링" },
    { date: "2020.06", year: 2020, org: "창업진흥원", program: "2020 도전! K-스타트업 본선 진출(국군)", role: "IR 피칭 멘토링" },
    { date: "2018~2020", year: 2020, org: "캠틱종합기술원", program: "선도기업 분석대회", role: "멘토링·비대면 멘토링" },
    { date: "2019~2023", year: 2019, org: "창업진흥원", program: "예비창업패키지", role: "전담멘토" },
    { date: "2019.09", year: 2019, org: "제주청년창업사관학교", program: "입교기업 대상 피칭 멘토링", role: "IR 피칭 멘토링" },
    { date: "2018.10 · 2019.09", year: 2019, org: "충남청년창업사관학교", program: "입교기업 대상 피칭 멘토링", role: "IR 피칭 멘토링" },
    { date: "2018.08", year: 2018, org: "광주대학교", program: "교내 창직 프로그램", role: "멘토링" },
    { date: "2018.07", year: 2018, org: "성신여자대학교", program: "창업·창직 프로그램 / 기업가 정신 및 IR PT", role: "멘토링·강의" },
    { date: "2018.06", year: 2018, org: "한국특허전략개발원", program: "창의적 지식재산 사업화 지원 사업", role: "참가팀 IR 피칭(PT)" },
    { date: "2018.05", year: 2018, org: "계명예술대학교", program: "창업·창직 프로그램 / 브랜드 컨설팅", role: "멘토링" },
    { date: "2017.11", year: 2017, org: "빅뱅엔젤스", program: "액셀러레이터 연계지원사업 유니콘파인더", role: "IR 국문 피칭 멘토링" },
    { date: "2017.10", year: 2017, org: "위덕대학교", program: "창업 역량 강화 캠프", role: "멘토링" },
    { date: "2017.09", year: 2017, org: "서울시립대학교", program: "스마트 창작터", role: "멘토링·강의" },
    { date: "2017.09", year: 2017, org: "대구대학교", program: "스포츠 창업캠프", role: "멘토링·강의" },
    { date: "2017.08", year: 2017, org: "문성대학교", program: "예비창업자를 위한 맞춤형 창업캠프", role: "멘토링·강의" },
    { date: "2017.07", year: 2017, org: "무주군", program: "반딧불 청년창업 지원 사업", role: "IR 피칭 멘토링" },
    { date: "2017.06", year: 2017, org: "대구대학교", program: "상상플러스 창업캠프", role: "멘토링·강의" },
    { date: "2017.05", year: 2017, org: "전주벤처기업육성촉진지구발전협의회", program: "리스타트업 캠프", role: "멘토링·강의" },
    { date: "2016.11", year: 2016, org: "창업진흥원", program: "빅데이터 왕중왕전 최종 12팀 파이널", role: "IR 피칭 멘토링" },
    { date: "2016.06", year: 2016, org: "창업진흥원", program: "KBS 도전! K-STARTUP 본선 진출", role: "IR 피칭 멘토링" },
    { date: "2015.07", year: 2015, org: "SBA 창업스쿨", program: "스타트업 IR PT 발표스킬 업 프로그램", role: "멘토링·강의" },
  ],
  lecture: [
    { date: "2026.11", year: 2026, org: "고려대학교", program: "모두의 창업 2기 1R 캠프", role: "PMF 강의·멘토링" },
    { date: "2026.11", year: 2026, org: "서울지식재산센터(SBA)", program: "2026 IP디딤돌 프로그램 ‘IP창업클럽 스타트업 IP:ON’", role: "특강·1:1 멘토링" },
    { date: "2026.10", year: 2026, org: "서울지식재산센터 × 남부여성발전센터", program: "사업계획서 작성 실습(모두의창업 특화)", role: "실습 강의" },
    { date: "2026.09", year: 2026, org: "서울지식재산센터(SBA)", program: "IP창업존 32기 / 비즈니스모델과 사업계획서", role: "사업계획서 강의" },
    { date: "2026.08", year: 2026, org: "배화여자대학교 취창업지원팀", program: "실전 사업계획서 특강", role: "대면 그룹 첨삭 강의" },
    { date: "2026.05", year: 2026, org: "(사)충남산학융합원", program: "정부지원사업의 이해 및 사업계획서 작성", role: "창업 강의" },
    { date: "2025.12", year: 2025, org: "배화여자대학교 산학협력처", program: "창업부트캠프 ‘린스타트업’", role: "특강" },
    { date: "2025", year: 2025, org: "서울지식재산센터(SBA)", program: "IP창업존 / 사업계획서 작성", role: "사업계획서 강의" },
    { date: "2024.06", year: 2024, org: "성남 브릿지센터", program: "생성형 AI를 활용한 SNS 마케팅", role: "초기창업자 강의" },
    { date: "2024.06", year: 2024, org: "백석대학교", program: "창업멘토링 교양수업(기업가정신)", role: "창업 강의" },
    { date: "2024.05", year: 2024, org: "강원창조경제혁신센터", program: "강원 창업 오디션", role: "피칭 강의" },
    { date: "2023.08", year: 2023, org: "백석대학교", program: "창업멘토링 교양수업(기업가정신)", role: "창업 강의" },
    { date: "2023.07", year: 2023, org: "서울IP지식재산센터", program: "서울 IP디딤돌 프로그램", role: "IR 피칭 강의" },
    { date: "2023.06", year: 2023, org: "성남IP지식재산센터", program: "성남 IP디딤돌 프로그램", role: "IR 피칭 강의" },
    { date: "2023", year: 2023, org: "서울시 자영업지원센터", program: "항목별 키포인트로 술술쓰는 사업계획서", role: "강의 영상", url: "https://edu.seoulsbdc.or.kr/course/course_view.jsp?id=49967&cid=11475&lnb=6159&ch=course1#cview3" },
    { date: "2023", year: 2023, org: "경기도 자영업 아카데미", program: "예비창업자를 위한 사업계획서 핵심 가이드", role: "강의 영상", url: "https://edu.gmr.or.kr/onlineCos/contentsPreview/1823" },
    { date: "2022.10", year: 2022, org: "한국콘텐츠진흥원", program: "2022 콘텐츠 임팩트 / 몰입 피칭", role: "비대면 강의" },
    { date: "2021.11", year: 2021, org: "창업진흥원", program: "창업에듀 교육영상 / 예시로 알아보는 사업계획서", role: "창업 강의", url: "https://www.youtube.com/watch?v=dEIglevKkdA&t=1151s" },
    { date: "2020.11", year: 2020, org: "한국콘텐츠진흥원", program: "콘텐츠 임팩트", role: "비대면 강의·멘토링" },
    { date: "2020.09", year: 2020, org: "서울시창업카페 상봉점", program: "기업가 정신 및 인플루언서 창업 마인드", role: "강의" },
    { date: "2019.09", year: 2019, org: "서울대학교 캠퍼스타운", program: "녹두 프로그램 / 설득력 있는 이미지(보이스) 훈련", role: "강의" },
    { date: "2019.04", year: 2019, org: "충무창업큐브", program: "사업계획 취지와 목적 만들기", role: "강의" },
    { date: "2017.02", year: 2017, org: "강원창조경제혁신센터", program: "스타트업 사업계획 스킬업", role: "강의" },
    { date: "2015.05", year: 2015, org: "SBA 창업스쿨", program: "프레젠테이션 발표스킬 업", role: "강의" },
    { date: "2014.04", year: 2014, org: "홍익대학교 창조아카데미", program: "창업 프로그램 ‘보이스 트레이닝’", role: "강의" },
    { date: "2013.09", year: 2013, org: "소상공인진흥원 경영학교", program: "키노트 프레젠테이션", role: "강의" },
    { date: "2012.10", year: 2012, org: "부천대학교", program: "창업 콘서트", role: "강연" },
    { date: "온라인", year: null, org: "소상공인 지식배움터", program: "성공적인 사업계획서 작성", role: "강의 영상", url: mentorActivities.lecture.url },
  ],
};

/* 멘토 활동과 기관 등록 이력 */
export const proof = {
  title: "박용근 멘토 이력",
  activities: [mentorActivities.pmf, mentorActivities.ir, mentorActivities.lecture],
  /** 대표로 창업·운영한 회사 (프로필 경력 기준). 첫 항목을 강조한다 */
  startups: [
    { org: "온에어플래닛", role: "대표 · IR 피칭 전문 멘토", period: "2022.05 ~ 현재", field: "경영컨설팅 · 스타트업 멘토링" },
    { org: "와이스트", role: "대표", period: "2016.05 ~ 2017.12 · 2018.11 ~ 2022.03", field: "경영컨설팅" },
    { org: "K엔터테인먼트", role: "대표", period: "2011.08 ~ 2012.06", field: "사업운영" },
  ],
  mentoring: [
    { name: "창업진흥원 예비창업패키지 전담멘토 풀 등록", period: "2019~2023" },
    { name: "성남산업진흥원 창업전문가 풀 등록", period: "2023년 등록 이력" },
    { name: "문화창업플래너 수료", period: "2019년" },
    { name: "동국대학교 창업전문기업 풀 등록", period: "2023~2025" },
  ],
};

export const insights = {
  title: "창업 실무 가이드와 결과물 예시",
  intro: "가상의 1인 미용실 예약 관리 서비스를 예로 들어 고객 검증 계획, IR 덱 초안, MVP 요구사항을 작성하는 방법을 보여 드립니다.",
  businessPlan: {
    title: "PSST 사업계획서의 근거 연결하기",
    summary: "문제 인식, 실현 가능성, 성장 전략, 팀 구성에 같은 고객과 사업 목표가 이어지는지 확인합니다.",
    points: [
      "문제 인식에는 목표 고객과 현재 대안을 적고, 인터뷰나 이용 기록으로 불편의 크기를 보여 주세요.",
      "실현 가능성과 성장 전략에는 지금까지 검증한 범위, 처음 도달할 고객군, 수익을 낼 방법과 다음 실험을 적으세요.",
      "팀 구성에는 앞서 적은 실행 과제마다 담당자와 관련 경험을 연결하세요.",
    ],
    source: {
      label: "중소벤처기업부 · PSST 평가 항목",
      url: "https://www.mss.go.kr/common/board/Download.do?bcIdx=1039751&cbIdx=310&streFileNm=e39051ae-9b81-4325-9bd3-7212658a9ee2.pdf",
    },
  },
  videosTitle: "사업계획서 강의 영상",
  videos: [
    {
      id: "sbiz",
      title: "성공적인 사업계획서 작성",
      provider: "소상공인 지식배움터 · 박용근 강사",
      type: "external" as const,
      start: 0,
      url: mentorActivities.lecture.url,
      thumbnail: null,
      detail: "공식 강의 목차에서 2:04 ‘MVP의 중요성’ 구간을 확인할 수 있습니다.",
    },
    {
      id: "dEIglevKkdA",
      title: "예시로 알아보는 사업계획서",
      provider: "K-Startup 창업에듀 · 2021년 14차시",
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
  title: "현장의 기록",
  body: "기관이 공개한 창업 행사와 강의 기록입니다.",
  records: [mentorActivities.pmf, mentorActivities.ir],
};

/* 4. 인물 */
export const person = {
  eyebrow: "The Pilot",
  name: "박용근",
  role: "온에어플래닛 대표 · IR 피칭 전문 멘토",
  body: "아이디어와 첫 제품을 준비하는 예비·극초기 창업팀을 멘토링합니다. IR 피칭을 중심으로 사업화 전략과 사업계획서 작성을 함께 점검해 왔습니다.",
  research: "Project ARHA에서는 브랜드의 어조와 업무 맥락을 AI 응답에 반영하는 방법을 연구합니다.",
  creds: ["예비창업패키지 전담멘토 활동", "문화창업플래너 수료"],
};

/* 5. 문의 */
export const contact = {
  title: "극초기 창업 멘토링 문의",
  body: "현재 단계와 가장 막히는 일을 알려 주세요. 인터뷰 기록, IR 덱 또는 데모가 있다면 함께 보내 주세요.",
  cta: "이메일로 상담 문의하기",
  mailSubject: "온에어플래닛 극초기 창업 멘토링 문의",
  mailBody: [
    "현재 단계 (아이디어, 고객 검증, 첫 MVP 등)",
    "상담 주제 (PMF 검증, IR 피치·덱, 바이브 코딩)",
    "가장 먼저 해결하고 싶은 일",
  ].join("\r\n\r\n"),
};

/** 장면(행성 자세)을 가진 섹션. 순서가 World.tsx의 POSES와 맞아야 한다 */
export const sections = [
  { id: "manifesto", label: "Identity", short: "ID" },
  { id: "orbit", label: "Specialties", short: "FOCUS" },
  { id: "paradox", label: "Experiment", short: "TEST" },
  { id: "hold", label: "Question", short: "ASK" },
  { id: "process", label: "Process", short: "STEP" },
  { id: "proof", label: "Authority", short: "PROOF" },
  { id: "insight", label: "Insights", short: "WATCH" },
  { id: "gallery", label: "Gallery", short: "FIELD" },
  { id: "person", label: "Architect", short: "PILOT" },
  { id: "contact", label: "Contact", short: "CALL" },
] as const;
