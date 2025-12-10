import { apiClient } from "./api";

export interface Interviewer {
  id: number;
  name: string;
  skill: string;
  hourly_rate: number;
  profile?: any;
}

export async function fetchInterviewers(): Promise<Interviewer[]> {
  return await apiClient("/api/interviewers");
}

export async function fetchInterviewer(id: number): Promise<Interviewer> {
  return apiClient(`/api/interviewers/${id}`);
}
