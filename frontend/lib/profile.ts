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
  return apiClient("/api/profile/me");
}

export async function createProfile(data: Partial<UserProfile>) {
  return apiClient("/api/profile/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateProfile(data: Partial<UserProfile>) {
  return apiClient("/api/profile/me", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}


