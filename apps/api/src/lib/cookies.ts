import type { Response } from "express";
import type { User } from "@prisma/client";
import { ROLE_COOKIE, SESSION_COOKIE } from "@n5deal/shared";
import { signSession } from "./jwt";

const isProd = process.env.NODE_ENV === "production";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function setSessionCookies(res: Response, user: User) {
  const token = signSession({ userId: user.id, role: user.role });

  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    maxAge: MAX_AGE_MS,
    path: "/",
  });

  // Non-sensitive hint cookie so the Next.js edge middleware can gate
  // routes without a network round-trip; the API still re-verifies the
  // JWT and DB status on every request, so this is UX-only.
  res.cookie(ROLE_COOKIE, user.role, {
    httpOnly: false,
    sameSite: "lax",
    secure: isProd,
    maxAge: MAX_AGE_MS,
    path: "/",
  });
}

export function clearSessionCookies(res: Response) {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
  res.clearCookie(ROLE_COOKIE, { path: "/" });
}
