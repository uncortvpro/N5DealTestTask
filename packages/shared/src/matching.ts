import type { Region, Sector } from "./enums";

export interface MatchableAsset {
  sector: Sector;
  region: Region;
  dealSize: number;
}

export interface MatchableBuyerProfile {
  sectors: Sector[];
  regions: Region[];
  ticketSizeMin: number;
  ticketSizeMax: number;
}

export interface MatchBreakdown {
  score: number;
  sectorMatch: boolean;
  regionMatch: boolean;
  /** 0-1 fraction — 1 means squarely inside the buyer's ticket-size band. */
  sizeFitRatio: number;
}

const SECTOR_WEIGHT = 40;
const REGION_WEIGHT = 25;
const SIZE_WEIGHT = 35;

/**
 * Deterministic 0-100 fit score between a buyer's stated investment
 * interests and a given asset, broken down into its three independent
 * signals so the UI can show buyers *why* something matched, not just a
 * number. Deal-size fit degrades linearly for 25% outside the buyer's
 * stated band instead of hard cutting off, since real buyers stay
 * flexible near the edges.
 */
export function getMatchBreakdown(
  buyer: MatchableBuyerProfile,
  asset: MatchableAsset
): MatchBreakdown {
  const sectorMatch = buyer.sectors.includes(asset.sector);
  const regionMatch = buyer.regions.includes(asset.region) || buyer.regions.includes("GLOBAL");
  const sizeFitRatio = dealSizeFit(buyer.ticketSizeMin, buyer.ticketSizeMax, asset.dealSize);

  const score = Math.round(
    (sectorMatch ? SECTOR_WEIGHT : 0) +
      (regionMatch ? REGION_WEIGHT : 0) +
      SIZE_WEIGHT * sizeFitRatio
  );

  return { score, sectorMatch, regionMatch, sizeFitRatio };
}

export function scoreAssetForBuyer(buyer: MatchableBuyerProfile, asset: MatchableAsset): number {
  return getMatchBreakdown(buyer, asset).score;
}

function dealSizeFit(min: number, max: number, dealSize: number): number {
  if (min > max) [min, max] = [max, min];

  if (dealSize >= min && dealSize <= max) return 1;

  const band = Math.max(max - min, 1);
  const tolerance = band * 0.25;
  const distance = dealSize < min ? min - dealSize : dealSize - max;

  if (distance >= tolerance) return 0;
  return 1 - distance / tolerance;
}
