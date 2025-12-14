// lib/api/interview.ts
import { apiClient } from "./api";

/**
 * 面接（Interview）データ構造
 */
export interface Interview {
  id: number;
  candidate_name: string;
  interviewer_name?: string;
  interviewer_id: number;
  user_id: number;
  status: "pending" | "confirmed" | "completed" | "canceled";
}

/**
 * 面接作成用 Payload
 */
export interface CreateInterviewPayload {
  interviewer_id: number;
  scheduled_at: string; // ISO 8601
  message?: string;
}

/**
 * 面接作成レスポンス
 */
export interface CreateInterviewResponse {
  id: number;
  interviewer_id: number;
  user_id: number;
  scheduled_at: string;
  status: "pending";
}

/**
 * 面接詳細レスポンス
 */
export interface InterviewDetail extends Interview {
  notes?: string;
  feedback?: string;
}

/**
 * 自分の面接一覧を取得
 */
export async function fetchInterviews(): Promise<Interview[]> {
  return apiClient("/api/interviews", { method: "GET" });
}

/**
 * 面接の詳細を取得
 */
export async function fetchInterviewDetail(id: string): Promise<InterviewDetail> {
  return apiClient(`/api/interviews/${id}`, { method: "GET" });
}

/**
 * 面接リクエストの作成
 */
export async function createInterview(
  payload: CreateInterviewPayload
): Promise<CreateInterviewResponse> {
  return apiClient("/api/interviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
