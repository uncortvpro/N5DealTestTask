import type { BuyerWithScore } from "@n5deal/shared";
import { apiFetch } from "@/lib/serverFetch";
import { BuyerFilterBar } from "@/components/BuyerFilterBar";
import { BuyerCard } from "@/components/BuyerCard";
import { EmptyState } from "@/components/EmptyState";

export default async function SellerBuyersPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const params = new URLSearchParams(
    Object.entries(searchParams).filter(([, v]) => Boolean(v)) as [string, string][]
  );

  const { data } = await apiFetch<{ buyers: BuyerWithScore[] }>(`/api/buyers?${params.toString()}`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy-900">Browse Buyers</h1>
        <p className="mt-1 text-sm text-navy-500">
          Ranked by fit against your active listings — sector, region, and deal size.
        </p>
      </div>

      <BuyerFilterBar />

      {data.buyers.length === 0 ? (
        <EmptyState title="No buyers match these filters" description="Try widening your search." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.buyers.map((buyer) => (
            <BuyerCard key={buyer.id} buyer={buyer} />
          ))}
        </div>
      )}
    </div>
  );
}
