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

/**
 * Sector/region are manager-editable rows, not a fixed enum, so every
 * dropdown and label lookup in the UI fetches the current active set here
 * instead of importing a compile-time list. Public (no auth) since the
 * landing page's sector strip and the register flow both need it before a
 * session exists.
 */
publicRouter.get(
  "/taxonomy",
  asyncHandler(async (_req, res) => {
    const [sectors, regions] = await Promise.all([
      prisma.sector.findMany({ where: { active: true }, orderBy: { label: "asc" } }),
      prisma.region.findMany({ where: { active: true }, orderBy: { label: "asc" } }),
    ]);

    res.json({
      sectors: sectors.map((s) => ({ key: s.key, label: s.label })),
      regions: regions.map((r) => ({ key: r.key, label: r.label })),
    });
  })
);
