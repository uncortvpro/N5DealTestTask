import Link from "next/link";
import { toSlugPath, type Asset } from "@n5deal/shared";
import { apiFetch } from "@/lib/serverFetch";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/StatusBadge";
import { StatusControl } from "@/components/StatusControl";
import { StopClickPropagation } from "@/components/StopClickPropagation";
import { ManagerAssetFilterBar } from "@/components/ManagerAssetFilterBar";
import { EmptyState } from "@/components/EmptyState";
import { formatCurrency, formatDate } from "@/lib/format";

const ASSET_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "REMOVED", label: "Removed" },
];

export default async function ManagerAssetsPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const params = new URLSearchParams(
    Object.entries(searchParams).filter(([, v]) => Boolean(v)) as [string, string][]
  );

  const { data } = await apiFetch<{ assets: Asset[] }>(`/api/manager/assets?${params.toString()}`);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy-900">Assets</h1>
        <p className="mt-1 text-sm text-navy-500">All listings published on the platform.</p>
      </div>

      <ManagerAssetFilterBar />

      {data.assets.length === 0 ? (
        <EmptyState title="No assets match these filters" />
      ) : (
        <div className="space-y-3">
          {data.assets.map((asset) => (
            <Link
              key={asset.id}
              href={`/assets/${toSlugPath(asset.title, asset.id)}`}
              className="group block"
            >
              <Card className="transition-all duration-150 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-navy-900/5">
                <CardBody className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-navy-900 group-hover:underline">
                        {asset.title}
                      </span>
                      <StatusBadge status={asset.status} />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      <Badge tone="info">{asset.sectorLabel}</Badge>
                      <Badge tone="neutral">{asset.regionLabel}</Badge>
                      <span className="text-navy-400">Listed {formatDate(asset.createdAt)}</span>
                    </div>
                    {asset.status !== "ACTIVE" && asset.statusReason && (
                      <p className="mt-1 text-xs text-amber-700">Reason: {asset.statusReason}</p>
                    )}
                  </div>
                  <StopClickPropagation className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-navy-900">
                      {formatCurrency(asset.dealSize)}
                    </span>
                    <StatusControl
                      apiPath={`/api/manager/assets/${asset.id}/status`}
                      currentStatus={asset.status}
                      statusOptions={ASSET_STATUS_OPTIONS}
                    />
                  </StopClickPropagation>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
