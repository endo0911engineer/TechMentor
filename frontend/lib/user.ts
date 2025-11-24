import { apiClient } from "./api";

export async function fetchMe() {
  return apiClient("/auth/me", { method: "GET" });
}
