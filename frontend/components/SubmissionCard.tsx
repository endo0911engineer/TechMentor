import { SalarySubmission, InterviewSubmission, InterviewContent } from "@/lib/api";
import Link from "next/link";

export function SalaryCard({ s }: { s: SalarySubmission }) {
  const techStack = s.tech_stack ? s.tech_stack.split(",").filter(Boolean) : [];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      {/* 職種 + 年収 */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="font-semibold text-gray-900">{s.job_title || "職種未記入"}</p>
          {s.years_of_experience !== undefined && (
            <p className="text-sm text-gray-500 mt-0.5">経験 {s.years_of_experience}年</p>
          )}
        </div>
        {s.salary && (
          <p className="text-xl font-bold text-blue-600 shrink-0">{s.salary.toLocaleString()}万円</p>
        )}
      </div>

      {/* 詳細グリッド */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
        {s.salary_breakdown && (
          <div className="col-span-2">
            <span className="text-xs text-gray-400 mr-1">年収内訳</span>
            <span className="text-gray-700">{s.salary_breakdown}</span>
          </div>
        )}
        {s.location && (
          <div>
            <span className="text-xs text-gray-400 mr-1">勤務地</span>
            <span className="text-gray-700">{s.location}</span>
          </div>
        )}
        {s.remote_type && (
          <div>
            <span className="text-xs text-gray-400 mr-1">リモート</span>
            <span className="text-gray-700">{s.remote_type}</span>
          </div>
        )}
        {s.overtime_feeling && (
          <div className="col-span-2">
            <span className="text-xs text-gray-400 mr-1">残業</span>
            <span className="text-gray-700">{s.overtime_feeling}</span>
          </div>
        )}
      </div>

      {/* 技術スタック */}
      {techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {techStack.map((tech) => (
            <span key={tech} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* コメント */}
      {s.comment && (
        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed">
          {s.comment}
        </p>
      )}
    </div>
  );
}

const CONTENT_LABELS: Record<string, string> = {
  coding: "コーディング試験",
  system_design: "システムデザイン",
  behavioral: "行動面接（Behavioral）",
  case: "ケース面接",
  english: "英語面接",
  other: "その他",
};

const COMMENT_TRUNCATE_LENGTH = 120;

export function InterviewCard({
  s,
  companyId,
}: {
  s: InterviewSubmission;
  companyId: number;
}) {
  let content: InterviewContent | null = null;
  try {
    if (s.interview_content) content = JSON.parse(s.interview_content);
  } catch {}

  const checkedItems = content
    ? (Object.entries(content) as [keyof InterviewContent, InterviewContent[keyof InterviewContent]][]).filter(
        ([, v]) => v.checked
      )
    : [];

  const hasLongComment = checkedItems.some(
    ([, v]) => v.comment && v.comment.length > COMMENT_TRUNCATE_LENGTH
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      {/* ヘッダー */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="font-semibold text-gray-900">{s.job_title || "職種未記入"}</p>
        <div className="flex items-center gap-2 shrink-0">
          {s.interview_rounds && (
            <span className="text-sm text-gray-500">面接 {s.interview_rounds}回</span>
          )}
          {s.result && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                s.result === "合格"
                  ? "bg-green-100 text-green-700"
                  : s.result === "不合格"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {s.result}
            </span>
          )}
        </div>
      </div>

      {/* 難易度 */}
      {s.difficulty && (
        <span className="inline-block text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full mb-3">
          難易度: {s.difficulty}
        </span>
      )}

      {/* 面接内容（切り詰め） */}
      {checkedItems.length > 0 && (
        <div className="space-y-2">
          {checkedItems.map(([key, val]) => (
            <div key={key}>
              <span className="text-xs font-medium text-gray-700">
                ✓ {CONTENT_LABELS[key] || key}
              </span>
              {val.comment && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2 mt-1">
                  {val.comment.length > COMMENT_TRUNCATE_LENGTH
                    ? val.comment.slice(0, COMMENT_TRUNCATE_LENGTH) + "…"
                    : val.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 詳細リンク */}
      {hasLongComment && (
        <div className="mt-3 text-right">
          <Link
            href={`/companies/${companyId}/interviews/${s.id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            続きを読む →
          </Link>
        </div>
      )}
    </div>
  );
}
