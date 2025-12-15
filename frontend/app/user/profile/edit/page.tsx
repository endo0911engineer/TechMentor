"use client";

import { useEffect, useState } from "react";
import { fetchMe } from "@/lib/user";
import { updateProfile } from "@/lib/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";

export default function ProfileEditPage() {
  const [profile, setProfile] = useState({
    name: "",
    headline: "",
    summary: "",
    experiences: [] as any[],
    skills: [] as { name: string; level: string }[],
    interviewWeaknesses: [] as string[],
    projects: [] as any[],
    targetCompanies: "",
    englishDetail: "",
    certifications: "",
    github: "",
  });

  useEffect(() => {
    fetchMe().then((data) => setProfile((p) => ({ ...p, ...data })));
  }, []);

  const addExperience = () => {
    setProfile({
      ...profile,
      experiences: [
        ...profile.experiences,
        {
          company: "",
          role: "",
          start: "",
          end: "",
          description: "",
          stack: "",
        },
      ],
    });
    };
  
  const updateExperience = (i: number, key: string, value: string) => {
    const next = [...profile.experiences];
    next[i][key] = value;
    setProfile({ ...profile, experiences: next });
  };

  const removeExperience = (i: number) => {
    setProfile({
      ...profile,
      experiences: profile.experiences.filter((_, idx) => idx !== i),
    });
  };

  const onSave = async () => {
    await updateProfile(profile);
    alert("プロフィールを更新しました");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">プロフィール編集</h1>

      {/* 基本 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">基本情報</h2>
        <Input placeholder="名前" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        <Input placeholder="見出し（例: Backend Engineer | 5y | AWS）" value={profile.headline} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} />
        <Textarea placeholder="サマリー" value={profile.summary} onChange={(e) => setProfile({ ...profile, summary: e.target.value })} />
      </section>

      {/* 職務経歴 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">職務経歴</h2>
        {profile.experiences.map((exp, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="font-semibold">Experience {i + 1}</span>
              <Trash className="cursor-pointer" onClick={() => removeExperience(i)} />
            </div>
            <Input placeholder="会社名" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} />
            <Input placeholder="ロール" value={exp.role} onChange={(e) => updateExperience(i, "role", e.target.value)} />
            <div className="flex gap-2">
            <Input placeholder="開始年月" value={exp.start} onChange={(e) => updateExperience(i, "start", e.target.value)} />
            <Input placeholder="終了年月（在職中可）" value={exp.end} onChange={(e) => updateExperience(i, "end", e.target.value)} />
            </div>
            <Textarea placeholder="業務内容・成果" value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} />
            <Input placeholder="技術スタック" value={exp.stack} onChange={(e) => updateExperience(i, "stack", e.target.value)} />
          </div>
        ))}
        <Button variant="outline" onClick={addExperience}><Plus className="mr-2" />職務経歴を追加</Button>
      </section>

      {/* スキル詳細 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">スキル詳細</h2>
        <Textarea placeholder="例: Python(Advanced), React(Intermediate)" value={profile.skills.map(s => `${s.name}(${s.level})`).join(", ")} onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(",").map(v => ({ name: v.trim(), level: "" })) })} />
      </section>

      {/* 面接対策 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">面接対策（弱点）</h2>
        <Textarea placeholder="例: システムデザイン、英語面接" value={profile.interviewWeaknesses.join(", ")} onChange={(e) => setProfile({ ...profile, interviewWeaknesses: e.target.value.split(",") })} />
      </section>

      {/* Phase 2 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">プロジェクト / 実績</h2>
        <Textarea placeholder="プロジェクト・成果" value={profile.projects.map(p => p).join("\n")} onChange={(e) => setProfile({ ...profile, projects: e.target.value.split("\n") })} />
          <Label>希望企業</Label>
          <Input value={profile.targetCompanies} onChange={(e) => setProfile({ ...profile, targetCompanies: e.target.value })} />
          <Label>英語詳細</Label>
          <Textarea value={profile.englishDetail} onChange={(e) => setProfile({ ...profile, englishDetail: e.target.value })} />
      </section>

      {/* Phase 3 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">その他</h2>
        <Input placeholder="資格" value={profile.certifications} onChange={(e) => setProfile({ ...profile, certifications: e.target.value })} />
        <Input placeholder="GitHub URL" value={profile.github} onChange={(e) => setProfile({ ...profile, github: e.target.value })} />
      </section>

      <Button className="w-full" onClick={onSave}>保存</Button>
    </div>
  );
}
