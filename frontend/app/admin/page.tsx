"use client";

import { useEffect, useState, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Tab = "salary" | "interview" | "companies" | "industries" | "articles";

interface SalarySubmission {
  id: number;
  company_id: number;
  company_name: string;
  job_title?: string;
  years_of_experience?: number;
  salary?: number;
  salary_breakdown?: string;
  location?: string;
  remote_type?: string;
  overtime_feeling?: string;
  tech_stack?: string;
  comment?: string;
  is_approved: boolean;
  created_at: string;
}

interface InterviewSubmission {
  id: number;
  company_id: number;
  company_name: string;
  job_title?: string;
  interview_rounds?: number;
  result?: string;
  difficulty?: string;
  tags?: string;
  interview_content?: string;
  is_approved: boolean;
  created_at: string;
}

interface Company {
  id: number;
  name: string;
  industry?: string;
  description?: string;
  is_approved?: boolean;
}

interface Industry {
  id: number;
  name: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  content?: string;
  created_at: string;
}

interface ConfirmState {
  message: string;
  onConfirm: () => void;
}

const REMOTE_OPTIONS = ["フルリモート", "一部リモート（週3日以上）", "一部リモート（週1〜2日）", "出社のみ"];
const OVERTIME_OPTIONS = ["ほぼなし（月10時間未満）", "少ない（月10〜20時間）", "普通（月20〜40時間）", "多い（月40〜60時間）", "非常に多い（月60時間以上）"];
const RESULT_OPTIONS = ["合格", "不合格", "辞退", "選考中"];
const DIFFICULTY_OPTIONS = ["とても簡単", "簡単", "普通", "難しい", "とても難しい"];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);
}

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("salary");
  const [salarySubs, setSalarySubs] = useState<SalarySubmission[]>([]);
  const [interviewSubs, setInterviewSubs] = useState<InterviewSubmission[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  // salary edit
  const [editingSalary, setEditingSalary] = useState<number | null>(null);
  const [salaryEditForm, setSalaryEditForm] = useState<Partial<SalarySubmission>>({});

  // interview edit
  const [editingInterview, setEditingInterview] = useState<number | null>(null);
  const [interviewEditForm, setInterviewEditForm] = useState<Partial<InterviewSubmission>>({});

  // company
  const [editingCompany, setEditingCompany] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", industry: "", description: "" });
  const [companySearch, setCompanySearch] = useState("");

  // industry
  const [newIndustryName, setNewIndustryName] = useState("");
  const [industryMessage, setIndustryMessage] = useState("");

  // article
  const [articleForm, setArticleForm] = useState({ title: "", slug: "", content: "" });
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleMessage, setArticleMessage] = useState("");

  const headers = useCallback(
    () => ({ "Content-Type": "application/json", "X-Admin-Key": key }),
    [key]
  );

  const loadIndustries = useCallback(async () => {
    const data = await fetch(`${API_URL}/industries`).then((r) => r.json());
    setIndustries(data);
  }, []);

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
    if (saved) setKey(saved);
    loadIndustries();
  }, [loadIndustries]);

  const askConfirm = (message: string, onConfirm: () => void) => {
    setConfirm({ message, onConfirm });
  };

  // salary
  const approveSubmission = async (type: "salary" | "interview", id: number) => {
    await fetch(`${API_URL}/admin/${type}-submissions/${id}/approve`, { method: "POST", headers: headers() });
    load();
  };

  const deleteSubmission = (type: "salary" | "interview", id: number) => {
    askConfirm("この投稿を削除しますか？この操作は取り消せません。", async () => {
      await fetch(`${API_URL}/admin/${type}-submissions/${id}`, { method: "DELETE", headers: headers() });
      load();
    });
  };

  const saveSalaryEdit = async (id: number) => {
    await fetch(`${API_URL}/admin/salary-submissions/${id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(salaryEditForm),
    });
    setEditingSalary(null);
    load();
  };

  const saveInterviewEdit = async (id: number) => {
    await fetch(`${API_URL}/admin/interview-submissions/${id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify(interviewEditForm),
    });
    setEditingInterview(null);
    load();
  };

  // company
  const approveCompany = async (id: number) => {
    await fetch(`${API_URL}/admin/companies/${id}/approve`, { method: "POST", headers: headers() });
    load();
  };

  const deleteCompany = (id: number) => {
    askConfirm("この企業を削除しますか？紐づく投稿がある場合は削除できません。", async () => {
      const res = await fetch(`${API_URL}/admin/companies/${id}`, { method: "DELETE", headers: headers() });
      if (!res.ok) {
        setMessage("この企業には投稿データが紐づいているため削除できません。先に投稿を削除してください。");
        return;
      }
      load();
    });
  };

  const startEditCompany = (c: Company) => {
    setEditingCompany(c.id);
    setEditForm({ name: c.name, industry: c.industry || "", description: c.description || "" });
  };

  const saveEditCompany = async (id: number) => {
    await fetch(`${API_URL}/admin/companies/${id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ name: editForm.name, industry: editForm.industry || null, description: editForm.description || null }),
    });
    setEditingCompany(null);
    load();
  };

  // industry
  const addIndustry = async () => {
    if (!newIndustryName.trim()) return;
    const res = await fetch(`${API_URL}/industries`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ name: newIndustryName.trim() }),
    });
    if (!res.ok) {
      const err = await res.json();
      setIndustryMessage(err.detail || "エラーが発生しました");
      return;
    }
    setNewIndustryName("");
    setIndustryMessage("追加しました");
    loadIndustries();
  };

  const deleteIndustry = (id: number, name: string) => {
    askConfirm(`業種「${name}」を削除しますか？`, async () => {
      await fetch(`${API_URL}/industries/${id}`, { method: "DELETE", headers: headers() });
      loadIndustries();
    });
  };

  // article
  const deleteArticle = (id: number) => {
    askConfirm("この記事を削除しますか？", async () => {
      await fetch(`${API_URL}/admin/articles/${id}`, { method: "DELETE", headers: headers() });
      load();
    });
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
        <button onClick={load} disabled={loading || !key} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50">
          {loading ? "確認中..." : "ログイン"}
        </button>
      </div>
    );
  }

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const selectClass = `${inputClass} bg-white`;

  const pendingCount = allCompanies.filter((c) => !c.is_approved).length;
  const pendingSalary = salarySubs.filter((s) => !s.is_approved).length;
  const pendingInterview = interviewSubs.filter((s) => !s.is_approved).length;

  const sortedCompanies = [...allCompanies]
    .filter((c) => !companySearch || c.name.includes(companySearch))
    .sort((a, b) => {
      if (a.is_approved === b.is_approved) return a.name.localeCompare(b.name, "ja");
      return a.is_approved ? 1 : -1;
    });

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "salary", label: "給与投稿", count: pendingSalary || undefined },
    { key: "interview", label: "面接投稿", count: pendingInterview || undefined },
    { key: "companies", label: "企業管理", count: pendingCount || undefined },
    { key: "industries", label: "業種管理" },
    { key: "articles", label: "記事投稿" },
  ];

  return (
    <div>
      {/* Confirm dialog */}
      {confirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4">
            <p className="text-gray-800 font-medium mb-6">{confirm.message}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirm(null)} className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                キャンセル
              </button>
              <button
                onClick={() => { confirm.onConfirm(); setConfirm(null); }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="ml-4 text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">管理画面</h1>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg">
          ログアウト
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              tab === t.key ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
            {t.count !== undefined && (
              <span className="ml-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Salary submissions */}
      {tab === "salary" && (
        <section>
          <h2 className="text-lg font-bold mb-4">給与投稿 ({salarySubs.length}件 / 承認待ち {pendingSalary}件)</h2>
          {salarySubs.length === 0 ? <p className="text-gray-400">投稿はありません</p> : (
            <div className="space-y-3">
              {salarySubs.map((s) => (
                <div key={s.id} className={`bg-white border rounded-xl p-4 ${!s.is_approved ? "border-yellow-300 bg-yellow-50" : "border-gray-200"}`}>
                  {editingSalary === s.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>職種</label>
                          <input value={salaryEditForm.job_title || ""} onChange={(e) => setSalaryEditForm((f) => ({ ...f, job_title: e.target.value }))} className={inputClass} placeholder="職種" />
                        </div>
                        <div>
                          <label className={labelClass}>年収（万円）</label>
                          <input type="number" value={salaryEditForm.salary ?? ""} onChange={(e) => setSalaryEditForm((f) => ({ ...f, salary: Number(e.target.value) }))} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>経験年数</label>
                          <input type="number" value={salaryEditForm.years_of_experience ?? ""} onChange={(e) => setSalaryEditForm((f) => ({ ...f, years_of_experience: Number(e.target.value) }))} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>勤務地</label>
                          <input value={salaryEditForm.location || ""} onChange={(e) => setSalaryEditForm((f) => ({ ...f, location: e.target.value }))} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>リモート</label>
                          <select value={salaryEditForm.remote_type || ""} onChange={(e) => setSalaryEditForm((f) => ({ ...f, remote_type: e.target.value }))} className={selectClass}>
                            <option value="">-</option>
                            {REMOTE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>残業感</label>
                          <select value={salaryEditForm.overtime_feeling || ""} onChange={(e) => setSalaryEditForm((f) => ({ ...f, overtime_feeling: e.target.value }))} className={selectClass}>
                            <option value="">-</option>
                            {OVERTIME_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>年収内訳</label>
                        <input value={salaryEditForm.salary_breakdown || ""} onChange={(e) => setSalaryEditForm((f) => ({ ...f, salary_breakdown: e.target.value }))} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>技術スタック（カンマ区切り）</label>
                        <input value={salaryEditForm.tech_stack || ""} onChange={(e) => setSalaryEditForm((f) => ({ ...f, tech_stack: e.target.value }))} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>コメント</label>
                        <textarea rows={3} value={salaryEditForm.comment || ""} onChange={(e) => setSalaryEditForm((f) => ({ ...f, comment: e.target.value }))} className={inputClass} />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => saveSalaryEdit(s.id)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700">保存</button>
                        <button onClick={() => setEditingSalary(null)} className="border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg text-sm">キャンセル</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{s.company_name} — {s.job_title || "職種未記入"}</p>
                          {!s.is_approved && <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full shrink-0">承認待ち</span>}
                        </div>
                        <p className="text-sm text-gray-500">
                          {s.salary}万円 | 経験{s.years_of_experience}年
                          {s.location && ` | ${s.location}`}
                          {s.remote_type && ` | ${s.remote_type}`}
                        </p>
                        {s.comment && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{s.comment}</p>}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => { setEditingSalary(s.id); setSalaryEditForm(s); }} className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50">編集</button>
                        {!s.is_approved && <button onClick={() => approveSubmission("salary", s.id)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700">承認</button>}
                        <button onClick={() => deleteSubmission("salary", s.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700">削除</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Interview submissions */}
      {tab === "interview" && (
        <section>
          <h2 className="text-lg font-bold mb-4">面接投稿 ({interviewSubs.length}件 / 承認待ち {pendingInterview}件)</h2>
          {interviewSubs.length === 0 ? <p className="text-gray-400">投稿はありません</p> : (
            <div className="space-y-3">
              {interviewSubs.map((s) => (
                <div key={s.id} className={`bg-white border rounded-xl p-4 ${!s.is_approved ? "border-yellow-300 bg-yellow-50" : "border-gray-200"}`}>
                  {editingInterview === s.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>職種</label>
                          <input value={interviewEditForm.job_title || ""} onChange={(e) => setInterviewEditForm((f) => ({ ...f, job_title: e.target.value }))} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>面接回数</label>
                          <input type="number" value={interviewEditForm.interview_rounds ?? ""} onChange={(e) => setInterviewEditForm((f) => ({ ...f, interview_rounds: Number(e.target.value) }))} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>結果</label>
                          <select value={interviewEditForm.result || ""} onChange={(e) => setInterviewEditForm((f) => ({ ...f, result: e.target.value }))} className={selectClass}>
                            <option value="">-</option>
                            {RESULT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>難易度</label>
                          <select value={interviewEditForm.difficulty || ""} onChange={(e) => setInterviewEditForm((f) => ({ ...f, difficulty: e.target.value }))} className={selectClass}>
                            <option value="">-</option>
                            {DIFFICULTY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>タグ（カンマ区切り）</label>
                        <input value={interviewEditForm.tags || ""} onChange={(e) => setInterviewEditForm((f) => ({ ...f, tags: e.target.value }))} className={inputClass} />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => saveInterviewEdit(s.id)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700">保存</button>
                        <button onClick={() => setEditingInterview(null)} className="border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg text-sm">キャンセル</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{s.company_name} — {s.job_title || "職種未記入"}</p>
                          {!s.is_approved && <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full shrink-0">承認待ち</span>}
                        </div>
                        <p className="text-sm text-gray-500">
                          {s.interview_rounds}回面接
                          {s.result && ` | ${s.result}`}
                          {s.difficulty && ` | ${s.difficulty}`}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => { setEditingInterview(s.id); setInterviewEditForm(s); }} className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50">編集</button>
                        {!s.is_approved && <button onClick={() => approveSubmission("interview", s.id)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700">承認</button>}
                        <button onClick={() => deleteSubmission("interview", s.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700">削除</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Companies */}
      {tab === "companies" && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-bold">企業管理 ({allCompanies.length}件)</h2>
            <input type="text" placeholder="企業名で検索..." value={companySearch} onChange={(e) => setCompanySearch(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-48" />
          </div>
          {sortedCompanies.length === 0 ? <p className="text-gray-400">企業が見つかりません</p> : (
            <div className="space-y-3">
              {sortedCompanies.map((c) => (
                <div key={c.id} className={`bg-white border rounded-xl p-4 ${!c.is_approved ? "border-yellow-300 bg-yellow-50" : "border-gray-200"}`}>
                  {editingCompany === c.id ? (
                    <div className="space-y-2">
                      <div>
                        <label className={labelClass}>企業名</label>
                        <input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>業種</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {industries.map((ind) => (
                            <button key={ind.id} type="button"
                              onClick={() => setEditForm((f) => ({ ...f, industry: f.industry === ind.name ? "" : ind.name }))}
                              className={`px-3 py-1 rounded-full text-xs border transition ${editForm.industry === ind.name ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600 hover:border-blue-400"}`}
                            >
                              {ind.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>企業説明（任意）</label>
                        <textarea rows={3} value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} className={inputClass} placeholder="企業の概要を入力..." />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => saveEditCompany(c.id)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700">保存</button>
                        <button onClick={() => setEditingCompany(null)} className="border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg text-sm">キャンセル</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{c.name}</p>
                          {!c.is_approved && <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">承認待ち</span>}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{c.industry || "業種未設定"}</p>
                        {c.description && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{c.description}</p>}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => startEditCompany(c)} className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50">編集</button>
                        {!c.is_approved && <button onClick={() => approveCompany(c.id)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700">承認</button>}
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

      {/* Industries */}
      {tab === "industries" && (
        <section>
          <h2 className="text-lg font-bold mb-4">業種マスター管理 ({industries.length}件)</h2>
          <div className="flex gap-2 mb-6">
            <input type="text" placeholder="新しい業種名..." value={newIndustryName}
              onChange={(e) => setNewIndustryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addIndustry()}
              className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1" />
            <button onClick={addIndustry} disabled={!newIndustryName.trim()} className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50">追加</button>
          </div>
          {industryMessage && (
            <p className={`text-sm mb-4 ${industryMessage.includes("エラー") || industryMessage.includes("既に") ? "text-red-500" : "text-green-600"}`}>{industryMessage}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {industries.map((ind) => (
              <div key={ind.id} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5">
                <span className="text-sm text-gray-700">{ind.name}</span>
                <button onClick={() => deleteIndustry(ind.id, ind.name)} className="text-gray-300 hover:text-red-500 transition text-xs leading-none">✕</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Articles */}
      {tab === "articles" && (
        <section>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-bold mb-4">新規記事を投稿</h2>
              <form onSubmit={submitArticle} className="space-y-4">
                <div>
                  <label className={labelClass}>タイトル</label>
                  <input required type="text" placeholder="例: メルカリのエンジニア年収を解説" value={articleForm.title}
                    onChange={(e) => { const title = e.target.value; setArticleForm((f) => ({ ...f, title, slug: f.slug === slugify(f.title) ? slugify(title) : f.slug })); }}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>スラッグ（URL）</label>
                  <input required type="text" placeholder="mercari-engineer-salary" value={articleForm.slug}
                    onChange={(e) => setArticleForm((f) => ({ ...f, slug: e.target.value }))} className={inputClass} />
                  <p className="text-xs text-gray-400 mt-1">/articles/{articleForm.slug || "..."} として公開されます</p>
                </div>
                <div>
                  <label className={labelClass}>本文</label>
                  <textarea rows={10} placeholder="記事の内容を入力..." value={articleForm.content}
                    onChange={(e) => setArticleForm((f) => ({ ...f, content: e.target.value }))} className={inputClass} />
                </div>
                {articleMessage && (
                  <p className={`text-sm ${articleMessage.includes("エラー") || articleMessage.includes("already") ? "text-red-500" : "text-green-600"}`}>{articleMessage}</p>
                )}
                <button type="submit" disabled={articleLoading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50">
                  {articleLoading ? "投稿中..." : "記事を投稿する"}
                </button>
              </form>
            </div>
            <div>
              <h2 className="text-lg font-bold mb-4">投稿済み記事 ({articles.length}件)</h2>
              {articles.length === 0 ? <p className="text-gray-400">記事はまだありません</p> : (
                <div className="space-y-3">
                  {articles.map((a) => (
                    <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-sm">{a.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">/articles/{a.slug}</p>
                        </div>
                        <button onClick={() => deleteArticle(a.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 shrink-0">削除</button>
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
