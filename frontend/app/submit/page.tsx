"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api, Company, InterviewContent } from "@/lib/api";
import {
  JOB_TITLES,
  EXPERIENCE_OPTIONS,
  REMOTE_OPTIONS,
  OVERTIME_OPTIONS,
  TECH_STACK_OPTIONS,
  LOCATION_OPTIONS,
  RESULT_OPTIONS,
  DIFFICULTY_OPTIONS,
  INTERVIEW_CONTENT_KEYS,
  EMPLOYMENT_TYPE_OPTIONS,
} from "@/lib/constants";

declare global {
  interface Window {
    grecaptcha: {
      ready: (fn: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const NEW_COMPANY_VALUE = "__new__";

async function getRecaptchaToken(action: string): Promise<string> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey || typeof window === "undefined" || !window.grecaptcha) return "";
  return new Promise((resolve) => {
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(siteKey, { action }).then(resolve);
    });
  });
}

const inputClass =
  "w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
      <dt className="text-gray-500 shrink-0 w-28 text-sm">{label}</dt>
      <dd className="text-gray-900 text-sm break-words">{value}</dd>
    </div>
  );
}

function CompanySelector({
  companies,
  value,
  onChange,
  newName,
  setNewName,
}: {
  companies: import("@/lib/api").Company[];
  value: string;
  onChange: (v: string) => void;
  newName: string;
  setNewName: (v: string) => void;
}) {
  return (
    <>
      <div>
        <label className={labelClass}>企業 <span className="text-red-500">*</span></label>
        <select required value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
          <option value="">選択してください</option>
          {companies.map((c) => (
            <option key={c.id} value={String(c.id)}>{c.name}</option>
          ))}
          <option value={NEW_COMPANY_VALUE}>＋ 新しい企業を追加</option>
        </select>
      </div>
      {value === NEW_COMPANY_VALUE && (
        <div className="border border-blue-200 bg-blue-50 rounded-xl p-4 space-y-3">
          <p className="text-sm font-medium text-blue-700">新しい企業を登録</p>
          <div>
            <label className={labelClass}>企業名 <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="例: 株式会社〇〇"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      )}
    </>
  );
}

const defaultInterviewContent = (): InterviewContent => ({
  coding: { checked: false },
  system_design: { checked: false },
  behavioral: { checked: false },
  case: { checked: false },
  english: { checked: false },
  other: { checked: false },
});

function SubmitForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tab, setTab] = useState<"salary" | "interview">("salary");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState<"salary" | "interview" | null>(null);

  const defaultCompanyId = searchParams.get("company_id") || "";

  const [salaryCompany, setSalaryCompany] = useState(defaultCompanyId);
  const [salaryNewName, setSalaryNewName] = useState("");

  const [interviewCompany, setInterviewCompany] = useState(defaultCompanyId);
  const [interviewNewName, setInterviewNewName] = useState("");

  // 給与フォーム
  const [salaryForm, setSalaryForm] = useState({
    job_title: "",
    years_of_experience: "",
    salary: "",
    salary_breakdown: "",
    location: "",
    remote_type: "",
    overtime_feeling: "",
    comment: "",
  });
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);

  // 面接フォーム
  const [interviewForm, setInterviewForm] = useState({
    job_title: "",
    employment_type: "",
    interview_rounds: "",
    result: "",
    difficulty: "",
  });
  const [interviewContent, setInterviewContent] = useState<InterviewContent>(
    defaultInterviewContent()
  );

  useEffect(() => {
    api.getCompanies().then(setCompanies);
  }, []);

  const resolveCompanyId = async (
    selectedValue: string,
    newName: string
  ): Promise<number> => {
    if (selectedValue === NEW_COMPANY_VALUE) {
      const company = await api.createCompany({ name: newName });
      return company.id;
    }
    return parseInt(selectedValue);
  };

  const handleSalarySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (salaryCompany === NEW_COMPANY_VALUE && !salaryNewName.trim()) {
      alert("企業名を入力してください");
      return;
    }
    setShowConfirm("salary");
  };

  const doSalarySubmit = async () => {
    setShowConfirm(null);
    setLoading(true);
    try {
      const [companyId, recaptchaToken] = await Promise.all([
        resolveCompanyId(salaryCompany, salaryNewName),
        getRecaptchaToken("submit_salary"),
      ]);
      await api.submitSalary({
        company_id: companyId,
        job_title: salaryForm.job_title || undefined,
        years_of_experience: parseInt(salaryForm.years_of_experience),
        salary: parseInt(salaryForm.salary),
        salary_breakdown: salaryForm.salary_breakdown || undefined,
        location: salaryForm.location || undefined,
        remote_type: salaryForm.remote_type || undefined,
        overtime_feeling: salaryForm.overtime_feeling || undefined,
        tech_stack: selectedTechStack.length > 0 ? selectedTechStack.join(",") : undefined,
        comment: salaryForm.comment || undefined,
        recaptcha_token: recaptchaToken || undefined,
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (interviewCompany === NEW_COMPANY_VALUE && !interviewNewName.trim()) {
      alert("企業名を入力してください");
      return;
    }
    const hasContent = Object.values(interviewContent).some((v) => v.checked);
    if (!hasContent) {
      alert("面接内容を少なくとも1つ選択してください");
      return;
    }
    setShowConfirm("interview");
  };

  const doInterviewSubmit = async () => {
    setShowConfirm(null);
    setLoading(true);
    try {
      const [companyId, recaptchaToken] = await Promise.all([
        resolveCompanyId(interviewCompany, interviewNewName),
        getRecaptchaToken("submit_interview"),
      ]);
      await api.submitInterview({
        company_id: companyId,
        job_title: interviewForm.job_title || undefined,
        employment_type: interviewForm.employment_type || undefined,
        interview_rounds: parseInt(interviewForm.interview_rounds),
        result: interviewForm.result || undefined,
        difficulty: interviewForm.difficulty || undefined,
        interview_content: JSON.stringify(interviewContent),
        recaptcha_token: recaptchaToken || undefined,
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleTechStack = (tech: string) => {
    setSelectedTechStack((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const updateInterviewContent = (
    key: keyof InterviewContent,
    field: "checked" | "comment",
    value: boolean | string
  ) => {
    setInterviewContent((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-gray-900">投稿ありがとうございます！</h2>
        <p className="text-gray-500 mt-2">管理者確認後に公開されます。</p>
        <button
          onClick={() => router.push("/companies")}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700"
        >
          企業一覧に戻る
        </button>
      </div>
    );
  }

  const salaryCompanyName =
    salaryCompany === NEW_COMPANY_VALUE
      ? salaryNewName
      : companies.find((c) => String(c.id) === salaryCompany)?.name ?? "";

  const interviewCompanyName =
    interviewCompany === NEW_COMPANY_VALUE
      ? interviewNewName
      : companies.find((c) => String(c.id) === interviewCompany)?.name ?? "";

  return (
    <div className="max-w-lg mx-auto">
      {/* 確認ポップアップ */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">投稿内容の確認</h2>
              <p className="text-sm text-gray-500 mb-4">以下の内容で投稿してよろしいですか？</p>
              <dl>
                {showConfirm === "salary" && (
                  <>
                    <ConfirmRow label="企業" value={salaryCompanyName} />
                    {salaryForm.job_title && <ConfirmRow label="職種" value={salaryForm.job_title} />}
                    <ConfirmRow label="経験年数" value={`${salaryForm.years_of_experience}年`} />
                    <ConfirmRow label="年収" value={`${salaryForm.salary}万円`} />
                    {salaryForm.salary_breakdown && <ConfirmRow label="年収内訳" value={salaryForm.salary_breakdown} />}
                    {salaryForm.location && <ConfirmRow label="勤務地" value={salaryForm.location} />}
                    {salaryForm.remote_type && <ConfirmRow label="リモート" value={salaryForm.remote_type} />}
                    {salaryForm.overtime_feeling && <ConfirmRow label="残業感" value={salaryForm.overtime_feeling} />}
                    {selectedTechStack.length > 0 && <ConfirmRow label="技術スタック" value={selectedTechStack.join(", ")} />}
                    {salaryForm.comment && <ConfirmRow label="コメント" value={salaryForm.comment} />}
                  </>
                )}
                {showConfirm === "interview" && (
                  <>
                    <ConfirmRow label="企業" value={interviewCompanyName} />
                    {interviewForm.job_title && <ConfirmRow label="職種" value={interviewForm.job_title} />}
                    {interviewForm.employment_type && <ConfirmRow label="雇用形態" value={interviewForm.employment_type} />}
                    <ConfirmRow label="面接回数" value={`${interviewForm.interview_rounds}回`} />
                    {interviewForm.result && <ConfirmRow label="結果" value={interviewForm.result} />}
                    {interviewForm.difficulty && <ConfirmRow label="難易度" value={interviewForm.difficulty} />}
                    {INTERVIEW_CONTENT_KEYS.filter(({ key }) => interviewContent[key].checked).map(({ key, label }) => (
                      <ConfirmRow key={key} label={label} value={interviewContent[key].comment || "あり"} />
                    ))}
                  </>
                )}
              </dl>
              <p className="text-xs text-gray-400 mt-4">投稿は匿名で送信されます。管理者確認後に公開されます。</p>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowConfirm(null)}
                  className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                  修正する
                </button>
                <button
                  onClick={showConfirm === "salary" ? doSalarySubmit : doInterviewSubmit}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700"
                >
                  投稿する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-2">情報を投稿する</h1>
      <p className="text-sm text-gray-500 mb-6">投稿は匿名で公開されます</p>

      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => setTab("salary")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
            tab === "salary" ? "bg-white shadow text-gray-900" : "text-gray-500"
          }`}
        >
          給与情報
        </button>
        <button
          onClick={() => setTab("interview")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
            tab === "interview" ? "bg-white shadow text-gray-900" : "text-gray-500"
          }`}
        >
          面接体験
        </button>
      </div>

      {/* 給与フォーム */}
      {tab === "salary" && (
        <form onSubmit={handleSalarySubmit} className="space-y-4">
          <CompanySelector
            companies={companies}
            value={salaryCompany}
            onChange={setSalaryCompany}
            newName={salaryNewName}
            setNewName={setSalaryNewName}
          />
          <div>
            <label className={labelClass}>職種</label>
            <select
              value={salaryForm.job_title}
              onChange={(e) => setSalaryForm({ ...salaryForm, job_title: e.target.value })}
              className={inputClass}
            >
              <option value="">選択してください</option>
              {JOB_TITLES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>経験年数 <span className="text-red-500">*</span></label>
              <select
                required
                value={salaryForm.years_of_experience}
                onChange={(e) => setSalaryForm({ ...salaryForm, years_of_experience: e.target.value })}
                className={inputClass}
              >
                <option value="">選択してください</option>
                {EXPERIENCE_OPTIONS.map((o) => (
                  <option key={o.value} value={String(o.value)}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>年収合計（万円）<span className="text-red-500">*</span></label>
              <input
                required
                type="number"
                min="100"
                max="10000"
                placeholder="例: 700"
                value={salaryForm.salary}
                onChange={(e) => setSalaryForm({ ...salaryForm, salary: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>年収内訳（任意）</label>
            <input
              type="text"
              placeholder="例: 基本給600万、賞与100万"
              value={salaryForm.salary_breakdown}
              onChange={(e) => setSalaryForm({ ...salaryForm, salary_breakdown: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>勤務地</label>
            <select
              value={salaryForm.location}
              onChange={(e) => setSalaryForm({ ...salaryForm, location: e.target.value })}
              className={inputClass}
            >
              <option value="">選択してください</option>
              {LOCATION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>リモート可否</label>
            <select
              value={salaryForm.remote_type}
              onChange={(e) => setSalaryForm({ ...salaryForm, remote_type: e.target.value })}
              className={inputClass}
            >
              <option value="">選択してください</option>
              {REMOTE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>残業感</label>
            <select
              value={salaryForm.overtime_feeling}
              onChange={(e) => setSalaryForm({ ...salaryForm, overtime_feeling: e.target.value })}
              className={inputClass}
            >
              <option value="">選択してください</option>
              {OVERTIME_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>技術スタック（任意・複数選択可）</label>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK_OPTIONS.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTechStack(tech)}
                  className={`px-3 py-1 rounded-full text-xs border transition ${
                    selectedTechStack.includes(tech)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-600 hover:border-blue-400"
                  }`}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>コメント（任意）</label>
            <textarea
              rows={3}
              placeholder="職場環境や待遇について..."
              value={salaryForm.comment}
              onChange={(e) => setSalaryForm({ ...salaryForm, comment: e.target.value })}
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "送信中..." : "投稿する"}
          </button>
          <p className="text-center text-xs text-gray-400">投稿内容は管理者が確認した後に公開されます</p>
        </form>
      )}

      {/* 面接フォーム */}
      {tab === "interview" && (
        <form onSubmit={handleInterviewSubmit} className="space-y-4">
          <CompanySelector
            companies={companies}
            value={interviewCompany}
            onChange={setInterviewCompany}
            newName={interviewNewName}
            setNewName={setInterviewNewName}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>職種</label>
              <select
                value={interviewForm.job_title}
                onChange={(e) => setInterviewForm({ ...interviewForm, job_title: e.target.value })}
                className={inputClass}
              >
                <option value="">選択してください</option>
                {JOB_TITLES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>雇用形態</label>
              <select
                value={interviewForm.employment_type}
                onChange={(e) => setInterviewForm({ ...interviewForm, employment_type: e.target.value })}
                className={inputClass}
              >
                <option value="">選択してください</option>
                {EMPLOYMENT_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>面接回数 <span className="text-red-500">*</span></label>
              <input
                required
                type="number"
                min="1"
                max="20"
                placeholder="例: 3"
                value={interviewForm.interview_rounds}
                onChange={(e) => setInterviewForm({ ...interviewForm, interview_rounds: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>結果</label>
              <select
                value={interviewForm.result}
                onChange={(e) => setInterviewForm({ ...interviewForm, result: e.target.value })}
                className={inputClass}
              >
                <option value="">選択してください</option>
                {RESULT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>難易度</label>
            <div className="flex gap-2 flex-wrap">
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setInterviewForm({ ...interviewForm, difficulty: d })}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    interviewForm.difficulty === d
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 text-gray-600 hover:border-blue-400"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* 面接内容 */}
          <div>
            <label className={labelClass}>面接内容</label>
            <div className="space-y-3">
              {INTERVIEW_CONTENT_KEYS.map(({ key, label }) => (
                <div key={key} className="border border-gray-200 rounded-xl p-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={interviewContent[key].checked}
                      onChange={(e) => updateInterviewContent(key, "checked", e.target.checked)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </label>
                  {interviewContent[key].checked && (
                    <textarea
                      rows={2}
                      placeholder={`${label}の内容を記述...`}
                      value={interviewContent[key].comment || ""}
                      onChange={(e) => updateInterviewContent(key, "comment", e.target.value)}
                      className={`${inputClass} mt-2 text-sm`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "送信中..." : "投稿する"}
          </button>
          <p className="text-center text-xs text-gray-400">投稿内容は管理者が確認した後に公開されます</p>
        </form>
      )}
    </div>
  );
}

export default function SubmitPage() {
  return (
    <Suspense>
      <SubmitForm />
    </Suspense>
  );
}
