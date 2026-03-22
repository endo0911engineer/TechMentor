import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "面接体験談一覧",
  description: "ITエンジニアによる企業の面接体験談。難易度・結果・面接内容など実際の選考情報を掲載。",
  robots: { index: true, follow: true },
};

export default function InterviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
