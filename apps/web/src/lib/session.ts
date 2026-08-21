import "server-only";
import { redirect } from "next/navigation";
import type { PublicUser, Role } from "@n5deal/shared";
import { apiFetch } from "./serverFetch";
import { roleHome } from "./roleHome";

export { roleHome };

export async function getSession(): Promise<PublicUser | null> {
  const { ok, data } = await apiFetch<{ user: PublicUser }>("/api/auth/me");
  return ok ? data.user : null;
}

/** Server-side route guard: redirects to /login (or the user's own home) when the session is missing or the role doesn't match. */
export async function requireSession(allowedRoles?: Role[]): Promise<PublicUser> {
  const user = await getSession();
  if (!user) redirect("/login");
  if (allowedRoles && !allowedRoles.includes(user.role)) redirect(roleHome(user.role));
  return user;
}
