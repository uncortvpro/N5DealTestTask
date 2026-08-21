import Link from "next/link";
import { SECTOR_LABELS, REGION_LABELS, toSlugPath, type Asset } from "@n5deal/shared";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/StatusBadge";
import { SectorIcon } from "@/components/SectorIcon";
import { EditListingButton } from "@/components/EditListingButton";
import { StopClickPropagation } from "@/components/StopClickPropagation";
import { formatCurrency, formatDate } from "@/lib/format";

export function SellerListingRow({ asset }: { asset: Asset }) {
  return (
    <Link href={`/assets/${toSlugPath(asset.title, asset.id)}`} className="group block">
      <Card className="transition-all duration-150 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-navy-900/5">
        <CardBody className="flex flex-wrap items-center gap-4">
          <SectorIcon sector={asset.sector} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-navy-950 group-hover:underline">{asset.title}</span>
              <StatusBadge status={asset.status} />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              <Badge tone="info">{SECTOR_LABELS[asset.sector]}</Badge>
              <Badge tone="neutral">{REGION_LABELS[asset.region]}</Badge>
              <span className="text-navy-400">Listed {formatDate(asset.createdAt)}</span>
            </div>
            {asset.status !== "ACTIVE" && asset.statusReason && (
              <p className="mt-1 text-xs text-amber-700">Reason: {asset.statusReason}</p>
            )}
          </div>

          <StopClickPropagation className="flex shrink-0 items-center gap-4">
            <span className="text-lg font-semibold text-navy-950">{formatCurrency(asset.dealSize)}</span>
            <EditListingButton
              assetId={asset.id}
              defaultValues={{
                title: asset.title,
                description: asset.description,
                sector: asset.sector,
                region: asset.region,
                dealSize: asset.dealSize,
                revenue: asset.revenue ?? undefined,
                ebitda: asset.ebitda ?? undefined,
              }}
            />
          </StopClickPropagation>
        </CardBody>
      </Card>
    </Link>
  );
}
