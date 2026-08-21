import Link from "next/link";
import { SECTOR_LABELS, REGION_LABELS, toSlugPath, type AssetWithScore } from "@n5deal/shared";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MatchRing } from "@/components/MatchRing";
import { SectorIcon } from "@/components/SectorIcon";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";

export function AssetCard({
  asset,
  featured = false,
}: {
  asset: AssetWithScore;
  featured?: boolean;
}) {
  return (
    <Link href={`/assets/${toSlugPath(asset.title, asset.id)}`} className="group block h-full">
      <Card className="h-full transition-all duration-150 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-navy-900/5">
        <CardBody className={cn("flex h-full flex-col gap-3", featured && "gap-4 p-6")}>
          <div className="flex items-start justify-between gap-3">
            <SectorIcon sector={asset.sector} className={featured ? "h-12 w-12 rounded-xl" : undefined} />
            <MatchRing score={asset.matchScore} size={featured ? 60 : 46} />
          </div>

          <div>
            {featured && asset.matchScore !== null && asset.matchScore >= 70 && (
              <span className="mb-1.5 inline-block text-xs font-semibold uppercase tracking-wide text-gold-600">
                Best match for you
              </span>
            )}
            <h3 className={cn("font-semibold leading-snug text-navy-950", featured ? "text-xl" : "text-base")}>
              {asset.title}
            </h3>
            <p
              className={cn(
                "mt-1.5 leading-relaxed text-navy-500",
                featured ? "line-clamp-3 text-sm" : "line-clamp-2 text-sm"
              )}
            >
              {asset.description}
            </p>
          </div>

          <div className="flex flex-1 flex-wrap items-end gap-2 text-xs">
            <Badge tone="info">{SECTOR_LABELS[asset.sector]}</Badge>
            <Badge tone="neutral">{REGION_LABELS[asset.region]}</Badge>
          </div>

          <div className="flex items-baseline justify-between border-t border-navy-100 pt-3">
            <span className="text-xs font-medium uppercase tracking-wide text-navy-400">Deal size</span>
            <span className={cn("font-semibold text-navy-950", featured ? "text-2xl" : "text-lg")}>
              {formatCurrency(asset.dealSize)}
            </span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
