// lib/reward.ts
import { apiClient } from "./api";

export interface Reward {
  id: number;
  interview_id: number;
  amount: number;
  status: "pending" | "paid";
  created_at: string;
}

export async function fetchRewards(): Promise<Reward[]> {
  return apiClient("/rewards");
}
