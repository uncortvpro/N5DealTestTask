import type { MatchBreakdown } from "@n5deal/shared";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export function MatchBreakdownCard({ breakdown }: { breakdown: MatchBreakdown }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-navy-950">Why this matches</h2>
        <p className="mt-0.5 text-xs text-navy-400">Scored against your investment profile</p>
      </CardHeader>
      <CardBody className="space-y-4">
        <BreakdownRow label="Sector fit" ratio={breakdown.sectorMatch ? 1 : 0} />
        <BreakdownRow label="Region fit" ratio={breakdown.regionMatch ? 1 : 0} />
        <BreakdownRow label="Deal size fit" ratio={breakdown.sizeFitRatio} />
      </CardBody>
    </Card>
  );
}

function BreakdownRow({ label, ratio }: { label: string; ratio: number }) {
  const status = ratio >= 1 ? "match" : ratio > 0 ? "partial" : "none";
  const statusLabel = status === "match" ? "Match" : status === "partial" ? "Partial" : "No match";

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-navy-700">{label}</span>
        <span
          className={cn(
            "font-semibold",
            status === "match" && "text-emerald-600",
            status === "partial" && "text-amber-600",
            status === "none" && "text-navy-400"
          )}
        >
          {statusLabel}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-navy-50">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500",
            status === "match" && "bg-emerald-500",
            status === "partial" && "bg-amber-500",
            status === "none" && "bg-navy-200"
          )}
          style={{ width: `${Math.round(ratio * 100)}%` }}
        />
      </div>
    </div>
  );
}
