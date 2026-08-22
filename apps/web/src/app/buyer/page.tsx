import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { AssetWithScore } from "@n5deal/shared";
import { apiFetch } from "@/lib/serverFetch";
import { getSession } from "@/lib/session";
import { AssetFilterBar } from "@/components/AssetFilterBar";
import { AssetCard } from "@/components/AssetCard";
import { FeaturedListingCard } from "@/components/FeaturedListingCard";
import { BuyerWelcomeBanner } from "@/components/BuyerWelcomeBanner";
import { EmptyState } from "@/components/EmptyState";

interface MatchResponse {
  assets: AssetWithScore[];
  hasProfile: boolean;
}

export default async function BuyerDashboardPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const params = new URLSearchParams(
    Object.entries(searchParams).filter(([, v]) => Boolean(v)) as [string, string][]
  );

  const [user, overviewResult, results] = await Promise.all([
    getSession(),
    apiFetch<MatchResponse>("/api/match/assets"),
    apiFetch<MatchResponse>(`/api/match/assets?${params.toString()}`),
  ]);

  const overview = overviewResult.ok ? overviewResult.data : { assets: [], hasProfile: false };
  const data = results.ok ? results.data : { assets: [], hasProfile: false };
  const sectorCount = new Set(overview.assets.map((a) => a.sector)).size;
  const topMatchCount = overview.assets.filter((a) => (a.matchScore ?? 0) >= 70).length;

  const [top, ...rest] = data.assets;
  const hasFeatured = top && (top.matchScore ?? 0) >= 70;

  return (
    <div className="space-y-8">
      {user && (
        <BuyerWelcomeBanner
          name={user.name}
          totalListings={overview.assets.length}
          topMatches={topMatchCount}
          sectors={sectorCount}
        />
      )}

      {!overview.hasProfile && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-800">
          <Sparkles size={16} className="mt-0.5 shrink-0" />
          <p>
            Complete your{" "}
            <Link href="/buyer/profile" className="font-semibold underline underline-offset-2">
              investment profile
            </Link>{" "}
            to unlock personalized match scores on every listing.
          </p>
        </div>
      )}

      <AssetFilterBar />

      {data.assets.length === 0 ? (
        <EmptyState title="No assets match these filters" description="Try widening your search." />
      ) : (
        <div className="space-y-6">
          {hasFeatured && <FeaturedListingCard asset={top} />}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(hasFeatured ? rest : data.assets).map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
