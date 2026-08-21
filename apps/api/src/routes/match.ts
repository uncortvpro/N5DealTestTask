import { Router } from "express";
import { assetFilterSchema, scoreAssetForBuyer } from "@n5deal/shared";
import type { Region, Sector } from "@n5deal/shared";
import { prisma } from "../db";
import { asyncHandler } from "../lib/asyncHandler";
import { loadCurrentUser, requireAuth, requireRole } from "../middleware/auth";
import { toAsset, toBuyerProfile } from "../serializers";
import type { Prisma } from "@prisma/client";

export const matchRouter = Router();

matchRouter.use(requireAuth, requireRole("BUYER"), loadCurrentUser);

matchRouter.get(
  "/assets",
  asyncHandler(async (req, res) => {
    const filters = assetFilterSchema.parse(req.query);

    const profileRecord = await prisma.buyerProfile.findUnique({
      where: { userId: req.currentUser!.id },
      include: { sectors: true, regions: true },
    });

    const where: Prisma.AssetWhereInput = { status: "ACTIVE" };
    if (filters.sector) where.sector = filters.sector;
    if (filters.region) where.region = filters.region;
    if (filters.minSize !== undefined || filters.maxSize !== undefined) {
      where.dealSize = {
        ...(filters.minSize !== undefined ? { gte: filters.minSize } : {}),
        ...(filters.maxSize !== undefined ? { lte: filters.maxSize } : {}),
      };
    }
    if (filters.keyword) {
      where.OR = [
        { title: { contains: filters.keyword } },
        { description: { contains: filters.keyword } },
      ];
    }

    const assets = await prisma.asset.findMany({ where, orderBy: { createdAt: "desc" } });
    const profile = profileRecord ? toBuyerProfile(profileRecord) : null;

    const scored = assets.map((asset) => ({
      ...toAsset(asset),
      matchScore: profile
        ? scoreAssetForBuyer(profile, {
            sector: asset.sector as Sector,
            region: asset.region as Region,
            dealSize: asset.dealSize,
          })
        : null,
    }));

    if (profile) {
      scored.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
    }

    res.json({ assets: scored, hasProfile: Boolean(profile) });
  })
);
