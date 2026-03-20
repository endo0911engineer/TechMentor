"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Category = "general" | "delete" | "report" | "other";

const categories: { value: Category; label: string }[] = [
  { value: "general", label: "一般的なお問い合わせ" },
  { value: "delete", label: "投稿の削除依頼" },
  { value: "report", label: "不適切な投稿の報告" },
  { value: "other", label: "その他" },
];

const categoryLabel: Record<Category, string> = {
  general: "一般的なお問い合わせ",
  delete: "投稿の削除依頼",
  report: "不適切な投稿の報告",
  other: "その他",
};

export default function ContactPage() {
  const [category, setCategory] = useState<Category>("general");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const doSubmit = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, email: email || null, message }),
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-4xl mb-4">✓</div>
        <h2 className="text-xl font-bold text-gray-900">お問い合わせを受け付けました</h2>
        <p className="text-sm text-gray-500 mt-2">内容を確認の上、対応いたします。</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* 確認ポップアップ */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">送信内容の確認</h2>
              <p className="text-sm text-gray-500 mb-4">以下の内容で送信してよろしいですか？</p>
              <dl className="space-y-0">
                <div className="flex gap-3 py-2 border-b border-gray-100">
                  <dt className="text-gray-500 shrink-0 w-32 text-sm">種類</dt>
                  <dd className="text-gray-900 text-sm">{categoryLabel[category]}</dd>
                </div>
                {email && (
                  <div className="flex gap-3 py-2 border-b border-gray-100">
                    <dt className="text-gray-500 shrink-0 w-32 text-sm">メールアドレス</dt>
                    <dd className="text-gray-900 text-sm break-all">{email}</dd>
                  </div>
                )}
                <div className="flex gap-3 py-2">
                  <dt className="text-gray-500 shrink-0 w-32 text-sm">内容</dt>
                  <dd className="text-gray-900 text-sm whitespace-pre-wrap">{message}</dd>
                </div>
              </dl>
              {!email && (
                <p className="text-xs text-gray-400 mt-3">※ メールアドレス未入力のため返信はできません</p>
              )}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                  修正する
                </button>
                <button
                  onClick={doSubmit}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700"
                >
                  送信する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-2">お問い合わせ</h1>
      <p className="text-sm text-gray-500 mb-8">
        削除依頼・不適切投稿の報告・その他ご意見はこちらからご連絡ください。
      </p>

      <div id="delete" className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-8 text-sm text-yellow-800">
        <p className="font-semibold mb-1">投稿の削除依頼について</p>
        <p>
          ご自身が投稿した情報の削除をご希望の場合は、カテゴリに「投稿の削除依頼」を選択し、
          投稿内容・投稿日時・対象の企業名をお知らせください。確認の上、速やかに対応します。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            お問い合わせの種類 <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス（任意）
          </label>
          <input
            type="email"
            placeholder="reply@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-xs text-gray-400 mt-1">入力した場合、対応内容をご返信できる場合があります</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={6}
            placeholder={
              category === "delete"
                ? "投稿内容・投稿日時・企業名などをご記入ください"
                : category === "report"
                ? "報告対象のURL・問題の内容をご記入ください"
                : "お問い合わせ内容をご記入ください"
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "送信中..." : "内容を確認する"}
        </button>
      </form>
    </div>
  );
}
