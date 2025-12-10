"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProfile } from "@/lib/profile";
import { fetchInterviewers } from "@/lib/interviewer";
import { fetchInterviews } from "@/lib/interview";

export default function UserDashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [interviewers, setInterviewers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const me = await fetchProfile();
        if (me.role !== "user") {
          router.push("/dashboard/interviewer");
          return;
        }

        setProfile(me);

        const myBookings = await fetchInterviews();
        setBookings(myBookings);

        const list = await fetchInterviewers();
        setInterviewers(list);
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">ユーザーダッシュボード</h1>

      <h2 className="text-lg font-semibold">ようこそ、{profile.name} さん</h2>

      {/* プロフィール編集 */}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded mt-4"
        onClick={() => router.push("/user/profile/edit")}
      >
        プロフィール編集
      </button>

      {/* 予約一覧 */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold mb-2">あなたの予約一覧</h3>
        {bookings.length === 0 ? (
          <p>まだ予約はありません。</p>
        ) : (
          <ul className="space-y-2">
            {bookings.map((b) => (
              <li key={b.id} className="p-3 border rounded">
                <p><strong>面接官ID:</strong> {b.interviewer_id}</p>
                <p><strong>日時:</strong> {b.scheduled_at}</p>
                <p>状態: {b.status}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 面接官一覧 */}
      <section className="mt-10">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold mb-2">面接官一覧</h3>

          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => router.push("/interviewer/search")}
          >
            詳細検索
          </button>
        </div>

        {interviewers.map((i) => (
          <div
            key={i.id}
            className="p-4 border rounded mb-3 cursor-pointer hover:bg-gray-100"
            onClick={() => router.push(`/interviewer/${i.id}/booking`)}
          >
            <p><strong>{i.name}</strong></p>
            <p>スキル: {i.skill}</p>
            <p>時給: {i.hourly_rate}円</p>
          </div>
        ))}
      </section>
    </div>
  );
}
