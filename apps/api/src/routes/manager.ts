import { Router } from "express";
import { managerAssetFilterSchema, managerUserFilterSchema, statusUpdateSchema } from "@n5deal/shared";
import type { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { asyncHandler } from "../lib/asyncHandler";
import { parseBody } from "../lib/validate";
import { loadCurrentUser, requireAuth, requireRole } from "../middleware/auth";
import { toAsset, toBuyerProfile, toPublicUser } from "../serializers";

export const managerRouter = Router();

managerRouter.use(requireAuth, requireRole("MANAGER"), loadCurrentUser);

managerRouter.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    const [buyers, sellers, activeAssets, suspendedUsers, suspendedAssets, portfolio, bySector] =
      await Promise.all([
        prisma.user.count({ where: { role: "BUYER" } }),
        prisma.user.count({ where: { role: "SELLER" } }),
        prisma.asset.count({ where: { status: "ACTIVE" } }),
        prisma.user.count({ where: { status: "SUSPENDED" } }),
        prisma.asset.count({ where: { status: { in: ["SUSPENDED", "REMOVED"] } } }),
        prisma.asset.aggregate({ where: { status: "ACTIVE" }, _sum: { dealSize: true } }),
        prisma.asset.groupBy({ by: ["sector"], where: { status: "ACTIVE" }, _count: true }),
      ]);

    res.json({
      buyers,
      sellers,
      activeAssets,
      suspendedUsers,
      suspendedAssets,
      totalPortfolioValue: portfolio._sum.dealSize ?? 0,
      sectorBreakdown: bySector
        .map((s) => ({ sector: s.sector, count: s._count }))
        .sort((a, b) => b.count - a.count),
    });
  })
);

managerRouter.get(
  "/users",
  asyncHandler(async (req, res) => {
    const { role, status, keyword } = managerUserFilterSchema.parse(req.query);
    const where: Prisma.UserWhereInput = { role: { in: ["BUYER", "SELLER"] } };
    if (role) where.role = role;
    if (status) where.status = status;
    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { email: { contains: keyword } },
        { company: { contains: keyword } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: { buyerProfile: { include: { sectors: true, regions: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      users: users.map((u) => ({
        ...toPublicUser(u),
        profile: u.buyerProfile ? toBuyerProfile(u.buyerProfile) : null,
      })),
    });
  })
);

managerRouter.patch(
  "/users/:id/status",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) return res.status(404).json({ error: "User not found" });
    if (target.role === "MANAGER") {
      return res.status(400).json({ error: "Manager accounts cannot be suspended here" });
    }

    const data = parseBody(statusUpdateSchema, req.body, res);
    if (!data) return;
    if (data.status === "REMOVED") {
      return res.status(400).json({ error: "Use ACTIVE or SUSPENDED for user accounts" });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        status: data.status as "ACTIVE" | "SUSPENDED",
        statusReason: data.status === "SUSPENDED" ? data.reason ?? "Policy violation" : null,
        statusChangedAt: new Date(),
      },
    });

    res.json({ user: toPublicUser(user) });
  })
);

managerRouter.get(
  "/assets",
  asyncHandler(async (req, res) => {
    const { status, sector, region, keyword } = managerAssetFilterSchema.parse(req.query);
    const where: Prisma.AssetWhereInput = {};
    if (status) where.status = status;
    if (sector) where.sector = sector;
    if (region) where.region = region;
    if (keyword) {
      where.OR = [{ title: { contains: keyword } }, { description: { contains: keyword } }];
    }

    const assets = await prisma.asset.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json({ assets: assets.map(toAsset) });
  })
);

managerRouter.patch(
  "/assets/:id/status",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const existing = await prisma.asset.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Asset not found" });

    const data = parseBody(statusUpdateSchema, req.body, res);
    if (!data) return;

    const asset = await prisma.asset.update({
      where: { id },
      data: {
        status: data.status as "ACTIVE" | "SUSPENDED" | "REMOVED",
        statusReason: data.status !== "ACTIVE" ? data.reason ?? "Policy violation" : null,
        statusChangedAt: new Date(),
      },
    });

    res.json({ asset: toAsset(asset) });
  })
);
