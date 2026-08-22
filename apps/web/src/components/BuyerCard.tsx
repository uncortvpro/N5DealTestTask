import Link from "next/link";
import { toSlugPath, type BuyerWithScore } from "@n5deal/shared";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MatchRing } from "@/components/MatchRing";
import { Avatar } from "@/components/Avatar";
import { formatCurrency } from "@/lib/format";

export function BuyerCard({ buyer }: { buyer: BuyerWithScore }) {
  return (
    <Link
      href={`/buyers/${toSlugPath(buyer.company ?? buyer.name, buyer.id)}`}
      className="group block h-full"
    >
      <Card className="h-full transition-all duration-150 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-navy-900/5">
        <CardBody className="flex h-full flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <Avatar name={buyer.company ?? buyer.name} />
              <div>
                <h3 className="text-base font-semibold leading-snug text-navy-950">{buyer.name}</h3>
                {buyer.company && <p className="text-xs text-navy-400">{buyer.company}</p>}
              </div>
            </div>
            <MatchRing score={buyer.matchScore} size={46} />
          </div>
          {buyer.profile ? (
            <>
              <p className="line-clamp-2 flex-1 text-sm text-navy-500">
                {buyer.profile.investmentThesis}
              </p>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {buyer.profile.sectorLabels.slice(0, 3).map((label) => (
                  <Badge key={label} tone="info">
                    {label}
                  </Badge>
                ))}
                {buyer.profile.regionLabels.slice(0, 2).map((label) => (
                  <Badge key={label} tone="neutral">
                    {label}
                  </Badge>
                ))}
              </div>
              <div className="flex items-baseline justify-between border-t border-navy-100 pt-3">
                <span className="text-xs font-medium uppercase tracking-wide text-navy-400">
                  Ticket size
                </span>
                <span className="text-sm font-semibold text-navy-950">
                  {formatCurrency(buyer.profile.ticketSizeMin)} – {formatCurrency(buyer.profile.ticketSizeMax)}
                </span>
              </div>
            </>
          ) : (
            <p className="flex-1 text-sm italic text-navy-400">Investment profile not completed yet.</p>
          )}
        </CardBody>
      </Card>
    </Link>
  );
}
