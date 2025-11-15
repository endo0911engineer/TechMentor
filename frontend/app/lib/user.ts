import { apiClient } from "./api";

export async function fetchProfile() {
  return apiClient("/users/me");
}

export async function updateProfile(data: any) {
  return apiClient("/users/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
