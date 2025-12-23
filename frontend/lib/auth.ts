import { apiClient } from "./api";

export async function login(email: string, password: string) {
  const data = await apiClient("/api/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: email,
      password: password,
    }),
  });
}

export function logout() {
  await apiClient("/api/auth/logout", {
    method: "POST",
  });
}

export async function updateMyRole(role: "user" | "interviewer") {
  return apiClient("/api/auth/role", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
}
