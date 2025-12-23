"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateMyRole } from "@/lib/api/auth"; // role更新API
import { useAuth } from "@/hooks/useAuth";

export default function SelectRolePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  // すでに role がある人は来る意味がない
  if (user?.role) {
    router.replace("/");
    return null;
  }

  const handleSelectRole = async (role: "user" | "interviewer") => {
    try {
      setLoading(true);

      await updateMyRole(role);
      await refreshUser(); // user情報を再取得

      // ロール確定後はプロフィール登録へ
      router.push("/profile/setup");
    } catch (e) {
      console.error(e);
      alert("ロール設定に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8 space-y-6">
        <h1 className="text-xl font-bold text-center">
          あなたの利用目的を選択してください
        </h1>

        <Button
          disabled={loading}
          className="w-full h-14 text-lg"
          onClick={() => handleSelectRole("user")}
        >
          面接を受けたい
        </Button>

        <Button
          disabled={loading}
          variant="outline"
          className="w-full h-14 text-lg"
          onClick={() => handleSelectRole("interviewer")}
        >
          面接官として参加したい
        </Button>
      </div>
    </div>
  );
}