"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, InterviewSubmission, InterviewContent } from "@/lib/api";
import { DIFFICULTY_OPTIONS, RESULT_OPTIONS, EMPLOYMENT_TYPE_OPTIONS, JOB_TITLES } from "@/lib/constants";
import Pagination from "@/components/Pagination";

type InterviewWithCompany = InterviewSubmission & { company_name: string };

const CONTENT_LABELS: Record<string, string> = {
  coding: "コーディング",
  system_design: "システムデザイン",
  behavioral: "行動面接",
  case: "ケース面接",
  english: "英語面接",
  other: "その他",
};

const PAGE_SIZE = 10;

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<InterviewWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("");
  const [result, setResult] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.getAllInterviews()
      .then(setInterviews)
      .finally(() => setLoading(false));
  }, []);

  const filtered = interviews.filter((s) => {
    if (difficulty && s.difficulty !== difficulty) return false;
    if (result && s.result !== result) return false;
    if (employmentType && s.employment_type !== employmentType) return false;
    if (jobTitle && s.job_title !== jobTitle) return false;
    return true;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectClass = "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">面接体験談</h1>
        <p className="text-sm text-gray-400 mt-1">実際の選考を経験したエンジニアによるリアルな体験談</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={employmentType} onChange={(e) => { setEmploymentType(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">雇用形態: すべて</option>
          {EMPLOYMENT_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={jobTitle} onChange={(e) => { setJobTitle(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">職種: すべて</option>
          {JOB_TITLES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={difficulty} onChange={(e) => { setDifficulty(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">難易度: すべて</option>
          {DIFFICULTY_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={result} onChange={(e) => { setResult(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">結果: すべて</option>
          {RESULT_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        {(difficulty || result || employmentType || jobTitle) && (
          <button
            onClick={() => { setDifficulty(""); setResult(""); setEmploymentType(""); setJobTitle(""); setPage(1); }}
            className="text-sm text-blue-600 hover:underline px-2"
          >
            クリア
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-16">読み込み中...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-400 py-16">体験談が見つかりませんでした</div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4">{filtered.length}件</p>
          <div className="space-y-4">
          {paged.map((s) => {
            let content: InterviewContent | null = null;
            try {
              if (s.interview_content) content = JSON.parse(s.interview_content);
            } catch {}

            const checkedItems = content
              ? Object.entries(content).filter(([, v]) => (v as { checked: boolean }).checked)
              : [];

            const hasLongComment = checkedItems.some(
              ([, v]) => (v as { comment?: string }).comment && (v as { comment?: string }).comment!.length > 120
            );

            return (
              <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <Link
                      href={`/companies/${s.company_id}`}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      {s.company_name}
                    </Link>
                    <p className="font-semibold text-gray-900 mt-0.5">{s.job_title || "職種未記入"}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {s.interview_rounds && (
                      <span className="text-sm text-gray-500">{s.interview_rounds}回面接</span>
                    )}
                    {s.result && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.result === "合格" ? "bg-green-100 text-green-700"
                        : s.result === "不合格" ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                      }`}>
                        {s.result}
                      </span>
                    )}
                  </div>
                </div>

                {/* 雇用形態・難易度 */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {s.employment_type && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      {s.employment_type}
                    </span>
                  )}
                  {s.difficulty && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                      難易度: {s.difficulty}
                    </span>
                  )}
                </div>

                {/* Content items */}
                {checkedItems.length > 0 && (
                  <div className="space-y-2">
                    {checkedItems.map(([key, val]) => {
                      const v = val as { checked: boolean; comment?: string };
                      return (
                        <div key={key}>
                          <span className="text-xs font-medium text-gray-700">
                            ✓ {CONTENT_LABELS[key] || key}
                          </span>
                          {v.comment && (
                            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2 mt-1">
                              {v.comment.length > 120 ? v.comment.slice(0, 120) + "…" : v.comment}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    {new Date(s.created_at).toLocaleDateString("ja-JP")}
                  </p>
                  {hasLongComment && (
                    <Link
                      href={`/companies/${s.company_id}/interviews/${s.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      続きを読む →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        </>
      )}
    </div>
  );
}
