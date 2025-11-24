"use client";

import { useState } from "react";
import Link from "next/link";
import { searchInterviewers } from "@/lib/search";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const onSearch = async () => {
    const list = await searchInterviewers(keyword);
    setResults(list);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">面接官を検索</h1>

      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="border p-2 w-full mt-4"
      />

      <button
        onClick={onSearch}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        検索
      </button>

      <div className="mt-6 space-y-4">
        {results.map((u) => (
          <Link key={u.id} href={`/profile/${u.id}`}>
            <div className="border p-4 rounded hover:bg-gray-100 cursor-pointer">
              <p className="font-bold">{u.name}</p>
              <p className="text-gray-600">{u.skills}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

