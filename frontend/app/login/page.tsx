"use client";

import { useState } from "react";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { login } from "../../lib/auth";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await login(email, password);

        if (result.role === "interviewer") {
          router.push("/interviewer/dashboard");
        } else {
          router.push("/user/dashboard");
        }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold">
          <LogIn /> ログイン
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
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
            className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
          >
            ログイン
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          アカウントがありませんか？{" "}
          <a href="/register" className="text-blue-600 underline">
            新規登録へ
          </a>
        </p>
      </div>
    </div>
  );
}
