import type { AssetStatus, Region, Role, Sector, UserStatus } from "./enums";

export interface PublicUser {
  id: number;
  email: string;
  role: Role;
  name: string;
  company: string | null;
  phone: string | null;
  status: UserStatus;
  statusReason: string | null;
  createdAt: string;
}

export interface BuyerProfile {
  userId: number;
  investmentThesis: string;
  sectors: Sector[];
  regions: Region[];
  ticketSizeMin: number;
  ticketSizeMax: number;
}

export interface Asset {
  id: number;
  sellerId: number;
  title: string;
  description: string;
  sector: Sector;
  region: Region;
  dealSize: number;
  revenue: number | null;
  ebitda: number | null;
  status: AssetStatus;
  statusReason: string | null;
  createdAt: string;
}

export interface AssetWithScore extends Asset {
  matchScore: number | null;
}

export interface BuyerWithScore extends PublicUser {
  profile: BuyerProfile | null;
  matchScore: number | null;
}

export interface Conversation {
  id: number;
  buyerId: number;
  sellerId: number;
  assetId: number | null;
  createdAt: string;
  lastMessageAt: string;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  body: string;
  createdAt: string;
}
