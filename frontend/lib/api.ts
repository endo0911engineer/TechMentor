const API_URL =
  typeof window === "undefined"
    ? process.env.API_URL || "http://localhost:8000"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Company {
  id: number;
  name: string;
  description?: string;
  industry?: string;
  employee_count?: number;
  founded_year?: number;
  headquarters?: string;
  tech_stack?: string;
}

export interface CompanyStats {
  avg_salary?: number;
  median_salary?: number;
  min_salary?: number;
  max_salary?: number;
  submission_count: number;
}

export interface CompanyWithStats extends Company {
  stats: CompanyStats;
}

export interface InterviewContentItem {
  checked: boolean;
  comment?: string;
}

export interface InterviewContent {
  coding: InterviewContentItem;
  system_design: InterviewContentItem;
  behavioral: InterviewContentItem;
  case: InterviewContentItem;
  english: InterviewContentItem;
  other: InterviewContentItem;
}

export interface SalarySubmission {
  id: number;
  company_id: number;
  job_title?: string;
  years_of_experience?: number;
  salary?: number;
  salary_breakdown?: string;
  location?: string;
  remote_type?: string;
  overtime_feeling?: string;
  tech_stack?: string;
  comment?: string;
  created_at: string;
}

export interface InterviewSubmission {
  id: number;
  company_id: number;
  job_title?: string;
  interview_rounds?: number;
  result?: string;
  difficulty?: string;
  tags?: string;
  interview_content?: string;
  created_at: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content?: string;
  created_at: string;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  createCompany: (data: Omit<Company, "id">) =>
    apiFetch<Company>("/companies", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getCompanies: (params?: { search?: string; industry?: string }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set("search", params.search);
    if (params?.industry) qs.set("industry", params.industry);
    const query = qs.toString() ? `?${qs}` : "";
    return apiFetch<Company[]>(`/companies${query}`);
  },
  getCompany: (id: number) => apiFetch<Company>(`/companies/${id}`),
  getCompanyStats: (id: number) => apiFetch<CompanyStats>(`/companies/${id}/stats`),
  getCompaniesWithStats: async (params?: { search?: string }): Promise<CompanyWithStats[]> => {
    const companies = await api.getCompanies(params);
    const stats = await Promise.all(companies.map((c) => api.getCompanyStats(c.id)));
    return companies
      .map((c, i) => ({ ...c, stats: stats[i] }))
      .filter((c) => c.stats.submission_count > 0);
  },
  getSalarySubmissions: (id: number) =>
    apiFetch<SalarySubmission[]>(`/companies/${id}/salary-submissions`),
  getInterviewSubmissions: (id: number) =>
    apiFetch<InterviewSubmission[]>(`/companies/${id}/interview-submissions`),
  submitSalary: (data: Omit<SalarySubmission, "id" | "created_at">) =>
    apiFetch<SalarySubmission>("/salary-submissions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  submitInterview: (data: Omit<InterviewSubmission, "id" | "created_at">) =>
    apiFetch<InterviewSubmission>("/interview-submissions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getInterviewSubmission: (id: number) =>
    apiFetch<InterviewSubmission>(`/interview-submissions/${id}`),
  getArticles: () => apiFetch<Article[]>("/articles"),
  getArticle: (slug: string) => apiFetch<Article>(`/articles/${slug}`),
};
