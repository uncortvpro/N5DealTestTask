import { describe, expect, it } from "vitest";
import {
  assetInputSchema,
  buyerProfileSchema,
  registerSchema,
  startConversationSchema,
  statusUpdateSchema,
} from "@n5deal/shared";

describe("registerSchema", () => {
  it("rejects passwords shorter than 8 characters", () => {
    const result = registerSchema.safeParse({
      email: "a@b.com",
      password: "short",
      name: "Test User",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid registration payload", () => {
    const result = registerSchema.safeParse({
      email: "a@b.com",
      password: "longenough1",
      role: "BUYER",
      name: "Test User",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a malformed email", () => {
    const result = registerSchema.safeParse({
      email: "not-an-email",
      password: "longenough1",
      name: "Test User",
    });
    expect(result.success).toBe(false);
  });

  it("rejects MANAGER as a self-registration role", () => {
    const result = registerSchema.safeParse({
      email: "a@b.com",
      password: "longenough1",
      role: "MANAGER",
      name: "Test User",
    });
    expect(result.success).toBe(false);
  });

  it("defaults role to BUYER when omitted", () => {
    const result = registerSchema.safeParse({
      email: "a@b.com",
      password: "longenough1",
      name: "Test User",
    });
    expect(result.success && result.data.role).toBe("BUYER");
  });

  it("rejects unexpected extra fields (mass-assignment guard)", () => {
    const result = registerSchema.safeParse({
      email: "a@b.com",
      password: "longenough1",
      name: "Test User",
      status: "ACTIVE",
    });
    expect(result.success).toBe(false);
  });
});

describe("buyerProfileSchema", () => {
  it("rejects ticketSizeMax below ticketSizeMin", () => {
    const result = buyerProfileSchema.safeParse({
      investmentThesis: "We invest in profitable niche businesses.",
      sectors: ["TECHNOLOGY"],
      regions: ["GLOBAL"],
      ticketSizeMin: 5_000_000,
      ticketSizeMax: 1_000_000,
    });
    expect(result.success).toBe(false);
  });

  it("requires at least one sector", () => {
    const result = buyerProfileSchema.safeParse({
      investmentThesis: "We invest in profitable niche businesses.",
      sectors: [],
      regions: ["GLOBAL"],
      ticketSizeMin: 1_000_000,
      ticketSizeMax: 5_000_000,
    });
    expect(result.success).toBe(false);
  });
});

describe("assetInputSchema", () => {
  const base = {
    title: "B2B SaaS Analytics Platform",
    description: "Profitable vertical SaaS analytics company.",
    sector: "TECHNOLOGY" as const,
    region: "NORTH_AMERICA" as const,
    dealSize: 4_500_000,
  };

  it("accepts a valid listing payload", () => {
    expect(assetInputSchema.safeParse(base).success).toBe(true);
  });

  it("rejects a non-positive deal size", () => {
    const result = assetInputSchema.safeParse({ ...base, dealSize: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown sector value", () => {
    const result = assetInputSchema.safeParse({ ...base, sector: "AEROSPACE" });
    expect(result.success).toBe(false);
  });

  it("rejects a title shorter than 3 characters", () => {
    const result = assetInputSchema.safeParse({ ...base, title: "SA" });
    expect(result.success).toBe(false);
  });
});

describe("statusUpdateSchema", () => {
  it("accepts ACTIVE, SUSPENDED, and REMOVED", () => {
    for (const status of ["ACTIVE", "SUSPENDED", "REMOVED"]) {
      expect(statusUpdateSchema.safeParse({ status }).success).toBe(true);
    }
  });

  it("rejects an unrecognized status value", () => {
    const result = statusUpdateSchema.safeParse({ status: "PENDING" });
    expect(result.success).toBe(false);
  });
});

describe("startConversationSchema", () => {
  it("rejects an empty message", () => {
    const result = startConversationSchema.safeParse({ toUserId: 1, message: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a non-positive toUserId", () => {
    const result = startConversationSchema.safeParse({ toUserId: 0, message: "Hi there" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid conversation start payload", () => {
    const result = startConversationSchema.safeParse({ toUserId: 12, message: "Hi there" });
    expect(result.success).toBe(true);
  });
});
