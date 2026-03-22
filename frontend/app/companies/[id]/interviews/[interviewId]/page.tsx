import { api, InterviewContent } from "@/lib/api";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

interface Props {
  params: { id: string; interviewId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const company = await api.getCompany(parseInt(params.id));
    return {
      title: `${company.name}の面接体験談`,
      description: `${company.name}の面接体験談。面接回数・難易度・内容など実際の選考情報を掲載。`,
      robots: { index: true, follow: true },
    };
  } catch {
    return { title: "面接体験談", robots: { index: false, follow: false } };
  }
}

const CONTENT_LABELS: Record<string, string> = {
  coding: "コーディング試験",
  system_design: "システムデザイン",
  behavioral: "行動面接（Behavioral）",
  case: "ケース面接",
  english: "英語面接",
  other: "その他",
};

export default async function InterviewDetailPage({ params }: Props) {
  const companyId = parseInt(params.id);
  const interviewId = parseInt(params.interviewId);

  let company, submission;
  try {
    [company, submission] = await Promise.all([
      api.getCompany(companyId),
      api.getInterviewSubmission(interviewId),
    ]);
  } catch {
    notFound();
  }

  let content: InterviewContent | null = null;
  try {
    if (submission.interview_content) content = JSON.parse(submission.interview_content);
  } catch {}

  const checkedItems = content
    ? (Object.entries(content) as [keyof InterviewContent, InterviewContent[keyof InterviewContent]][]).filter(
        ([, v]) => v.checked
      )
    : [];

  const tags = submission.tags ? submission.tags.split(",").filter(Boolean) : [];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-5 flex items-center gap-1.5">
        <Link href="/companies" className="hover:text-gray-600">企業一覧</Link>
        <span>/</span>
        <Link href={`/companies/${companyId}`} className="hover:text-gray-600">{company.name}</Link>
        <span>/</span>
        <span className="text-gray-600">面接体験談</span>
      </nav>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-xs text-gray-400 mb-1">{company.name}</p>
            <h1 className="text-xl font-bold text-gray-900">{submission.job_title || "職種未記入"}</h1>
          </div>
          {submission.result && (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium shrink-0 ${
                submission.result === "合格"
                  ? "bg-green-100 text-green-700"
                  : submission.result === "不合格"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {submission.result}
            </span>
          )}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-3 mb-5 text-sm">
          {submission.interview_rounds && (
            <div className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-400">面接回数</p>
              <p className="font-semibold text-gray-800">{submission.interview_rounds}回</p>
            </div>
          )}
          {submission.difficulty && (
            <div className="bg-yellow-50 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-400">難易度</p>
              <p className="font-semibold text-yellow-700">{submission.difficulty}</p>
            </div>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {tags.map((tag) => (
              <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Interview content */}
        {checkedItems.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 border-b pb-2">面接内容</h2>
            {checkedItems.map(([key, val]) => (
              <div key={key} className="rounded-xl border border-gray-100 p-4">
                <p className="text-sm font-semibold text-gray-800 mb-2">
                  ✓ {CONTENT_LABELS[key] || key}
                </p>
                {val.comment ? (
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {val.comment}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">コメントなし</p>
                )}
              </div>
            ))}
          </div>
        )}

        {checkedItems.length === 0 && (
          <p className="text-sm text-gray-400">面接内容の詳細は記載されていません。</p>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
          <p className="text-xs text-gray-400">
            {new Date(submission.created_at).toLocaleDateString("ja-JP")}
          </p>
          <Link
            href={`/companies/${companyId}`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← 企業ページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
