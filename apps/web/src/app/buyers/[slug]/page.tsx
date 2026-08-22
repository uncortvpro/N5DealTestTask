import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { BuyerProfile, PublicUser } from "@n5deal/shared";
import { idFromSlugPath } from "@n5deal/shared";
import { apiFetch } from "@/lib/serverFetch";
import { getSession } from "@/lib/session";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar } from "@/components/Avatar";
import { ContactModal } from "@/components/ContactModal";
import { formatCurrency, formatDate } from "@/lib/format";

interface BuyerDetail extends PublicUser {
  profile: BuyerProfile | null;
}

const BACK_LINK: Record<string, { href: string; label: string }> = {
  SELLER: { href: "/seller/buyers", label: "Back to buyers" },
  MANAGER: { href: "/manager/buyers", label: "Back to buyers" },
};

export default async function BuyerDetailPage({ params }: { params: { slug: string } }) {
  const user = await getSession();

  const id = idFromSlugPath(params.slug);
  if (!id) notFound();

  const { ok, data } = await apiFetch<{ buyer: BuyerDetail }>(`/api/buyers/${id}`);
  if (!ok) notFound();

  const { buyer } = data;
  const back = user ? BACK_LINK[user.role] : undefined;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {back && (
        <Link
          href={back.href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900"
        >
          <ArrowLeft size={14} />
          {back.label}
        </Link>
      )}

      <Card>
        <CardBody className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar name={buyer.company ?? buyer.name} className="mt-0.5 h-12 w-12 text-sm" />
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-navy-950">{buyer.name}</h1>
                <p className="mt-1 text-sm text-navy-500">
                  {buyer.company ?? "Independent investor"} · Member since {formatDate(buyer.createdAt)}
                </p>
              </div>
            </div>
            {buyer.status !== "ACTIVE" && <StatusBadge status={buyer.status} />}
          </div>

          {buyer.profile ? (
            <>
              <p className="whitespace-pre-line text-sm leading-relaxed text-navy-700">
                {buyer.profile.investmentThesis}
              </p>
              <div className="flex flex-wrap gap-2">
                {buyer.profile.sectorLabels.map((label) => (
                  <Badge key={label} tone="info">
                    {label}
                  </Badge>
                ))}
                {buyer.profile.regionLabels.map((label) => (
                  <Badge key={label} tone="neutral">
                    {label}
                  </Badge>
                ))}
              </div>
              <div className="rounded-lg bg-navy-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-navy-400">Ticket size</p>
                <p className="mt-0.5 text-lg font-semibold text-navy-950">
                  {formatCurrency(buyer.profile.ticketSizeMin)} – {formatCurrency(buyer.profile.ticketSizeMax)}
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm italic text-navy-400">This buyer hasn't completed their profile yet.</p>
          )}

          {user?.role === "SELLER" && buyer.status === "ACTIVE" && (
            <div className="border-t border-navy-100 pt-6">
              <ContactModal
                toUserId={buyer.id}
                toName={buyer.company ?? buyer.name}
                defaultMessage={`Hi ${buyer.name.split(" ")[0]}, I have a listing that may fit your investment criteria.`}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
