import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SECTOR_LABELS, REGION_LABELS, toSlugPath, type AssetWithScore } from "@n5deal/shared";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MatchRing } from "@/components/MatchRing";
import { SectorIcon } from "@/components/SectorIcon";
import { formatCurrency } from "@/lib/format";

export function FeaturedListingCard({ asset }: { asset: AssetWithScore }) {
  return (
    <Link href={`/assets/${toSlugPath(asset.title, asset.id)}`} className="group block">
      <Card className="overflow-hidden border-gold-200 transition-all duration-150 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-gold-900/10">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-7">
          <SectorIcon sector={asset.sector} className="h-14 w-14 shrink-0 rounded-2xl" />

          <div className="flex-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-gold-600">
              Best match for you
            </span>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-navy-950">{asset.title}</h3>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-navy-500">
              {asset.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Badge tone="info">{SECTOR_LABELS[asset.sector]}</Badge>
              <Badge tone="neutral">{REGION_LABELS[asset.region]}</Badge>
            </div>
          </div>

          <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-navy-100 pt-4 sm:flex-col sm:items-end sm:gap-3 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            <div className="flex items-center gap-3">
              <MatchRing score={asset.matchScore} size={52} />
              <div className="sm:text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-navy-400">Deal size</p>
                <p className="text-2xl font-semibold text-navy-950">{formatCurrency(asset.dealSize)}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-navy-950 transition-colors group-hover:text-gold-600">
              View details
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
