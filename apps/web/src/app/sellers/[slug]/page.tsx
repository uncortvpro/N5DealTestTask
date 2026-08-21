import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Briefcase, Mail } from "lucide-react";
import type { Asset, PublicUser } from "@n5deal/shared";
import { idFromSlugPath } from "@n5deal/shared";
import { apiFetch } from "@/lib/serverFetch";
import { getSession } from "@/lib/session";
import { Card, CardBody } from "@/components/ui/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar } from "@/components/Avatar";
import { ContactModal } from "@/components/ContactModal";
import { RelatedAssetsSection } from "@/components/RelatedAssetsSection";
import { formatCurrency, formatDate } from "@/lib/format";

const BACK_LINK: Record<string, { href: string; label: string }> = {
  BUYER: { href: "/buyer", label: "Back to listings" },
  MANAGER: { href: "/manager/sellers", label: "Back to sellers" },
};

export default async function SellerDetailPage({ params }: { params: { slug: string } }) {
  const user = await getSession();

  const id = idFromSlugPath(params.slug);
  if (!id) notFound();

  const [sellerResult, listingsResult] = await Promise.all([
    apiFetch<{ seller: PublicUser }>(`/api/sellers/${id}`),
    apiFetch<{ assets: Asset[] }>(`/api/assets?sellerId=${id}`),
  ]);
  if (!sellerResult.ok) notFound();

  const { seller } = sellerResult.data;
  const listings = listingsResult.data.assets.map((a) => ({ ...a, matchScore: null }));
  const portfolioValue = listings.reduce((sum, a) => sum + a.dealSize, 0);
  const back = user ? BACK_LINK[user.role] : undefined;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
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
              <Avatar name={seller.company ?? seller.name} className="mt-0.5 h-14 w-14 text-lg" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-navy-950">
                    {seller.company ?? seller.name}
                  </h1>
                  {seller.status !== "ACTIVE" && <StatusBadge status={seller.status} />}
                </div>
                <p className="mt-1 text-sm text-navy-500">{seller.name}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-navy-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={12} />
                    {seller.email}
                  </span>
                  <span>Member since {formatDate(seller.createdAt)}</span>
                </div>
              </div>
            </div>

            {user?.role === "BUYER" && seller.status === "ACTIVE" && (
              <ContactModal
                toUserId={seller.id}
                toName={seller.company ?? seller.name}
                defaultMessage={`Hi ${seller.name.split(" ")[0]}, I'd like to learn more about your listings on N5Deal.`}
              />
            )}
          </div>

          <div className="flex flex-wrap gap-8 border-t border-navy-100 pt-5">
            <div className="inline-flex items-center gap-2">
              <Briefcase size={14} className="text-navy-400" />
              <span className="text-sm text-navy-600">
                <span className="font-semibold text-navy-950">{listings.length}</span> active listing
                {listings.length === 1 ? "" : "s"}
              </span>
            </div>
            {listings.length > 0 && (
              <div>
                <span className="text-sm text-navy-600">
                  <span className="font-semibold text-navy-950">{formatCurrency(portfolioValue)}</span>{" "}
                  total portfolio value
                </span>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      <RelatedAssetsSection title="Listings from this seller" assets={listings} />
    </div>
  );
}
