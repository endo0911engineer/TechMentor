"use client";

import { useState } from "react";
import { InterviewSubmission } from "@/lib/api";
import { InterviewCard } from "@/components/SubmissionCard";
import Pagination from "@/components/Pagination";
import { DIFFICULTY_OPTIONS, RESULT_OPTIONS, EMPLOYMENT_TYPE_OPTIONS } from "@/lib/constants";

const PAGE_SIZE = 8;

const selectClass = "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white";

export default function InterviewSubmissionList({
  submissions,
  companyId,
}: {
  submissions: InterviewSubmission[];
  companyId: number;
}) {
  const [page, setPage] = useState(1);
  const [employmentType, setEmploymentType] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [result, setResult] = useState("");

  const jobTitlesInData = Array.from(new Set(submissions.map((s) => s.job_title).filter(Boolean))) as string[];

  const filtered = submissions.filter((s) => {
    if (employmentType && s.employment_type !== employmentType) return false;
    if (jobTitle && s.job_title !== jobTitle) return false;
    if (difficulty && s.difficulty !== difficulty) return false;
    if (result && s.result !== result) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasFilter = employmentType || jobTitle || difficulty || result;

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-4">
        <select value={employmentType} onChange={(e) => { setEmploymentType(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">雇用形態: すべて</option>
          {EMPLOYMENT_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        {jobTitlesInData.length > 0 && (
          <select value={jobTitle} onChange={(e) => { setJobTitle(e.target.value); setPage(1); }} className={selectClass}>
            <option value="">職種: すべて</option>
            {jobTitlesInData.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        )}
        <select value={difficulty} onChange={(e) => { setDifficulty(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">難易度: すべて</option>
          {DIFFICULTY_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={result} onChange={(e) => { setResult(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">結果: すべて</option>
          {RESULT_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        {hasFilter && (
          <button
            onClick={() => { setEmploymentType(""); setJobTitle(""); setDifficulty(""); setResult(""); setPage(1); }}
            className="text-sm text-blue-600 hover:underline px-2"
          >
            クリア
          </button>
        )}
      </div>
      <p className="text-sm text-gray-400 mb-4">{filtered.length}件</p>
      <div className="space-y-4">
        {paged.map((s) => <InterviewCard key={s.id} s={s} companyId={companyId} />)}
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      />
    </>
  );
}
