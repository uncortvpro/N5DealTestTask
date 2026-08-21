"use client";

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function apiClient<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (data && (data.error as string)) || `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data?.details);
  }

  return data as T;
}
