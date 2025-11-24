// frontend/app/user/interview/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchInterviews} from "@/lib/interview";

export default async function InterviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [interview, setInterview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchInterviews(params.id);
        setInterview(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!interview) return <div>面接情報が見つかりません。</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">面接詳細</h1>

      <div className="border p-4 mt-4 rounded">
        <p>面接官：{interview.interviewer.name}</p>
        <p>日時：{interview.scheduled_at}</p>
        <p>ステータス：{interview.status}</p>
        <p>金額：{interview.payment?.amount || 0}円</p>

        {interview.payment?.status === "pending" && (
          <button
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => router.push(`/user/interview/${params.id}/payment`)}
          >
            支払いへ
          </button>
        )}
        {interview.payment?.status === "paid" && (
          <p className="mt-2 text-green-600 font-bold">支払い済み</p>
        )}
      </div>
    </div>
  );
}
