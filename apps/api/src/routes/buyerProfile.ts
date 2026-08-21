import { Router } from "express";
import { buyerProfileSchema } from "@n5deal/shared";
import { prisma } from "../db";
import { asyncHandler } from "../lib/asyncHandler";
import { parseBody } from "../lib/validate";
import { loadCurrentUser, requireAuth, requireRole } from "../middleware/auth";
import { toBuyerProfile } from "../serializers";

export const buyerProfileRouter = Router();

buyerProfileRouter.use(requireAuth, requireRole("BUYER"), loadCurrentUser);

buyerProfileRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const profile = await prisma.buyerProfile.findUnique({
      where: { userId: req.currentUser!.id },
      include: { sectors: true, regions: true },
    });
    res.json({ profile: profile ? toBuyerProfile(profile) : null });
  })
);

buyerProfileRouter.put(
  "/",
  asyncHandler(async (req, res) => {
    const data = parseBody(buyerProfileSchema, req.body, res);
    if (!data) return;

    const userId = req.currentUser!.id;

    await prisma.$transaction(async (tx) => {
      await tx.buyerProfile.upsert({
        where: { userId },
        create: {
          userId,
          investmentThesis: data.investmentThesis,
          ticketSizeMin: data.ticketSizeMin,
          ticketSizeMax: data.ticketSizeMax,
        },
        update: {
          investmentThesis: data.investmentThesis,
          ticketSizeMin: data.ticketSizeMin,
          ticketSizeMax: data.ticketSizeMax,
        },
      });

      await tx.buyerSector.deleteMany({ where: { buyerProfileId: userId } });
      await tx.buyerSector.createMany({
        data: data.sectors.map((sector) => ({ buyerProfileId: userId, sector })),
      });

      await tx.buyerRegion.deleteMany({ where: { buyerProfileId: userId } });
      await tx.buyerRegion.createMany({
        data: data.regions.map((region) => ({ buyerProfileId: userId, region })),
      });
    });

    const profile = await prisma.buyerProfile.findUniqueOrThrow({
      where: { userId },
      include: { sectors: true, regions: true },
    });
    res.json({ profile: toBuyerProfile(profile) });
  })
);
