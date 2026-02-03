import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "박용근 멘토 | The Architect of Insight",
  description:
    "정보는 AI가, 결정은 통찰이. 중장년 기술창업 전문 멘토 박용근의 포트폴리오 사이트입니다.",
  keywords: ["박용근", "멘토", "창업", "스타트업", "멘토링", "한성대학교"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
