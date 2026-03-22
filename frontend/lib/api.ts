/**
 * API client for DevPay backend.
 * TypeScript types are auto-generated from the FastAPI OpenAPI schema.
 * To regenerate: npm run generate:types
 */
import type { components } from "./generated";

const API_URL =
  typeof window === "undefined"
    ? process.env.API_URL || "http://localhost:8000"
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Re-export schema types for use across the app
export type Company = components["schemas"]["CompanyRead"];
export type CompanyStats = components["schemas"]["CompanyStats"];
export type SalarySubmission = components["schemas"]["SalarySubmissionRead"];
export type InterviewSubmission = components["schemas"]["InterviewSubmissionRead"];
export type Article = components["schemas"]["ArticleRead"];
export type Industry = components["schemas"]["IndustryRead"];

export interface CompanyWithStats extends Company {
  stats: CompanyStats;
}

// InterviewContent is stored as JSON string; define structure here
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

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  createCompany: (data: components["schemas"]["CompanyCreate"]) =>
    apiFetch<Company>("/companies", { method: "POST", body: JSON.stringify(data) }),

  getCompanies: (params?: { search?: string; industry?: string; tech_stack?: string }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set("search", params.search);
    if (params?.industry) qs.set("industry", params.industry);
    if (params?.tech_stack) qs.set("tech_stack", params.tech_stack);
    const query = qs.toString() ? `?${qs}` : "";
    return apiFetch<Company[]>(`/companies${query}`);
  },

  getCompany: (id: number) => apiFetch<Company>(`/companies/${id}`),
  getCompanyStats: (id: number) => apiFetch<CompanyStats>(`/companies/${id}/stats`),

  getCompaniesWithStats: async (params?: {
    search?: string;
    industry?: string;
    tech_stack?: string;
  }): Promise<CompanyWithStats[]> => {
    const companies = await api.getCompanies(params);
    const statsResults = await Promise.allSettled(companies.map((c) => api.getCompanyStats(c.id)));
    return companies
      .map((c, i) => ({
        ...c,
        stats: statsResults[i].status === "fulfilled"
          ? (statsResults[i] as PromiseFulfilledResult<CompanyStats>).value
          : { submission_count: 0, tech_stacks: [] },
      }))
      .filter((c) => c.stats.submission_count > 0);
  },

  getSalarySubmissions: (id: number) =>
    apiFetch<SalarySubmission[]>(`/companies/${id}/salary-submissions`),

  getInterviewSubmissions: (id: number) =>
    apiFetch<InterviewSubmission[]>(`/companies/${id}/interview-submissions`),

  submitSalary: (data: components["schemas"]["SalarySubmissionCreate"]) =>
    apiFetch<SalarySubmission>("/salary-submissions", { method: "POST", body: JSON.stringify(data) }),

  submitInterview: (data: components["schemas"]["InterviewSubmissionCreate"]) =>
    apiFetch<InterviewSubmission>("/interview-submissions", { method: "POST", body: JSON.stringify(data) }),

  getInterviewSubmission: (id: number) =>
    apiFetch<InterviewSubmission>(`/interview-submissions/${id}`),

  getArticles: () => apiFetch<Article[]>("/articles"),
  getArticle: (slug: string) => apiFetch<Article>(`/articles/${slug}`),

  getStats: () =>
    apiFetch<{ company_count: number; salary_count: number; interview_count: number }>("/stats"),

  getAllInterviews: () =>
    apiFetch<(InterviewSubmission & { company_name: string })[]>("/interview-submissions"),

  getIndustries: () => apiFetch<Industry[]>("/industries"),
  getTechStacks: () => apiFetch<string[]>("/companies/tech-stacks"),
};
