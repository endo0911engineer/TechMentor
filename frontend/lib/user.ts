import { apiClient } from "./api";

export async function fetchMe() {
  return apiClient("/api/auth/me", { method: "GET" });
}

export async function register(name: string, email: string, password: string) {
  const res = await apiClient("/api/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", 
    },
    body: JSON.stringify({ name, email, password }),
  });

  localStorage.setItem("access_token", res.access_token);
  return res;
}

