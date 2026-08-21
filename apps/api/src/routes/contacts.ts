import { Router } from "express";
import { sendMessageSchema, startConversationSchema } from "@n5deal/shared";
import { prisma } from "../db";
import { asyncHandler } from "../lib/asyncHandler";
import { parseBody } from "../lib/validate";
import { loadCurrentUser, requireAuth, requireRole } from "../middleware/auth";
import { toPublicUser } from "../serializers";

export const contactsRouter = Router();

contactsRouter.use(requireAuth, requireRole("BUYER", "SELLER"), loadCurrentUser);

contactsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = parseBody(startConversationSchema, req.body, res);
    if (!data) return;

    const me = req.currentUser!;
    const target = await prisma.user.findUnique({ where: { id: data.toUserId } });
    if (!target || target.status !== "ACTIVE") {
      return res.status(404).json({ error: "Recipient not found" });
    }
    if (target.role === me.role || !["BUYER", "SELLER"].includes(target.role)) {
      return res.status(400).json({ error: "Contacts are only allowed between a buyer and a seller" });
    }

    const buyerId = me.role === "BUYER" ? me.id : target.id;
    const sellerId = me.role === "SELLER" ? me.id : target.id;

    if (data.assetId) {
      const asset = await prisma.asset.findUnique({ where: { id: data.assetId } });
      if (!asset || asset.sellerId !== sellerId) {
        return res.status(400).json({ error: "Asset does not belong to this seller" });
      }
    }

    let conversation = await prisma.conversation.findFirst({
      where: { buyerId, sellerId, assetId: data.assetId ?? null },
    });
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { buyerId, sellerId, assetId: data.assetId ?? null },
      });
    }

    await prisma.$transaction([
      prisma.message.create({
        data: { conversationId: conversation.id, senderId: me.id, body: data.message },
      }),
      prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      }),
    ]);

    res.status(201).json({ conversationId: conversation.id });
  })
);

contactsRouter.get(
  "/unread-count",
  asyncHandler(async (req, res) => {
    const me = req.currentUser!;
    const count = await prisma.message.count({
      where: {
        readAt: null,
        senderId: { not: me.id },
        conversation: me.role === "BUYER" ? { buyerId: me.id } : { sellerId: me.id },
      },
    });
    res.json({ count });
  })
);

contactsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const me = req.currentUser!;
    const conversations = await prisma.conversation.findMany({
      where: me.role === "BUYER" ? { buyerId: me.id } : { sellerId: me.id },
      include: {
        buyer: true,
        seller: true,
        asset: true,
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { lastMessageAt: "desc" },
    });

    const unreadByConversation = await prisma.message.groupBy({
      by: ["conversationId"],
      where: {
        readAt: null,
        senderId: { not: me.id },
        conversationId: { in: conversations.map((c) => c.id) },
      },
      _count: true,
    });
    const unreadMap = new Map(unreadByConversation.map((u) => [u.conversationId, u._count]));

    res.json({
      conversations: conversations.map((c) => ({
        id: c.id,
        assetId: c.assetId,
        assetTitle: c.asset?.title ?? null,
        counterpart: toPublicUser(me.role === "BUYER" ? c.seller : c.buyer),
        lastMessage: c.messages[0]?.body ?? null,
        lastMessageAt: c.lastMessageAt.toISOString(),
        unreadCount: unreadMap.get(c.id) ?? 0,
      })),
    });
  })
);

contactsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const me = req.currentUser!;
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { buyer: true, seller: true, asset: true, messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!conversation || (conversation.buyerId !== me.id && conversation.sellerId !== me.id)) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Opening a thread is what "reading" it means here — mark anything the
    // other party sent as read now, mirroring how every chat app behaves.
    await prisma.message.updateMany({
      where: { conversationId: id, senderId: { not: me.id }, readAt: null },
      data: { readAt: new Date() },
    });

    res.json({
      conversation: {
        id: conversation.id,
        assetId: conversation.assetId,
        assetTitle: conversation.asset?.title ?? null,
        counterpart: toPublicUser(me.role === "BUYER" ? conversation.seller : conversation.buyer),
        messages: conversation.messages.map((m) => ({
          id: m.id,
          senderId: m.senderId,
          body: m.body,
          createdAt: m.createdAt.toISOString(),
          fromMe: m.senderId === me.id,
        })),
      },
    });
  })
);

contactsRouter.post(
  "/:id/messages",
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const me = req.currentUser!;
    const conversation = await prisma.conversation.findUnique({ where: { id } });
    if (!conversation || (conversation.buyerId !== me.id && conversation.sellerId !== me.id)) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const data = parseBody(sendMessageSchema, req.body, res);
    if (!data) return;

    const message = await prisma.message.create({
      data: { conversationId: id, senderId: me.id, body: data.body },
    });
    await prisma.conversation.update({ where: { id }, data: { lastMessageAt: new Date() } });

    res.status(201).json({
      message: {
        id: message.id,
        senderId: message.senderId,
        body: message.body,
        createdAt: message.createdAt.toISOString(),
        fromMe: true,
      },
    });
  })
);
