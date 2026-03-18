"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api, Company, InterviewContent } from "@/lib/api";

const NEW_COMPANY_VALUE = "__new__";

const JOB_TITLES = [
  "バックエンドエンジニア",
  "フロントエンドエンジニア",
  "フルスタックエンジニア",
  "モバイルエンジニア（iOS）",
  "モバイルエンジニア（Android）",
  "インフラ / SREエンジニア",
  "データエンジニア",
  "機械学習 / AIエンジニア",
  "セキュリティエンジニア",
  "QAエンジニア",
  "プロダクトマネージャー",
  "エンジニアリングマネージャー",
  "その他",
];

const REMOTE_OPTIONS = [
  "フルリモート",
  "一部リモート（週3日以上）",
  "一部リモート（週1〜2日）",
  "出社のみ",
];

const OVERTIME_OPTIONS = [
  "ほぼなし（月10時間未満）",
  "少ない（月10〜20時間）",
  "普通（月20〜40時間）",
  "多い（月40〜60時間）",
  "非常に多い（月60時間以上）",
];

const TECH_STACK_OPTIONS = [
  // 言語
  "TypeScript", "JavaScript", "Python", "Go", "Java", "Kotlin", "Swift",
  "Ruby", "Rust", "C#", "C++", "PHP", "Scala",
  // フロントエンド
  "React", "Next.js", "Vue.js", "Nuxt.js", "Angular",
  // バックエンド
  "Node.js", "FastAPI", "Django", "Ruby on Rails", "Spring Boot", "Laravel",
  // インフラ / クラウド
  "AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform",
  // DB
  "PostgreSQL", "MySQL", "MongoDB", "Redis",
];

const LOCATION_OPTIONS = [
  "東京",
  "神奈川",
  "大阪",
  "愛知",
  "福岡",
  "北海道",
  "宮城",
  "広島",
  "その他",
];

const RESULT_OPTIONS = ["合格", "不合格", "辞退", "選考中"];

const DIFFICULTY_OPTIONS = [
  "とても簡単",
  "簡単",
  "普通",
  "難しい",
  "とても難しい",
];

const INTERVIEW_CONTENT_KEYS: { key: keyof InterviewContent; label: string }[] = [
  { key: "coding", label: "コーディング試験" },
  { key: "system_design", label: "システムデザイン" },
  { key: "behavioral", label: "行動面接（Behavioral）" },
  { key: "case", label: "ケース面接" },
  { key: "english", label: "英語面接" },
  { key: "other", label: "その他" },
];

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

  const defaultCompanyId = searchParams.get("company_id") || "";

  const [salaryCompany, setSalaryCompany] = useState(defaultCompanyId);
  const [salaryNewName, setSalaryNewName] = useState("");
  const [salaryNewIndustry, setSalaryNewIndustry] = useState("");

  const [interviewCompany, setInterviewCompany] = useState(defaultCompanyId);
  const [interviewNewName, setInterviewNewName] = useState("");
  const [interviewNewIndustry, setInterviewNewIndustry] = useState("");

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
    newName: string,
    newIndustry: string
  ): Promise<number> => {
    if (selectedValue === NEW_COMPANY_VALUE) {
      const company = await api.createCompany({ name: newName, industry: newIndustry || undefined });
      return company.id;
    }
    return parseInt(selectedValue);
  };

  const handleSalarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (salaryCompany === NEW_COMPANY_VALUE && !salaryNewName.trim()) {
      alert("企業名を入力してください");
      return;
    }
    setLoading(true);
    try {
      const companyId = await resolveCompanyId(salaryCompany, salaryNewName, salaryNewIndustry);
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
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (interviewCompany === NEW_COMPANY_VALUE && !interviewNewName.trim()) {
      alert("企業名を入力してください");
      return;
    }
    setLoading(true);
    try {
      const companyId = await resolveCompanyId(interviewCompany, interviewNewName, interviewNewIndustry);
      await api.submitInterview({
        company_id: companyId,
        job_title: interviewForm.job_title || undefined,
        interview_rounds: parseInt(interviewForm.interview_rounds),
        result: interviewForm.result || undefined,
        difficulty: interviewForm.difficulty || undefined,
        interview_content: JSON.stringify(interviewContent),
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

  const inputClass =
    "w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  const CompanySelector = ({
    value,
    onChange,
    newName,
    setNewName,
    newIndustry,
    setNewIndustry,
  }: {
    value: string;
    onChange: (v: string) => void;
    newName: string;
    setNewName: (v: string) => void;
    newIndustry: string;
    setNewIndustry: (v: string) => void;
  }) => (
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
          <div>
            <label className={labelClass}>業種（任意）</label>
            <input
              type="text"
              placeholder="例: SaaS / クラウド"
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="max-w-lg mx-auto">
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
            value={salaryCompany}
            onChange={setSalaryCompany}
            newName={salaryNewName}
            setNewName={setSalaryNewName}
            newIndustry={salaryNewIndustry}
            setNewIndustry={setSalaryNewIndustry}
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
              <input
                required
                type="number"
                min="0"
                max="50"
                placeholder="例: 5"
                value={salaryForm.years_of_experience}
                onChange={(e) => setSalaryForm({ ...salaryForm, years_of_experience: e.target.value })}
                className={inputClass}
              />
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
        </form>
      )}

      {/* 面接フォーム */}
      {tab === "interview" && (
        <form onSubmit={handleInterviewSubmit} className="space-y-4">
          <CompanySelector
            value={interviewCompany}
            onChange={setInterviewCompany}
            newName={interviewNewName}
            setNewName={setInterviewNewName}
            newIndustry={interviewNewIndustry}
            setNewIndustry={setInterviewNewIndustry}
          />
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
