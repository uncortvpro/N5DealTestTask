import type { Asset as PrismaAsset, User } from "@prisma/client";
import type { Asset, BuyerProfile, PublicUser } from "@n5deal/shared";

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    company: user.company,
    phone: user.phone,
    status: user.status,
    statusReason: user.statusReason,
    createdAt: user.createdAt.toISOString(),
  };
}

export function toAsset(
  asset: PrismaAsset & { sectorRef: { label: string }; regionRef: { label: string } }
): Asset {
  return {
    id: asset.id,
    sellerId: asset.sellerId,
    title: asset.title,
    description: asset.description,
    sector: asset.sector,
    sectorLabel: asset.sectorRef.label,
    region: asset.region,
    regionLabel: asset.regionRef.label,
    dealSize: asset.dealSize,
    revenue: asset.revenue,
    ebitda: asset.ebitda,
    status: asset.status,
    statusReason: asset.statusReason,
    createdAt: asset.createdAt.toISOString(),
  };
}

export function toBuyerProfile(profile: {
  userId: number;
  investmentThesis: string;
  ticketSizeMin: number;
  ticketSizeMax: number;
  sectors: { sector: string; sectorRef: { label: string } }[];
  regions: { region: string; regionRef: { label: string } }[];
}): BuyerProfile {
  return {
    userId: profile.userId,
    investmentThesis: profile.investmentThesis,
    ticketSizeMin: profile.ticketSizeMin,
    ticketSizeMax: profile.ticketSizeMax,
    sectors: profile.sectors.map((s) => s.sector),
    sectorLabels: profile.sectors.map((s) => s.sectorRef.label),
    regions: profile.regions.map((r) => r.region),
    regionLabels: profile.regions.map((r) => r.regionRef.label),
  };
}
