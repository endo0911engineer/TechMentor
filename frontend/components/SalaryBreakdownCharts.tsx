"use client";

import { SalarySubmission } from "@/lib/api";

interface Props {
  submissions: SalarySubmission[];
}

const EXP_BUCKETS = [
  { label: "〜2年", min: 0, max: 2 },
  { label: "3〜5年", min: 3, max: 5 },
  { label: "6〜10年", min: 6, max: 10 },
  { label: "11年〜", min: 11, max: Infinity },
];

function avg(vals: number[]): number {
  if (vals.length === 0) return 0;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function HorizontalBar({ label, value, max, count }: { label: string; value: number; max: number; count: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-36 text-xs text-gray-600 text-right shrink-0 truncate">{label}</div>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
          <div
            className="h-full bg-blue-400 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-gray-700 w-16 shrink-0">
          {value}万
          <span className="text-gray-400 font-normal ml-1">({count}件)</span>
        </span>
      </div>
    </div>
  );
}

export default function SalaryBreakdownCharts({ submissions }: Props) {
  const withSalary = submissions.filter((s) => typeof s.salary === "number" && s.salary > 0);

  // 経験年数別
  const expData = EXP_BUCKETS.map((b) => {
    const vals = withSalary
      .filter((s) => s.years_of_experience != null && s.years_of_experience >= b.min && s.years_of_experience <= b.max)
      .map((s) => s.salary as number);
    return { label: b.label, avg: avg(vals), count: vals.length };
  }).filter((d) => d.count > 0);

  // 職種別
  const jobMap = new Map<string, number[]>();
  for (const s of withSalary) {
    if (!s.job_title) continue;
    const list = jobMap.get(s.job_title) ?? [];
    list.push(s.salary as number);
    jobMap.set(s.job_title, list);
  }
  const jobData = Array.from(jobMap.entries())
    .map(([title, vals]) => ({ label: title, avg: avg(vals), count: vals.length }))
    .sort((a, b) => b.avg - a.avg);

  if (expData.length === 0 && jobData.length === 0) return null;

  const expMax = Math.max(...expData.map((d) => d.avg), 1);
  const jobMax = Math.max(...jobData.map((d) => d.avg), 1);

  return (
    <div className="mt-8 space-y-8">
      {expData.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">経験年数別 平均年収</h3>
          <div className="space-y-3">
            {expData.map((d) => (
              <HorizontalBar key={d.label} label={d.label} value={d.avg} max={expMax} count={d.count} />
            ))}
          </div>
        </div>
      )}

      {jobData.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">職種別 平均年収</h3>
          <div className="space-y-3">
            {jobData.map((d) => (
              <HorizontalBar key={d.label} label={d.label} value={d.avg} max={jobMax} count={d.count} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
