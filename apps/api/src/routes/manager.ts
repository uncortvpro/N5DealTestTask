import { Router } from "express";
import {
  managerAssetFilterSchema,
  managerUserFilterSchema,
  statusUpdateSchema,
  taxonomyCreateSchema,
  taxonomyUpdateSchema,
} from "@n5deal/shared";
import type { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { asyncHandler } from "../lib/asyncHandler";
import { parseBody } from "../lib/validate";
import { loadCurrentUser, requireAuth, requireRole } from "../middleware/auth";
import { toAsset, toBuyerProfile, toPublicUser } from "../serializers";

/** "New Sector Name" -> "NEW_SECTOR_NAME" — mirrors the fixed enum keys this replaced. */
function generateTaxonomyKey(label: string): string {
  return label
    .trim()
    .toUpperCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
}

export const managerRouter = Router();

managerRouter.use(requireAuth, requireRole("MANAGER"), loadCurrentUser);

managerRouter.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    const [buyers, sellers, activeAssets, suspendedUsers, suspendedAssets, portfolio, bySector, sectors] =
      await Promise.all([
        prisma.user.count({ where: { role: "BUYER" } }),
        prisma.user.count({ where: { role: "SELLER" } }),
        prisma.asset.count({ where: { status: "ACTIVE" } }),
        prisma.user.count({ where: { status: "SUSPENDED" } }),
        prisma.asset.count({ where: { status: { in: ["SUSPENDED", "REMOVED"] } } }),
        prisma.asset.aggregate({ where: { status: "ACTIVE" }, _sum: { dealSize: true } }),
        prisma.asset.groupBy({ by: ["sector"], where: { status: "ACTIVE" }, _count: true }),
        prisma.sector.findMany(),
      ]);

    const sectorLabel = new Map(sectors.map((s) => [s.key, s.label]));

    res.json({
      buyers,
      sellers,
      activeAssets,
      suspendedUsers,
      suspendedAssets,
      totalPortfolioValue: portfolio._sum.dealSize ?? 0,
      sectorBreakdown: bySector
        .map((s) => ({ sector: s.sector, label: sectorLabel.get(s.sector) ?? s.sector, count: s._count }))
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
      include: {
        buyerProfile: {
          include: { sectors: { include: { sectorRef: true } }, regions: { include: { regionRef: true } } },
        },
      },
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

    const assets = await prisma.asset.findMany({
      where,
      include: { sectorRef: true, regionRef: true },
      orderBy: { createdAt: "desc" },
    });
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
      include: { sectorRef: true, regionRef: true },
    });

    res.json({ asset: toAsset(asset) });
  })
);

/**
 * Sector/region admin. No hard delete on purpose: Asset/BuyerSector rows
 * reference these by key with a real foreign key, so removing one out from
 * under existing data isn't safe. Deactivating hides it from new dropdowns
 * (see GET /api/public/taxonomy) without touching anything that already
 * references it. `key` is set once at creation and never edited, so
 * existing references never go stale.
 */
managerRouter.get(
  "/taxonomy",
  asyncHandler(async (_req, res) => {
    const [sectors, regions] = await Promise.all([
      prisma.sector.findMany({
        orderBy: { label: "asc" },
        include: { _count: { select: { assets: true, buyerSectors: true } } },
      }),
      prisma.region.findMany({
        orderBy: { label: "asc" },
        include: { _count: { select: { assets: true, buyerRegions: true } } },
      }),
    ]);

    res.json({
      sectors: sectors.map((s) => ({
        id: s.id,
        key: s.key,
        label: s.label,
        active: s.active,
        usageCount: s._count.assets + s._count.buyerSectors,
      })),
      regions: regions.map((r) => ({
        id: r.id,
        key: r.key,
        label: r.label,
        active: r.active,
        usageCount: r._count.assets + r._count.buyerRegions,
      })),
    });
  })
);

managerRouter.post(
  "/sectors",
  asyncHandler(async (req, res) => {
    const data = parseBody(taxonomyCreateSchema, req.body, res);
    if (!data) return;

    const key = generateTaxonomyKey(data.label);
    if (!key) return res.status(400).json({ error: "Label must contain at least one letter or number" });
    if (await prisma.sector.findUnique({ where: { key } })) {
      return res.status(400).json({ error: "A sector with this name already exists" });
    }

    const sector = await prisma.sector.create({ data: { key, label: data.label } });
    res.status(201).json({ sector: { ...sector, usageCount: 0 } });
  })
);

managerRouter.patch(
  "/sectors/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = parseBody(taxonomyUpdateSchema, req.body, res);
    if (!data) return;

    const existing = await prisma.sector.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Sector not found" });

    const sector = await prisma.sector.update({ where: { id }, data });
    res.json({ sector });
  })
);

managerRouter.post(
  "/regions",
  asyncHandler(async (req, res) => {
    const data = parseBody(taxonomyCreateSchema, req.body, res);
    if (!data) return;

    const key = generateTaxonomyKey(data.label);
    if (!key) return res.status(400).json({ error: "Label must contain at least one letter or number" });
    if (await prisma.region.findUnique({ where: { key } })) {
      return res.status(400).json({ error: "A region with this name already exists" });
    }

    const region = await prisma.region.create({ data: { key, label: data.label } });
    res.status(201).json({ region: { ...region, usageCount: 0 } });
  })
);

managerRouter.patch(
  "/regions/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = parseBody(taxonomyUpdateSchema, req.body, res);
    if (!data) return;

    const existing = await prisma.region.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Region not found" });

    const region = await prisma.region.update({ where: { id }, data });
    res.json({ region });
  })
);
