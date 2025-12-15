"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMySchedules, createSchedule } from "@/lib/schedule";
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, Plus, Trash2, CheckCircle, AlertCircle } from "lucide-react"

export default function InterviewerSchedulesPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState([]);
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableTo, setAvailableTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("")

  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [success, setSuccess] = useState("")
  
  const timeSlots = [
    { label: "9:00-10:00", start: "09:00", end: "10:00" },
    { label: "10:00-11:00", start: "10:00", end: "11:00" },
    { label: "13:00-14:00", start: "13:00", end: "14:00" },
    { label: "14:00-15:00", start: "14:00", end: "15:00" },
    { label: "15:00-16:00", start: "15:00", end: "16:00" },
    { label: "16:00-17:00", start: "16:00", end: "17:00" },
  ]

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                面接可能日程の管理
              </h1>
              <p className="text-slate-400 text-sm mt-1">面接可能な日程を登録・管理します</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/interviewer/dashboard")}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            >
              ダッシュボードに戻る
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Schedule Form */}
          <div>
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-3">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">新しい日程を追加</h2>
                    <p className="text-slate-400 text-sm">面接可能な日時を登録します</p>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <CalendarIcon className="w-4 h-4 inline mr-2" />
                    日付
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Quick Time Slots */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    <Clock className="w-4 h-4 inline mr-2" />
                    クイック選択
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.label}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickTimeSelect(slot.start, slot.end)}
                        className={`border-slate-600 text-slate-300 hover:bg-slate-700 bg-slate-700/30 ${
                          startTime === slot.start && endTime === slot.end
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0"
                            : ""
                        }`}
                      >
                        {slot.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">開始時刻</label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">終了時刻</label>
                    <input
                      type="time"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* Error & Success Messages */}
                {error && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
                    <p className="text-emerald-300 text-sm">{success}</p>
                  </div>
                )}

                {/* Add Button */}
                <Button
                  onClick={handleAdd}
                  disabled={submitting || !selectedDate}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:shadow-lg hover:shadow-blue-500/50 h-12 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      追加中...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      日程を追加
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Registered Schedules List */}
          <div>
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-3">
                      <CalendarIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">登録済み日程</h2>
                      <p className="text-slate-400 text-sm">面接可能な時間帯一覧</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {schedules.length} 件
                  </Badge>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {schedules.length === 0 ? (
                    <div className="text-center py-12">
                      <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
                      <p className="text-slate-400 mb-2">まだ日程が登録されていません</p>
                      <p className="text-slate-500 text-sm">左側のフォームから日程を追加してください</p>
                    </div>
                  ) : (
                    schedules.map((schedule) => (
                      <Card
                        key={schedule.id}
                        className="border-slate-700/50 bg-gradient-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-sm hover:bg-slate-700/50 transition-all group"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <CalendarIcon className="w-4 h-4 text-cyan-400 mr-2" />
                                <span className="text-white font-medium">
                                  {new Date(schedule.available_from).toLocaleDateString("ja-JP", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    weekday: "short",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center text-slate-300">
                                <Clock className="w-4 h-4 text-blue-400 mr-2" />
                                <span className="text-sm">
                                  {new Date(schedule.available_from).toLocaleTimeString("ja-JP", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}{" "}
                                  〜{" "}
                                  {new Date(schedule.available_to).toLocaleTimeString("ja-JP", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(schedule.id)}
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
