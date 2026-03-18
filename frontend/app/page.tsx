import Link from "next/link";
import { api, Company } from "@/lib/api";
import CompanyCard from "@/components/CompanyCard";

export const revalidate = 60;

export default async function HomePage() {
  let companies: Company[] = [];
  try {
    companies = await api.getCompanies();
  } catch {}

  const featured = companies.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          日本のITエンジニア
          <br />
          <span className="text-blue-600">給与・面接データベース</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
          実際の体験談から、企業のリアルな年収・面接情報を知ろう
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/companies"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            企業を探す
          </Link>
          <Link
            href="/submit"
            className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
          >
            情報を投稿する
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-6 my-12">
        {[
          { label: "登録企業数", value: `${companies.length}社` },
          { label: "年収データ", value: "随時更新" },
          { label: "面接体験談", value: "随時更新" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Featured companies */}
      {featured.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">注目企業</h2>
            <Link href="/companies" className="text-sm text-blue-600 hover:underline">
              すべて見る →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {featured.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
