// lib/payment.ts
import { apiClient } from "./api";

// 支払い情報取得 or Checkout セッション作成
export async function createPaymentIntent(interviewId: string) {
  return apiClient(`/payments/interview/${interviewId}`, { method: "POST" });
}