"use client";

import { useEffect, useState } from "react";
import { fetchMe } from "@/lib/user";
import { updateProfile } from "@/lib/profile";

export default function ProfileEditPage() {
  const [form, setForm] = useState({ name: "", bio: "", skills: "" });

  useEffect(() => {
    fetchMe().then((user) => setForm(user));
  }, []);

  const onSave = async () => {
    await updateProfile(form);
    alert("プロフィールを更新しました");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">プロフィール編集</h1>

      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="border p-2 w-full mt-4"
      />

      <textarea
        value={form.bio}
        onChange={(e) => setForm({ ...form, bio: e.target.value })}
        className="border p-2 w-full mt-4"
      />

      <button
        onClick={onSave}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        保存
      </button>
    </div>
  );
}
