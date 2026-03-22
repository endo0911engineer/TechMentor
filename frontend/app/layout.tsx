import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://devpay.jp"),
  title: {
    default: "DevPay | 日本ITエンジニア年収データベース",
    template: "%s | DevPay",
  },
  description: "日本のIT企業のエンジニア年収・面接体験談を匿名で共有するプラットフォーム。企業別の給与データ・面接情報を掲載。",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        {recaptchaSiteKey && (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
            strategy="afterInteractive"
          />
        )}
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
