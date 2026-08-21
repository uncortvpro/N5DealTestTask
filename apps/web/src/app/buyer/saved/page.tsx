import type { AssetWithScore } from "@n5deal/shared";
import { apiFetch } from "@/lib/serverFetch";
import { AssetCard } from "@/components/AssetCard";
import { EmptyState } from "@/components/EmptyState";

export default async function SavedListingsPage() {
  const { data } = await apiFetch<{ assets: AssetWithScore[] }>("/api/favorites");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy-950">Saved Listings</h1>
        <p className="mt-1 text-sm text-navy-500">
          Listings you've starred, in one place.
        </p>
      </div>

      {data.assets.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          description="Tap the star on any listing to keep track of it here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
}
