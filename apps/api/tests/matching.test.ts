import { describe, expect, it } from "vitest";
import { getMatchBreakdown, scoreAssetForBuyer } from "@n5deal/shared";

const baseBuyer = {
  sectors: ["TECHNOLOGY"] as const,
  regions: ["NORTH_AMERICA"] as const,
  ticketSizeMin: 1_000_000,
  ticketSizeMax: 5_000_000,
};

describe("scoreAssetForBuyer", () => {
  it("scores a perfect match at 100", () => {
    const score = scoreAssetForBuyer(
      { ...baseBuyer, sectors: [...baseBuyer.sectors], regions: [...baseBuyer.regions] },
      { sector: "TECHNOLOGY", region: "NORTH_AMERICA", dealSize: 3_000_000 }
    );
    expect(score).toBe(100);
  });

  it("scores zero when nothing matches and deal size is far outside the band", () => {
    const score = scoreAssetForBuyer(
      { ...baseBuyer, sectors: [...baseBuyer.sectors], regions: [...baseBuyer.regions] },
      { sector: "HEALTHCARE", region: "EUROPE", dealSize: 50_000_000 }
    );
    expect(score).toBe(0);
  });

  it("treats a buyer's GLOBAL region as matching any asset region", () => {
    const score = scoreAssetForBuyer(
      { ...baseBuyer, sectors: [...baseBuyer.sectors], regions: ["GLOBAL"] },
      { sector: "TECHNOLOGY", region: "APAC", dealSize: 3_000_000 }
    );
    expect(score).toBe(100);
  });

  it("gives partial credit for deal size just outside the band", () => {
    // band is 4,000,000 wide; 25% tolerance = 1,000,000 above max (5,000,000)
    const score = scoreAssetForBuyer(
      { ...baseBuyer, sectors: [...baseBuyer.sectors], regions: [...baseBuyer.regions] },
      { sector: "TECHNOLOGY", region: "NORTH_AMERICA", dealSize: 5_500_000 }
    );
    // sector(40) + region(25) + partial size credit (~17.5)
    expect(score).toBeGreaterThan(60);
    expect(score).toBeLessThan(90);
  });

  it("gives no size credit once past the tolerance band", () => {
    const score = scoreAssetForBuyer(
      { ...baseBuyer, sectors: [...baseBuyer.sectors], regions: [...baseBuyer.regions] },
      { sector: "TECHNOLOGY", region: "NORTH_AMERICA", dealSize: 6_500_000 }
    );
    expect(score).toBe(65); // sector + region only
  });

  it("handles an empty sectors/regions list without throwing", () => {
    const score = scoreAssetForBuyer(
      { sectors: [], regions: [], ticketSizeMin: 1_000_000, ticketSizeMax: 2_000_000 },
      { sector: "TECHNOLOGY", region: "NORTH_AMERICA", dealSize: 1_500_000 }
    );
    expect(score).toBe(35);
  });
});

describe("getMatchBreakdown", () => {
  it("reports which individual signals matched alongside the total score", () => {
    const breakdown = getMatchBreakdown(
      { ...baseBuyer, sectors: [...baseBuyer.sectors], regions: [...baseBuyer.regions] },
      { sector: "TECHNOLOGY", region: "EUROPE", dealSize: 3_000_000 }
    );
    expect(breakdown.sectorMatch).toBe(true);
    expect(breakdown.regionMatch).toBe(false);
    expect(breakdown.sizeFitRatio).toBe(1);
    expect(breakdown.score).toBe(75); // sector(40) + size(35), no region credit
  });

  it("stays consistent with scoreAssetForBuyer's total", () => {
    const buyer = { ...baseBuyer, sectors: [...baseBuyer.sectors], regions: [...baseBuyer.regions] };
    const asset = { sector: "RETAIL" as const, region: "APAC" as const, dealSize: 5_500_000 };
    expect(getMatchBreakdown(buyer, asset).score).toBe(scoreAssetForBuyer(buyer, asset));
  });
});
