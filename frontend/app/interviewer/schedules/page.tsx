"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMySchedules, createSchedule } from "@/lib/schedule";


export default function InterviewerSchedulesPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState([]);
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function loadSchedules() {
    const data = await fetchMySchedules();
    setSchedules(data);
  }

  useEffect(() => {
    loadSchedules().finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!availableFrom || !availableTo) {
      setError("開始・終了日時を入力してください");
      return;
    }

    if (new Date(availableFrom) >= new Date(availableTo)) {
      setError("終了日時は開始日時より後にしてください");
      return;
    }

    try {
        setSubmitting(true);
        await createSchedule({
            available_from: availableFrom,
            available_to: availableTo,
        });
        setAvailableFrom("");
        setAvailableTo("");
        setError("");
        await loadSchedules(); // 再取得
    } catch {
        setError("日程の追加に失敗しました");
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6">読み込み中...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">面接可能日程の管理</h1>

      {/* -------- 新規追加フォーム -------- */}
      <div className="mt-6 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-3">新しい日程を追加</h2>

        <label className="block mb-2">
            開始日時
            <input
            type="datetime-local"
            className="border p-2 w-full rounded"
            value={availableFrom}
            onChange={(e) => setAvailableFrom(e.target.value)}
            />
        </label>

        <label className="block mb-2">
          終了日時
          <input
          type="datetime-local"
          className="border p-2 w-full rounded"
          value={availableTo}
          onChange={(e) => setAvailableTo(e.target.value)}
          />
        </label>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleAdd}
        disabled={submitting}
        >
            {submitting ? "追加中..." : "追加"}
        </button>
      </div>

      {/* -------- 一覧 -------- */}
      <h2 className="text-lg font-semibold mt-8">登録済み日程</h2>

      {schedules.length === 0 ? (
        <p className="mt-2">まだ日程は登録されていません。</p>
      ) : (
      <ul className="mt-4 space-y-3">
        {schedules.map((s) => (
            <li key={s.id} className="p-3 border rounded">
            {new Date(s.available_from).toLocaleString()} 〜{" "}
            {new Date(s.available_to).toLocaleString()}
            </li>
        ))}
        </ul>
     )}
    </div>
  );
}
