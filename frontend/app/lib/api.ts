export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiClient(path: string, options?: RequestInit) {
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
}
