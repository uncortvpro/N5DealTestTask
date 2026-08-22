import { z } from "zod";
import { REGIONS, ROLES, SECTORS } from "./enums";

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["BUYER", "SELLER"]).default("BUYER"),
    name: z.string().min(2).max(120),
    company: z.string().max(160).optional(),
    phone: z.string().max(40).optional(),
  })
  .strict();
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  .strict();
export type LoginInput = z.infer<typeof loginSchema>;

export const buyerProfileSchema = z
  .object({
    investmentThesis: z.string().min(10).max(2000),
    sectors: z.array(z.enum(SECTORS)).min(1),
    regions: z.array(z.enum(REGIONS)).min(1),
    ticketSizeMin: z.number().nonnegative(),
    ticketSizeMax: z.number().positive(),
  })
  .strict()
  .refine((data) => data.ticketSizeMax >= data.ticketSizeMin, {
    message: "ticketSizeMax must be >= ticketSizeMin",
    path: ["ticketSizeMax"],
  });
export type BuyerProfileInput = z.infer<typeof buyerProfileSchema>;

export const assetInputSchema = z
  .object({
    title: z.string().min(3).max(160),
    description: z.string().min(10).max(4000),
    sector: z.enum(SECTORS),
    region: z.enum(REGIONS),
    dealSize: z.number().positive(),
    revenue: z.number().nonnegative().optional(),
    ebitda: z.number().optional(),
  })
  .strict();
export type AssetInput = z.infer<typeof assetInputSchema>;

export const assetFilterSchema = z.object({
  sector: z.enum(SECTORS).optional(),
  region: z.enum(REGIONS).optional(),
  minSize: z.coerce.number().nonnegative().optional(),
  maxSize: z.coerce.number().nonnegative().optional(),
  keyword: z.string().max(200).optional(),
});
export type AssetFilterInput = z.infer<typeof assetFilterSchema>;

export const buyerFilterSchema = z.object({
  sector: z.enum(SECTORS).optional(),
  region: z.enum(REGIONS).optional(),
  keyword: z.string().max(200).optional(),
});
export type BuyerFilterInput = z.infer<typeof buyerFilterSchema>;

export const managerUserFilterSchema = z.object({
  role: z.enum(["BUYER", "SELLER"]).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED"]).optional(),
  keyword: z.string().max(200).optional(),
});
export type ManagerUserFilterInput = z.infer<typeof managerUserFilterSchema>;

export const managerAssetFilterSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED", "REMOVED"]).optional(),
  sector: z.enum(SECTORS).optional(),
  region: z.enum(REGIONS).optional(),
  keyword: z.string().max(200).optional(),
});
export type ManagerAssetFilterInput = z.infer<typeof managerAssetFilterSchema>;

export const statusUpdateSchema = z
  .object({
    status: z.enum(["ACTIVE", "SUSPENDED", "REMOVED"]),
    reason: z.string().max(500).optional(),
  })
  .strict();
export type StatusUpdateInput = z.infer<typeof statusUpdateSchema>;

export const startConversationSchema = z
  .object({
    toUserId: z.number().int().positive(),
    assetId: z.number().int().positive().optional(),
    message: z.string().min(1).max(4000),
  })
  .strict();
export type StartConversationInput = z.infer<typeof startConversationSchema>;

export const sendMessageSchema = z
  .object({
    body: z.string().min(1).max(4000),
  })
  .strict();
export type SendMessageInput = z.infer<typeof sendMessageSchema>;

export const rolesEnum = ROLES;
