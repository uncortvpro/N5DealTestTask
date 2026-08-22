import { Router } from "express";
import { buyerFilterSchema, scoreAssetForBuyer } from "@n5deal/shared";
import type { Sector, Region } from "@n5deal/shared";
import { prisma } from "../db";
import { asyncHandler } from "../lib/asyncHandler";
import { loadCurrentUser, requireAuth, requireRole } from "../middleware/auth";
import { toBuyerProfile, toPublicUser } from "../serializers";

export const buyersRouter = Router();

buyersRouter.use(requireAuth, requireRole("SELLER", "MANAGER"), loadCurrentUser);

buyersRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const filters = buyerFilterSchema.parse(req.query);

    const buyers = await prisma.user.findMany({
      where: {
        role: "BUYER",
        status: "ACTIVE",
        ...(filters.keyword
          ? {
              OR: [
                { name: { contains: filters.keyword } },
                { company: { contains: filters.keyword } },
                { buyerProfile: { investmentThesis: { contains: filters.keyword } } },
              ],
            }
          : {}),
        ...(filters.sector || filters.region
          ? {
              buyerProfile: {
                ...(filters.sector ? { sectors: { some: { sector: filters.sector } } } : {}),
                ...(filters.region ? { regions: { some: { region: filters.region } } } : {}),
              },
            }
          : {}),
      },
      include: { buyerProfile: { include: { sectors: { include: { sectorRef: true } }, regions: { include: { regionRef: true } } } } },
      orderBy: { createdAt: "desc" },
    });

    // Sellers see how well each buyer fits their own active listings
    // (best-matching asset), so the score is meaningful without asking
    // the seller to pick a specific asset up front.
    const myAssets =
      req.currentUser!.role === "SELLER"
        ? await prisma.asset.findMany({
            where: { sellerId: req.currentUser!.id, status: "ACTIVE" },
          })
        : [];

    const result = buyers.map((buyer) => {
      const profile = buyer.buyerProfile ? toBuyerProfile(buyer.buyerProfile) : null;
      let matchScore: number | null = null;
      if (profile && myAssets.length > 0) {
        matchScore = Math.max(
          ...myAssets.map((asset) =>
            scoreAssetForBuyer(profile, {
              sector: asset.sector as Sector,
              region: asset.region as Region,
              dealSize: asset.dealSize,
            })
          )
        );
      }
      return { ...toPublicUser(buyer), profile, matchScore };
    });

    if (req.currentUser!.role === "SELLER" && myAssets.length > 0) {
      result.sort((a, b) => (b.matchScore ?? -1) - (a.matchScore ?? -1));
    }

    res.json({ buyers: result });
  })
);

buyersRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const isManager = req.currentUser!.role === "MANAGER";
    const buyer = await prisma.user.findFirst({
      where: { id, role: "BUYER", ...(isManager ? {} : { status: "ACTIVE" }) },
      include: { buyerProfile: { include: { sectors: { include: { sectorRef: true } }, regions: { include: { regionRef: true } } } } },
    });
    if (!buyer) return res.status(404).json({ error: "Buyer not found" });

    res.json({
      buyer: {
        ...toPublicUser(buyer),
        profile: buyer.buyerProfile ? toBuyerProfile(buyer.buyerProfile) : null,
      },
    });
  })
);
