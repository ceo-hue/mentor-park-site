import type { Metadata, Viewport } from "next";
import { Anton, IBM_Plex_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

// 명함 워드마크 계열 세리프 (OFL)
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  variable: "--font-playfair",
  display: "swap",
});
// 거대 디스플레이 타이포 (OFL)
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });
// UI 라벨용 모노 (OFL)
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ONAIR PLANET | 박용근 멘토 · 비즈니스 정체성 아키텍트",
  description:
    "정보는 AI가, 결정은 통찰이. 온에어플래닛 대표 박용근 — 중장년 기술창업 전문 멘토, IR 피칭과 ARHA 기반 비즈니스 정체성 설계.",
  keywords: ["박용근", "온에어플래닛", "ONAIR PLANET", "멘토", "창업", "IR 피칭", "사업계획서", "ARHA", "한성대학교"],
};

export const viewport: Viewport = {
  themeColor: "#eef3ff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${playfair.variable} ${anton.variable} ${plexMono.variable} is-gated`}>
      <head>
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
