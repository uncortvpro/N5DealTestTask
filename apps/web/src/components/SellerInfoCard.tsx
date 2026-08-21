import Link from "next/link";
import { Building2 } from "lucide-react";
import { toSlugPath } from "@n5deal/shared";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Avatar } from "@/components/Avatar";
import { ContactModal } from "@/components/ContactModal";
import { formatDate } from "@/lib/format";

export function SellerInfoCard({
  sellerId,
  name,
  company,
  memberSince,
  otherListingsCount,
  contact,
}: {
  sellerId: number;
  name: string;
  company: string | null;
  memberSince: string;
  otherListingsCount: number;
  contact?: { toUserId: number; assetId: number; defaultMessage: string };
}) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-navy-950">Seller</h2>
      </CardHeader>
      <CardBody className="space-y-4">
        <Link
          href={`/sellers/${toSlugPath(company ?? name, sellerId)}`}
          className="group flex items-center gap-3"
        >
          <Avatar name={company ?? name} className="h-11 w-11" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-navy-950 group-hover:underline">
              {company ?? name}
            </p>
            <p className="truncate text-xs text-navy-400">{name}</p>
          </div>
        </Link>
        <div className="space-y-2 border-t border-navy-100 pt-3 text-xs text-navy-500">
          <p>On N5Deal since {formatDate(memberSince)}</p>
          <p className="inline-flex items-center gap-1.5">
            <Building2 size={12} />
            {otherListingsCount > 0
              ? `${otherListingsCount} other active listing${otherListingsCount === 1 ? "" : "s"}`
              : "No other active listings"}
          </p>
        </div>
        {contact && (
          <div className="border-t border-navy-100 pt-4">
            <ContactModal
              toUserId={contact.toUserId}
              toName={company ?? name}
              assetId={contact.assetId}
              defaultMessage={contact.defaultMessage}
              className="w-full justify-center"
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
