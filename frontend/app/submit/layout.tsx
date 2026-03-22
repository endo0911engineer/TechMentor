import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "情報を投稿する",
  description: "給与情報・面接体験談を匿名で投稿してください。投稿は管理者確認後に公開されます。",
  robots: { index: true, follow: true },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
