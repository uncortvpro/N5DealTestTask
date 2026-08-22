import Link from "next/link";
import { AlertTriangle, Briefcase, Building2, Package, Users } from "lucide-react";
import { apiFetch } from "@/lib/serverFetch";
import { getSession } from "@/lib/session";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DarkPanel } from "@/components/ui/DarkPanel";
import { formatCurrency } from "@/lib/format";

interface Stats {
  buyers: number;
  sellers: number;
  activeAssets: number;
  suspendedUsers: number;
  suspendedAssets: number;
  totalPortfolioValue: number;
  sectorBreakdown: { sector: string; label: string; count: number }[];
}

export default async function ManagerOverviewPage() {
  const [user, { data }] = await Promise.all([
    getSession(),
    apiFetch<Stats>("/api/manager/stats"),
  ]);

  const needsAttention = data.suspendedUsers + data.suspendedAssets;
  const maxSectorCount = Math.max(1, ...data.sectorBreakdown.map((s) => s.count));

  return (
    <div className="space-y-8">
      {user && (
        <DarkPanel>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Welcome back, {user.name.split(" ")[0]}
              </h1>
              <p className="mt-1 text-sm text-navy-300">Here&apos;s the state of the marketplace.</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8">
              <div>
                <p className="text-2xl font-semibold text-white">{data.buyers + data.sellers}</p>
                <p className="mt-0.5 text-xs uppercase tracking-wide text-navy-300">Participants</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">{data.activeAssets}</p>
                <p className="mt-0.5 text-xs uppercase tracking-wide text-navy-300">Active listings</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-gold-300">
                  {formatCurrency(data.totalPortfolioValue)}
                </p>
                <p className="mt-0.5 text-xs uppercase tracking-wide text-navy-300">Portfolio value</p>
              </div>
            </div>
          </div>
        </DarkPanel>
      )}

      {needsAttention > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-navy-950">
            <AlertTriangle size={15} className="text-amber-500" />
            Needs attention
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.suspendedUsers > 0 && (
              <AttentionCard
                icon={Users}
                count={data.suspendedUsers}
                label={`Suspended participant${data.suspendedUsers === 1 ? "" : "s"}`}
                href="/manager/buyers?status=SUSPENDED"
              />
            )}
            {data.suspendedAssets > 0 && (
              <AttentionCard
                icon={Package}
                count={data.suspendedAssets}
                label={`Suspended or removed listing${data.suspendedAssets === 1 ? "" : "s"}`}
                href="/manager/assets?status=SUSPENDED"
              />
            )}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold text-navy-950">Marketplace health</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <HealthCard icon={Users} value={data.buyers} label="Buyers" href="/manager/buyers" />
          <HealthCard icon={Briefcase} value={data.sellers} label="Sellers" href="/manager/sellers" />
          <HealthCard
            icon={Building2}
            value={data.activeAssets}
            label="Active listings"
            href="/manager/assets"
          />
        </div>
      </section>

      {data.sectorBreakdown.length > 0 && (
        <section>
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-navy-950">Active listings by sector</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              {data.sectorBreakdown.map((s) => (
                <div key={s.sector} className="flex items-center gap-4">
                  <span className="w-40 shrink-0 text-sm text-navy-700">{s.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-navy-50">
                    <div
                      className="h-full rounded-full bg-gold-400 transition-[width] duration-700 ease-out"
                      style={{ width: `${(s.count / maxSectorCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-sm font-semibold text-navy-950">
                    {s.count}
                  </span>
                </div>
              ))}
            </CardBody>
          </Card>
        </section>
      )}
    </div>
  );
}

function HealthCard({
  icon: Icon,
  value,
  label,
  href,
}: {
  icon: typeof Users;
  value: number;
  label: string;
  href: string;
}) {
  return (
    <Link href={href} className="group block">
      <Card className="transition-all duration-150 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-navy-900/5">
        <CardBody className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy-950">
            <Icon size={18} className="text-gold-300" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-navy-950">{value}</p>
            <p className="text-sm text-navy-500">{label}</p>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

function AttentionCard({
  icon: Icon,
  count,
  label,
  href,
}: {
  icon: typeof Users;
  count: number;
  label: string;
  href: string;
}) {
  return (
    <Link href={href} className="group block">
      <Card className="border-amber-200 bg-amber-50/50 transition-all duration-150 group-hover:-translate-y-0.5 group-hover:shadow-lg group-hover:shadow-amber-900/5">
        <CardBody className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-100">
            <Icon size={18} className="text-amber-700" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-navy-950">{count}</p>
            <p className="text-sm text-amber-800">{label}</p>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
