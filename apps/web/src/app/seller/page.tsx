import Link from "next/link";
import { Plus } from "lucide-react";
import type { Asset } from "@n5deal/shared";
import { apiFetch } from "@/lib/serverFetch";
import { getSession } from "@/lib/session";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/EmptyState";
import { SellerListingsBanner } from "@/components/SellerListingsBanner";
import { SellerListingRow } from "@/components/SellerListingRow";

export default async function SellerListingsPage() {
  const [user, { data }] = await Promise.all([
    getSession(),
    apiFetch<{ assets: Asset[] }>("/api/assets?mine=true"),
  ]);

  const activeAssets = data.assets.filter((a) => a.status === "ACTIVE");
  const portfolioValue = activeAssets.reduce((sum, a) => sum + a.dealSize, 0);

  return (
    <div className="space-y-6">
      {user && (
        <SellerListingsBanner
          name={user.name}
          total={data.assets.length}
          active={activeAssets.length}
          portfolioValue={portfolioValue}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-navy-950">My Listings</h2>
          <p className="mt-1 text-sm text-navy-500">Assets you&apos;ve published on N5Deal.</p>
        </div>
        <Link href="/seller/assets/new">
          <Button variant="gold">
            <Plus size={16} />
            Publish listing
          </Button>
        </Link>
      </div>

      {data.assets.length === 0 ? (
        <EmptyState
          title="You haven't published any listings yet"
          description="Publish your first asset to start reaching buyers."
        />
      ) : (
        <div className="space-y-3">
          {data.assets.map((asset) => (
            <SellerListingRow key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
}
