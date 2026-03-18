import { CompanyStats } from "@/lib/api";

interface Props {
  stats: CompanyStats;
}

export default function SalaryStats({ stats }: Props) {
  if (stats.submission_count === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-400">
        まだ給与データがありません
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 rounded-xl p-4 text-center">
        <p className="text-xs text-gray-500 mb-1">平均年収</p>
        <p className="text-2xl font-bold text-blue-700">{stats.avg_salary}万円</p>
      </div>
      <div className="bg-green-50 rounded-xl p-4 text-center">
        <p className="text-xs text-gray-500 mb-1">中央値</p>
        <p className="text-2xl font-bold text-green-700">{stats.median_salary}万円</p>
      </div>
      <div className="bg-orange-50 rounded-xl p-4 text-center">
        <p className="text-xs text-gray-500 mb-1">最低〜最高</p>
        <p className="text-lg font-bold text-orange-700">
          {stats.min_salary}〜{stats.max_salary}万円
        </p>
      </div>
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-xs text-gray-500 mb-1">投稿数</p>
        <p className="text-2xl font-bold text-gray-700">{stats.submission_count}件</p>
      </div>
    </div>
  );
}
