import { Router } from "express";
import { prisma } from "../db";
import { asyncHandler } from "../lib/asyncHandler";
import { loadCurrentUser, requireAuth, requireRole } from "../middleware/auth";
import { toPublicUser } from "../serializers";

export const sellersRouter = Router();

sellersRouter.use(requireAuth, requireRole("BUYER", "MANAGER"), loadCurrentUser);

sellersRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const isManager = req.currentUser!.role === "MANAGER";
    const seller = await prisma.user.findFirst({
      where: { id, role: "SELLER", ...(isManager ? {} : { status: "ACTIVE" }) },
    });
    if (!seller) return res.status(404).json({ error: "Seller not found" });

    res.json({ seller: toPublicUser(seller) });
  })
);
