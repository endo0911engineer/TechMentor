"use client";

import { useState } from "react";
import { SalarySubmission } from "@/lib/api";
import { SalaryCard } from "@/components/SubmissionCard";
import Pagination from "@/components/Pagination";
import { JOB_TITLES } from "@/lib/constants";

const PAGE_SIZE = 8;

const EXPERIENCE_RANGES = [
  { label: "3年未満", min: 0, max: 2 },
  { label: "3〜5年", min: 3, max: 5 },
  { label: "6〜10年", min: 6, max: 10 },
  { label: "11年以上", min: 11, max: Infinity },
] as const;

const selectClass = "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white";

export default function SalarySubmissionList({ submissions }: { submissions: SalarySubmission[] }) {
  const [page, setPage] = useState(1);
  const [jobTitle, setJobTitle] = useState("");
  const [expRange, setExpRange] = useState("");

  const jobTitlesInData = Array.from(new Set(submissions.map((s) => s.job_title).filter(Boolean))) as string[];

  const filtered = submissions.filter((s) => {
    if (jobTitle && s.job_title !== jobTitle) return false;
    if (expRange) {
      const range = EXPERIENCE_RANGES.find((r) => r.label === expRange);
      if (range && s.years_of_experience != null) {
        if (s.years_of_experience < range.min || s.years_of_experience > range.max) return false;
      }
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasFilter = jobTitle || expRange;

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-4">
        <select value={jobTitle} onChange={(e) => { setJobTitle(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">職種: すべて</option>
          {jobTitlesInData.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={expRange} onChange={(e) => { setExpRange(e.target.value); setPage(1); }} className={selectClass}>
          <option value="">経験年数: すべて</option>
          {EXPERIENCE_RANGES.map((r) => <option key={r.label} value={r.label}>{r.label}</option>)}
        </select>
        {hasFilter && (
          <button
            onClick={() => { setJobTitle(""); setExpRange(""); setPage(1); }}
            className="text-sm text-blue-600 hover:underline px-2"
          >
            クリア
          </button>
        )}
      </div>
      <p className="text-sm text-gray-400 mb-4">{filtered.length}件</p>
      <div className="space-y-4">
        {paged.map((s) => <SalaryCard key={s.id} s={s} />)}
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      />
    </>
  );
}
