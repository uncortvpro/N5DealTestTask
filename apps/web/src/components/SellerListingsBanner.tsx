import { DarkPanel } from "@/components/ui/DarkPanel";
import { cn } from "@/lib/cn";
import { formatCurrency } from "@/lib/format";

export function SellerListingsBanner({
  name,
  total,
  active,
  portfolioValue,
}: {
  name: string;
  total: number;
  active: number;
  portfolioValue: number;
}) {
  const firstName = name.split(" ")[0];

  return (
    <DarkPanel>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-navy-300">Here&apos;s how your listings are performing.</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8">
          <Stat label="Listings" value={total} />
          <Stat label="Active" value={active} accent />
          <Stat label="Portfolio value" value={formatCurrency(portfolioValue)} />
        </div>
      </div>
    </DarkPanel>
  );
}

function Stat({ label, value, accent }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div>
      <p className={cn("text-2xl font-semibold", accent ? "text-gold-300" : "text-white")}>{value}</p>
      <p className="mt-0.5 text-xs uppercase tracking-wide text-navy-300">{label}</p>
    </div>
  );
}
