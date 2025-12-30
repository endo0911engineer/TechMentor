"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

// ユーザー情報の型定義
interface User {
  id: number;
  email: string;
  role: string | null;
  // ...その他必要なフィールド
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      // バックエンドの /api/users/me (Cookieを使って自分を取得する) エンドポイント
      const data = await apiClient("/api/users/me");
      setUser(data);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ページから呼び出すためのフック
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};