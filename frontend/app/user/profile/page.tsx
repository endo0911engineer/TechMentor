"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProfile, createProfile } from "@/lib/profile";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MultiSelect, MultiSelectTrigger, MultiSelectValue, MultiSelectContent, MultiSelectItem} 
from "@/components/ui/multi-select";
import { ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    role: "" as "user" | "interviewer" | "",
    skills: [] as string[], 
    experience: "",
    targetLevel: "",
    englishLevel: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await createProfile(form);
        
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      router.push("/login");

    } finally {
        setIsSaving(false);
    }
  };

    return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5 text-slate-400" />
            <span className="text-slate-300">戻る</span>
          </Link>
          <h1 className="text-lg font-semibold text-white">初期プロフィール設定</h1>
          <div className="w-12"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 sm:p-12 backdrop-blur">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">まずは基本情報を教えてください</h2>
            <p className="mt-2 text-slate-400">
              2分で完了します。詳細な職務経歴は後で入力できます。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role */}
            <div className="space-y-2">
              <Label className="text-white font-semibold">ロール *</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as any })}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="user" className="text-white">ユーザー（面接を受けたい）</SelectItem>
              <SelectItem value="interviewer" className="text-white">面接官（支援したい）</SelectItem>
              </SelectContent>
              </Select>
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
              <Label className="text-white text-base font-semibold">スキル *</Label>
              <MultiSelect value={form.skills} onValueChange={(v) => setForm({ ...form, skills: v })}>
                <MultiSelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <MultiSelectValue placeholder="スキルを選択" />
                </MultiSelectTrigger>
                <MultiSelectContent className="bg-slate-800 border-slate-600">
                {["Frontend", "Backend", "React", "Node.js", "Python", "AWS", "System Design"].map((skill) => (
                  <MultiSelectItem key={skill} value={skill} className="text-white">
                    {skill}
                  </MultiSelectItem>
                ))}
                </MultiSelectContent>
              </MultiSelect>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label className="text-white font-semibold">経験年数 *</Label>
              <Select value={form.experience} onValueChange={(v) => setForm({ ...form, experience: v })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {[0, 1, 3, 5, 7, 10].map((y) => (
                  <SelectItem key={y} value={String(y)} className="text-white">
                    {y === 0 ? "新卒" : `${y}年`}
                  </SelectItem>
                ))}
              </SelectContent>
              </Select>
            </div>

            {/* Target Level */}
            <div className="space-y-2">
              <Label className="text-white font-semibold">目標レベル *</Label>
              <Select value={form.targetLevel} onValueChange={(v) => setForm({ ...form, targetLevel: v })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="venture" className="text-white">メガベンチャー</SelectItem>
                <SelectItem value="foreign-saas" className="text-white">外資SaaS</SelectItem>
                <SelectItem value="bigtech" className="text-white">BigTech</SelectItem>
                <SelectItem value="global" className="text-white">海外（US/EU）</SelectItem>
              </SelectContent>
              </Select>
            </div>

            {/* English */}
            <div className="space-y-2">
              <Label className="text-white font-semibold">英語レベル *</Label>
              <Select value={form.englishLevel} onValueChange={(v) => setForm({ ...form, englishLevel: v })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue placeholder="選択してください" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="jp" className="text-white">日本語のみ</SelectItem>
                <SelectItem value="tech" className="text-white">技術的な会話が可能</SelectItem>
              <SelectItem value="interview" className="text-white">英語面接対応可</SelectItem>
              <SelectItem value="native" className="text-white">ネイティブ</SelectItem>
              </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={isSaving} className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
              {isSaving ? "保存中..." : (<><Check className="mr-2 h-4 w-4" />保存して続ける</>)}
            </Button>
          </form>
      </div>
    </div>
  )
}