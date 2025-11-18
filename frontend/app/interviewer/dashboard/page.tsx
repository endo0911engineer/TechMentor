"use client";

import { useEffect, useState } from "react";
import { fetchProfile, Profile } from "@/lib/user";
import { getMyInterviews, Interview } from "@/lib/interview";

export default function InterviewerDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [p, ivs] = await Promise.all([getMyProfile(), getMyInterviews()]);
        setProfile(p);
        setInterviews(ivs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>プロフィールが見つかりません</div>;

  return (
    <div className="min-h-screen p-6 bg-slate-900 text-white">
      <h1 className="text-3xl font-bold mb-6">面接官ダッシュボード</h1>

      {/* 基本プロフィール */}
      <section className="mb-8 p-6 bg-slate-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">基本情報</h2>
        <p><strong>名前:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>スキル:</strong> {profile.skill ?? "未設定"}</p>
        <p><strong>経験年数:</strong> {profile.experience ?? "未設定"}</p>
        <p><strong>希望職種:</strong> {profile.job_type ?? "未設定"}</p>
        <p><strong>時給:</strong> {profile.hourly_rate ?? "未設定"} 円</p>
      </section>

      <section className="mb-8 p-6 bg-slate-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">マッチング状況（面接依頼）</h2>
        {interviews.length === 0 ? (
            <p>まだ依頼はありません</p>
        ) : (
        <ul>
            {interviews.map(iv => (
                <li key={iv.id} className="mb-2 p-2 bg-slate-700 rounded">
                    <p><strong>候補者:</strong> {iv.candidate_name}</p>
                    <p><strong>日時:</strong> {new Date(iv.scheduled_at).toLocaleString()}</p>
                    <p><strong>ステータス:</strong> {iv.status}</p>
                    {iv.message && <p><strong>メッセージ:</strong> {iv.message}</p>}
                    {iv.status === "pending" && (
                        <div className="mt-2">
                            <button className="mr-2 px-3 py-1 bg-green-500 rounded">承認</button>
                            <button className="px-3 py-1 bg-red-500 rounded">拒否</button>
                        </div>
                    )}
                </li>
          ))}
        </ul>
        )}
      </section>

      {/* 面接スケジュール */}
      <section className="mb-8 p-6 bg-slate-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">面接スケジュール</h2>
        {interviews.length === 0 ? (
          <p>まだ面接はありません</p>
        ) : (
          <ul>
            {interviews.map(iv => (
              <li key={iv.id}>
                {iv.candidate_name} - {new Date(iv.scheduled_at).toLocaleString()} - {iv.status}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
