import type { NextFunction, Request, Response } from "express";
import type { Role } from "@n5deal/shared";
import { SESSION_COOKIE, verifySession } from "../lib/jwt";
import { prisma } from "../db";

export function attachSession(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (token) {
    const payload = verifySession(token);
    if (payload) req.user = payload;
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}

/** Loads the fresh DB record for the session user and rejects suspended accounts. */
export async function loadCurrentUser(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  if (!user) {
    return res.status(401).json({ error: "Account no longer exists" });
  }
  if (user.status === "SUSPENDED") {
    return res.status(403).json({ error: "Account suspended", reason: user.statusReason });
  }
  req.currentUser = user;
  next();
}
