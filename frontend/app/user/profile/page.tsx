"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, createProfile } from "@/lib/profile";
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
    role: "" as "user" | "interviewer" | "",
    skills: [] as string[], 
    experience: "",
    targetLevel: "",
    englishLevel: "",
  });

  const skillOptions = ["Frontend", "Backend", "React", "Node.js", "Python", "AWS", "System Design"];

  const handleSkillToggle = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const buildPayload = () => ({
    experience_years: form.experience_years
      ? Number(form.experience_years)
      : undefined,
    target_level: form.target_level || undefined,
    english_level: form.english_level || undefined,
    skills: form.skills,
  });

  /* 途中保存 */
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      await updateProfile(buildPayload());
      alert("途中保存しました");
    } finally {
      setIsSaving(false);
    }
  };

  /* 完了 */ 
  const handleComplete = async () => {
    setIsSaving(true);
    try {
      await updateProfile(buildPayload());
      await completeProfile();
      router.push("/dashboard");
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
          <h1 className="text-lg font-semibold">初期プロフィール設定</h1>
          <div className="w-12"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 sm:p-12 backdrop-blur">
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 sm:p-12 backdrop-blur">
          <h2 className="text-2xl font-bold mb-2">基本情報を入力してください</h2>
          <p className="mb-6 text-slate-400">途中保存できます。あとで続きから再開できます。</p>
            {/* Role */}
            <div className="space-y-2">
              <Label>ロール *</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as any })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white h-11">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="user">ユーザー（面接を受けたい）</SelectItem>
                  <SelectItem value="interviewer">面接官（支援したい）</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Skills */}
            <div className="space-y-2">
              <Label>スキル *</Label>
              <div className="grid grid-cols-2 gap-2">
                {skillOptions.map((skill) => (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-3 py-2 rounded border transition-colors ${
                      form.skills.includes(skill)
                        ? "bg-cyan-500 border-cyan-400 text-white"
                        : "bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label>経験年数 *</Label>
              <Select value={form.experience} onValueChange={(v) => setForm({ ...form, experience: v })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white h-11">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {[0, 1, 3, 5, 7, 10].map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y === 0 ? "新卒" : `${y}年`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Target Level */}
            <div className="space-y-2">
              <Label>目標レベル *</Label>
              <Select value={form.targetLevel} onValueChange={(v) => setForm({ ...form, targetLevel: v })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white h-11">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="venture">メガベンチャー</SelectItem>
                  <SelectItem value="foreign-saas">外資SaaS</SelectItem>
                  <SelectItem value="bigtech">BigTech</SelectItem>
                  <SelectItem value="global">海外（US/EU）</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* English */}
            <div className="space-y-2">
              <Label>英語レベル *</Label>
              <Select value={form.englishLevel} onValueChange={(v) => setForm({ ...form, englishLevel: v })}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white h-11">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="jp">日本語のみ</SelectItem>
                  <SelectItem value="tech">技術的会話可能</SelectItem>
                  <SelectItem value="interview">英語面接対応可</SelectItem>
                  <SelectItem value="native">ネイティブ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              disabled={isSaving}
              onClick={handleSaveDraft}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              途中保存
            </Button>

            <Button
              type="button"
              disabled={isSaving}
              onClick={handleComplete}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              <Check className="h-4 w-4 mr-2" />
              完了
            </Button>
          </div>
      </div>
    </div>
  </div>
 )
}