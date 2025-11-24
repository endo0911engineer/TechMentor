"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProfile, updateProfile } from "../../../lib/profile";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    skill: "",
    experience: 0,
    job_type: "",
    role: "user" as "user" | "interviewer",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchProfile();
        setForm({
          name: data.name || "",
          skill: data.skill || "",
          experience: data.experience || 0,
          job_type: data.job_type || "",
          role: data.role,
        });
      } catch (error) {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
        await updateProfile(form);
        if (form.role === "interviewer") {
          router.push("interviewer/dashboard");
        } else {
          router.push("user/dashboard");
        }
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

    return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5 text-slate-400" />
            <span className="text-slate-300">戻る</span>
          </Link>
          <h1 className="text-lg font-semibold text-white">プロフィール編集</h1>
          <div className="w-12"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-2xl px-6 py-12 sm:py-20">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 sm:p-12 backdrop-blur">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
              <span>ステップ 1/1</span>
              <span>100%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"></div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">あなたのプロフィールを教えてください</h2>
            <p className="mt-2 text-slate-400">
              最適なメンターとマッチングするため、あなたのスキルと経験を教えてください。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-white text-base font-semibold">
                お名前 <span className="text-red-400">*</span>
              </Label>
              <Input
                placeholder="山田太郎"
                value={form.name}
                onChange={(e:any) => setForm({ ...form, name: e.target.value })}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 text-base h-11"
                required
              />
              <p className="text-xs text-slate-400">あなたのお名前を入力してください</p>
            </div>

            <div className="space-y-2">
              <Label className="text-white text-base font-semibold">ロール <span className="text-red-400">*</span></Label>
              <Select value={form.role} onValueChange={(value) => setForm({ ...form, role: value as "user" | "interviewer" })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white h-11">
                <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="user" className="text-white">ユーザー</SelectItem>
                  <SelectItem value="interviewer" className="text-white">面接官</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label className="text-white text-base font-semibold">
                スキル <span className="text-red-400">*</span>
              </Label>
              <Input
                placeholder="Python, React, AWS"
                value={form.skill}
                onChange={(e:any) => setForm({ ...form, skill: e.target.value })}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 text-base h-11"
                required
              />
              <p className="text-xs text-slate-400">取得しているスキルをカンマ区切りで入力してください</p>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label className="text-white text-base font-semibold">
                経験年数 <span className="text-red-400">*</span>
              </Label>
              <Select value={String(form.experience)} onValueChange={(value) => setForm({ ...form, experience: Number(value) })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white h-11">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {[0, 1, 2, 3, 5, 7, 10, 15, 20].map((year) => (
                    <SelectItem key={year} value={String(year)} className="text-white">
                      {year === 0 ? '新卒' : `${year}年`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-400">エンジニアとしてのキャリアを選択してください</p>
            </div>

            {/* Job Type */}
            <div className="space-y-2">
              <Label className="text-white text-base font-semibold">
                希望職種 <span className="text-red-400">*</span>
              </Label>
              <Select value={form.job_type} onValueChange={(value) => setForm({ ...form, job_type: value })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white h-11">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="frontend" className="text-white">Frontend Engineer</SelectItem>
                  <SelectItem value="backend" className="text-white">Backend Engineer</SelectItem>
                  <SelectItem value="fullstack" className="text-white">Full-stack Engineer</SelectItem>
                  <SelectItem value="devops" className="text-white">DevOps Engineer</SelectItem>
                  <SelectItem value="machine-learning" className="text-white">Machine Learning Engineer</SelectItem>
                  <SelectItem value="data" className="text-white">Data Engineer</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-400">あなたが目指す職種を選択してください</p>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold transition-all"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin inline-block mr-2">⏳</span>
                    保存中...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    プロフィールを保存
                  </>
                )}
              </Button>
              <p className="mt-4 text-center text-sm text-slate-400">
                このステップは後でいつでも編集できます
              </p>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-8 rounded-lg bg-blue-500/10 border border-blue-500/30 p-4">
            <p className="text-sm text-blue-200">
              💡 ヒント: 詳しくプロフィールを記入するほど、より正確にメンターがマッチングされます。
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3 text-center">
          <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700/50">
            <div className="text-2xl font-bold text-cyan-400">100%</div>
            <p className="mt-2 text-sm text-slate-400">プライバシー保護</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700/50">
            <div className="text-2xl font-bold text-cyan-400">無料</div>
            <p className="mt-2 text-sm text-slate-400">登録・初期利用</p>
          </div>
          <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700/50">
            <div className="text-2xl font-bold text-cyan-400">2分</div>
            <p className="mt-2 text-sm text-slate-400">登録完了時間</p>
          </div>
        </div>
      </div>
    </div>
  )
}