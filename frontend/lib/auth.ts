import { apiClient } from "./api";

export async function login(email: string, password: string) {
  const res = await apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem("access_token", res.access_token);
  return res;
}

export async function register(email: string, password: string) {
  const res = await apiClient("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem("access_token", res.access_token);
  return res;
}
