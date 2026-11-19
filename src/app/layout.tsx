import type { Metadata, Viewport } from "next";
import { Anton, IBM_Plex_Mono } from "next/font/google";
import { brand, person } from "@/content/site";
import "./globals.css";

// 거대 디스플레이 타이포 (OFL)
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });
// UI 라벨용 모노 (OFL)
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const title = `${brand.nameKo} | 극초기 스타트업 검증 파트너 · PMF·IR·바이브 코딩`;
const description =
  `온에어플래닛(ONAIR PLANET)은 극초기 스타트업이 첫 고객, 첫 투자자 미팅, 첫 MVP에 도달하도록 검증의 순서를 설계합니다. 대표 멘토 ${person.name}. PMF 검증, IR 피치·덱, 바이브 코딩.`;

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, siteName: brand.nameKo, locale: "ko_KR", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#eef3ff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${anton.variable} ${plexMono.variable} is-gated`}>
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
