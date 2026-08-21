export const ROLES = ["BUYER", "SELLER", "MANAGER"] as const;
export type Role = (typeof ROLES)[number];

export const USER_STATUSES = ["ACTIVE", "SUSPENDED"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const ASSET_STATUSES = ["ACTIVE", "SUSPENDED", "REMOVED"] as const;
export type AssetStatus = (typeof ASSET_STATUSES)[number];

export const SECTORS = [
  "TECHNOLOGY",
  "HEALTHCARE",
  "MANUFACTURING",
  "FINANCIAL_SERVICES",
  "REAL_ESTATE",
  "ENERGY",
  "RETAIL",
  "OTHER",
] as const;
export type Sector = (typeof SECTORS)[number];

export const REGIONS = [
  "NORTH_AMERICA",
  "EUROPE",
  "APAC",
  "LATAM",
  "MEA",
  "GLOBAL",
] as const;
export type Region = (typeof REGIONS)[number];

export const SECTOR_LABELS: Record<Sector, string> = {
  TECHNOLOGY: "Technology",
  HEALTHCARE: "Healthcare",
  MANUFACTURING: "Manufacturing",
  FINANCIAL_SERVICES: "Financial Services",
  REAL_ESTATE: "Real Estate",
  ENERGY: "Energy",
  RETAIL: "Retail",
  OTHER: "Other",
};

export const REGION_LABELS: Record<Region, string> = {
  NORTH_AMERICA: "North America",
  EUROPE: "Europe",
  APAC: "APAC",
  LATAM: "LATAM",
  MEA: "Middle East & Africa",
  GLOBAL: "Global",
};
