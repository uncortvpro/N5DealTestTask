import { describe, expect, it } from "vitest";
import { idFromSlugPath, slugify, toSlugPath } from "@n5deal/shared";

describe("slugify", () => {
  it("lowercases and hyphenates a normal title", () => {
    expect(slugify("B2B SaaS Analytics Platform")).toBe("b2b-saas-analytics-platform");
  });

  it("collapses punctuation and symbols into single hyphens", () => {
    expect(slugify("Solar EPC & O&M Services Co.")).toBe("solar-epc-o-m-services-co");
  });

  it("strips diacritics instead of dropping the whole word", () => {
    expect(slugify("Café Über Élan")).toBe("cafe-uber-elan");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  !!!Great Deal!!!  ")).toBe("great-deal");
  });

  it("returns an empty string for symbol-only input", () => {
    expect(slugify("!!! ??? ***")).toBe("");
  });

  it("truncates to 60 characters", () => {
    const long = "a".repeat(100);
    expect(slugify(long).length).toBe(60);
  });
});

describe("toSlugPath / idFromSlugPath round-trip", () => {
  it("appends the id as the trailing segment", () => {
    expect(toSlugPath("B2B SaaS Analytics Platform", 42)).toBe("b2b-saas-analytics-platform-42");
  });

  it("falls back to a bare id when the title has no sluggable text", () => {
    expect(toSlugPath("!!!", 7)).toBe("7");
  });

  it("recovers the id regardless of the decorative text in front of it", () => {
    expect(idFromSlugPath("b2b-saas-analytics-platform-42")).toBe(42);
    expect(idFromSlugPath("anything-at-all-7")).toBe(7);
    expect(idFromSlugPath("7")).toBe(7);
  });

  it("round-trips toSlugPath through idFromSlugPath for any title", () => {
    expect(idFromSlugPath(toSlugPath("Regional Insurance Brokerage", 103))).toBe(103);
  });

  it("returns null when there's no trailing id", () => {
    expect(idFromSlugPath("no-id-here")).toBeNull();
  });

  it("returns null for a zero or negative id", () => {
    expect(idFromSlugPath("listing--0")).toBeNull();
  });
});
