import { Router } from "express";
import { assetFilterSchema, assetInputSchema, getMatchBreakdown } from "@n5deal/shared";
import { prisma } from "../db";
import { asyncHandler } from "../lib/asyncHandler";
import { parseBody } from "../lib/validate";
import { loadCurrentUser, requireAuth, requireRole } from "../middleware/auth";
import { toAsset, toBuyerProfile } from "../serializers";
import { getAnthropicClient } from "../lib/anthropic";
import { buildMatchExplanationPrompt } from "../lib/matchExplanationPrompt";
import type { Prisma } from "@prisma/client";

const assetWithLabels = { sectorRef: true, regionRef: true } as const;
const buyerProfileWithLabels = {
  sectors: { include: { sectorRef: true } },
  regions: { include: { regionRef: true } },
} as const;

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

    const assets = await prisma.asset.findMany({
      where,
      include: assetWithLabels,
      orderBy: { createdAt: "desc" },
    });
    res.json({ assets: assets.map(toAsset) });
  })
);

assetsRouter.post(
  "/",
  requireRole("SELLER"),
  asyncHandler(async (req, res) => {
    const data = parseBody(assetInputSchema, req.body, res);
    if (!data) return;

    const [sector, region] = await Promise.all([
      prisma.sector.findFirst({ where: { key: data.sector, active: true } }),
      prisma.region.findFirst({ where: { key: data.region, active: true } }),
    ]);
    if (!sector) return res.status(400).json({ error: "Sector is invalid or no longer active" });
    if (!region) return res.status(400).json({ error: "Region is invalid or no longer active" });

    const asset = await prisma.asset.create({
      data: {
        ...data,
        revenue: data.revenue ?? null,
        ebitda: data.ebitda ?? null,
        sellerId: req.currentUser!.id,
      },
      include: assetWithLabels,
    });
    res.status(201).json({ asset: toAsset(asset) });
  })
);

assetsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: { seller: true, ...assetWithLabels },
    });
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
          include: buyerProfileWithLabels,
        }),
        prisma.favorite.findUnique({
          where: { buyerId_assetId: { buyerId: req.currentUser!.id, assetId: id } },
        }),
      ]);

      if (buyerProfile) {
        matchBreakdown = getMatchBreakdown(toBuyerProfile(buyerProfile), {
          sector: asset.sector,
          region: asset.region,
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

/**
 * LLM-generated "why this matches" note layered on top of the deterministic
 * score — a real Claude call, not another weighted feature. Kept as its own
 * lazily-fetched endpoint rather than bundled into GET /:id so the asset
 * page itself never waits on an LLM round trip. Cached per (buyer, asset)
 * pair in MatchExplanation; buyerProfile.ts clears the cache when a buyer
 * edits their profile, since the note is only valid for the profile it was
 * written against.
 */
assetsRouter.get(
  "/:id/match-explanation",
  requireRole("BUYER"),
  asyncHandler(async (req, res) => {
    const assetId = Number(req.params.id);
    const buyerId = req.currentUser!.id;

    const cached = await prisma.matchExplanation.findUnique({
      where: { buyerId_assetId: { buyerId, assetId } },
    });
    if (cached) return res.json({ explanation: cached.text });

    const client = getAnthropicClient();
    if (!client) return res.status(503).json({ error: "Match explanations are not configured" });

    const [asset, buyerProfile] = await Promise.all([
      prisma.asset.findUnique({ where: { id: assetId }, include: assetWithLabels }),
      prisma.buyerProfile.findUnique({
        where: { userId: buyerId },
        include: buyerProfileWithLabels,
      }),
    ]);
    if (!asset || !buyerProfile) {
      return res.status(404).json({ error: "Not enough data to explain this match" });
    }

    const prompt = buildMatchExplanationPrompt(toBuyerProfile(buyerProfile), asset);

    let text: string;
    try {
      const response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 120,
        messages: [{ role: "user", content: prompt }],
      });
      const block = response.content[0];
      text = block?.type === "text" ? block.text.trim() : "";
      if (!text) throw new Error("empty response from model");
    } catch (err) {
      console.error("match-explanation generation failed", err);
      return res.status(502).json({ error: "Could not generate an explanation right now" });
    }

    await prisma.matchExplanation.upsert({
      where: { buyerId_assetId: { buyerId, assetId } },
      create: { buyerId, assetId, text },
      update: { text },
    });

    res.json({ explanation: text });
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

    if (data.sector) {
      const sector = await prisma.sector.findFirst({ where: { key: data.sector, active: true } });
      if (!sector) return res.status(400).json({ error: "Sector is invalid or no longer active" });
    }
    if (data.region) {
      const region = await prisma.region.findFirst({ where: { key: data.region, active: true } });
      if (!region) return res.status(400).json({ error: "Region is invalid or no longer active" });
    }

    const asset = await prisma.asset.update({
      where: { id },
      data: { ...data, revenue: data.revenue ?? undefined, ebitda: data.ebitda ?? undefined },
      include: assetWithLabels,
    });
    res.json({ asset: toAsset(asset) });
  })
);
