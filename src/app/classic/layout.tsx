import type { Metadata } from "next";

// 이전 개인형 사이트. 비교용으로 남겨 두고 검색에는 노출하지 않는다
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ClassicLayout({ children }: { children: React.ReactNode }) {
  return children;
}
