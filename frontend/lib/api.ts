export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiClient(path: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include", 
    headers:{
      ...options?.headers,
    }
  });

  if (!res.ok) {
    const data = await res.text();
    throw new Error(`API Error: ${res.status} - ${data}`);
  }

  return res.json();
}
