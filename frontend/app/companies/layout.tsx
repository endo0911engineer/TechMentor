import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "企業一覧",
  description: "ITエンジニアの年収・給与データを掲載している企業の一覧。業種・技術スタックで絞り込み検索が可能。",
  robots: { index: true, follow: true },
};

export default function CompaniesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
