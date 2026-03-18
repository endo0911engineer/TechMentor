"use client";

import { useEffect, useState } from "react";
import { api, CompanyWithStats } from "@/lib/api";
import CompanyCard from "@/components/CompanyCard";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyWithStats[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.getCompaniesWithStats({ search: search || undefined });
        setCompanies(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">企業一覧</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="企業名で検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
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
