import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { AssetWithScore } from "@n5deal/shared";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

export function MatchSnapshotCard({
  hasProfile,
  assets,
  savedCount,
}: {
  hasProfile: boolean;
  assets: AssetWithScore[];
  savedCount: number;
}) {
  const topMatches = assets.filter((a) => (a.matchScore ?? 0) >= 70).length;
  const bestScore =
    hasProfile && assets.length > 0 ? Math.max(...assets.map((a) => a.matchScore ?? 0)) : null;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-navy-950">Match Snapshot</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <Row label="Active listings" value={assets.length} />
        <Row
          label="Top matches (70%+)"
          value={topMatches}
          accent={topMatches > 0}
          icon={topMatches > 0 ? <Sparkles size={13} className="text-gold-500" /> : undefined}
        />
        {bestScore !== null && <Row label="Best match score" value={`${bestScore}%`} accent />}
        <Row label="Saved listings" value={savedCount} />

        <div className="flex flex-col gap-1.5 pt-1">
          <Link
            href="/buyer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-navy-950 hover:text-gold-600"
          >
            Browse listings
            <ArrowRight size={13} />
          </Link>
          {savedCount > 0 && (
            <Link
              href="/buyer/saved"
              className="inline-flex items-center gap-1 text-sm font-semibold text-navy-950 hover:text-gold-600"
            >
              View saved
              <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function Row({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-navy-50 pb-3 last:border-0 last:pb-0">
      <span className="inline-flex items-center gap-1.5 text-sm text-navy-500">
        {icon}
        {label}
      </span>
      <span className={accent ? "text-lg font-semibold text-gold-600" : "text-lg font-semibold text-navy-950"}>
        {value}
      </span>
    </div>
  );
}
