import { Router } from "express";
import { loginSchema, registerSchema } from "@n5deal/shared";
import { prisma } from "../db";
import { hashPassword, verifyPassword } from "../lib/password";
import { clearSessionCookies, setSessionCookies } from "../lib/cookies";
import { asyncHandler } from "../lib/asyncHandler";
import { parseBody } from "../lib/validate";
import { loadCurrentUser, requireAuth } from "../middleware/auth";
import { toPublicUser } from "../serializers";

export const authRouter = Router();

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const data = parseBody(registerSchema, req.body, res);
    if (!data) return;

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: data.role as "BUYER" | "SELLER",
        name: data.name,
        company: data.company ?? null,
        phone: data.phone ?? null,
      },
    });

    setSessionCookies(res, user);
    res.status(201).json({ user: toPublicUser(user) });
  })
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const data = parseBody(loginSchema, req.body, res);
    if (!data) return;

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if (user.status === "SUSPENDED") {
      return res.status(403).json({ error: "Account suspended", reason: user.statusReason });
    }

    setSessionCookies(res, user);
    res.json({ user: toPublicUser(user) });
  })
);

authRouter.post("/logout", (_req, res) => {
  clearSessionCookies(res);
  res.status(204).end();
});

authRouter.get(
  "/me",
  requireAuth,
  loadCurrentUser,
  asyncHandler(async (req, res) => {
    res.json({ user: toPublicUser(req.currentUser!) });
  })
);
