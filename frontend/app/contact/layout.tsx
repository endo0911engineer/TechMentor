import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ",
  robots: { index: true, follow: true },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
