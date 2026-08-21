import type { AssetWithScore } from "@n5deal/shared";
import { AssetCard } from "@/components/AssetCard";

export function RelatedAssetsSection({
  title,
  assets,
}: {
  title: string;
  assets: AssetWithScore[];
}) {
  if (assets.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-navy-950">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </section>
  );
}
