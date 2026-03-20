"use client";

import { useState } from "react";
import { SalarySubmission } from "@/lib/api";
import { SalaryCard } from "@/components/SubmissionCard";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 8;

export default function SalarySubmissionList({ submissions }: { submissions: SalarySubmission[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(submissions.length / PAGE_SIZE);
  const paged = submissions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
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
