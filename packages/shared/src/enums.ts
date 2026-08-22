export const ROLES = ["BUYER", "SELLER", "MANAGER"] as const;
export type Role = (typeof ROLES)[number];

export const USER_STATUSES = ["ACTIVE", "SUSPENDED"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const ASSET_STATUSES = ["ACTIVE", "SUSPENDED", "REMOVED"] as const;
export type AssetStatus = (typeof ASSET_STATUSES)[number];

// Sector and Region used to be fixed enums here. They're now manager-editable
// rows in the database (see Sector/Region in schema.prisma) — the stable
// `key` string is still what everything stores and compares (Asset.sector,
// BuyerProfile.sectors, the match-score algorithm), so the type stays a
// plain string rather than a fixed union. Fetch the current, active set —
// with its display label — from GET /api/public/taxonomy at runtime instead
// of importing a compile-time list.
export type Sector = string;
export type Region = string;

export interface TaxonomyItem {
  key: string;
  label: string;
}
