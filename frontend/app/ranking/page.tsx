import { api, Company } from "@/lib/api";

export const revalidate = 60;

interface RankingItem {
  company: Company;
  avg_salary: number;
  submission_count: number;
}

export default async function RankingPage() {
  let companies: Company[] = [];
  try {
    companies = await api.getCompanies();
  } catch {}

  const rankings: RankingItem[] = [];
  await Promise.all(
    companies.map(async (c) => {
      try {
        const stats = await api.getCompanyStats(c.id);
        if (stats.avg_salary && stats.submission_count > 0) {
          rankings.push({ company: c, avg_salary: stats.avg_salary, submission_count: stats.submission_count });
        }
      } catch {}
    })
  );
  rankings.sort((a, b) => b.avg_salary - a.avg_salary);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">年収ランキング</h1>
      <p className="text-gray-500 mb-6">投稿データが存在する企業のみ表示されます</p>
      {rankings.length === 0 ? (
        <div className="text-center text-gray-400 py-16">データがまだありません</div>
      ) : (
        <div className="space-y-3">
          {rankings.map((item, index) => (
            <a
              key={item.company.id}
              href={`/companies/${item.company.id}`}
              className="flex items-center bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
            >
              <span
                className={`text-2xl font-bold w-10 ${
                  index === 0
                    ? "text-yellow-500"
                    : index === 1
                    ? "text-gray-400"
                    : index === 2
                    ? "text-orange-400"
                    : "text-gray-300"
                }`}
              >
                {index + 1}
              </span>
              <div className="flex-1 ml-4">
                <p className="font-bold text-gray-900">{item.company.name}</p>
                <p className="text-sm text-gray-400">{item.company.industry}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-600">{item.avg_salary}万円</p>
                <p className="text-xs text-gray-400">{item.submission_count}件</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
