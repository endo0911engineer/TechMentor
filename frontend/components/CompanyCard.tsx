import Link from "next/link";
import { Company, CompanyStats } from "@/lib/api";

interface Props {
  company: Company;
  stats?: CompanyStats;
}

export default function CompanyCard({ company, stats }: Props) {
  const hasStats = stats && stats.submission_count > 0;

  return (
    <Link href={`/companies/${company.id}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer h-full">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">{company.name}</h3>
            {company.industry && (
              <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {company.industry}
              </span>
            )}
          </div>
          {hasStats && stats.avg_salary && (
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-400">平均年収</p>
              <p className="text-lg font-bold text-blue-600">
                {Math.round(stats.avg_salary)}万円
              </p>
            </div>
          )}
        </div>

        {company.tech_stack && (
          <div className="mt-3 flex flex-wrap gap-1">
            {company.tech_stack.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5).map((t) => (
              <span key={t} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
        )}

        {hasStats ? (
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-400">年収レンジ</p>
              <p className="text-sm font-semibold text-gray-700 mt-0.5">
                {stats.min_salary && stats.max_salary
                  ? `${stats.min_salary}〜${stats.max_salary}万`
                  : "—"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-400">中央値</p>
              <p className="text-sm font-semibold text-gray-700 mt-0.5">
                {stats.median_salary ? `${Math.round(stats.median_salary)}万` : "—"}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-400">投稿数</p>
              <p className="text-sm font-semibold text-gray-700 mt-0.5">
                {stats.submission_count}件
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-400">投稿データなし</p>
        )}
      </div>
    </Link>
  );
}
