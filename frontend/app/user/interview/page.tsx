"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchInterviewers } from "@/lib/interviewer";
import { createInterviewRequest, CreateInterviewPayload } from "@/lib/api/interview";

export default function BookingPage() {
  const router = useRouter();
  const [interviewers, setInterviewers] = useState<any[]>([]);
  const [selectedInterviewer, setSelectedInterviewer] = useState<number | null>(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const list = await fetchInterviewers();
        setInterviewers(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async () => {
    if (!selectedInterviewer || !scheduledAt) {
      alert("面接官と日時を選択してください");
      return;
    }

    const payload: CreateInterviewPayload = {
      interviewer_id: selectedInterviewer,
      scheduled_at: scheduledAt,
    };

    setSaving(true);
    try {
      await createInterviewRequest(payload);
      alert("予約が作成されました");
      router.push("/dashboard"); // ダッシュボードに戻す
    } catch (err: any) {
      console.error(err);
      alert("予約に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>面接予約</h1>

      <div style={{ marginBottom: 16 }}>
        <label>面接官を選択</label>
        <select
          value={selectedInterviewer ?? ""}
          onChange={(e) => setSelectedInterviewer(Number(e.target.value))}
        >
          <option value="">選択してください</option>
          {interviewers.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name} ({i.skill})
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>日時を選択</label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {saving ? "予約中..." : "予約する"}
      </button>
    </div>
  );
}
