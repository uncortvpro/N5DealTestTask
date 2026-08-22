import { z } from "zod";
import { ROLES } from "./enums";

// Sector/region keys are validated for shape here; whether a given key
// actually exists (and is still active) is a DB lookup done in the route
// handler, since the valid set is manager-editable and not fixed at
// compile time.
const sectorKey = z.string().min(1).max(60);
const regionKey = z.string().min(1).max(60);

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
    sectors: z.array(sectorKey).min(1),
    regions: z.array(regionKey).min(1),
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
    sector: sectorKey,
    region: regionKey,
    dealSize: z.number().positive(),
    revenue: z.number().nonnegative().optional(),
    ebitda: z.number().optional(),
  })
  .strict();
export type AssetInput = z.infer<typeof assetInputSchema>;

export const assetFilterSchema = z.object({
  sector: sectorKey.optional(),
  region: regionKey.optional(),
  minSize: z.coerce.number().nonnegative().optional(),
  maxSize: z.coerce.number().nonnegative().optional(),
  keyword: z.string().max(200).optional(),
});
export type AssetFilterInput = z.infer<typeof assetFilterSchema>;

export const buyerFilterSchema = z.object({
  sector: sectorKey.optional(),
  region: regionKey.optional(),
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
  sector: sectorKey.optional(),
  region: regionKey.optional(),
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

export const taxonomyCreateSchema = z
  .object({
    label: z.string().min(2).max(60),
  })
  .strict();
export type TaxonomyCreateInput = z.infer<typeof taxonomyCreateSchema>;

export const taxonomyUpdateSchema = z
  .object({
    label: z.string().min(2).max(60).optional(),
    active: z.boolean().optional(),
  })
  .strict();
export type TaxonomyUpdateInput = z.infer<typeof taxonomyUpdateSchema>;

export const rolesEnum = ROLES;
