import { Router } from "express";
import { assetFilterSchema, assetInputSchema, getMatchBreakdown } from "@n5deal/shared";
import type { Region, Sector } from "@n5deal/shared";
import { prisma } from "../db";
import { asyncHandler } from "../lib/asyncHandler";
import { parseBody } from "../lib/validate";
import { loadCurrentUser, requireAuth, requireRole } from "../middleware/auth";
import { toAsset, toBuyerProfile } from "../serializers";
import type { Prisma } from "@prisma/client";

export const assetsRouter = Router();

assetsRouter.use(requireAuth, loadCurrentUser);

assetsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const filters = assetFilterSchema.parse(req.query);
    const mine = req.query.mine === "true";

    const where: Prisma.AssetWhereInput = {};

    if (mine) {
      if (req.currentUser!.role !== "SELLER") {
        return res.status(403).json({ error: "Only sellers have listings to manage" });
      }
      where.sellerId = req.currentUser!.id;
    } else {
      where.status = "ACTIVE";
      where.seller = { status: "ACTIVE" };
      if (req.query.sellerId) {
        where.sellerId = Number(req.query.sellerId);
      }
    }

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
    if (req.query.excludeId) {
      where.id = { not: Number(req.query.excludeId) };
    }

    const assets = await prisma.asset.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json({ assets: assets.map(toAsset) });
  })
);

assetsRouter.post(
  "/",
  requireRole("SELLER"),
  asyncHandler(async (req, res) => {
    const data = parseBody(assetInputSchema, req.body, res);
    if (!data) return;

    const asset = await prisma.asset.create({
      data: {
        ...data,
        revenue: data.revenue ?? null,
        ebitda: data.ebitda ?? null,
        sellerId: req.currentUser!.id,
      },
    });
    res.status(201).json({ asset: toAsset(asset) });
  })
);

assetsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const asset = await prisma.asset.findUnique({ where: { id }, include: { seller: true } });
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    const isOwner = asset.sellerId === req.currentUser!.id;
    const isManager = req.currentUser!.role === "MANAGER";
    if (!isOwner && !isManager && (asset.status !== "ACTIVE" || asset.seller.status !== "ACTIVE")) {
      return res.status(404).json({ error: "Asset not found" });
    }

    let matchBreakdown = null;
    let isFavorited = false;

    if (req.currentUser!.role === "BUYER") {
      const [buyerProfile, favorite] = await Promise.all([
        prisma.buyerProfile.findUnique({
          where: { userId: req.currentUser!.id },
          include: { sectors: true, regions: true },
        }),
        prisma.favorite.findUnique({
          where: { buyerId_assetId: { buyerId: req.currentUser!.id, assetId: id } },
        }),
      ]);

      if (buyerProfile) {
        matchBreakdown = getMatchBreakdown(toBuyerProfile(buyerProfile), {
          sector: asset.sector as Sector,
          region: asset.region as Region,
          dealSize: asset.dealSize,
        });
      }
      isFavorited = Boolean(favorite);
    }

    res.json({
      asset: {
        ...toAsset(asset),
        sellerName: asset.seller.name,
        sellerCompany: asset.seller.company,
        sellerMemberSince: asset.seller.createdAt.toISOString(),
        matchBreakdown,
        isFavorited,
      },
    });
  })
);

assetsRouter.patch(
  "/:id",
  requireRole("SELLER"),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const existing = await prisma.asset.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Asset not found" });
    if (existing.sellerId !== req.currentUser!.id) {
      return res.status(403).json({ error: "You do not own this listing" });
    }
    if (existing.status === "REMOVED") {
      return res.status(403).json({ error: "This listing has been removed and can no longer be edited" });
    }

    const data = parseBody(assetInputSchema.partial(), req.body, res);
    if (!data) return;

    const asset = await prisma.asset.update({
      where: { id },
      data: { ...data, revenue: data.revenue ?? undefined, ebitda: data.ebitda ?? undefined },
    });
    res.json({ asset: toAsset(asset) });
  })
);
