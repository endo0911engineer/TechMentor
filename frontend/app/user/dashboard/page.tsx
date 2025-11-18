"use client";

import { useEffect, useState } from "react";
import { fetchProfile } from "@/lib/user";
import { fetchInterviewers } from "@/lib/interviewer";
import { fetchMyBookings } from "@/lib/match";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [interviewers, setInterviewers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const me = await fetchProfile();
        setProfile(me);

        const myBookings = await fetchMyBookings();
        setBookings(myBookings);

        if (me.role === "user") {
          const list = await fetchInterviewers();
          setInterviewers(list);
        }
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
    <div style={{ padding: 24 }}>
      <h1>ダッシュボード</h1>

      <h2>ようこそ、{profile.name} さん</h2>
      <p>ロール: {profile.role}</p>

      {/* 共通: 予約一覧 */}
      <section style={{ marginTop: 40 }}>
        <h3>あなたの予約一覧</h3>

        {bookings.length === 0 ? (
          <p>まだ予約はありません。</p>
        ) : (
          <ul>
            {bookings.map((b) => (
              <li key={b.id}>
                面接官ID: {b.interviewer_id} / {b.scheduled_at}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ロール別 UI */}
      {profile.role === "user" ? (
        <section style={{ marginTop: 40 }}>
          <h3>面接官一覧</h3>
          {interviewers.map((i) => (
            <div key={i.id} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 8 }}>
              <p>名前: {i.name}</p>
              <p>スキル: {i.skill}</p>
              <p>時給: {i.hourly_rate}円</p>
            </div>
          ))}
        </section>
      ) : (
        <section style={{ marginTop: 40 }}>
          <h3>あなたに入っている予約</h3>
          {/* bookings は interviewer でも同じ */}
        </section>
      )}
    </div>
  );
}
