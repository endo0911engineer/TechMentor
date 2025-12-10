"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProfile } from "@/lib/profile";
import { fetchInterviews } from "@/lib/interview";

export default function InterviewerDashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const me = await fetchProfile();

        if (me.role !== "interviewer") {
          router.push("/user/dashboard");
          return;
        }

        setProfile(me);

        const list = await fetchInterviews();
        setBookings(list);
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div>Loading...</div>;

  const pending = bookings.filter(b => b.status === "pending");
  const confirmed = bookings.filter(b => b.status === "confirmed");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">面接官ダッシュボード</h1>

      <h2 className="text-lg font-semibold mt-4">
        {profile.name} さん（面接官）
      </h2>

      {/* プロフィール編集 */}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded mt-4"
        onClick={() => router.push("/interviewer/profile/edit")}
      >
        面接官プロフィール編集
      </button>

      {/* 履歴ページ */}
      <button
        className="px-4 py-2 bg-gray-600 text-white rounded mt-4 ml-4"
        onClick={() => router.push("/interviewer/history")}
      >
        面接履歴
      </button>

      {/* ---- 面接依頼 Pending ---- */}
      <section className="mt-10">
        <h3 className="text-xl font-semibold">保留中の面接依頼</h3>
        {pending.length === 0 ? (
          <p className="mt-2">現在、保留中の依頼はありません。</p>
        ) : (
          <ul className="mt-2 space-y-3">
            {pending.map(b => (
              <li key={b.id} className="p-4 border rounded bg-yellow-50">
                <p><strong>候補者ID:</strong> {b.user_id}</p>
                <p><strong>日時:</strong> {b.scheduled_at}</p>
                <p><strong>メッセージ:</strong> {b.message}</p>
                <div className="mt-3 flex gap-3">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded"
                    onClick={() => router.push(`/interviewer/booking/${b.id}/confirm`)}
                  >
                    承認
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded"
                    onClick={() => router.push(`../interviewer/booking/${b.id}/reject`)}
                  >
                    拒否
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ---- Confirmed ---- */}
      <section className="mt-10">
        <h3 className="text-xl font-semibold">確定済みの面接</h3>
        {confirmed.length === 0 ? (
          <p className="mt-2">確定済みの予定はありません。</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {confirmed.map(b => (
              <li key={b.id} className="p-4 border rounded bg-green-50">
                <p><strong>候補者ID:</strong> {b.user_id}</p>
                <p><strong>日時:</strong> {b.scheduled_at}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
