// lib/interview.ts
import { apiClient } from "./api";

export interface Interview {
  id: number;
  candidate_name: string;
  scheduled_at: string;
  status: "pending" | "confirmed" | "completed";
}

// 自分の面接スケジュール一覧
export async function getMyInterviews(): Promise<Interview[]> {
  return apiClient("/interviews");
}