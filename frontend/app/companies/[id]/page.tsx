import { api } from "@/lib/api";
import SalaryStats from "@/components/SalaryStats";
import SalaryHistogram from "@/components/SalaryHistogram";
import { SalaryCard, InterviewCard } from "@/components/SubmissionCard";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

interface Props {
  params: { id: string };
}

export default async function CompanyDetailPage({ params }: Props) {
  const id = parseInt(params.id);

  let company, stats, salarySubmissions, interviewSubmissions;
  try {
    [company, stats, salarySubmissions, interviewSubmissions] = await Promise.all([
      api.getCompany(id),
      api.getCompanyStats(id),
      api.getSalarySubmissions(id),
      api.getInterviewSubmissions(id),
    ]);
  } catch {
    notFound();
  }

  const techStack = Array.from(
    new Set(
      salarySubmissions
        .flatMap((s) => (s.tech_stack ? s.tech_stack.split(",").map((t) => t.trim()) : []))
        .filter(Boolean)
    )
  );

  const salaries = salarySubmissions
    .map((s) => s.salary)
    .filter((v): v is number => typeof v === "number");

  return (
    <div>
      {/* Company header */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            {company.industry && (
              <span className="inline-block mt-2 text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {company.industry}
              </span>
            )}
          </div>
          <Link
            href={`/submit?company_id=${id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            情報を投稿
          </Link>
        </div>
        {techStack.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2">技術スタック</p>
            <div className="flex flex-wrap gap-2">
              {techStack.map((t) => (
                <span key={t} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Salary stats + histogram */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">年収データ</h2>
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <SalaryStats stats={stats} />
          {salaries.length > 0 &&
            stats.median_salary !== undefined &&
            stats.avg_salary !== undefined && (
              <SalaryHistogram
                salaries={salaries}
                median={stats.median_salary}
                avg={stats.avg_salary}
              />
            )}
        </div>
      </section>

      {/* Salary submissions */}
      {salarySubmissions.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            給与体験談 ({salarySubmissions.length}件)
          </h2>
          <div className="space-y-4">
            {salarySubmissions.map((s) => (
              <SalaryCard key={s.id} s={s} />
            ))}
          </div>
        </section>
      )}

      {/* Interview submissions */}
      {interviewSubmissions.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            面接体験談 ({interviewSubmissions.length}件)
          </h2>
          <div className="space-y-4">
            {interviewSubmissions.map((s) => (
              <InterviewCard key={s.id} s={s} companyId={id} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
