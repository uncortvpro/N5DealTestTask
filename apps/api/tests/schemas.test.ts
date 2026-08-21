import { describe, expect, it } from "vitest";
import { buyerProfileSchema, registerSchema } from "@n5deal/shared";

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
