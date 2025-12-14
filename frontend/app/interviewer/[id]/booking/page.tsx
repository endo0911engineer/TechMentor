"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchInterviewer } from "@/lib/interviewer";
import { createInterview } from "@/lib/interview";
import { fetchInterviewerSchedules } from "@/lib/schedule";

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const interviewerId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [interviewer, setInterviewer] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const interviewerData = await fetchInterviewer(interviewerId);
        const scheduleData = await fetchInterviewerSchedules(interviewerId);
        
        setInterviewer(interviewerData);
        setSchedules(scheduleData);
      } catch (err) {
        setError("面接官情報の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [interviewerId]);

  const handleSubmit = async () => {
    try {
      await createInterview({
        schedule_id: selectedScheduleId,
      });

      router.push("/user/dashboard");
    } catch (e) {
        console.error(e);
        setError("予約に失敗しました");
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6">読み込み中...</p>;
  if (!interviewer) return <p className="p-6">面接官が見つかりません</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">面接予約</h1>

      <div className="border rounded p-4 mb-6">
        <p className="font-semibold">{interviewer.name}</p>
        <p>スキル: {interviewer.skill}</p>
        <p>時給: {interviewer.hourly_rate}円</p>
      </div>

      <h3 className="text-lg font-semibold mb-2">予約可能な時間</h3>

    { schedules.length === 0 ? (
    <p>現在予約可能な時間はありません。</p>
    ) : (
    <ul className="space-y-2">
        {schedules.map((s) => (
        <li
            key={s.id}
            className={`p-3 border rounded cursor-pointer ${
            selectedScheduleId === s.id
                ? "bg-blue-100 border-blue-500"
                : "hover:bg-gray-100"
            }`}
            onClick={() => setSelectedScheduleId(s.id)}
        >
            {new Date(s.start_at).toLocaleString()} 〜
            {new Date(s.end_at).toLocaleString()}
        </li>
        ))}
    </ul>
    )}

    {error && <p className="text-red-600 mb-3">{error}</p>}

    <button
    className="w-full bg-blue-600 text-white py-2 rounded"
    onClick={handleSubmit}
    disabled={!selectedScheduleId || submitting}
    >
        予約する
    </button>
    </div>
  );
}
