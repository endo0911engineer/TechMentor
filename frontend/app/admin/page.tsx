"use client";

import { useEffect, useState, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Tab = "salary" | "interview" | "companies" | "articles";

interface Submission {
  id: number;
  company_id: number;
  job_title?: string;
  salary?: number;
  years_of_experience?: number;
  interview_rounds?: number;
  coding_test?: boolean;
  comment?: string;
  experience_comment?: string;
  created_at: string;
}

interface Company {
  id: number;
  name: string;
  industry?: string;
  headquarters?: string;
  is_approved?: boolean;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  content?: string;
  created_at: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("salary");
  const [salarySubs, setSalarySubs] = useState<Submission[]>([]);
  const [interviewSubs, setInterviewSubs] = useState<Submission[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingCompany, setEditingCompany] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", industry: "" });

  const [articleForm, setArticleForm] = useState({
    title: "",
    slug: "",
    content: "",
  });
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleMessage, setArticleMessage] = useState("");

  const headers = useCallback(
    () => ({ "Content-Type": "application/json", "X-Admin-Key": key }),
    [key]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, i, c, a] = await Promise.all([
        fetch(`${API_URL}/admin/salary-submissions`, { headers: headers() }).then((r) => {
          if (!r.ok) throw new Error("auth");
          return r.json();
        }),
        fetch(`${API_URL}/admin/interview-submissions`, { headers: headers() }).then((r) => r.json()),
        fetch(`${API_URL}/admin/companies`, { headers: headers() }).then((r) => r.json()),
        fetch(`${API_URL}/admin/articles`, { headers: headers() }).then((r) => r.json()),
      ]);
      setSalarySubs(s);
      setInterviewSubs(i);
      setAllCompanies(c);
      setArticles(a);
      setAuthed(true);
      sessionStorage.setItem("admin_key", key);
    } catch {
      setMessage("認証に失敗しました。管理者キーを確認してください。");
    } finally {
      setLoading(false);
    }
  }, [key, headers]);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_key");
    if (saved) {
      setKey(saved);
    }
  }, []);

  const approveSubmission = async (type: "salary" | "interview", id: number) => {
    await fetch(`${API_URL}/admin/${type}-submissions/${id}/approve`, {
      method: "POST",
      headers: headers(),
    });
    load();
  };

  const deleteSubmission = async (type: "salary" | "interview", id: number) => {
    await fetch(`${API_URL}/admin/${type}-submissions/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    load();
  };

  const approveCompany = async (id: number) => {
    await fetch(`${API_URL}/admin/companies/${id}/approve`, {
      method: "POST",
      headers: headers(),
    });
    load();
  };

  const deleteCompany = async (id: number) => {
    await fetch(`${API_URL}/admin/companies/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    load();
  };

  const startEditCompany = (c: Company) => {
    setEditingCompany(c.id);
    setEditForm({ name: c.name, industry: c.industry || "" });
  };

  const saveEditCompany = async (id: number) => {
    await fetch(`${API_URL}/admin/companies/${id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ name: editForm.name, industry: editForm.industry || null }),
    });
    setEditingCompany(null);
    load();
  };

  const deleteArticle = async (id: number) => {
    await fetch(`${API_URL}/admin/articles/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    load();
  };

  const submitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setArticleLoading(true);
    setArticleMessage("");
    try {
      const res = await fetch(`${API_URL}/admin/articles`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(articleForm),
      });
      if (!res.ok) {
        const err = await res.json();
        setArticleMessage(err.detail || "エラーが発生しました");
        return;
      }
      setArticleForm({ title: "", slug: "", content: "" });
      setArticleMessage("記事を投稿しました");
      load();
    } finally {
      setArticleLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("admin_key");
    setAuthed(false);
    setKey("");
  };

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-2">管理画面</h1>
        <p className="text-sm text-gray-500 mb-6">管理者キーでログインしてください</p>
        <input
          type="password"
          placeholder="管理者キー"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {message && <p className="text-red-500 text-sm mb-3">{message}</p>}
        <button
          onClick={load}
          disabled={loading || !key}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "確認中..." : "ログイン"}
        </button>
      </div>
    );
  }

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  const pendingCount = allCompanies.filter((c) => !c.is_approved).length;

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "salary", label: "給与投稿", count: salarySubs.length },
    { key: "interview", label: "面接投稿", count: interviewSubs.length },
    { key: "companies", label: "企業管理", count: pendingCount || undefined },
    { key: "articles", label: "記事投稿" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">管理画面</h1>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg"
        >
          ログアウト
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              tab === t.key ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Salary submissions */}
      {tab === "salary" && (
        <section>
          <h2 className="text-lg font-bold mb-4">給与投稿の承認待ち ({salarySubs.length}件)</h2>
          {salarySubs.length === 0 ? (
            <p className="text-gray-400">承認待ちはありません</p>
          ) : (
            <div className="space-y-3">
              {salarySubs.map((s) => (
                <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{s.job_title} — {s.salary}万円</p>
                      <p className="text-sm text-gray-500">経験 {s.years_of_experience}年 | 企業ID: {s.company_id}</p>
                      {s.comment && <p className="text-sm text-gray-600 mt-2">{s.comment}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => approveSubmission("salary", s.id)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700">承認</button>
                      <button onClick={() => deleteSubmission("salary", s.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700">削除</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Interview submissions */}
      {tab === "interview" && (
        <section>
          <h2 className="text-lg font-bold mb-4">面接投稿の承認待ち ({interviewSubs.length}件)</h2>
          {interviewSubs.length === 0 ? (
            <p className="text-gray-400">承認待ちはありません</p>
          ) : (
            <div className="space-y-3">
              {interviewSubs.map((s) => (
                <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{s.job_title || "職種未記入"} — {s.interview_rounds}回面接</p>
                      <p className="text-sm text-gray-500">企業ID: {s.company_id} | コーディングテスト: {s.coding_test ? "あり" : "なし"}</p>
                      {s.experience_comment && <p className="text-sm text-gray-600 mt-2">{s.experience_comment}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => approveSubmission("interview", s.id)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700">承認</button>
                      <button onClick={() => deleteSubmission("interview", s.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700">削除</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Companies */}
      {tab === "companies" && (
        <section>
          <h2 className="text-lg font-bold mb-4">企業管理 ({allCompanies.length}件)</h2>
          {allCompanies.length === 0 ? (
            <p className="text-gray-400">企業はありません</p>
          ) : (
            <div className="space-y-3">
              {allCompanies.map((c) => (
                <div key={c.id} className={`bg-white border rounded-xl p-4 ${!c.is_approved ? "border-yellow-300 bg-yellow-50" : "border-gray-200"}`}>
                  {editingCompany === c.id ? (
                    <div className="space-y-2">
                      <input
                        value={editForm.name}
                        onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                        className={inputClass}
                        placeholder="企業名"
                      />
                      <input
                        value={editForm.industry}
                        onChange={(e) => setEditForm((f) => ({ ...f, industry: e.target.value }))}
                        className={inputClass}
                        placeholder="業種（例: SaaS / クラウド）"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => saveEditCompany(c.id)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700">保存</button>
                        <button onClick={() => setEditingCompany(null)} className="border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50">キャンセル</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{c.name}</p>
                          {!c.is_approved && (
                            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">承認待ち</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{c.industry || "業種未設定"}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => startEditCompany(c)} className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50">編集</button>
                        {!c.is_approved && (
                          <button onClick={() => approveCompany(c.id)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700">承認</button>
                        )}
                        <button onClick={() => deleteCompany(c.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700">削除</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Articles */}
      {tab === "articles" && (
        <section>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Create form */}
            <div>
              <h2 className="text-lg font-bold mb-4">新規記事を投稿</h2>
              <form onSubmit={submitArticle} className="space-y-4">
                <div>
                  <label className={labelClass}>タイトル</label>
                  <input
                    required
                    type="text"
                    placeholder="例: メルカリのエンジニア年収を解説"
                    value={articleForm.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setArticleForm((f) => ({
                        ...f,
                        title,
                        slug: f.slug === slugify(f.title) ? slugify(title) : f.slug,
                      }));
                    }}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>スラッグ（URL）</label>
                  <input
                    required
                    type="text"
                    placeholder="mercari-engineer-salary"
                    value={articleForm.slug}
                    onChange={(e) => setArticleForm((f) => ({ ...f, slug: e.target.value }))}
                    className={inputClass}
                  />
                  <p className="text-xs text-gray-400 mt-1">/articles/{articleForm.slug || "..."} として公開されます</p>
                </div>
                <div>
                  <label className={labelClass}>本文</label>
                  <textarea
                    rows={10}
                    placeholder="記事の内容を入力..."
                    value={articleForm.content}
                    onChange={(e) => setArticleForm((f) => ({ ...f, content: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                {articleMessage && (
                  <p className={`text-sm ${articleMessage.includes("エラー") || articleMessage.includes("already") ? "text-red-500" : "text-green-600"}`}>
                    {articleMessage}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={articleLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {articleLoading ? "投稿中..." : "記事を投稿する"}
                </button>
              </form>
            </div>

            {/* Article list */}
            <div>
              <h2 className="text-lg font-bold mb-4">投稿済み記事 ({articles.length}件)</h2>
              {articles.length === 0 ? (
                <p className="text-gray-400">記事はまだありません</p>
              ) : (
                <div className="space-y-3">
                  {articles.map((a) => (
                    <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-sm">{a.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">/articles/{a.slug}</p>
                        </div>
                        <button
                          onClick={() => deleteArticle(a.id)}
                          className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 shrink-0"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
