import type { BuyerProfile } from "@n5deal/shared";

interface AssetForPrompt {
  title: string;
  description: string;
  dealSize: number;
  revenue: number | null;
  ebitda: number | null;
  sectorRef: { label: string };
  regionRef: { label: string };
}

/** One user-turn prompt — no system prompt needed for a task this narrow.
 * Explicitly told to cite specifics rather than produce generic marketing
 * copy, since that's the whole point of layering this on top of a
 * transparent deterministic score instead of replacing it. */
export function buildMatchExplanationPrompt(profile: BuyerProfile, asset: AssetForPrompt): string {
  const financials = [
    asset.revenue !== null ? `Revenue: $${asset.revenue.toLocaleString()}` : null,
    asset.ebitda !== null ? `EBITDA: $${asset.ebitda.toLocaleString()}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return `You are an M&A analyst writing a one- or two-sentence note explaining whether a listing fits a buyer's stated investment thesis. Cite specific details from both sides — sector, region, deal size, and anything notable in the description or thesis. Do not use generic phrases like "great fit" without backing them up with a specific reason. Be direct and concise, like a real analyst's note, not marketing copy. If it's a weak fit, say so plainly and explain why.

Buyer's investment thesis: "${profile.investmentThesis}"
Buyer's target sectors: ${profile.sectorLabels.join(", ") || "none specified"}
Buyer's target regions: ${profile.regionLabels.join(", ") || "none specified"}
Buyer's ticket size: $${profile.ticketSizeMin.toLocaleString()} – $${profile.ticketSizeMax.toLocaleString()}

Listing: "${asset.title}"
Description: ${asset.description}
Sector: ${asset.sectorRef.label}
Region: ${asset.regionRef.label}
Deal size: $${asset.dealSize.toLocaleString()}${financials ? `\n${financials}` : ""}

Write only the note itself — no preamble, no "Here's why:".`;
}
