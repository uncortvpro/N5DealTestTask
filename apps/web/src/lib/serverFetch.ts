import "server-only";
import { cookies } from "next/headers";
import { API_INTERNAL_URL } from "./config";

export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T;
}

/** Server-component-only fetch that forwards the visitor's cookies to the internal API. */
export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResult<T>> {
  const cookieHeader = cookies().toString();
  const res = await fetch(`${API_INTERNAL_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      cookie: cookieHeader,
      ...init.headers,
    },
    cache: "no-store",
  });

  const data = (await res.json().catch(() => null)) as T;
  return { ok: res.ok, status: res.status, data };
}
