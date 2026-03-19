"use client";

import { useEffect, useState } from "react";
import { api, CompanyWithStats } from "@/lib/api";
import CompanyCard from "@/components/CompanyCard";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [techStack, setTechStack] = useState("");
  const [industries, setIndustries] = useState<string[]>([]);
  const [techStacks, setTechStacks] = useState<string[]>([]);

  useEffect(() => {
    api.getIndustries().then((data) => setIndustries(data.map((d) => d.name))).catch(() => {});
    api.getTechStacks().then(setTechStacks).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getCompaniesWithStats({
      search: search || undefined,
      industry: industry || undefined,
      tech_stack: techStack || undefined,
    })
      .then(setCompanies)
      .finally(() => setLoading(false));
  }, [search, industry, techStack]);

  const hasFilter = search || industry || techStack;
  const selectClass = "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">企業一覧</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="企業名で検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
        />
        <select value={industry} onChange={(e) => setIndustry(e.target.value)} className={selectClass}>
          <option value="">業種: すべて</option>
          {industries.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <select value={techStack} onChange={(e) => setTechStack(e.target.value)} className={selectClass}>
          <option value="">技術スタック: すべて</option>
          {techStacks.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {hasFilter && (
          <button
            onClick={() => { setSearch(""); setIndustry(""); setTechStack(""); }}
            className="text-sm text-blue-600 hover:underline px-2"
          >
            クリア
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-16">読み込み中...</div>
      ) : companies.length === 0 ? (
        <div className="text-center text-gray-400 py-16">企業が見つかりませんでした</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {companies.map((c) => (
            <CompanyCard key={c.id} company={c} stats={c.stats} />
          ))}
        </div>
      )}
    </div>
  );
}
