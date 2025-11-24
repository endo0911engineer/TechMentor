import { apiClient } from "./api";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: "user" | "interviewer";
  skill?: string;
  experience?: number;
  job_type?: string;
  profile?: any;
}

export async function fetchProfile(): Promise<UserProfile> {
  return apiClient("/users/me");
}

export async function updateProfile(data: Partial<UserProfile>) {
  return apiClient("/users/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
