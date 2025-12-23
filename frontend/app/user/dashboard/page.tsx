"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { fetchProfile } from "@/lib/profile";
import { fetchInterviewers } from "@/lib/interviewer";
import { fetchInterviews } from "@/lib/interview";
import { logout } from "@/lib/auth";


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  }, [router]);

  const nextInterview = useMemo(() => {
    return bookings
      .filter((b:any) => b.status === "scheduled")
      .sort(
        (a:any, b:any) =>
          new Date(a.scheduled_at).getTime() -
          new Date(b.scheduled_at).getTime()
      )[0];
  }, [bookings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
            <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-zinc-800">
            ダッシュボード
          </h1>

          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar>
                <AvatarFallback>
                  {profile.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push("/user/profile/edit")}
              >
                プロフィール編集
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
              >
                ログアウト
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Welcome */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900">
            ようこそ、{profile.name} さん
          </h2>
          <p className="text-muted-foreground mt-1">
            面接の予約・確認ができます
          </p>
        </section>

        {/* Next Interview */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>次の面接</CardTitle>
            </CardHeader>
            <CardContent>
              {nextInterview ? (
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {format(
                        new Date(nextInterview.scheduled_at),
                        "yyyy/MM/dd HH:mm"
                      )}
                    </p>
                    <Badge variant="secondary">
                      {nextInterview.status}
                    </Badge>
                  </div>

                  {nextInterview.meet_url && (
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() =>
                        window.open(nextInterview.meet_url, "_blank")
                      }
                    >
                      面接に参加
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  まだ面接は予約されていません。
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Booking History */}
        <section>
          <h3 className="text-lg font-semibold mb-3">予約履歴</h3>

          {bookings.length === 0 ? (
            <p className="text-muted-foreground">
              予約履歴はまだありません。
            </p>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <Card key={b.id}>
                  <CardContent className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {format(
                          new Date(b.scheduled_at),
                          "yyyy/MM/dd HH:mm"
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        面接官ID: {b.interviewer_id}
                      </p>
                    </div>
                    <Badge>{b.status}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <Separator />

        {/* Interviewer Search */}
        <section className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">面接官を探す</h3>
            <p className="text-muted-foreground text-sm">
              条件に合う面接官を見つけて予約しましょう
            </p>
          </div>

          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => router.push("/interviewer/search")}
          >
            面接官を探す
          </Button>
        </section>
      </main>
    </div>
  );
}
