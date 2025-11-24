import { apiClient } from "./api";

export async function searchInterviewers(keyword: string) {
  return apiClient(`/interviewers/search?keyword=${keyword}`, {
    method: "GET",
  });
}