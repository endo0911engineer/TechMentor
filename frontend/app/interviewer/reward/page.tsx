// frontend/app/interviewer/reward/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchRewards } from "@/lib/reward";

export default function RewardPage() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchRewards();
        setRewards(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">報酬一覧</h1>

      {rewards.length === 0 ? (
        <p>報酬はありません。</p>
      ) : (
        <table className="mt-4 w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">面接ID</th>
              <th className="border px-4 py-2">金額</th>
              <th className="border px-4 py-2">ステータス</th>
              <th className="border px-4 py-2">作成日</th>
            </tr>
          </thead>
          <tbody>
            {rewards.map((r) => (
              <tr key={r.id}>
                <td className="border px-4 py-2">{r.interview_id}</td>
                <td className="border px-4 py-2">{r.amount}円</td>
                <td className="border px-4 py-2">{r.status}</td>
                <td className="border px-4 py-2">{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
