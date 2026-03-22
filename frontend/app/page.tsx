import Link from "next/link";
import { api } from "@/lib/api";
import CompanyCarousel from "@/components/CompanyCarousel";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "DevPay | 日本ITエンジニア年収データベース",
  description: "日本のIT企業のエンジニア年収・給与データ、面接体験談を匿名で共有するプラットフォーム。企業別の給与データ・面接情報を掲載。",
  robots: { index: true, follow: true },
};

export default async function HomePage() {
  let stats = { company_count: 0, salary_count: 0, interview_count: 0 };
  let featured: Awaited<ReturnType<typeof api.getCompaniesWithStats>> = [];

  await Promise.allSettled([
    api.getStats().then((s) => { stats = s; }),
    api.getCompaniesWithStats().then((c) => { featured = c; }),
  ]);

  const topCompanies = [...featured]
    .sort((a, b) => b.stats.submission_count - a.stats.submission_count)
    .slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16 pb-10">
        <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-4">
          Engineers, Know Your Worth
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          その年収、技術に<br />見合っていますか？
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
          リアルな給与データと、技術選考の舞台裏。<br className="hidden sm:block" />
          エンジニアが本音で語る、生の体験談。
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/companies"
            className="bg-blue-600 text-white px-7 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            気になる企業のデータを検索 →
          </Link>
          <Link
            href="/submit"
            className="border-2 border-blue-600 text-blue-600 px-7 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition"
          >
            体験談を匿名でシェアする
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4 my-10">
        {[
          { label: "掲載企業", value: stats.company_count, unit: "社" },
          { label: "年収データ", value: stats.salary_count, unit: "件" },
          { label: "面接体験談", value: stats.interview_count, unit: "件" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
            <p className="text-3xl font-extrabold text-blue-600 tabular-nums">
              {stat.value.toLocaleString()}
              <span className="text-lg font-bold ml-0.5">{stat.unit}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Featured companies — メインコンテンツ */}
      {topCompanies.length > 0 && (
        <section className="my-10">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">注目企業の年収データ</h2>
              <p className="text-sm text-gray-400 mt-0.5">投稿数の多い企業をピックアップ</p>
            </div>
            <Link href="/companies" className="text-sm text-blue-600 hover:underline font-medium">
              すべて見る →
            </Link>
          </div>
          <CompanyCarousel companies={topCompanies} />
        </section>
      )}

      {/* Bottom CTA */}
      <section className="my-10 border-t border-gray-100 pt-12 text-center">
        <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-3">Share Your Experience</p>
        <h2 className="text-2xl font-bold text-gray-900">あなたの体験が、誰かの決断を変える</h2>
        <p className="mt-2 mb-4 text-gray-500 max-w-md mx-auto">
          DevPayは、日本のエンジニアの競争力を高めることを目指しています。<br />
        </p>
        <p className="mb-8 text-sm text-gray-400 max-w-sm mx-auto">
          企業規模や業界を問わず、すべてのエンジニアの声を歓迎します。<br />
          スタートアップ、SIer、地方企業など、どんな環境でも投稿できます。
        </p>
        <Link
          href="/submit"
          className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition inline-block"
        >
          体験談を匿名でシェアする
        </Link>
      </section>
    </div>
  );
}
