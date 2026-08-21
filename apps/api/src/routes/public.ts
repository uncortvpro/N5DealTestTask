import { Router } from "express";
import { prisma } from "../db";
import { asyncHandler } from "../lib/asyncHandler";

export const publicRouter = Router();

/**
 * Unauthenticated, non-sensitive counts for the marketing landing page —
 * mirrors the "X listings live" trust signal real marketplaces show
 * publicly, without exposing anything a logged-out visitor shouldn't see.
 */
publicRouter.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    const [buyers, sellers, activeAssets, sectors] = await Promise.all([
      prisma.user.count({ where: { role: "BUYER", status: "ACTIVE" } }),
      prisma.user.count({ where: { role: "SELLER", status: "ACTIVE" } }),
      prisma.asset.count({ where: { status: "ACTIVE" } }),
      prisma.asset.findMany({
        where: { status: "ACTIVE" },
        select: { sector: true },
        distinct: ["sector"],
      }),
    ]);

    res.json({ buyers, sellers, activeAssets, sectors: sectors.length });
  })
);
