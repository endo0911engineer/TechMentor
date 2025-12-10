import { apiClient } from "./api";

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  role: "user" | "interviewer";
  token_type: string;
  access_expires_at: string;
  refresh_expires_at: string;
}

export async function login(email: string, password: string): Promise<LoginResponse>  {
  const form = new FormData();
  form.append("username", email);
  form.append("password", password);
  
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

  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  return data;
}

export async function refreshToken(): Promise<LoginResponse> {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) throw new Error("No refresh token");

  const res = await apiClient("/auth/token/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refresh }),
  });

  localStorage.setItem("access_token", res.access_token);
  localStorage.setItem("refresh_token", res.refresh_token);

  return res;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}