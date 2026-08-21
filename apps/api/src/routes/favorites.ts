import { Router } from "express";
import { getMatchBreakdown } from "@n5deal/shared";
import type { Region, Sector } from "@n5deal/shared";
import { prisma } from "../db";
import { asyncHandler } from "../lib/asyncHandler";
import { loadCurrentUser, requireAuth, requireRole } from "../middleware/auth";
import { toAsset, toBuyerProfile } from "../serializers";

export const favoritesRouter = Router();

favoritesRouter.use(requireAuth, requireRole("BUYER"), loadCurrentUser);

favoritesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const [favorites, buyerProfile] = await Promise.all([
      prisma.favorite.findMany({
        where: { buyerId: req.currentUser!.id },
        include: { asset: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.buyerProfile.findUnique({
        where: { userId: req.currentUser!.id },
        include: { sectors: true, regions: true },
      }),
    ]);

    const profile = buyerProfile ? toBuyerProfile(buyerProfile) : null;

    const assets = favorites
      .filter((f) => f.asset.status === "ACTIVE")
      .map((f) => ({
        ...toAsset(f.asset),
        matchScore: profile
          ? getMatchBreakdown(profile, {
              sector: f.asset.sector as Sector,
              region: f.asset.region as Region,
              dealSize: f.asset.dealSize,
            }).score
          : null,
      }));

    res.json({ assets });
  })
);

favoritesRouter.post(
  "/:assetId",
  asyncHandler(async (req, res) => {
    const assetId = Number(req.params.assetId);
    const asset = await prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    const buyerId = req.currentUser!.id;
    const existing = await prisma.favorite.findUnique({
      where: { buyerId_assetId: { buyerId, assetId } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return res.json({ favorited: false });
    }

    await prisma.favorite.create({ data: { buyerId, assetId } });
    res.json({ favorited: true });
  })
);
