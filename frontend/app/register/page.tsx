"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { register } from "../../lib/auth";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    await register(email, password);

    router.push("user/profile");
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
          <UserPlus /> 新規登録
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1 block font-medium">メールアドレス</label>
            <input
              type="email"
              className="w-full rounded-lg border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">パスワード</label>
            <input
              type="password"
              className="w-full rounded-lg border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 py-2 font-semibold text-white hover:bg-green-700"
          >
            登録する
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          すでにアカウントがありますか？{" "}
          <a href="/login" className="text-blue-600 underline">
            ログインへ
          </a>
        </p>
      </div>
    </div>
  );
}
