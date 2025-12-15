"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProfile } from "@/lib/profile";
import { fetchInterviews } from "@/lib/interview";
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, CheckCircle, AlertCircle, UserCheck, History, Settings, ArrowRight } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                面接官ダッシュボード
              </h1>
              <p className="text-slate-400 text-sm mt-1">ようこそ、{profile?.name} さん（面接官）</p>
            </div>
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 px-4 py-2">
              面接官
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Button
            onClick={() => router.push("/interviewer/profile/edit")}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:shadow-lg hover:shadow-blue-500/50 h-14 text-base"
          >
            <Settings className="w-5 h-5 mr-2" />
            面接官プロフィール編集
          </Button>

          <Button
            onClick={() => router.push("/interviewer/history")}
            className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600 h-14 text-base"
          >
            <History className="w-5 h-5 mr-2" />
            面接履歴
          </Button>

          <Button
            onClick={() => router.push("/interviewer/schedules")}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:shadow-lg hover:shadow-indigo-500/50 h-14 text-base"
          >
            <Calendar className="w-5 h-5 mr-2" />
            面接可能日程の管理
          </Button>
        </div>

      {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Pending Requests */}
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/80 transition-colors">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">保留中の依頼</h3>
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{pending.length}</div>
              <p className="text-slate-500 text-sm">
                {pending.length === 0 ? "新しい依頼はありません" : "承認待ちの依頼"}
              </p>
            </div>
          </Card>

          {/* Confirmed Interviews */}
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/80 transition-colors">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">確定済みの面接</h3>
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{confirmed.length}</div>
              <p className="text-slate-500 text-sm">
                {confirmed.length === 0 ? "予定はありません" : "スケジュールされています"}
              </p>
            </div>
          </Card>

          {/* Total Bookings */}
          <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/80 transition-colors">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">合計予約数</h3>
                <UserCheck className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">{pending.length + confirmed.length}</div>
              <p className="text-slate-500 text-sm">全ての面接予約</p>
            </div>
          </Card>
        </div>

        {/* Pending Requests Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">保留中の面接依頼</h2>
            <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">{pending.length} 件</Badge>
          </div>

          {pending.length === 0 ? (
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <div className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
                <p className="text-slate-400 mb-2">現在、保留中の依頼はありません。</p>
                <p className="text-slate-500 text-sm">新しい依頼が入ると、こちらに表示されます。</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pending.map((b) => (
                <Card
                  key={b.id}
                  className="border-slate-700/50 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 backdrop-blur-sm hover:bg-slate-800/80 transition-all hover:border-yellow-500/30"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">候補者からの依頼</h3>
                        <p className="text-slate-400 text-sm">候補者ID: {b.user_id}</p>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">保留中</Badge>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">
                          <Clock className="w-3 h-3 inline mr-1" />
                          希望日時
                        </p>
                        <p className="text-white font-medium">{new Date(b.scheduled_at).toLocaleString("ja-JP")}</p>
                      </div>

                      {b.message && (
                        <div>
                          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">メッセージ</p>
                          <p className="text-slate-300 text-sm bg-slate-700/50 p-3 rounded-lg">{b.message}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 hover:shadow-lg hover:shadow-emerald-500/50"
                        onClick={() => router.push(`/interviewer/booking/${b.id}/confirm`)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        承認
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                        onClick={() => router.push(`/interviewer/booking/${b.id}/reject`)}
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        拒否
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Confirmed Interviews Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">確定済みの面接</h2>
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {confirmed.length} 件
            </Badge>
          </div>

          {confirmed.length === 0 ? (
            <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
              <div className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
                <p className="text-slate-400 mb-2">確定済みの予定はありません。</p>
                <p className="text-slate-500 text-sm">承認された面接がこちらに表示されます。</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {confirmed.map((b) => (
                <Card
                  key={b.id}
                  className="border-slate-700/50 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 backdrop-blur-sm hover:bg-slate-800/80 transition-all hover:border-emerald-500/30 group cursor-pointer"
                  onClick={() => router.push(`/interviewer/booking/${b.id}`)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">
                          面接 #{b.id}
                        </h3>
                        <p className="text-slate-400 text-sm">候補者ID: {b.user_id}</p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        確定済み
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          面接日時
                        </p>
                        <p className="text-white font-medium">{new Date(b.scheduled_at).toLocaleString("ja-JP")}</p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 group-hover:border-emerald-500/30 group-hover:text-emerald-300 bg-transparent"
                    >
                      詳細を見る
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
