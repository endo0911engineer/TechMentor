"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProfile, updateProfile } from "../lib/user";

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    skill: "",
    experience: 0,
    job_type: "",
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
        });
      } catch (error) {
        router.push("/login");
      }
    }
    loadProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(form);
    router.push("/search"); // プロフィール完了 → 面接官検索へ
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-xl space-y-6 rounded-lg bg-white p-6 shadow">
      <h1 className="text-xl font-bold">プロフィール編集</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="名前"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full rounded border px-3 py-2"
          placeholder="スキル（例: Python, React）"
          value={form.skill}
          onChange={(e) => setForm({ ...form, skill: e.target.value })}
        />

        <input
          className="w-full rounded border px-3 py-2"
          type="number"
          placeholder="経験年数"
          value={form.experience}
          onChange={(e) =>
            setForm({ ...form, experience: Number(e.target.value) })
          }
        />

        <input
          className="w-full rounded border px-3 py-2"
          placeholder="希望職種（例: Backend, Frontend）"
          value={form.job_type}
          onChange={(e) =>
            setForm({ ...form, job_type: e.target.value })
          }
        />

        <button className="w-full rounded bg-blue-600 py-2 text-white">
          保存する
        </button>
      </form>
    </div>
  );
}
