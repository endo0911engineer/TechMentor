import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevPay - 日本ITエンジニア給与データベース",
  description: "日本のIT企業のエンジニア年収・面接体験を共有するプラットフォーム",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 mt-16 py-8 text-center text-sm text-gray-400">
          © 2024 DevPay - 日本ITエンジニア給与データベース
        </footer>
      </body>
    </html>
  );
}
