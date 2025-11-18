import { apiClient } from "./api";

export interface Interviewer {
  id: number;
  name: string;
  skill: string;
  hourly_rate: number;
  profile?: any;
}

export async function fetchInterviewers(): Promise<Interviewer[]> {
  const res = await apiClient("/api/v1/interviewers");
  return res.json();
}

export async function fetchInterviewer(id: number): Promise<Interviewer> {
  return apiClient(`/api/v1/interviewers/${id}`);
}
