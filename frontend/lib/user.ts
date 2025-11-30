import { apiClient } from "./api";

export async function fetchMe() {
  return apiClient("/auth/me", { method: "GET" });
}

export async function register(name: string, email: string, password: string) {
  const res = await apiClient("/api/users/register", {
    method: "POST",
    body: JSON.stringify({ name: name, email: email, password: password }),
  });

  localStorage.setItem("access_token", res.access_token);
  return res;
}

