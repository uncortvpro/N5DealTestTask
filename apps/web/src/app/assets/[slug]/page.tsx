import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import type { Asset, AssetWithScore, MatchBreakdown } from "@n5deal/shared";
import { idFromSlugPath } from "@n5deal/shared";
import { apiFetch } from "@/lib/serverFetch";
import { getSession } from "@/lib/session";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatusBadge } from "@/components/StatusBadge";
import { SectorIcon } from "@/components/SectorIcon";
import { MatchRing } from "@/components/MatchRing";
import { FavoriteButton } from "@/components/FavoriteButton";
import { EditListingButton } from "@/components/EditListingButton";
import { MatchBreakdownCard } from "@/components/MatchBreakdownCard";
import { SellerInfoCard } from "@/components/SellerInfoCard";
import { RelatedAssetsSection } from "@/components/RelatedAssetsSection";
import { formatCurrency, formatDate } from "@/lib/format";

interface AssetDetail extends Asset {
  sellerName: string;
  sellerCompany: string | null;
  sellerMemberSince: string;
  matchBreakdown: MatchBreakdown | null;
  isFavorited: boolean;
}

const BACK_LINK: Record<string, { href: string; label: string }> = {
  BUYER: { href: "/buyer", label: "Back to listings" },
  SELLER: { href: "/seller", label: "Back to my listings" },
  MANAGER: { href: "/manager/assets", label: "Back to assets" },
};

export default async function AssetDetailPage({ params }: { params: { slug: string } }) {
  const user = await getSession();
  if (!user) redirect("/login");

  const id = idFromSlugPath(params.slug);
  if (!id) notFound();

  const { ok, data } = await apiFetch<{ asset: AssetDetail }>(`/api/assets/${id}`);
  if (!ok) notFound();

  const { asset } = data;
  const back = BACK_LINK[user.role];
  const isOwner = user.id === asset.sellerId;

  const [sellerListingsResult, similarResult] = await Promise.all([
    apiFetch<{ assets: Asset[] }>(`/api/assets?sellerId=${asset.sellerId}&excludeId=${asset.id}`),
    user.role === "BUYER"
      ? apiFetch<{ assets: AssetWithScore[] }>(`/api/match/assets?sector=${asset.sector}`)
      : Promise.resolve(null),
  ]);

  // The plain assets endpoint doesn't compute match scores (that's buyer-profile-relative),
  // so normalize to AssetWithScore with an explicit null rather than a missing field.
  const sellerListings: AssetWithScore[] = sellerListingsResult.data.assets
    .slice(0, 3)
    .map((a) => ({ ...a, matchScore: null }));
  const similarListings = (similarResult?.data.assets ?? [])
    .filter((a) => a.id !== asset.id)
    .slice(0, 3);

  const ebitdaMultiple = asset.ebitda && asset.ebitda > 0 ? asset.dealSize / asset.ebitda : null;
  const ebitdaMargin =
    asset.ebitda !== null && asset.revenue && asset.revenue > 0 ? asset.ebitda / asset.revenue : null;

  const factStrip = [
    asset.revenue !== null && { label: "Revenue", value: formatCurrency(asset.revenue) },
    asset.ebitda !== null && { label: "EBITDA", value: formatCurrency(asset.ebitda) },
    ebitdaMultiple !== null && {
      label: "Asking multiple",
      value: `${ebitdaMultiple.toFixed(1)}x EBITDA`,
      accent: true,
    },
    ebitdaMargin !== null && { label: "EBITDA margin", value: `${Math.round(ebitdaMargin * 100)}%` },
  ].filter(Boolean) as { label: string; value: string; accent?: boolean }[];

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <Link
        href={back.href}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-500 hover:text-navy-900"
      >
        <ArrowLeft size={14} />
        {back.label}
      </Link>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardBody className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <SectorIcon sector={asset.sector} className="mt-0.5 h-12 w-12 rounded-xl" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-semibold tracking-tight text-navy-950">
                        {asset.title}
                      </h1>
                      {asset.status !== "ACTIVE" && <StatusBadge status={asset.status} />}
                    </div>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-navy-500">
                      <Calendar size={13} />
                      Listed {formatDate(asset.createdAt)} by{" "}
                      {asset.sellerCompany ?? asset.sellerName}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {asset.matchBreakdown && <MatchRing score={asset.matchBreakdown.score} size={52} />}
                  <div className="text-right">
                    <p className="text-xs font-medium uppercase tracking-wide text-navy-400">
                      Deal size
                    </p>
                    <p className="text-2xl font-bold text-navy-950">{formatCurrency(asset.dealSize)}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="info">{asset.sectorLabel}</Badge>
                  <Badge tone="neutral">{asset.regionLabel}</Badge>
                </div>
                {user.role === "BUYER" && (
                  <FavoriteButton assetId={asset.id} initialFavorited={asset.isFavorited} size="sm" />
                )}
                {isOwner && (
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
                )}
              </div>

              <p className="whitespace-pre-line text-sm leading-relaxed text-navy-700">
                {asset.description}
              </p>

              {factStrip.length > 0 && (
                <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-navy-100 pt-5">
                  {factStrip.map((item) => (
                    <div key={item.label}>
                      <p className="text-xs font-medium uppercase tracking-wide text-navy-400">
                        {item.label}
                      </p>
                      <p
                        className={
                          item.accent
                            ? "mt-0.5 text-base font-semibold text-gold-700"
                            : "mt-0.5 text-base font-semibold text-navy-950"
                        }
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {asset.matchBreakdown && <MatchBreakdownCard breakdown={asset.matchBreakdown} />}
        </div>

        <div className="space-y-6">
          {!isOwner && (
            <SellerInfoCard
              sellerId={asset.sellerId}
              name={asset.sellerName}
              company={asset.sellerCompany}
              memberSince={asset.sellerMemberSince}
              otherListingsCount={sellerListings.length}
              contact={
                user.role === "BUYER" && asset.status === "ACTIVE"
                  ? {
                      toUserId: asset.sellerId,
                      assetId: asset.id,
                      defaultMessage: `Hi, I'm interested in "${asset.title}". Could you share more details?`,
                    }
                  : undefined
              }
            />
          )}
        </div>
      </div>

      <RelatedAssetsSection title="More from this seller" assets={sellerListings} />
      <RelatedAssetsSection title="Similar opportunities" assets={similarListings} />
    </div>
  );
}
