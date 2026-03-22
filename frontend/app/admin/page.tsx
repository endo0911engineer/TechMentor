"use client";

import { useEffect, useState, useCallback } from "react";
import type { components } from "@/lib/generated";
import Pagination from "@/components/Pagination";

const ADMIN_PAGE_SIZE = 20;
import {
  REMOTE_OPTIONS,
  OVERTIME_OPTIONS,
  RESULT_OPTIONS,
  DIFFICULTY_OPTIONS,
  INTERVIEW_CONTENT_KEYS,
  EMPLOYMENT_TYPE_OPTIONS,
} from "@/lib/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Tab = "salary" | "interview" | "companies" | "industries" | "articles" | "contacts";
type Contact = components["schemas"]["ContactRead"];

// Types derived from generated OpenAPI schema
type SalarySubmission = components["schemas"]["SalarySubmissionAdmin"];
type InterviewSubmission = components["schemas"]["InterviewSubmissionAdmin"];
type Company = components["schemas"]["CompanyRead"];
type Industry = components["schemas"]["IndustryRead"];
type Article = components["schemas"]["ArticleRead"];

interface ConfirmState {
  message: string;
  onConfirm: () => void;
}

type InterviewContentMap = Record<string, { checked: boolean; comment: string }>;

function parseInterviewContent(raw?: string | null): InterviewContentMap {
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    return Object.fromEntries(
      INTERVIEW_CONTENT_KEYS.map(({ key }) => [
        key,
        { checked: !!parsed[key]?.checked, comment: parsed[key]?.comment ?? "" },
      ])
    );
  } catch {
    return Object.fromEntries(
      INTERVIEW_CONTENT_KEYS.map(({ key }) => [key, { checked: false, comment: "" }])
    );
  }
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);
}

const JSON_HEADERS = { "Content-Type": "application/json" };

function adminFetch(url: string, options: RequestInit = {}) {
  return fetch(url, { ...options, credentials: "include", headers: { ...JSON_HEADERS, ...(options.headers as Record<string, string> | undefined) } });
}

export default function AdminPage() {
  const [loginKey, setLoginKey] = useState("");
  const [authed, setAuthed] = useState<boolean | null>(null); // null = 確認中
  const [tab, setTab] = useState<Tab>("salary");
  const [salarySubs, setSalarySubs] = useState<SalarySubmission[]>([]);
  const [interviewSubs, setInterviewSubs] = useState<InterviewSubmission[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  // salary edit
  const [editingSalary, setEditingSalary] = useState<number | null>(null);
  const [salaryEditForm, setSalaryEditForm] = useState<Partial<SalarySubmission>>({});
  const [salaryPage, setSalaryPage] = useState(1);
  const [salaryFilterApproval, setSalaryFilterApproval] = useState("");
  const [salaryFilterSearch, setSalaryFilterSearch] = useState("");

  // interview edit
  const [editingInterview, setEditingInterview] = useState<number | null>(null);
  const [interviewEditForm, setInterviewEditForm] = useState<Partial<InterviewSubmission>>({});
  const [interviewContentEdit, setInterviewContentEdit] = useState<InterviewContentMap>({});
  const [interviewPage, setInterviewPage] = useState(1);
  const [interviewFilterApproval, setInterviewFilterApproval] = useState("");
  const [interviewFilterSearch, setInterviewFilterSearch] = useState("");

  // company
  const [editingCompany, setEditingCompany] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", industry: "", description: "" });
  const [companySearch, setCompanySearch] = useState("");
  const [companyPage, setCompanyPage] = useState(1);

  // industry
  const [newIndustryName, setNewIndustryName] = useState("");
  const [industryMessage, setIndustryMessage] = useState("");

  // article
  const [articleForm, setArticleForm] = useState({ title: "", slug: "", content: "" });
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleMessage, setArticleMessage] = useState("");

  const loadIndustries = useCallback(async () => {
    const data = await fetch(`${API_URL}/industries`).then((r) => r.json());
    setIndustries(data);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, i, c, a, ct] = await Promise.all([
        adminFetch(`${API_URL}/admin/salary-submissions`).then((r) => r.json()),
        adminFetch(`${API_URL}/admin/interview-submissions`).then((r) => r.json()),
        adminFetch(`${API_URL}/admin/companies`).then((r) => r.json()),
        adminFetch(`${API_URL}/admin/articles`).then((r) => r.json()),
        adminFetch(`${API_URL}/admin/contacts`).then((r) => r.json()),
      ]);
      setSalarySubs(s);
      setInterviewSubs(i);
      setAllCompanies(c);
      setArticles(a);
      setContacts(ct);
      setAuthed(true);
    } catch {
      setMessage("データの取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Cookie セッションが有効か確認
    adminFetch(`${API_URL}/admin/me`)
      .then((r) => { if (r.ok) load(); else setAuthed(false); })
      .catch(() => setAuthed(false));
    loadIndustries();
  }, [load, loadIndustries]);

  const askConfirm = (message: string, onConfirm: () => void) => {
    setConfirm({ message, onConfirm });
  };

  // salary
  const approveSubmission = async (type: "salary" | "interview", id: number) => {
    await adminFetch(`${API_URL}/admin/${type}-submissions/${id}/approve`, { method: "POST" });
    load();
  };

  const unapproveSubmission = async (type: "salary" | "interview", id: number) => {
    await adminFetch(`${API_URL}/admin/${type}-submissions/${id}/unapprove`, { method: "POST" });
    load();
  };

  const deleteSubmission = (type: "salary" | "interview", id: number) => {
    askConfirm("この投稿を削除しますか？この操作は取り消せません。", async () => {
      await adminFetch(`${API_URL}/admin/${type}-submissions/${id}`, { method: "DELETE" });
      load();
    });
  };

  const saveSalaryEdit = async (id: number) => {
    await adminFetch(`${API_URL}/admin/salary-submissions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(salaryEditForm),
    });
    setEditingSalary(null);
    load();
  };

  const saveInterviewEdit = async (id: number) => {
    await adminFetch(`${API_URL}/admin/interview-submissions/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...interviewEditForm,
        interview_content: JSON.stringify(interviewContentEdit),
      }),
    });
    setEditingInterview(null);
    load();
  };

  // company
  const approveCompany = async (id: number) => {
    await adminFetch(`${API_URL}/admin/companies/${id}/approve`, { method: "POST" });
    load();
  };

  const deleteCompany = (id: number) => {
    askConfirm("この企業を削除しますか？紐づく投稿がある場合は削除できません。", async () => {
      const res = await adminFetch(`${API_URL}/admin/companies/${id}`, { method: "DELETE" });
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
    await adminFetch(`${API_URL}/admin/companies/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: editForm.name, industry: editForm.industry || null, description: editForm.description || null }),
    });
    setEditingCompany(null);
    load();
  };

  // industry
  const addIndustry = async () => {
    if (!newIndustryName.trim()) return;
    const res = await adminFetch(`${API_URL}/industries`, {
      method: "POST",
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
      await adminFetch(`${API_URL}/industries/${id}`, { method: "DELETE" });
      loadIndustries();
    });
  };

  // contacts
  const resolveContact = async (id: number) => {
    await adminFetch(`${API_URL}/admin/contacts/${id}/resolve`, { method: "POST" });
    load();
  };

  const deleteContact = (id: number) => {
    askConfirm("このお問い合わせを削除しますか？", async () => {
      await adminFetch(`${API_URL}/admin/contacts/${id}`, { method: "DELETE" });
      load();
    });
  };

  // article
  const deleteArticle = (id: number) => {
    askConfirm("この記事を削除しますか？", async () => {
      await adminFetch(`${API_URL}/admin/articles/${id}`, { method: "DELETE" });
      load();
    });
  };

  const submitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setArticleLoading(true);
    setArticleMessage("");
    try {
      const res = await adminFetch(`${API_URL}/admin/articles`, {
        method: "POST",
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

  const login = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: JSON_HEADERS,
        body: JSON.stringify({ key: loginKey }),
      });
      if (!res.ok) {
        setMessage("管理者キーが正しくありません");
        return;
      }
      await load();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await adminFetch(`${API_URL}/admin/logout`, { method: "POST" });
    setAuthed(false);
    setLoginKey("");
  };

  if (authed === null) {
    return <div className="text-center text-gray-400 py-20">確認中...</div>;
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto mt-20">
        <h1 className="text-2xl font-bold mb-2">管理画面</h1>
        <p className="text-sm text-gray-500 mb-6">管理者キーでログインしてください</p>
        <input
          type="password"
          placeholder="管理者キー"
          value={loginKey}
          onChange={(e) => setLoginKey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {message && <p className="text-red-500 text-sm mb-3">{message}</p>}
        <button onClick={login} disabled={loading || !loginKey} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50">
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
  const pendingContacts = contacts.filter((c) => !c.is_resolved).length;

  const sortedCompanies = [...allCompanies]
    .filter((c) => !companySearch || c.name.includes(companySearch))
    .sort((a, b) => {
      if (a.is_approved === b.is_approved) return a.name.localeCompare(b.name, "ja");
      return a.is_approved ? 1 : -1;
    });

  const filteredSalary = salarySubs.filter((s) => {
    if (salaryFilterApproval === "pending" && s.is_approved) return false;
    if (salaryFilterApproval === "approved" && !s.is_approved) return false;
    if (salaryFilterSearch && !s.company_name.includes(salaryFilterSearch)) return false;
    return true;
  });
  const pagedSalary = filteredSalary.slice((salaryPage - 1) * ADMIN_PAGE_SIZE, salaryPage * ADMIN_PAGE_SIZE);
  const salaryTotalPages = Math.ceil(filteredSalary.length / ADMIN_PAGE_SIZE);

  const filteredInterview = interviewSubs.filter((s) => {
    if (interviewFilterApproval === "pending" && s.is_approved) return false;
    if (interviewFilterApproval === "approved" && !s.is_approved) return false;
    if (interviewFilterSearch && !s.company_name.includes(interviewFilterSearch)) return false;
    return true;
  });
  const pagedInterview = filteredInterview.slice((interviewPage - 1) * ADMIN_PAGE_SIZE, interviewPage * ADMIN_PAGE_SIZE);
  const interviewTotalPages = Math.ceil(filteredInterview.length / ADMIN_PAGE_SIZE);
  const pagedCompanies = sortedCompanies.slice((companyPage - 1) * ADMIN_PAGE_SIZE, companyPage * ADMIN_PAGE_SIZE);
  const companyTotalPages = Math.ceil(sortedCompanies.length / ADMIN_PAGE_SIZE);

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "salary", label: "給与投稿", count: pendingSalary || undefined },
    { key: "interview", label: "面接投稿", count: pendingInterview || undefined },
    { key: "companies", label: "企業管理", count: pendingCount || undefined },
    { key: "industries", label: "業種管理" },
    { key: "articles", label: "記事投稿" },
    { key: "contacts", label: "お問い合わせ", count: pendingContacts || undefined },
  ];

  const categoryLabel: Record<string, string> = {
    general: "一般",
    delete: "削除依頼",
    report: "不適切報告",
    other: "その他",
  };
  const categoryColor: Record<string, string> = {
    general: "bg-blue-100 text-blue-700",
    delete: "bg-orange-100 text-orange-700",
    report: "bg-red-100 text-red-700",
    other: "bg-gray-100 text-gray-600",
  };

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
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h2 className="text-lg font-bold">給与投稿 ({filteredSalary.length}/{salarySubs.length}件)</h2>
            <input
              type="text"
              placeholder="企業名で検索..."
              value={salaryFilterSearch}
              onChange={(e) => { setSalaryFilterSearch(e.target.value); setSalaryPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-44"
            />
            <select
              value={salaryFilterApproval}
              onChange={(e) => { setSalaryFilterApproval(e.target.value); setSalaryPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="">承認状態: すべて</option>
              <option value="pending">承認待ち</option>
              <option value="approved">承認済み</option>
            </select>
          </div>
          {filteredSalary.length === 0 ? <p className="text-gray-400">投稿はありません</p> : (
            <div className="space-y-3">
              {pagedSalary.map((s) => (
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
                        {s.is_approved && <button onClick={() => unapproveSubmission("salary", s.id)} className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-orange-600">非公開</button>}
                        <button onClick={() => deleteSubmission("salary", s.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700">削除</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <Pagination page={salaryPage} totalPages={salaryTotalPages} onChange={setSalaryPage} />
        </section>
      )}

      {/* Interview submissions */}
      {tab === "interview" && (
        <section>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h2 className="text-lg font-bold">面接投稿 ({filteredInterview.length}/{interviewSubs.length}件)</h2>
            <input
              type="text"
              placeholder="企業名で検索..."
              value={interviewFilterSearch}
              onChange={(e) => { setInterviewFilterSearch(e.target.value); setInterviewPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-44"
            />
            <select
              value={interviewFilterApproval}
              onChange={(e) => { setInterviewFilterApproval(e.target.value); setInterviewPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="">承認状態: すべて</option>
              <option value="pending">承認待ち</option>
              <option value="approved">承認済み</option>
            </select>
          </div>
          {filteredInterview.length === 0 ? <p className="text-gray-400">投稿はありません</p> : (
            <div className="space-y-3">
              {pagedInterview.map((s) => (
                <div key={s.id} className={`bg-white border rounded-xl p-4 ${!s.is_approved ? "border-yellow-300 bg-yellow-50" : "border-gray-200"}`}>
                  {editingInterview === s.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>職種</label>
                          <input value={interviewEditForm.job_title || ""} onChange={(e) => setInterviewEditForm((f) => ({ ...f, job_title: e.target.value }))} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>雇用形態</label>
                          <select value={interviewEditForm.employment_type || ""} onChange={(e) => setInterviewEditForm((f) => ({ ...f, employment_type: e.target.value }))} className={selectClass}>
                            <option value="">-</option>
                            {EMPLOYMENT_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
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
                      <div>
                        <label className={labelClass}>面接内容</label>
                        <div className="space-y-2 mt-1">
                          {INTERVIEW_CONTENT_KEYS.map(({ key, label }) => (
                            <div key={key} className="border border-gray-200 rounded-lg p-3">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={interviewContentEdit[key]?.checked ?? false}
                                  onChange={(e) => setInterviewContentEdit((prev) => ({ ...prev, [key]: { ...prev[key], checked: e.target.checked } }))}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm text-gray-700">{label}</span>
                              </label>
                              {interviewContentEdit[key]?.checked && (
                                <textarea
                                  rows={2}
                                  placeholder={`${label}の内容...`}
                                  value={interviewContentEdit[key]?.comment ?? ""}
                                  onChange={(e) => setInterviewContentEdit((prev) => ({ ...prev, [key]: { ...prev[key], comment: e.target.value } }))}
                                  className={`${inputClass} mt-2 text-sm`}
                                />
                              )}
                            </div>
                          ))}
                        </div>
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
                          {s.employment_type && ` | ${s.employment_type}`}
                          {s.result && ` | ${s.result}`}
                          {s.difficulty && ` | ${s.difficulty}`}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => { setEditingInterview(s.id); setInterviewEditForm(s); setInterviewContentEdit(parseInterviewContent(s.interview_content)); }} className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50">編集</button>
                        {!s.is_approved && <button onClick={() => approveSubmission("interview", s.id)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700">承認</button>}
                        {s.is_approved && <button onClick={() => unapproveSubmission("interview", s.id)} className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-orange-600">非公開</button>}
                        <button onClick={() => deleteSubmission("interview", s.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700">削除</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <Pagination page={interviewPage} totalPages={interviewTotalPages} onChange={setInterviewPage} />
        </section>
      )}

      {/* Companies */}
      {tab === "companies" && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-bold">企業管理 ({allCompanies.length}件)</h2>
            <input type="text" placeholder="企業名で検索..." value={companySearch} onChange={(e) => { setCompanySearch(e.target.value); setCompanyPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-48" />
          </div>
          {sortedCompanies.length === 0 ? <p className="text-gray-400">企業が見つかりません</p> : (
            <div className="space-y-3">
              {pagedCompanies.map((c) => (
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
          <Pagination page={companyPage} totalPages={companyTotalPages} onChange={setCompanyPage} />
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
      {/* Contacts */}
      {tab === "contacts" && (
        <section>
          <h2 className="text-lg font-bold mb-4">お問い合わせ ({contacts.length}件 / 未対応 {pendingContacts}件)</h2>
          {contacts.length === 0 ? <p className="text-gray-400">お問い合わせはありません</p> : (
            <div className="space-y-3">
              {contacts.map((c) => (
                <div key={c.id} className={`bg-white border rounded-xl p-4 ${!c.is_resolved ? "border-yellow-300 bg-yellow-50" : "border-gray-200"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColor[c.category] ?? "bg-gray-100 text-gray-600"}`}>
                          {categoryLabel[c.category] ?? c.category}
                        </span>
                        {c.is_resolved && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">対応済み</span>}
                        <span className="text-xs text-gray-400">{c.created_at.slice(0, 10)}</span>
                      </div>
                      {c.email && (
                        <p className="text-xs text-blue-600 mb-1">返信先: {c.email}</p>
                      )}
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{c.message}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {!c.is_resolved && (
                        <button onClick={() => resolveContact(c.id)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700">
                          対応済み
                        </button>
                      )}
                      <button onClick={() => deleteContact(c.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700">削除</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
